/**
 * One-time helper — generates the GOOGLE_OAUTH_REFRESH_TOKEN needed for
 * writing to the Google Sheet, WITHOUT using the OAuth Playground (which
 * is a common source of "invalid_grant" errors if you forget to plug in
 * your own client ID/secret there).
 *
 * BEFORE RUNNING — one-time Google Cloud Console setup:
 *   1. console.cloud.google.com → APIs & Services → Credentials →
 *      + Create Credentials → OAuth client ID
 *   2. Application type: "Web application"
 *   3. Authorized redirect URIs → Add URI → paste EXACTLY:
 *        http://localhost:53682/oauth2callback
 *   4. Create → copy the Client ID and Client Secret into .env.local as
 *        GOOGLE_OAUTH_CLIENT_ID=...
 *        GOOGLE_OAUTH_CLIENT_SECRET=...
 *   5. APIs & Services → OAuth consent screen → scroll to "Test users" →
 *      Add the Google account email that has EDIT access to the target
 *      sheet (if consent screen "Publishing status" is "Testing", ONLY
 *      emails in this list can complete login — this is the #1 cause of
 *      failures, more common than invalid_grant itself).
 *   6. APIs & Services → Library → make sure "Google Sheets API" is
 *      Enabled for this project.
 *
 * THEN RUN:
 *   npx tsx scripts/getGoogleRefreshToken.ts
 *
 * It will print a URL — open it, log in with the sheet-editor Google
 * account, approve access, and the refresh token will be printed here.
 * Paste it into .env.local as GOOGLE_OAUTH_REFRESH_TOKEN.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import http from "node:http";
import { URL } from "node:url";

const PORT = 53682;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

async function main() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error("Missing GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET in .env.local — set these first (see comment at top of this file).");
    process.exit(1);
  }

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", SCOPE);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent"); // forces a refresh_token every time

  console.log("\n1. Open this URL in your browser (log in with the account that has EDIT access to the sheet):\n");
  console.log(authUrl.toString());
  console.log("\n2. Approve access. This script is now waiting for the redirect...\n");

  const code: string = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      // Parse manually instead of via URLSearchParams — URLSearchParams
      // follows the application/x-www-form-urlencoded spec and silently
      // turns literal "+" characters into spaces, which corrupts Google's
      // authorization code (they can legitimately contain "+") and causes
      // a "Malformed auth code" error at the token-exchange step below.
      const rawUrl = req.url ?? "";
      const [path, queryString = ""] = rawUrl.split("?");
      if (path !== "/oauth2callback") {
        res.writeHead(404).end();
        return;
      }
      const params: Record<string, string> = {};
      for (const pair of queryString.split("&")) {
        if (!pair) continue;
        // Split on the FIRST "=" only — auth codes can contain "=" characters
        // themselves (base64url padding), and splitting on every "=" would
        // truncate the value there, producing a corrupted/"malformed" code.
        const eqIdx = pair.indexOf("=");
        const k = eqIdx === -1 ? pair : pair.slice(0, eqIdx);
        const v = eqIdx === -1 ? "" : pair.slice(eqIdx + 1);
        params[decodeURIComponent(k)] = decodeURIComponent(v);
      }
      const err = params.error;
      const c = params.code;
      res.writeHead(200, { "Content-Type": "text/html" });
      if (err) {
        res.end(`<h2>Error: ${err}</h2>You can close this tab and check the terminal.`);
        server.close();
        reject(new Error(err));
        return;
      }
      res.end("<h2>Success — you can close this tab.</h2>Check your terminal for the refresh token.");
      server.close();
      resolve(c!);
    });
    server.listen(PORT);
  });

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    }),
  });

  const json = await tokenRes.json();
  if (!tokenRes.ok) {
    console.error("\n❌ Token exchange failed:", json);
    process.exit(1);
  }

  if (!json.refresh_token) {
    console.error(
      "\n⚠️ No refresh_token was returned. This usually means you've already authorized this app before without revoking it. " +
        "Go to https://myaccount.google.com/permissions, remove access for this app, then run this script again."
    );
    process.exit(1);
  }

  console.log("\n✅ Success! Add this to your .env.local:\n");
  console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${json.refresh_token}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});