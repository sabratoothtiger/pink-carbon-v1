export default function Hero() {
  return (
    <div>
      <div className="flex flex-col gap-16 items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center surface-0 text-800">
          {/* Left Column: Text */}
          <div className="p-6 text-center md:text-left flex items-center">
            <section>
              <span className="block text-6xl font-bold mb-1">
                Custom management solutions delivered on{" "}
                <span className="pink-text">your</span> terms
              </span>
              <p className="mt-0 mb-4 text-700 leading-relaxed">
                Pink Carbon specializes in creating personalized tools and
                workflows that adapt to your business needs. Whether you’re
                scaling, optimizing, or starting fresh, we’re here to build the
                solutions that fit you best.{" "}
              </p>

              {/* Auth Buttons */}
              <div className="flex gap-4">
                <div className="flex gap-2">
                  <a href="/sign-in" className="p-button font-bold">
                    Sign in
                  </a>
                  <a
                    href="/sign-up"
                    className="p-button p-button-outlined font-bold"
                  >
                    Sign up
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Image */}
          <div className="overflow-hidden flex items-center justify-center">
            <img
              src="/assets/pink_carbon_hero.png"
              alt="pink-carbon-hero-image"
              className="block h-auto w-full object-cover"
              style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
