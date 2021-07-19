import Head from "next/head";
import React from "react";

export default function CTAContact() {
  return (
    <div className="cta-contact flex items-center justify-center">
      <div
        className="max-w-screen-md flex items-center pl-20 pr-20"
        style={{
          background:
            "url(./images/bg-salmon-circle.png) no-repeat left center",
          backgroundSize: 170,
          height: 300,
        }}
      >
        <div className="text-center">
          <h2>Let’s Have a Chat…</h2>
          <p>Just click and let’s see how can I help you on your project!</p>
        </div>
      </div>
    </div>
  );
}
