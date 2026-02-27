const LOG_SHEET = "SAO_Log";
const IMAGE_FOLDER_ID = "Your Image Folder ID.";


function doGet()
{
  return HtmlService
    .createHtmlOutputFromFile("index")
    .setTitle("Safety Audit Observation")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


/* MASTER DATA */
function getMaster()
{
  return {

    plants:[
      "Plant_1",
      "Plant_2",
      "Plant_3" //So on
    ],

    lines:[
"Line 1",
"Line 2",
"Line 3" //Fill in the name of the line you want to monitor. 
    ]

  };

}



/* SAVE IMAGE */
function saveImage(base64)
{
  if(!base64) return "";

  const folder = DriveApp.getFolderById(IMAGE_FOLDER_ID);

  const blob = Utilities.newBlob(
    Utilities.base64Decode(base64),
    "image/jpeg",
    "SAO_"+Date.now()+".jpg"
  );

  const file = folder.createFile(blob);

  file.setSharing(
    DriveApp.Access.ANYONE_WITH_LINK,
    DriveApp.Permission.VIEW
  );

  return file.getId();
}



/* SAVE ENTRY */
function saveEntry(form)
{
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try
  {
    const sh =
      SpreadsheetApp.getActive()
      .getSheetByName(LOG_SHEET);

    if(!sh)
      throw new Error("SAO_Log sheet missing");


    let link="";
    let preview="";

    if(form.image)
    {
      const id=saveImage(form.image);

      link=
      "https://drive.google.com/file/d/"+id+"/view";

      preview=
      '=IMAGE("https://drive.google.com/uc?id='+id+'",4,120,120)';
    }


    sh.appendRow([

      new Date(),

      form.plant,
      form.line,
      form.area,
      form.shift,

      form.auditor,
      form.supervisor,

      form.type,

      form.injuryPoint,
      form.empName,
      form.empContract,
      form.rootCause,
      form.actionTaken,

      form.remark,

      link,
      preview,

      form.responsibility,
      form.actionPlan,
      form.targetDate,
      form.status

    ]);

    sh.setRowHeight(sh.getLastRow(),130);

    return true;

  }
  finally
  {
    lock.releaseLock();
  }
}
