import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md py-4 border-b border-t-gray-200 ">
      <div className="container mx-auto flex justify-between items-center px-6 lg:px-8">
        <Link href={"/"} className="flex items-center">
          {/* <Image src={"/logo.png"} alt="logo" width={50} height={50} /> */}
          <span className="text-2xl font-bold text-gray-800">AI APP</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link href={"/analyze"} className="text-slate-900 hover:text-sky-500">
            Analyze
          </Link>
          <Link
            href={"/generate"}
            className="text-slate-900 hover:text-sky-500"
          >
            Generate
          </Link>
          <Link href={"/upscale"} className="text-slate-900 hover:text-sky-500">
            UpScale
          </Link>
          <Link
            href={"/bgRemove"}
            className="text-slate-900 hover:text-sky-500"
          >
            Remove BG
          </Link>
        </div>
      </div>
    </nav>
  );
}
