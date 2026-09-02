"use client";

import { useEffect, useMemo, useState } from "react";

type NeighborhoodMultiSelectProps = {
  il: string;
  ilce: string;
  selected: string[];
  onChange: (next: string[]) => void;
  error?: string;
};

export function NeighborhoodMultiSelect({
  il,
  ilce,
  selected,
  onChange,
  error,
}: NeighborhoodMultiSelectProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!il || !ilce) {
      setOptions([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setLoadError("");
    fetch(`/api/locations/neighborhoods?il=${encodeURIComponent(il)}&ilce=${encodeURIComponent(ilce)}`)
      .then((res) => res.json())
      .then((data: { ok: boolean; neighborhoods?: string[] }) => {
        if (cancelled) return;
        if (data.ok && data.neighborhoods) {
          setOptions(data.neighborhoods);
        } else {
          setOptions([]);
          setLoadError("Mahalle listesi alınamadı.");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOptions([]);
          setLoadError("Mahalle listesi alınamadı.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [il, ilce]);

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("tr-TR");
    if (!q) return options;
    return options.filter((n) => n.toLocaleLowerCase("tr-TR").includes(q));
  }, [options, search]);

  function toggle(name: string) {
    onChange(
      selected.includes(name)
        ? selected.filter((n) => n !== name)
        : [...selected, name],
    );
  }

  if (!il || !ilce) {
    return (
      <p className="rounded-2xl border border-dashed border-primary/15 bg-white/50 px-4 py-3 text-sm text-primary/60">
        Mahalleleri görmek için önce il ve ilçe seçin.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Mahalle ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-2xl border border-primary/10 bg-white px-4 py-2.5 text-sm text-primary shadow-sm"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(options)}
          className="text-xs font-bold text-accent underline"
        >
          Tümünü Seç
        </button>
        <button
          type="button"
          onClick={() => onChange([])}
          className="text-xs font-bold text-primary/60 underline"
        >
          Seçimi Temizle
        </button>
        <span className="text-xs font-semibold text-primary/60">
          {selected.length} mahalle seçildi
        </span>
      </div>

      {loading ? (
        <p className="text-sm text-primary/60">Mahalleler yükleniyor...</p>
      ) : loadError ? (
        <p className="text-sm text-danger">{loadError}</p>
      ) : (
        <div className="grid max-h-72 grid-cols-1 gap-1 overflow-y-auto rounded-2xl border border-primary/10 bg-white p-3 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((name) => (
            <label
              key={name}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-primary hover:bg-[#EEE8DF]"
            >
              <input
                type="checkbox"
                checked={selected.includes(name)}
                onChange={() => toggle(name)}
              />
              <span className="truncate">{name}</span>
            </label>
          ))}
          {!filtered.length ? (
            <p className="col-span-full py-2 text-center text-sm text-primary/50">
              Sonuç bulunamadı.
            </p>
          ) : null}
        </div>
      )}

      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
