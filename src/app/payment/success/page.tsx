"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PaymentCompleted = () => {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Payment successful!</h2>
        <p className="text-gray-700">We'll be on the main page soon...</p>
      </div>
    </div>
  );
};

export default PaymentCompleted;
