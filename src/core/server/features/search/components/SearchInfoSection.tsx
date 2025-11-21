export interface SearchViewParams {
  from?: string;
  to?: string;
  departureDate?: string;
  returnDate?: string;
  guest?: string;

}
export default function SearchInfoSection({ from,to,returnDate,departureDate,guest}: SearchViewParams) {
    return (
        <div className="z-1 bg-white w-full flex flex-col  rounded-2xl shadow-[0px_8px_32px_rgba(32,80,118,0.12)] py-[86px] px-[97px] space-y-[54px] h-[872px]">
            <div className="text-search">From: {from}</div>
            <div className="text-search">To: {to}</div>
            <div className="text-search">Departure date: {departureDate}</div>
            {returnDate && <div className="text-search">Return date: {returnDate}</div>}
            <div className="text-search">No. of passenger: {guest}</div>
        </div>
    );
}