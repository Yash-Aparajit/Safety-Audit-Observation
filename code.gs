const LOG_SHEET = "SAO_Log";
const IMAGE_FOLDER_ID = "Your ID here";


function doGet(e)
{
  const mode = e.parameter.mode || "sao";

  if(mode === "quick")
  {
    const t = HtmlService.createTemplateFromFile("quick");
    t.line  = e.parameter.line || "Unknown Line";
    t.plant = e.parameter.plant || "Unknown Plant";
    return t.evaluate().setTitle("Quick Safety Alert");
  }

  return HtmlService
    .createHtmlOutputFromFile("index")
    .setTitle("Safety Audit Observation");
}

/* MASTER DATA */
function getMaster()
{
  return {

    plants:[
      "Plant_1",
      "Plant_2",


    ],

    lines:[
"Line 1",
"Line 2",
"Line 3"
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

function generateIncidentCode()
{
  const sh =
    SpreadsheetApp.getActive()
    .getSheetByName("Quick_Alerts");

  const count = sh.getLastRow();

  const today =
    Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyyMMdd"
    );

  const serial =
    ("0000" + count).slice(-4);

  return `SAO-${today}-${serial}`;
}

function saveQuickAlert(data)
{
  const sh =
    SpreadsheetApp.getActive()
    .getSheetByName("Quick_Alerts");

  const code = generateIncidentCode();

  sh.appendRow([
    new Date(),
    code,
    data.plant,
    data.line,
    data.type,
    "OPEN"
  ]);

  const subject = `🚨 SAFETY ALERT | ${data.type} | ${data.line} | ${code}`;

  const htmlBody = `
  <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:20px;">

    <div style="max-width:600px;margin:auto;background:white;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,0.08);overflow:hidden;">

      <div style="background:#007a3d;color:white;padding:16px;text-align:center;">
        <h2 style="margin:0;">Safety Alert Notification</h2>
      </div>

      <div style="padding:20px;font-size:14px;color:#333;">

        <p style="margin-top:0;">A safety event has been reported from the shop floor.</p>

        <table style="width:100%;border-collapse:collapse;margin-top:15px;">
          <tr>
            <td style="padding:8px;font-weight:bold;">Incident Code</td>
            <td style="padding:8px;color:#007a3d;font-weight:bold;">${code}</td>
          </tr>
          <tr style="background:#f9f9f9;">
            <td style="padding:8px;font-weight:bold;">Plant</td>
            <td style="padding:8px;">${data.plant}</td>
          </tr>
          <tr>
            <td style="padding:8px;font-weight:bold;">Line</td>
            <td style="padding:8px;">${data.line}</td>
          </tr>
          <tr style="background:#f9f9f9;">
            <td style="padding:8px;font-weight:bold;">Alert Type</td>
            <td style="padding:8px;">${data.type}</td>
          </tr>
          <tr>
            <td style="padding:8px;font-weight:bold;">Time</td>
            <td style="padding:8px;">${new Date().toLocaleString()}</td>
          </tr>
        </table>

        <div style="margin-top:20px;text-align:center;">
          <a href="https://script.google.com/macros/s/Your ID Here/exec?mode=sao&incident=${code}"
            style="display:inline-block;padding:12px 18px;background:#007a3d;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">
            Open Investigation Form
          </a>
        </div>

        <hr style="margin-top:30px;border:none;border-top:1px solid #ddd;">

        <p style="font-size:12px;color:#888;text-align:center;margin-top:10px;">
        Please investigate at the earliest, and This is a system generated safety alert. Please do not reply to this email. 
        </p>

      </div>

    </div>

  </div>
  `;

  MailApp.sendEmail({
    to: "Your Email Here",
    subject: subject,
    htmlBody: htmlBody
  });

  return code;
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
      form.incidentCode,
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
    closeQuickAlert(form.incidentCode);

    return true;

  }
  finally
  {
    lock.releaseLock();
  }
}

function closeQuickAlert(code)
{
  if(!code) return;

  const sh =
    SpreadsheetApp.getActive()
    .getSheetByName("Quick_Alerts");

  const data = sh.getDataRange().getValues();

  for(let i=1;i<data.length;i++)
  {
    if(data[i][1] === code)
    {
      sh.getRange(i+1,6).setValue("CLOSED");
      break;
    }
  }
}
