export default async function Pricing() {
    return (
        <div>
            {/* Pricing Section */}
            <section id="pricing" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Simple, <span className="pink-text">Transparent Pricing</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Choose the plan that fits your practice. No hidden fees, no surprises.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-pink-300 transition-colors">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                            <p className="text-gray-600 mb-6">Perfect for small practices</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">$29</span>
                                <span className="text-gray-600">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Up to 100 returns/month
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Client status widget
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Basic analytics
                                </li>
                            </ul>
                            <a
                                href="/sign-up"
                                className="w-full bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center block"
                            >
                                Get Started
                            </a>
                        </div>

                        <div className="bg-pink-50 border-2 border-pink-500 rounded-xl p-8 relative">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                            <p className="text-gray-600 mb-6">For growing practices</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">$79</span>
                                <span className="text-gray-600">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Up to 500 returns/month
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Team collaboration
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Advanced analytics
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Priority support
                                </li>
                            </ul>
                            <a
                                href="/sign-up"
                                className="w-full bg-pink-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors text-center block"
                            >
                                Get Started
                            </a>
                        </div>

                        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-pink-300 transition-colors">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                            <p className="text-gray-600 mb-6">For large practices</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">$199</span>
                                <span className="text-gray-600">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Unlimited returns
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Custom integrations
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Dedicated support
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    White-label options
                                </li>
                            </ul>
                            <a
                                href="/sign-up"
                                className="w-full bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center block"
                            >
                                Contact Sales
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}