/**
 * MarksWriter.gs — ADD AS A NEW FILE in your existing Apps Script project
 * (File "+" -> Script -> name it MarksWriter). Do NOT edit Code.gs.
 *
 * It only defines: doPost(e) and out_(obj). Your Code.gs has neither, and
 * uses different names (autoSync, rebuildALCStack, INDEX4, etc.), so
 * nothing conflicts and your 1-minute autoSync trigger is not affected.
 *
 * Setup:
 *  1. Project Settings -> Script properties -> add
 *        SECRET = <long random string>
 *  2. Deploy -> New deployment -> Web app
 *        Execute as: Me   |   Who has access: Anyone
 *     Authorize when asked, then copy the Web app URL.
 *  3. .env.local:
 *        GOOGLE_MARKS_SCRIPT_URL=<web app URL>
 *        GOOGLE_MARKS_SCRIPT_SECRET=<same SECRET>
 *
 * Later edits to this file: Deploy -> Manage deployments -> Edit ->
 * New version (the URL stays the same).
 */
function doPost(e) {
  try {
    var secret = PropertiesService.getScriptProperties().getProperty('SECRET');
    var body = JSON.parse(e.postData.contents);

    if (!secret || body.secret !== secret) {
      return out_({ ok: false, error: 'unauthorized' });
    }

    // Same spreadsheet this script is attached to (the one autoSync uses).
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(body.tab);
    if (!sheet) return out_({ ok: false, error: 'tab not found: ' + body.tab });

    body.updates.forEach(function (u) {
      sheet.getRange(u.cell).setValue(u.value); // "80%" is parsed like typed input
    });
    SpreadsheetApp.flush();
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  }
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
