import Footer from '@/components/home-page/footer';
import Header from '@/components/home-page/header';
import Link from 'next/link';
import React from 'react';

export default function NotFound() {
    return (
        <React.Fragment>
            <Header />
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between text-center md:text-left px-6 py-10">
                {/* Left Column: Image */}
                <div className="md:w-1/2 flex justify-center md:justify-end mb-6 md:mb-0">
                    <img
                        src="/assets/pink_carbon_404.png"
                        alt="pink-carbon-not-found"
                        className="w-3/4 max-w-sm transform scale-y-50"
                    />
                </div>

                {/* Right Column: Text */}
                <div className="md:w-1/2 flex flex-col justify-center md:pl-8">
                    <h1>
                    <span className="pink-text">404 Error:</span> This page has evaporated into thin air!</h1>
                    <p>
                        Let’s{" "}
                        <Link href="https://pinkcarbon.app">
                                get back
                        </Link>{" "}
                        to a stable connection.
                    </p>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
}
