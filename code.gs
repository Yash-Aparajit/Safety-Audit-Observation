const LOG_SHEET = "SAO_Log";
const IMAGE_FOLDER_ID = "Your ID";


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
      "Plant_New"
    ],

    lines:[
"Names of line"
"Name of Line 2"
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

function getSafetyMetrics(){

const sh = SpreadsheetApp.getActive()
.getSheetByName("MASTER");

const data = sh.getRange(1,1,4,2).getValues();

return {
injuryFreeDays: data[1][1],
lti: data[2][1],
ltiIncident: data[3][1]
};

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
      form.auditDate,
      form.plant,
      form.department,
      form.line,
      form.area,
      form.shift,

      form.auditor,
      form.supervisor,

      form.type,

      form.injuryType,
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
      form.status,
      form.kaizen,

    ]);

    sh.setRowHeight(sh.getLastRow(),130);

    return true;

  }
  finally
  {
    lock.releaseLock();
  }
}
