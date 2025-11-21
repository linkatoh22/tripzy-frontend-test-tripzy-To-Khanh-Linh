import SearchView from "@/core/server/features/search/SearchView";

export interface SearchPageParams {
  from?: string;
  to?: string;
  dep?: string;
  ret?: string;
  pax?: string;

}

interface Props {
   searchParams: Promise<SearchPageParams>;
}
export default async function SearchPage({ searchParams}: Props){

    const resolvedSearchParams = await searchParams;
    const from = resolvedSearchParams.from || '';
    const to = resolvedSearchParams.to || '';
    const departureDate = resolvedSearchParams.dep || '';
    const returnDate = resolvedSearchParams.ret || '';
    const guest = resolvedSearchParams.pax || '';

    return (
        <SearchView from={from} to={to} departureDate={departureDate} returnDate={returnDate} guest={guest} ></SearchView>
    );
}