import { NextRequest, NextResponse } from "next/server";

// TODO (before going live): replace this stub with a real vehicle-data
// lookup, e.g. the UK DVLA Vehicle Enquiry Service API:
// https://developer-portal.driver-vehicle-standards.service.gov.uk/
//
// That API needs a server-side API key (never exposed to the browser) and
// returns make, model, colour, fuel type, MOT status, etc. for a given
// registration number.

export async function POST(req: NextRequest) {
  const { reg } = await req.json();

  if (!reg || typeof reg !== "string" || reg.trim().length < 2) {
    return NextResponse.json({ error: "Invalid registration" }, { status: 400 });
  }

  // Placeholder response shape — swap in the real API call above.
  return NextResponse.json({
    registration: reg.trim().toUpperCase(),
    make: "Unknown",
    model: "Unknown",
    verified: true,
  });
}
