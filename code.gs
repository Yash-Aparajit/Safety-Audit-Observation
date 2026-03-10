const LOG_SHEET = "DS_Log";
const IMAGE_FOLDER_ID = "YOUR FOLDER ID HERE";


function doGet(e)
{
  const mode = e.parameter.mode || "ds";

  const page = mode === "quick" ? "quick" : "index";

  const t = HtmlService.createTemplateFromFile(page);

  if(mode === "quick"){
    t.line  = e.parameter.line || "Unknown Line";
    t.plant = e.parameter.plant || "Unknown Plant";
  }

  if(mode === "ds"){
    t.incident = e.parameter.incident || "";
  }

  return t.evaluate().setTitle("Digital Safety");
}


/* MASTER DATA */
function getMaster()
{
  return {

    plants:[
      "Plant_1",
      "Plant_2",
      "Plant_3"
    ],

    lines:[
"OPTION_1",
"OPTION_2",
"OPTION_3",

    ]

  };

}


/* SAVE IMAGE */
function saveImage(base64)
{
  if(!base64) return "";

  const now = new Date();

  const datePart = Utilities.formatDate(
    now,
    Session.getScriptTimeZone(),
    "ddMMyy"
  );

  const folder = DriveApp.getFolderById(IMAGE_FOLDER_ID);

  const existing = folder.getFiles();
  let count = 0;

  while(existing.hasNext()){
    const name = existing.next().getName();
    if(name.startsWith("DS_"+datePart)){
      count++;
    }
  }

  const serial = ("000" + (count + 1)).slice(-3);

  const blob = Utilities.newBlob(
    Utilities.base64Decode(base64),
    "image/jpeg",
    "DS_"+datePart+"_"+serial+".jpg"
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
      "ddMMyyyy"
    );

  const serial =
    ("0000" + count).slice(-4);

  return `DS-${today}-${serial}`;
}

function saveQuickAlert(data)
{
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try{
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
      "Alerted"
    ]);

    const subject = `🚨 SAFETY ALERT | ${data.type} | ${data.line} | ${code}`;

    const htmlBody = `
    <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:20px;">

      <div style="max-width:600px;margin:auto;background:white;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,0.08);overflow:hidden;">

        <div style="background:#007a3d;color:white;padding:16px;text-align:center;">
          <h2 style="margin:0;">Digital Safety Alert</h2>
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
              <td style="padding:8px;">${Utilities.formatDate(new Date(),Session.getScriptTimeZone(),"dd/MM/yyyy HH:mm")}</td>
            </tr>
          </table>

          <div style="margin-top:20px;text-align:center;">
            <a href="YOUR URL ID HERE ?mode=ds&incident=${code}"
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
      to: "YOUR MAIL ID HERE",
      subject: subject,
      htmlBody: htmlBody
    });

    return code;

  } finally {
  lock.releaseLock();

}
}

function getAlertDetails(code)
{
  if(!code) return null;

  const sh = SpreadsheetApp
    .getActive()
    .getSheetByName("Quick_Alerts");

  const data = sh.getDataRange().getValues();

  for(let i=data.length-1;i>=1;i--)
  {
    if(data[i][1] === code)
    {
      return {
        plant:data[i][2],
        line:data[i][3],
        type:data[i][4]
      };
    }
  }

  return null;
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
      throw new Error("DS_Log sheet missing");


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
      form.incidentCode,
      form.auditDate,
      form.plant,
      form.department,
      form.line,
      form.area,
      form.shift,

      form.auditor,
      form.supervisor,
      form.reporter,
      form.reporterType,

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
      "",
      form.targetDate,
      form.status,
      form.kaizen,

    ]);

    sh.setRowHeight(sh.getLastRow(),130);
    closeQuickAlert(form.incidentCode);

    sendDSEmail(form, link);

    return form.incidentCode || "Manual Entry";

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

  for(let i=data.length-1;i>=1;i--)
  {
    if(data[i][1] === code)
    {
      sh.getRange(i+1,6).setValue("Registered");
      break;
    }
  }
}



function sendDSEmail(form, imageLink)
{

const subject =
`DS Report Submitted | ${form.line} | ${form.type}`;

const html = `
<div style="font-family:Arial;background:#f4f6f8;padding:20px">

<div style="max-width:650px;margin:auto;background:white;border-radius:10px;padding:20px">

<h2 style="color:#007a3d">Safety Audit Observation Report</h2>

<table style="width:100%;border-collapse:collapse">

<tr>
<td style="padding:8px;font-weight:bold">Incident Code</td>
<td style="padding:8px">${form.incidentCode || "Manual Entry"}</td>
</tr>

<tr>
<td style="padding:8px;font-weight:bold">Plant</td>
<td style="padding:8px">${form.plant}</td>
</tr>

<tr>
<td style="padding:8px;font-weight:bold">Line</td>
<td style="padding:8px">${form.line}</td>
</tr>

<tr>
<td style="padding:8px;font-weight:bold">Observation Type</td>
<td style="padding:8px">${form.type}</td>
</tr>

<tr>
<td style="padding:8px;font-weight:bold">Auditor</td>
<td style="padding:8px">${form.auditor}</td>
</tr>

<tr>
<td style="padding:8px;font-weight:bold">Remark</td>
<td style="padding:8px">${form.remark}</td>
</tr>

<tr>
<td style="padding:8px;font-weight:bold">Action Plan</td>
<td style="padding:8px">${form.actionPlan}</td>
</tr>

<tr>
<td style="padding:8px;font-weight:bold">Target Date</td>
<td style="padding:8px">${form.targetDate}</td>
</tr>

</table>

${imageLink ? `<p><a href="${imageLink}">View Image</a></p>` : ""}

<hr>

<p style="font-size:12px;color:#888">
System generated report. Do not reply.
</p>

</div>
</div>
`;

MailApp.sendEmail({
to:"YOUR MAIL ID HERE",
subject:subject,
htmlBody:html
});


}
