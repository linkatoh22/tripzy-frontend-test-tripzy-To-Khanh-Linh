"use client";
import { useEffect, useRef, useState } from "react";
import LocationDropdown from "@/core/shared/components/atoms/LocationInput/LocationInput";
import DatePickerCalendar from "@/core/shared/components/atoms/CalendarInput/CalendarDropdown";
import PassengerCounter from "@/core/shared/components/atoms/GuestInput/GuestInput";
import { useRouter } from "next/navigation";
import { ConvertDateToString } from "@/core/shared/utils/convertDate";
const TabItems = [
    {
        id:1,
        iconUrl:"/icons/BusIcon.svg",
        label:"Bus & Shuttle",
        outerIconColor: "#D3F3FF",
        tabColor:"#EBF9FF"
    },
    {
        id:2,
        iconUrl:"/icons/HotelIcon.svg",
        label:"Hotel & Accommodation",
        outerIconColor: "#E8FBCC",
        tabColor:"#ecfad7"
    },
    {
        id:3,
        iconUrl:"/icons/FlightIcon.svg",
        label:"Flight",
        outerIconColor: "#E1EDFE",
        tabColor:"#eff4fc"
    }
]

const locations = [
  { short_code: "MD", english_name: "Moldova, Republic of", code_state: "+373 - Moldova, Republic of" },
  { short_code: "MC", english_name: "Monaco", code_state: "+377 - Monaco" },
  { short_code: "AN", english_name: "Netherlands Antilles", code_state: "+599 - Netherlands Antilles" },
  { short_code: "NC", english_name: "New Caledonia", code_state: "+687 - New Caledonia" },
  { short_code: "NZ", english_name: "New Zealand", code_state: "+64 - New Zealand" },
  { short_code: "NU", english_name: "Niue", code_state: "+683 - Niue" },
  { short_code: "NF", english_name: "Norfolk Island", code_state: "+672 - Norfolk Island" },
  { short_code: "MP", english_name: "Northern Mariana Islands", code_state: "+1 670 - Northern Mariana Islands" }
];

export default function  BookingSection(){
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const departureRef = useRef<HTMLInputElement | null>(null);
    const returnRef = useRef<HTMLInputElement | null>(null);

    const [activeTab, setActiveTab] = useState<number>(1);
    const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
    const [fromLocation, setFromLocation] = useState<null | any>(null);
    const [toLocation, setToLocation] = useState<null | any>(null);
    const [departureDate, setDepartureDate] = useState<Date>();
    const [returnDate, setReturnDate] = useState<Date>();
    const [numberOfGuest, setNumberOfGuest] = useState<number>(1);


    const swapLocations = () => {
        const temp = fromLocation;
        setFromLocation(toLocation);
        setToLocation(temp);
    }
    const handleSearch = (e: React.FormEvent)=>{
         e.preventDefault();

        
         if (!inputRef.current?.value || !departureRef.current?.value ||
            (isRoundTrip && !returnRef.current?.value)) {
            inputRef.current?.reportValidity();
            departureRef.current?.reportValidity();
            returnRef.current?.reportValidity();
            return;
        }


        if (isRoundTrip &&
            returnDate &&
            departureDate &&
            returnDate <= departureDate) {
            alert('Return date must be after departure date!');
            return;
        }

        console.log({
            fromLocation,
            toLocation,
            departureDate,
            returnDate: isRoundTrip ? returnDate : null,
            numberOfGuest
        });
        const dep = ConvertDateToString(departureDate);
        const ret = isRoundTrip ? ConvertDateToString(returnDate) : '';
        const params: Record<string, string> = {
            from:fromLocation.english_name,
            to:toLocation.english_name,
            dep:dep,
            pax:numberOfGuest.toString(),
            }
        if (isRoundTrip) {
            params.ret = ConvertDateToString(returnDate);
        }
        const query = new URLSearchParams(params).toString();
        router.push(`/search?${query}`);



    }
    return(

        <div className="z-1 bg-white w-full flex flex-col  rounded-2xl shadow-[0px_8px_32px_rgba(32,80,118,0.12)]">
            {/* Tab for Booking Section */}
            <div className="flex p-3 shadow-[0px_4px_12px_rgba(32,80,118,0.12)] rounded-b-xl ">
                {/* Bus Tab */}
                
                {TabItems.map((item)=>(
                    <div 
                    style={{
                        backgroundColor: activeTab === item.id ? item.tabColor : "#fff"
                    }}
                    className={`cursor-pointer pl-4 py-3 flex items-center flex-1 justify-between rounded-lg `} key={item.id} onClick={()=>setActiveTab(item.id)}>

                        <div className={` flex gap-3 items-center w-full border-r-gray-300 ${item.id !== 3 && activeTab!=item.id && activeTab != item.id+1 ? "border-r" : ""}`}>
                            <div 
                             style={{ backgroundColor: item.outerIconColor }}
                            className={` p-2.5 rounded-full`} >
                                <img src={item.iconUrl} alt="Tab Icon"/>
                            </div>
                            
                            <div className="text-[#121216] text-md" style={{ fontWeight: 500 }}>{item.label}</div>
                        </div>

                </div>
                ))}
                
            
            </div>

            {/* Booking Form */}
            {
                activeTab === 1 && (
                    <form className="flex flex-col gap-6 w-full justify-center py-6 px-4" onSubmit={handleSearch}>
                        
                        <div className="flex  gap-4 py-4">
                            {/* Location Input */}
                            <div className="flex gap-2 items-end flex-1">
                                <LocationDropdown 
                                ref={inputRef}
                                value={fromLocation}
                                placeholder="Enter city, terminal,..." locations={locations} label={"FROM"} onChange={setFromLocation}
                                
                                />

                                <div onClick={swapLocations} className="cursor-pointer p-3 rounded-full shadow-[0px_2px_4px_rgba(32,80,118,0.12)] hover:opacity-80" >
                                    <img src="/icons/TransferIcon.svg" alt="Transfer Icon"/>
                                </div>

                                <LocationDropdown 
                                ref={inputRef}
                                value={toLocation}
                                placeholder="Enter city, terminal,..." locations={locations} label={"TO"} onChange={setToLocation}
                                
                                />
                            </div>


                            <div className="flex gap-2 items-end flex-1">
                                <DatePickerCalendar 
                                ref={departureRef}
                                type={'from'}label="DEPARTURE DATE" onChange={(date)=>setDepartureDate(date!)}
                                    
                                    />

                                <DatePickerCalendar 
                                ref={returnRef}
                                type={'to'}
                                disabled={!isRoundTrip}
                                setIsRoundTrip={setIsRoundTrip}
                                label="ROUND TRIP?" onChange={(date)=>setReturnDate(date!)}
                                
                                />
                            </div>

                            <div className="flex items-end w-[149px] ">
                                <PassengerCounter label="NO. OF PASSENGER" onChange={(count)=>setNumberOfGuest(count)} />
                            </div>
                        </div>

                        <div className="flex justify-center">
                            
                            <button type="submit" className="cursor-pointer flex justify-center items-center gap-2 rounded-full bg-[#19C0FF] text-white py-4 px-[87px]">
                                <img src="/icons/searchIcon.svg" alt="Search Icon"/>
                                <div className="font-semibold text-[14px] leading-[20px]">SEARCH</div>

                            </button>
                        </div>

                    </form>

                )
            }
            
            {
                (activeTab === 2 || activeTab ===3) && (
                    <div className=" flex justify-center items-center w-full py-6 text-[#767689]">
                        <div className="py-12">No-data</div>

                    </div>
                )
            }
            
            
           

        </div>
    )
}