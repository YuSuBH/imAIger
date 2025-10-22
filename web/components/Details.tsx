"use client";

import Link from "next/link";
import RollingGallery from "./RollingGallery";

const features = [
  {
    name: "Image Generation",
    description:
      "Transform your ideas into stunning visuals with AI-powered image generation. Create unique artwork from text descriptions.",
    tips: "Tip: Be specific with your prompts. Include details about style, colors, and composition for best results.",
    href: "/generate",
    buttonText: "Generate Images",
    isPlay: "false",
  },
  {
    name: "Image Analysis",
    description:
      "Get detailed AI-powered analysis of your images. Understand content, objects, scenes, and context with advanced computer vision.",
    tips: "Tip: Upload clear, well-lit images for more accurate analysis. Works great with photos, artwork, and documents.",
    href: "/analyze",
    buttonText: "Analyze Images",
    isPlay: "false",
  },
  {
    name: "Background Removal",
    description:
      "Remove backgrounds from images instantly with AI precision. Perfect for product photos, portraits, and creative projects.",
    tips: "Tip: Works best with images that have clear subject-background separation. Great for e-commerce and design work.",
    href: "/bgRemove",
    buttonText: "Remove Background",
    isPlay: "false",
  },
  {
    name: "Image Upscaling",
    description:
      "Enhance and upscale your images without losing quality. Use AI to add detail and improve resolution of low-quality images.",
    tips: "Tip: Start with the highest quality source image possible. AI upscaling works great for enlarging photos and graphics.",
    href: "/upscale",
    buttonText: "Upscale Images",
    isPlay: "false",
  },
  {
    name: "Playground",
    description:
      "Experiment with all features in one place. Combine generation, analysis, and editing tools for creative exploration.",
    tips: "Tip: Try chaining different features together. Generate an image, remove background, then upscale for professional results.",
    href: "/playGround",
    buttonText: "Open Playground",
    isPlay: "true",
  },
];

export default function Details() {
  return (
    <div className="w-full">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Explore the possibilities with AI
        </h1>
      </div>

      <RollingGallery autoplay={true} pauseOnHover={true} />

      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Powerful AI Features
        </h2>

        <div className="w-full space-y-6 px-4 md:px-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="w-full bg-black backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                    {feature.name}
                  </h3>
                  <p className="text-gray-300 mb-4 text-base md:text-lg">
                    {feature.description}
                  </p>
                  <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-3">
                    <p className="text-sm text-gray-300">{feature.tips}</p>
                  </div>
                </div>

                <div className="md:ml-6">
                  <Link href={feature.href}>
                    <button
                      className={`w-full md:w-auto px-8 py-4 font-semibold rounded-xl transition-all duration-300 hover:shadow-lg whitespace-nowrap ${
                        feature.isPlay === "true"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white hover:shadow-purple-500/50"
                          : "bg-white hover:bg-gray-100 text-black hover:shadow-white/50"
                      }`}
                    >
                      {feature.buttonText}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
