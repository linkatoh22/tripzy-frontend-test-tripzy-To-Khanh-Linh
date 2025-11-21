
"use client"
import { useEffect } from "react";
import SearchInfoSection from "./components/SearchInfoSection";
export interface SearchViewParams {
  from?: string;
  to?: string;
  departureDate?: string;
  returnDate?: string;
  guest?: string;

}

export default function SearchView({ from,to,returnDate,departureDate,guest}: SearchViewParams) {
    useEffect(() => {
       console.log({ from,to,returnDate,departureDate,guest});
    }, []);
    return (
        <div className="container min-h-screen flex flex-col items-centerc pt-[11px]">
            <div className="bg-[linear-gradient(135deg,#F5F8FF,#DBF5FF)] w-full h-[495px] absolute inset-0 z-0">
            </div>
            <SearchInfoSection from={from} to={to} departureDate={departureDate} returnDate={returnDate} guest={guest}></SearchInfoSection>
            {/* Add your search view content here */}
        </div>
    );
}