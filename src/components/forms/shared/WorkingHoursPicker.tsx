"use client";

import { TIME_SLOTS, WORKING_DAYS, type WorkingHours } from "@/lib/validations/workingHours";

type WorkingHoursPickerProps = {
  value: WorkingHours;
  onChange: (next: WorkingHours) => void;
  error?: string;
};

const timeSelectClass =
  "rounded-xl border border-primary/10 bg-white px-3 py-2 text-sm text-primary shadow-sm disabled:opacity-40";

export function WorkingHoursPicker({ value, onChange, error }: WorkingHoursPickerProps) {
  function updateDay(key: keyof WorkingHours, patch: Partial<WorkingHours[keyof WorkingHours]>) {
    onChange({ ...value, [key]: { ...value[key], ...patch } });
  }

  return (
    <div className="space-y-2">
      {WORKING_DAYS.map(({ key, label }) => {
        const day = value[key];
        return (
          <div
            key={key}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/10 bg-white px-4 py-3"
          >
            <label className="flex w-32 items-center gap-2 text-sm font-bold text-primary">
              <input
                type="checkbox"
                checked={!day.closed}
                onChange={(e) => updateDay(key, { closed: !e.target.checked })}
              />
              {label}
            </label>

            {day.closed ? (
              <span className="text-sm text-primary/50">Kapalı</span>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  className={timeSelectClass}
                  value={day.open ?? ""}
                  onChange={(e) => updateDay(key, { open: e.target.value })}
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                <span className="text-primary/50">–</span>
                <select
                  className={timeSelectClass}
                  value={day.close ?? ""}
                  onChange={(e) => updateDay(key, { close: e.target.value })}
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        );
      })}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
