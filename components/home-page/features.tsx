export default async function Features() {
    return (
        <div>
            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need to <span className="pink-text">Manage Tax Season</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            From intake to completion, Pink Carbon provides the tools and insights you need to run an efficient tax
                            practice.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Queue Management</h3>
                            <p className="text-gray-600">
                                Organize and prioritize tax returns with drag-and-drop simplicity. Never lose track of where each
                                return stands.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Client Portal</h3>
                            <p className="text-gray-600">
                                Clients can check their return status anytime with a simple widget. Reduce phone calls and improve
                                satisfaction.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                            <p className="text-gray-600">
                                Track performance metrics, completion times, and workflow efficiency to optimize your practice.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}