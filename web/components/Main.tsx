export default function Main() {
  return (
    <main className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-[#199FD7] via-[#99BD3C] to-[#FC7942] text-white px-6">
      <section className="max-w-6xl w-full py-20">
        {/* Top navigation placeholder */}
        <header className="flex items-center justify-between mb-12">
          <div className="text-2xl font-extrabold tracking-tight">
            AI<span className="text-black text-opacity-80 ml-2">Site</span>
          </div>
          <nav className="space-x-6 text-sm font-medium opacity-90 hidden md:block">
            <a href="#features" className="hover:underline">
              Features
            </a>
            <a href="#analyze" className="hover:underline">
              Analyze
            </a>
            <a href="#generate" className="hover:underline">
              Generate
            </a>
          </nav>
        </header>

        {/* Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight -tracking-tighter text-black">
              Build smarter with AI
            </h1>
            <p className="mt-6 text-lg md:text-xl text-black/85 max-w-xl">
              Powerful AI tools for analyzing, enhancing, and generating content
              — fast, secure, and user-friendly. Ship better work with less
              effort.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="/generate"
                className="inline-flex items-center justify-center rounded-xl bg-black text-white px-6 py-3 text-sm font-semibold shadow hover:opacity-95"
              >
                Try Generate
              </a>
              <a
                href="/analyze"
                className="inline-flex items-center justify-center rounded-xl border-2 border-black bg-white/80 text-black px-6 py-3 text-sm font-semibold"
              >
                Analyze data
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-black/75">
              <span className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full">
                No credit card
              </span>
              <span className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full">
                GDPR friendly
              </span>
              <span className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full">
                Open API
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center">
            {/* Simple illustrative card */}
            <div className="w-full max-w-md bg-white/90 text-black rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase text-black/60">
                    Live demo
                  </div>
                  <div className="mt-2 font-bold text-lg">
                    Summarize meeting notes
                  </div>
                </div>
                <div className="text-sm text-black/50">3s</div>
              </div>

              <div className="mt-4 text-sm text-black/70">
                Paste any long transcript and get a clean summary, action items,
                and follow-up templates — tuned to your tone.
              </div>

              <div className="mt-5 flex gap-3">
                <button className="flex-1 rounded-lg bg-[#199FD7] text-white px-4 py-2 font-semibold">
                  Open demo
                </button>
                <button className="rounded-lg border border-black/10 px-4 py-2">
                  Copy sample
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <section id="features" className="mt-16">
          <h2 className="text-2xl font-extrabold text-black mb-6">
            What you can do
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/90 text-black shadow">
              <div className="flex items-center gap-3">
                <svg
                  className="w-10 h-10 text-[#199FD7]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2v6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 11h14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 21h12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <div className="font-semibold">Analyze</div>
                  <div className="text-sm text-black/70">
                    Extract insights from documents and data.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/90 text-black shadow">
              <div className="flex items-center gap-3">
                <svg
                  className="w-10 h-10 text-[#99BD3C]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 12h18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 3v18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <div className="font-semibold">Enhance</div>
                  <div className="text-sm text-black/70">
                    Improve clarity, tone, and structure of text.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/90 text-black shadow">
              <div className="flex items-center gap-3">
                <svg
                  className="w-10 h-10 text-[#FC7942]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5v14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 12h14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <div className="font-semibold">Generate</div>
                  <div className="text-sm text-black/70">
                    Create blog posts, code, prompts and more.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
