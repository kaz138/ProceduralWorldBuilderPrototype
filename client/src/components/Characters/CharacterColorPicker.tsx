import React from 'react';

interface CharacterColorPickerProps {
  label: string;
  color: [number, number, number];
  onChange: (color: [number, number, number]) => void;
}

export function CharacterColorPicker({ 
  label, 
  color, 
  onChange 
}: CharacterColorPickerProps) {
  // Convert RGB array [0-1] to hex string
  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (c: number) => {
      const hex = Math.floor(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Convert hex string to RGB array [0-1]
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? [
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255
        ] 
      : [0, 0, 0];
  };

  const colorHex = rgbToHex(color[0], color[1], color[2]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRgb = hexToRgb(e.target.value);
    onChange(newRgb);
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="text-white font-medium">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={colorHex}
          onChange={handleChange}
          className="h-10 w-10 border-none rounded-md cursor-pointer"
        />
        <div 
          className="w-8 h-8 rounded-full shadow-inner"
          style={{ backgroundColor: colorHex }}
        />
      </div>
    </div>
  );
}

export default CharacterColorPicker;