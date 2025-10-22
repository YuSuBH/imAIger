"use client";

import Link from "next/link";

export default function Main() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
      <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl">
        AI-Powered
        <br />
        Image Studio
      </h1>
      <p className="text-xl md:text-2xl text-white/90 max-w-3xl drop-shadow-lg mb-8">
        Transform, enhance, and create stunning images with cutting-edge AI
        technology
      </p>
      <Link href="/playGround" className="pointer-events-auto animated-border">
        <span className="animated-border-inner block text-white text-lg font-semibold">
          Enter Playground
        </span>
      </Link>
    </div>
  );
}
