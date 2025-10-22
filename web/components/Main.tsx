"use client";

import Aurora from "./Aurora";

export default function Main() {
  return (
    <Aurora
      colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
      blend={0.5}
      amplitude={2.0}
      speed={0.5}
    />
  );
}
