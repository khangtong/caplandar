'use client';

import { useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

interface DatePickerProps {
  id: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  marginBottom: string;
  changeMonth: (month: number, year: number) => void | null;
  name: string;
  schedule?: any;
}

export default function DatePicker({
  id,
  textColor,
  backgroundColor,
  borderColor,
  marginBottom,
  changeMonth,
  name,
  schedule,
}: DatePickerProps) {
  useEffect(() => {
    // Initialize flatpickr on the input element
    flatpickr(`#${id}`, {
      dateFormat: 'Y-m-d',
      onChange: function (selectedDates) {
        changeMonth(
          new Date(selectedDates[0]).getMonth() + 1,
          new Date(selectedDates[0]).getFullYear()
        );
      },
    });
  }, [id]);

  return (
    <input
      type="text"
      id={id}
      className={`w-full px-3 py-1.5 border border-${borderColor} rounded-lg mb-${marginBottom} text-${textColor} bg-${backgroundColor} focus:outline-none focus:border-brand/40 focus:shadow-3 hover:outline-none hover:border-brand/40 hover:shadow-3`}
      placeholder="YYYY-MM-DD"
      name={name}
      value={
        schedule
          ? `${schedule.date.split('-')[0]}-${schedule.date.split('-')[1]}-${
              schedule.date.split('-')[2]
            }`
          : ''
      }
      onChange={(e) => e.target.value}
      required
    />
  );
}
