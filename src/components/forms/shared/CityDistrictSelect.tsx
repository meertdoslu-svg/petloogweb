"use client";

import { TURKEY_CITY_NAMES, getDistrictsForCity } from "@/lib/data/turkeyLocations";

const selectClass =
  "w-full rounded-2xl border border-primary/10 bg-white px-4 py-3 text-sm text-primary shadow-sm disabled:opacity-50";

type CityDistrictSelectProps = {
  il: string;
  ilce: string;
  onIlChange: (il: string) => void;
  onIlceChange: (ilce: string) => void;
  ilError?: string;
  ilceError?: string;
  ilLabel?: string;
  ilceLabel?: string;
};

export function CityDistrictSelect({
  il,
  ilce,
  onIlChange,
  onIlceChange,
  ilError,
  ilceError,
  ilLabel = "İl",
  ilceLabel = "İlçe",
}: CityDistrictSelectProps) {
  const districts = getDistrictsForCity(il);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="block space-y-1.5">
        <span className="text-sm font-bold text-primary">{ilLabel}</span>
        <select
          className={selectClass}
          value={il}
          onChange={(e) => onIlChange(e.target.value)}
        >
          <option value="">Seçiniz</option>
          {TURKEY_CITY_NAMES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {ilError ? <span className="block text-xs text-danger">{ilError}</span> : null}
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-bold text-primary">{ilceLabel}</span>
        <select
          className={selectClass}
          value={ilce}
          disabled={!il}
          onChange={(e) => onIlceChange(e.target.value)}
        >
          <option value="">{il ? "Seçiniz" : "Önce il seçin"}</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        {ilceError ? (
          <span className="block text-xs text-danger">{ilceError}</span>
        ) : null}
      </label>
    </div>
  );
}
