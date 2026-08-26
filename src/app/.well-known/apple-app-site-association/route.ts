import { NextResponse } from "next/server";

// Universal Links (Apple Associated Domains) verification file.
// Must be served as JSON, without a file extension, publicly, without
// redirects, at exactly /.well-known/apple-app-site-association.
//
// Apple Team ID (ZR26RRGH97) and bundle identifier (app.petloog.mobile)
// are sourced from the PetLoog mobile repo's eas.json / app.json — do not
// change these without confirming against that repo.
const APP_ID = "ZR26RRGH97.app.petloog.mobile";

const AASA = {
  applinks: {
    apps: [],
    details: [
      {
        appID: APP_ID,
        appIDs: [APP_ID],
        paths: ["*"],
      },
    ],
  },
};

export function GET() {
  return NextResponse.json(AASA, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
