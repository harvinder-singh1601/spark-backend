"use client"
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";

interface OpeningTimesFormProps {
  value?: any;
  onChange: (value: any) => void;
}

const daysOfWeek = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export default function OpeningTimesForm({ value, onChange }: OpeningTimesFormProps) {
  const [openingTimes, setOpeningTimes] = useState<any>(() => {
    if (value) return value;
    return {
      monday: { open: "09:00", close: "18:00", closed: false },
      tuesday: { open: "09:00", close: "18:00", closed: false },
      wednesday: { open: "09:00", close: "18:00", closed: false },
      thursday: { open: "09:00", close: "18:00", closed: false },
      friday: { open: "09:00", close: "18:00", closed: false },
      saturday: { open: "10:00", close: "16:00", closed: false },
      sunday: { closed: true },
    };
  });

  useEffect(() => {
    if (value) {
      setOpeningTimes(value);
    }
  }, [value]);

  const handleDayChange = (day: string, field: string, val: any) => {
    const updated = { ...openingTimes };
    if (field === "closed") {
      updated[day] = { closed: val };
    } else {
      updated[day] = {
        ...updated[day],
        [field]: val,
        closed: false,
      };
    }
    setOpeningTimes(updated);
    onChange(updated);
  };

  const copyToAllDays = () => {
    const mondayHours = openingTimes.monday;
    const updated = { ...openingTimes };
    daysOfWeek.forEach((day) => {
      updated[day.key] = { ...mondayHours };
    });
    setOpeningTimes(updated);
    onChange(updated);
  };

  const copyMondayToWeekdays = () => {
    const mondayHours = openingTimes.monday;
    const updated = { ...openingTimes };
    ["monday", "tuesday", "wednesday", "thursday", "friday"].forEach((day) => {
      updated[day] = { ...mondayHours };
    });
    setOpeningTimes(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          size="xs"
          color="light"
          onClick={copyMondayToWeekdays}
        >
          Copy Monday to Weekdays
        </Button>
        <Button
          type="button"
          size="xs"
          color="light"
          onClick={copyToAllDays}
        >
          Copy Monday to All Days
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {daysOfWeek.map((day) => (
          <div key={day.key} className="border border-border rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="font-medium">{day.label}</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`${day.key}-closed`}
                  checked={openingTimes[day.key]?.closed || false}
                  onChange={(e) => handleDayChange(day.key, "closed", e.target.checked)}
                />
                <Label htmlFor={`${day.key}-closed`} className="text-sm">
                  Closed
                </Label>
              </div>
            </div>
            {!openingTimes[day.key]?.closed && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`${day.key}-open`} className="text-sm mb-1 block">
                    Open
                  </Label>
                  <TextInput
                    id={`${day.key}-open`}
                    type="time"
                    value={openingTimes[day.key]?.open || "09:00"}
                    onChange={(e) => handleDayChange(day.key, "open", e.target.value)}
                    className="form-control"
                  />
                </div>
                <div>
                  <Label htmlFor={`${day.key}-close`} className="text-sm mb-1 block">
                    Close
                  </Label>
                  <TextInput
                    id={`${day.key}-close`}
                    type="time"
                    value={openingTimes[day.key]?.close || "18:00"}
                    onChange={(e) => handleDayChange(day.key, "close", e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

