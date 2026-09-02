// Reuses the same 81-il / 973-ilçe dataset already shipped in the PetLoog
// mobile app (petloog/src/data/turkey-locations.json, consumed there via
// CityDistrictPicker/lib/turkeyLocations.ts) so city/district names stay
// identical across the ecosystem. Vendored as a static asset since this is
// a separate deployable app with no shared package between the two repos.
import rawLocations from "@/data/turkey-locations.json";

type LocationsFile = {
  cities: Record<string, string[]>;
  names: string[];
};

const locations = rawLocations as LocationsFile;

const PRIORITY_CITIES = ["İstanbul", "Ankara", "İzmir"] as const;

export const TURKEY_CITY_NAMES: string[] = (() => {
  const prioritySet = new Set<string>(PRIORITY_CITIES);
  const rest = locations.names.filter((city) => !prioritySet.has(city));
  return [...PRIORITY_CITIES.filter((c) => locations.names.includes(c)), ...rest];
})();

export function getDistrictsForCity(city: string | undefined | null): string[] {
  if (!city) return [];
  return locations.cities[city] ?? [];
}

export function isValidCity(city: string): boolean {
  return Object.prototype.hasOwnProperty.call(locations.cities, city);
}

export function isValidDistrict(city: string, district: string): boolean {
  return getDistrictsForCity(city).includes(district);
}
