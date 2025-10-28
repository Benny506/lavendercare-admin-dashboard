import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { FaCircle } from "react-icons/fa6";


export const ColorCircle = ({ color, size }) => (
    <FaCircle color={color || '#000'} size={size || 30} />
)

const ColorPicker = ({ value = '#3498db', onChange }) => {
  const [internalColor, setInternalColor] = useState(value);
  const [hexInput, setHexInput] = useState(value);

  const handleColorChange = (color) => {
    setInternalColor(color);
    setHexInput(color);
    onChange?.(color);
  };

  const handleHexSubmit = (e) => {
    e.preventDefault();
    const cleaned = hexInput.trim();

    // Try named colors first (e.g. 'red', 'green', 'blue')
    const tempEl = document.createElement('div');
    tempEl.style.color = cleaned;
    if (tempEl.style.color) {
      const computed = getComputedStyle(tempEl).color;
      const rgbMatch = computed.match(/rgba?\((\d+), (\d+), (\d+)/);
      if (rgbMatch) {
        const [r, g, b] = rgbMatch.slice(1, 4).map(Number);
        const hex =
          '#' +
          [r, g, b]
            .map((x) => x.toString(16).padStart(2, '0'))
            .join('');
        setInternalColor(hex);
        setHexInput(hex);
        onChange?.(hex);
        return;
      }
    }

    // Try valid hex formats (#fff, #ffffff, #ffffffff)
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(cleaned)) {
      setInternalColor(cleaned);
      onChange?.(cleaned);
    } else {
      // Normalize if missing '#'
      const maybe = '#' + cleaned.replace(/^#/, '');
      if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(maybe)) {
        setInternalColor(maybe);
        setHexInput(maybe);
        onChange?.(maybe);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-sm">
          <HexColorPicker color={internalColor} onChange={handleColorChange} className="w-full" />
        </div>
      </div>

      {/* <form onSubmit={handleHexSubmit} className="flex gap-2 w-full">
        <input
          type="text"
          className="flex-1 border rounded-lg p-2"
          placeholder="Enter hex or color name (e.g. red, #fff, 00ff00)"
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Apply
        </button>
      </form> */}
    </div>
  );
};

export default ColorPicker;