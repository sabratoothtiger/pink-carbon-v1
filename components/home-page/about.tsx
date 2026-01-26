export default async function About() {
    return (
        <div>
            {/* About Section */}
            <section id="about" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Built by Tax Professionals, <span className="pink-text">For Tax Professionals</span>
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Pink Carbon was born from the frustration of managing hundreds of tax returns during busy season. We
                                understand the chaos, the client calls, and the sleepless nights wondering if anything fell through
                                the cracks.
                            </p>
                            <p className="text-lg text-gray-600 mb-8">
                                Our mission is simple: give tax professionals the tools they need to run efficient, stress-free
                                practices while keeping clients happy and informed throughout the process.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                                        <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Founded by practicing CPAs</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                                        <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Trusted by 50+ tax practices</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                                        <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">99.9% uptime guarantee</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="/assets/pink_carbon_hero.png"
                                alt="Pink Carbon team working on tax processing solutions"
                                className="w-full h-auto rounded-2xl shadow-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}