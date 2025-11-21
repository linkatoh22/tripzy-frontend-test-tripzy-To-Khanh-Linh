import HeroSection from "./components/HeroSection";
import BookingSection from "./components/BookingSection";
export default function HomeView() {
  return (
    <div className="container min-h-screen pt-[103px] ">
      <div className="bg-[linear-gradient(135deg,#F5F8FF,#DBF5FF)] w-full h-[495px] absolute inset-0 z-0">
      </div>
      <div className="flex flex-col gap-10 ">
      <HeroSection/>
      <BookingSection/>
       </div>
      
    </div>
  );
}
