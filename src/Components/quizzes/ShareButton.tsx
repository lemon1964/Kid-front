"use client";

import React, { useState } from "react";

const ShareButton: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
    >
      {copied ? "Link copied!" : "Share the quiz"}
    </button>
  );
};

export default ShareButton;
