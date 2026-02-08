"use client";
import { useState, useRef, useEffect } from "react";

interface DateSelectorProps {
  onSelect: (date: { day: number | null; month: number | null; year: number | null }) => void;
  dateError?: boolean;
}

export default function DateSelector({ onSelect, dateError }: DateSelectorProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<"day" | "month" | "year" | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 70 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (type: "day" | "month" | "year", value: number) => {
    if (type === "day") setSelectedDay(value);
    if (type === "month") setSelectedMonth(value);
    if (type === "year") setSelectedYear(value);
    setOpenDropdown(null);

    onSelect({
      day: type === "day" ? value : selectedDay,
      month: type === "month" ? value : selectedMonth,
      year: type === "year" ? value : selectedYear,
    });
  };

  const renderDropdown = (type: "day" | "month" | "year", items: number[]) => (
    <div className="relative " key={type}>
      <button
        onClick={() => setOpenDropdown(openDropdown === type ? null : type)}

        className={`w-32 mx-2.5 px-2 py-2 border rounded-lg shadow-sm text-gray-700 text-sm font-medium flex justify-between items-center focus:ring-2 focus:ring-blue-500
          ${dateError ? "border border-red-600" : "border border-gray-300"}`}
        
      >
        {type === "day" && (selectedDay ? `Ngày ${selectedDay}` : "Chọn ngày")}
        {type === "month" && (selectedMonth ? `Tháng ${selectedMonth}` : "Chọn tháng")}
        {type === "year" && (selectedYear ? `Năm ${selectedYear}` : "Chọn năm")}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {openDropdown === type && (
        <div className="absolute z-10 ml-3 mt-3 w-36 max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
          {items.map((item) => (
            <div
              key={item}
              onClick={() => handleSelect(type, item)}
              className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer text-gray-700"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={ref}
      className="bg-gray-100 flex flex-col items-center justify-center"
    >
      <div className="flex items-center">{renderDropdown("day", days)}{renderDropdown("month", months)}{renderDropdown("year", years)}</div>
    </div>
  );
}
