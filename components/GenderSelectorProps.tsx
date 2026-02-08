"use client";
import { useState } from "react";

interface GenderSelectorProps {
  onSelect: (gender: string) => void;
  isGenderError?: boolean
}

export default function GenderSelector({ onSelect, isGenderError }: GenderSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (gender: string) => {
    setSelected(gender);
    onSelect(gender);
  };

  return (
    <div className="flex gap-4 mt-1">
      {/* Button Nam */}
      <button
        onClick={() => handleSelect("Nam")}
        className={`px-8 py-1 rounded-lg border font-medium transition
          ${selected === "Nam"
            ? "bg-blue-500 text-white border-blue-500"
            : isGenderError
              ? "border-red-500 text-gray-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"}
        `}
      >
        Nam
      </button>

      {/* Button Nữ */}
      <button
        onClick={() => handleSelect("Nữ")}
        className={`px-8 py-1 rounded-lg border font-medium transition
          ${selected === "Nữ"
            ? "bg-blue-500 text-white border-blue-500"
            : isGenderError
              ? "border-red-500 text-gray-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"}
        `}
      >
        Nữ
      </button>
      
    </div>
  );
}
