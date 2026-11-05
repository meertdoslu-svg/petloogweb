"use client";

import { TURKEY_CITY_NAMES, getDistrictsForCity } from "@/lib/data/turkeyLocations";

const selectClass =
  "w-full min-h-12 rounded-2xl border border-line bg-surface px-4 py-3 text-base text-primary disabled:opacity-60 aria-[invalid=true]:border-danger";

type CityDistrictSelectProps = {
  il: string;
  ilce: string;
  onIlChange: (il: string) => void;
  onIlceChange: (ilce: string) => void;
  ilError?: string;
  ilceError?: string;
};

export function CityDistrictSelect({
  il,
  ilce,
  onIlChange,
  onIlceChange,
  ilError,
  ilceError,
}: CityDistrictSelectProps) {
  const districts = getDistrictsForCity(il);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-1.5">
        <label htmlFor="f-il" className="block font-bold text-primary">
          İl
        </label>
        <select
          id="f-il"
          className={selectClass}
          value={il}
          onChange={(e) => onIlChange(e.target.value)}
          aria-invalid={Boolean(ilError)}
          aria-describedby={ilError ? "e-il" : undefined}
        >
          <option value="">Seç</option>
          {TURKEY_CITY_NAMES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {ilError ? (
          <p id="e-il" className="text-sm font-bold text-danger">
            {ilError}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="f-ilce" className="block font-bold text-primary">
          İlçe
        </label>
        <select
          id="f-ilce"
          className={selectClass}
          value={ilce}
          disabled={!il}
          onChange={(e) => onIlceChange(e.target.value)}
          aria-invalid={Boolean(ilceError)}
          aria-describedby={ilceError ? "e-ilce" : undefined}
        >
          <option value="">{il ? "Seç" : "Önce il seç"}</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        {ilceError ? (
          <p id="e-ilce" className="text-sm font-bold text-danger">
            {ilceError}
          </p>
        ) : null}
      </div>
    </div>
  );
}
