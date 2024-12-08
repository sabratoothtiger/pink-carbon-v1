"use client"
import React, { useEffect, useState } from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";

const TopBar = React.memo(() => {
    const [mobileActive, setMobileActive] = useState(false);
// State to track if screen size has been determined
const [isReady, setIsReady] = useState(false);

// Example Menu Items
const items = [
    { label: 'Home', icon: 'pi pi-home', command: () => { window.location.href = "/" } },
    { label: 'About', icon: 'pi pi-info-circle', command: () => { window.location.href = "/about" } },
    { label: 'Contact', icon: 'pi pi-envelope', command: () => { window.location.href = "/contact" } },
];

// Listen to window resize to determine if it's mobile view
useEffect(() => {
    const handleResize = () => {
        setMobileActive(window.innerWidth <= 768); // Example: Mobile if width <= 768px
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call on initial render

    // After determining screen size, set `isReady` to true
    setIsReady(true);

    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);

if (!isReady) {
    return null; // Don't render anything until screen size is determined
}

return (
    <div>
        {!mobileActive && (
            <Menubar 
                model={items}
                end={
                    <div>
                        {/* Add extra components like buttons */}
                        <Button label="Login" icon="pi pi-sign-in" className="p-button-secondary mr-2" />
                        <Button label="Register" icon="pi pi-user-plus" className="p-button-success" />
                    </div>
                }
            />
        )}
        {mobileActive && (
            <div className="mobile-menu">
                <Button
                    label="Open Menu"
                    icon="pi pi-bars"
                    onClick={() => alert("Open mobile menu")}
                    className="p-button-primary"
                />
            </div>
        )}
    </div>
);
})

export default TopBar;
