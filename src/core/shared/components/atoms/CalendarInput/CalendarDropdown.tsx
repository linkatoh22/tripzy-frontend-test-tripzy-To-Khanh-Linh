import React, { useState, useRef, useEffect,forwardRef } from 'react';
import Checkbox from '../CustomCheckbox/CustomCheckbox';
interface DatePickerCalendarProps {
  onChange?: (date: Date | null) => void;
  disabled?: boolean;
  label?: string;
  type: 'from' | 'to';
  setIsRoundTrip?: (value: boolean) => void;
}
const DatePickerCalendar = forwardRef<HTMLInputElement, DatePickerCalendarProps>(
  (
    {type='from', onChange, disabled = false, label = "DEPARTURE DATE",setIsRoundTrip },
    ref
  ) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('DD / MM / YYYY  00:00');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);


  useEffect(() => {
  const currentRef = inputRef.current || (ref && 'current' in ref ? ref.current : null);
  if (currentRef) {
    if (!selectedDate || inputValue === 'DD / MM / YYYY  00:00') {
      currentRef.setCustomValidity('Please select a valid date!');
    } else {
      currentRef.setCustomValidity('');
    }
  }
}, [selectedDate, inputValue, ref]);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const generateCalendarDays = (date: Date) => {
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number, monthOffset: number = 0) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, day);
    clickedDate.setHours(0, 0, 0, 0);
    
    if (clickedDate >= today) {
      // Preserve hour and minute from current input if exists
      const currentDate = parseInputDate(inputValue);
      if (currentDate) {
        clickedDate.setHours(currentDate.getHours(), currentDate.getMinutes());
      }
      
      setSelectedDate(clickedDate);
      setInputValue(formatDate(clickedDate));
      setIsOpen(false);
      if (onChange) {
        onChange(clickedDate);
      }
    }
  };

  const isWeekend = (day: number | null, monthOffset: number = 0) => {
    if (day === null) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const isToday = (day: number | null) => {
    if (day === null) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  };

  const isPastDate = (day: number | null, monthOffset: number = 0) => {
    if (day === null) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, day);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatDate = (date: Date | null, hour?: number, minute?: number) => {
    if (!date) return 'DD / MM / YYYY  00:00';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const h = (hour !== undefined ? hour : date.getHours()).toString().padStart(2, '0');
    const m = (minute !== undefined ? minute : date.getMinutes()).toString().padStart(2, '0');
    return `${day} / ${month} / ${year}  ${h}:${m}`;
  };

  const parseInputDate = (value: string) => {
    // Remove extra spaces and parse DD / MM / YYYY HH:MM
    const cleaned = value.replace(/\s+/g, ' ').trim();
    const parts = cleaned.split(/[\/\s:]+/);
    
    if (parts.length >= 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      const hour = parts.length >= 4 ? parseInt(parts[3]) : 0;
      const minute = parts.length >= 5 ? parseInt(parts[4]) : 0;
      
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const date = new Date(year, month - 1, day, hour, minute);
        
        // Validate the date is real and not in the past
        const checkDate = new Date(year, month - 1, day);
        checkDate.setHours(0, 0, 0, 0);
        
        if (date.getDate() === day && 
            date.getMonth() === month - 1 && 
            date.getFullYear() === year &&
            hour >= 0 && hour <= 23 &&
            minute >= 0 && minute <= 59 &&
            checkDate >= today) {
          return date;
        }
      }
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleInputBlur = () => {
    const parsedDate = parseInputDate(inputValue);
    if (parsedDate) {
      setSelectedDate(parsedDate);
      setInputValue(formatDate(parsedDate));
      setCurrentMonth(parsedDate);
      if (onChange) {
        onChange(parsedDate);
      }
    } else if (selectedDate) {
      setInputValue(formatDate(selectedDate));
    } else {
      setInputValue('DD / MM / YYYY  00:00');
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
      setIsOpen(false);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  return (
    <div className="space-y-2">

      {type === 'from' ?
      <div className="block font-medium text-[12px] leading-4 text-[#65686F]">
        {label}
      </div>
      :
      <div className='flex gap-2'>
        
        <Checkbox
          checked={!disabled}
          label="ROUND TRIP?"
          onChange={setIsRoundTrip}
        />

      </div>

      }
      
      
      <div ref={dropdownRef} className="relative w-full">
        {/* Date Input Field */}
        <div className="relative">
          <input
            
            ref={ ref }
            type="text"
            value={inputValue}
            required
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            onFocus={() => !disabled && setIsOpen(true)}
            disabled={disabled}
            placeholder="DD / MM / YYYY  00:00"
            className={`w-full pl-12 pr-4 py-4 rounded-lg border border-[#CCCFD5] text-gray-400 font-medium focus:outline-none focus:border-[#19C0FF] ${
              disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-white cursor-text '
            }`}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <img src="/icons/CalendarIcon.svg" alt="Calendar" />
          </div>
        </div>

        {/* Dropdown Calendar */}
        {isOpen && (
          <div className={`min-w-[569px] absolute z-10 mt-2 bg-white rounded-lg shadow-lg p-4 border border-gray-200 ${type === 'to' ? 'right-0' : 'left-0'}`}>
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-3">
              <div className='flex items-center gap-4'>
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <img src="/icons/LeftArrowIcon.svg" alt="Previous" />
                </button>

                <div className="font-medium text-base leading-6">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>
              </div>
              
              <div className='flex items-center gap-4'>
                <div className="font-medium text-base leading-6">
                  {monthNames[(currentMonth.getMonth() + 1) % 12]} {currentMonth.getMonth() === 11 ? currentMonth.getFullYear() + 1 : currentMonth.getFullYear()}
                </div>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <img src="/icons/RightArrowIcon.svg" alt="Next" />
                </button>
              </div>
            </div>

            {/* Double Calendar Grid */}
            <div className="grid grid-cols-2 gap-8">
              {/* Current Month */}
              <div>
                <div className="grid grid-cols-7 mb-3">
                  {weekDays.map((day) => (
                    <div key={day} className="text-center text-gray-400 font-medium">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {generateCalendarDays(currentMonth).map((day, index) => {
                    const weekend = isWeekend(day, 0);
                    const todayDate = isToday(day);
                    const past = isPastDate(day, 0);
                    
                    return (
                      <button
                        key={index}
                        onClick={() => day && handleDateClick(day, 0)}
                        disabled={!day || past}
                        className={`
                          px-2.5 py-2 flex items-center justify-center rounded-lg text-lg font-medium
                          transition
                          ${!day ? 'invisible' : ''}
                          ${past ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}
                          ${weekend && !todayDate && !past ? 'text-red-500' : ''}
                          ${todayDate ? 'text-cyan-500' : ''}
                          ${!weekend && !todayDate && !past ? 'text-black' : ''}
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Next Month */}
              <div>
                <div className="grid grid-cols-7 mb-3">
                  {weekDays.map((day) => (
                    <div key={day} className="text-center text-gray-400 font-medium">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {generateCalendarDays(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                  ).map((day, index) => {
                    const weekend = isWeekend(day, 1);
                    const todayDate = day !== null && (() => {
                      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day);
                      date.setHours(0, 0, 0, 0);
                      return date.getTime() === today.getTime();
                    })();
                    const past = isPastDate(day, 1);
                    
                    return (
                      <button
                        key={index}
                        onClick={() => day && handleDateClick(day, 1)}
                        disabled={!day || past}
                        className={`
                          px-2.5 py-2 flex items-center justify-center rounded-lg text-lg font-medium
                          transition
                          ${!day ? 'invisible' : ''}
                          ${past ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}
                          ${weekend && !todayDate && !past ? 'text-red-500' : ''}
                          ${todayDate ? 'text-cyan-500' : ''}
                          ${!weekend && !todayDate && !past ? 'text-black' : ''}
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  }
);
export default DatePickerCalendar;