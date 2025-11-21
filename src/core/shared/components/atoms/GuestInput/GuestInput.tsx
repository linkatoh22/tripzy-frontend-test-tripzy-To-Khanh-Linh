import React, { useState } from 'react';

interface PassengerCounterProps {
  label?: string;
  initialCount?: number;
  minCount?: number;

  onChange?: (count: number) => void;
}

export default function PassengerCounter({
  label = 'NO. OF PASSENGER',
  initialCount = 1,
  minCount = 1,

  onChange
}: PassengerCounterProps) {
  const [count, setCount] = useState(initialCount);

  const handleIncrement = () => {
    
      const newCount = count + 1;
      setCount(newCount);
      onChange?.(newCount);
    
  };

  const handleDecrement = () => {
    if (count > minCount) {
      const newCount = count - 1;
      setCount(newCount);
      onChange?.(newCount);
    }
  };

  return (
    <div className="w-full space-y-2 ">
      <label className="block font-medium text-[12px] leading-4 text-[#65686F]">
        {label}
      </label>
      <div className="flex items-center border border-gray-300 rounded-lg bg-white shadow-sm">
        <div className="flex items-center gap-2 p-4 flex-1">
          <img src="/icons/UserIcon.svg"/>
        
          <input type="number" value={count} min={1}

            onChange={e => {
              let value = Number(e.target.value);
              if (value < 1) value = count;
              setCount(value);
              onChange?.(value);
            }}
            className="border-0 bg-white font-normal text-sm leading-5 w-full"/>
        </div>

        <div className="flex flex-col border-l border-gray-300">
          <button
            type="button"
            onClick={handleIncrement}
            // disabled={count >= maxCount}
            className="px-2 py-[5px] hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-b border-gray-300"
            
          >
            <img src="/icons/UpArrowIcon.svg"/>
           
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            disabled={count <= minCount}
            className="px-2 py-[5px] hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            
          >
            <img src="/icons/DownArrowIcon.svg"/>
            
          </button>
        </div>
      </div>
    </div>
  );
}