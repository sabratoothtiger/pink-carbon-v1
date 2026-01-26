"use client";

import React from "react";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";

export default function Footer() {
  const handleFacebookRedirect = () => {
    window.location.href = "https://www.facebook.com/pinkcarbonapp";
  };

  return (
    <footer className="surface-0 p-4">
      <Divider />
      <div className="py-4 flex justify-between items-center">
        {/* Left Section */}
        <div className="text-600 text-sm">
          &copy; {new Date().getFullYear()} Pink Carbon Software Solutions, LLC.
          All Rights Reserved.
        </div>

        {/* Right Section */}
        <div className="flex gap-4">
          <Button
            icon="pi pi-envelope"
            rounded
            text
            size="large"
            onClick={() =>
              (window.location.href = "mailto:support@pinkcarbon.app")
            }
          />
          <Button
            icon="pi pi-facebook"
            rounded
            text
            size="large"
            onClick={handleFacebookRedirect}
          />
        </div>
      </div>
    </footer>
  );
}
