const LOG_SHEET = "SAO_Log";
const IMAGE_FOLDER_ID = "1bwL8oiHJgsl3_t71_7z_sCsHBL9TOhH2";


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
"JL LH COVER",
"K1/K3 LH COVER",
"INTAKE MANIFOLD",
"KTM LH COVER",
"DUKE MY24 INDICATOR LH - RH",
"K8 Tail Lamp",
"K8 - STRUCTURE",
"K10 - BACK COVER",
"K8 SPEEDO FLAP SUB ASSLY",
"SENSOR CABLE",
"KTM Sensor cable",
"ADVENTURE HOLDER INDICATOR LH/RH",
"DUKE PLATE HOLDER ASSLY",
"DUKE MY24 SPEEDOMETER",
"K17 B Speedometer",
"KTM Wheel",
"COUPLER ASSLY",
"K17 AB Seat Cowl",
"K17 B/E Seat Cowl",
"K17 B/E Belly Pan",
"Brake kit",
"Oil cooler",
"JL/K10 - RADIATOR",
"KTM Radiator",
"NS 400 Radiator Cowl",
"JL Fairing",
"K8 Fairing",
"DUKE FAIRING",
"RC Fairing (KTM)",
"K1 Fairing",
"K17 B/E Fairing",
"ADVENTURE FAIRING",
"K3 Fairing",
"NS 400 Fairing",
"SMC/ENDURO FAIRING",
"THRUXTON FAIRING",
"ADV FRONT FAIRING CARRIER MASK",
"K17 B/E Fr Fender",
"K17 AB Fr Fender",
"KTM/K10 - THERMOSTAT",
"SUMP GUARD WITH EXP. TANK (TRIUMPH)",
"COVER REAR RH (TRIUMPH)",
"THRUXTON THROTTLE BODY LH/RH",
"TRIUMPH HEADLAMP HOLDER",
"FORK",
"HANDLE",
"KTM STEP HOLDER RIDER RH + PILLION LH&RH",
"STEP HOLDER RIDER LH WITH SIDE STAND ASSLY",
"K4/K11 STEP HOLDER RH",
"K10 STEP HOLDER ASSLY",
"K17 STEP HOLDER ASSLY",
"K8 STEP HOLDER ASSLY",
"K17 A STEP HOLDER ASSLY",
"TRIUMPH STEP HOLDER",
"ADVENTURE CENTER STAND",
"KTM HARNESS ASSLY",
"KTM REAR FENDER ASSLY",
"K17 B/D REAR NO. PLATE ASSLY",
"K17 A REAR NO. PLATE ASSLY",
"TRIUMPH REAR FENDER",
"HUSQ. Gen03 RR FENDER ASSLY",
"K4G REAR NO. PLATE",
"TRIUMPH UNDER TRAY",
"ADVENTURE UNDER TRAY",
"HUSQ. Gen03 TAIL LAMP",
"HUSQ. Gen03 HEADLAMP STRUCTURE",
"HUSQ. Gen03 BRACKET LATCH",
"THRUXTON SOCKET CHARGER",
"KTM ENG. HANGER ASSLY",
"SMC/ENDURO FR FAIRING BACK COVER",
"K11 Cowl and Shroud assly"
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
