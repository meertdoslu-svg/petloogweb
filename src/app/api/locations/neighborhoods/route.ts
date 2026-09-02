import { NextResponse } from "next/server";
import { isValidCity, isValidDistrict } from "@/lib/data/turkeyLocations";
import { securityHeaders } from "@/lib/security";
// Server-only import: ~380KB of neighborhood names for all 973 districts.
// Reading it here (a route handler) keeps it out of the client bundle —
// the browser only ever receives the small slice for the district the
// visitor actually picked.
import neighborhoodsByCity from "@/data/turkey-neighborhoods.json";

type NeighborhoodsFile = Record<string, Record<string, string[]>>;
const data = neighborhoodsByCity as NeighborhoodsFile;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const il = searchParams.get("il") ?? "";
  const ilce = searchParams.get("ilce") ?? "";

  if (!il || !ilce || !isValidCity(il) || !isValidDistrict(il, ilce)) {
    return NextResponse.json(
      { ok: false, message: "Geçersiz il/ilçe.", neighborhoods: [] },
      { status: 400, headers: securityHeaders() },
    );
  }

  const neighborhoods = data[il]?.[ilce] ?? [];
  return NextResponse.json(
    { ok: true, neighborhoods },
    { headers: securityHeaders() },
  );
}
