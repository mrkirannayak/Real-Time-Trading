import Image from "next/image";
import Link from "next/link";

const HeroBanner = () => {
  return (
    <>
      <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-2 sm:py-32 lg:overflow-visible lg:px-0">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg
            aria-hidden="true"
            className="absolute top-0 left-[max(50%,25rem)] h-256 w-512 -translate-x-1/2 mask-[radial-gradient(64rem_64rem_at_top,white,transparent)] stroke-gray-800"
          >
            <defs>
              <pattern
                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                width="200"
                height="200"
                x="50%"
                y="-1"
                patternUnits="userSpaceOnUse"
              >
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y="-1" className="overflow-visible fill-gray-800/50">
              <path
                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                strokeWidth="0"
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
              strokeWidth="0"
            />
          </svg>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="text-base/7 font-semibold text-indigo-400">
                  Monitor top Intraday stocks in real time
                </p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">
                  Stock Trading Made Simple & Pro!
                </h1>
                <p className="mt-6 text-xl/8 text-gray-300">
                  Fast, simple and secure stock trading. Unlock instant margin
                  from your holdings.
                </p>
                <p className="mt-6 text-xl/8 text-gray-300">
                  Investing was none of the above. But we are changing that.
                  Super easy to use, lightning fast, and crystal clear.
                </p>
                <div className="mt-10">
                  <Link
                    href="/"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                  >
                    Start Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="-mt-12 -ml-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <Image
              src="/chart-banner.png"
              alt=""
              width={600}
              height={600}
              unoptimized
              className="w-3xl max-w-none rounded-xl bg-gray-800 shadow-xl ring-1 ring-white/10 sm:w-228"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroBanner;
