import { useState, useRef, useEffect,forwardRef  } from 'react';


export interface Location {
  short_code: string;
  english_name: string;
  code_state: string;
}

export interface LocationDropdownProps {
  
  locations: Location[];
  placeholder?: string;
  label?: string;
  value?: Location | null;
  onChange?: (location: Location | null) => void;
  className?: string;
}


// Component
const LocationDropdown = forwardRef<HTMLInputElement, LocationDropdownProps>(
  (
    {
      locations,
      placeholder = "Enter city, terminal,...",
      label = "From",
      value = null,
      onChange,
      className = "",
    },
    ref
  ) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync with external value changes
  useEffect(() => {
    setSelectedLocation(value);
  }, [value]);

  const filteredLocations = locations.filter(location =>
    location.english_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.short_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.code_state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (location: Location) => {
    setSelectedLocation(location);
    setSearchTerm('');
    setIsOpen(false);
    onChange?.(location);
  };

  const handleClear = () => {
    setSelectedLocation(null);
    setSearchTerm('');
    onChange?.(null);
  };

  const displayValue = selectedLocation 
    ? `${selectedLocation.short_code} - ${selectedLocation.english_name}`
    : searchTerm;

  return (
    <div className="space-y-2">
      {label && (
        <div className="block font-medium text-[12px] leading-4 text-[#65686F]">
          {label}
        </div>
      )}
      
      <div ref={dropdownRef} className="relative">
        <div className="flex gap-2">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 ">
            <img src="/icons/DropdownIcon.svg" alt="Location Icon"/>
          </div>
          <input
            ref={ref}
            required
            type="text"
            placeholder={placeholder}
            value={displayValue}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedLocation(null);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className={`w-full pl-11 pr-12 py-4 text-base border rounded-lg focus:outline-none  transition-colors placeholder:font-normal placeholder:text-[14px] placeholder:leading-5 placeholder:text-[#CCCFD5] border-[#CCCFD5] focus:border-[#19C0FF]`}
          />
          {selectedLocation && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        

        {isOpen && (
          <div className="min-w-[331px] p-1 absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location) => (
                <button
                  key={location.short_code}
                  onClick={() => handleSelect(location)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors "
                >
                  <div className="font-semibold text-[14px] leading-[19px] text-[#0E0E12]">
                    {location.short_code} - {location.english_name}
                  </div>
                  <div className="font-semibold text-[12px] leading-4 text-[#65686F]">
                    {location.code_state}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center">
                Không tìm thấy địa điểm
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
  }
);

export default LocationDropdown;