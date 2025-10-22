"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/playGround", label: "Playground", special: true },
    { href: "/analyze", label: "Analyze", special: false },
    { href: "/generate", label: "Generate", special: false },
    { href: "/upscale", label: "UpScale", special: false },
    { href: "/bgRemove", label: "Remove BG", special: false },
    { href: "/history", label: "History", special: false },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md py-4 border-b border-t-gray-200 ">
      <div className="container mx-auto flex justify-between items-center px-6 lg:px-8">
        <Link href={"/"} className="flex items-center">
          {/* <Image src={"/logo.png"} alt="logo" width={50} height={50} /> */}
          <span className="text-2xl font-bold text-gray-800">AI APP</span>
        </Link>

        <div className="flex items-center space-x-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative ${
                  link.special
                    ? "font-semibold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent hover:from-purple-500 hover:via-pink-400 hover:to-blue-400 animate-pulse drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    : "text-slate-900 hover:text-sky-500"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
