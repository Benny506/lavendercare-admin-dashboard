import React from "react";

const HourSelect = ({ value, onChange=()=>{}, required, onBlur=()=>{}, name }) => {
  return (
    <select
        id={name}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        className='p-2 border-[1px] border-gray-300 rounded-lg w-full focus:outline-none'
    >
        <option
            value={""}
            selected
            disabled
        >
            Select one
        </option>
        {Array.from({ length: 24 }, (_, i) => {
            const hour = String(i).padStart(2, "0");
            return (
                <option 
                    key={i} 
                    value={`${hour}:00`}
                >
                    {hour}:00
                </option>
            );
        })}
    </select>
  );
};

export default HourSelect;
