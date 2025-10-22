import Details from "@/components/Details";
import Main from "@/components/Main";
import Aurora from "@/components/Aurora";

export default function Home() {
  return (
    <>
      <div className="fixed inset-0 w-full h-full -z-10">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={2.0}
          speed={0.5}
        />
      </div>
      <div className="relative w-full">
        <div className="h-screen w-full relative">
          <Main />
        </div>
        <Details />
      </div>
    </>
  );
}
