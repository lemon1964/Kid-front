"use client";

import { useState } from "react";
import Link from "next/link";
import apiClient from "@/services/authClientService";
import { getSession } from "next-auth/react";

const PaymentPage = () => {
  const [paymentType, setPaymentType] = useState("forever");
  const [paymentSystem, setPaymentSystem] = useState("stripe");
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const freshSession = await getSession();
      if (!freshSession?.backendToken) {
        console.log("No auth token found in session");
        return;
      }

      // Выбираем правильный путь в зависимости от платежной системы
      const endpoint =
        paymentSystem === "stripe"
          ? paymentType === "forever"
            ? "/api/payment/process-buy/"
            : "/api/payment/process-subscription/"
          : "/api/payment/process-kassa/";
      // : paymentType === "forever"
      // ? "/api/payment/process-buy-kassa/"
      // : "/api/payment/process-subscription-kassa/";

      const response = await apiClient.post(
        endpoint,
        {
          subscription_type: paymentType,
          coupon_code: couponCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${freshSession.backendToken}`,
          },
        }
      );

      if (response.data.session_url) {
        window.location.href = response.data.session_url;
      }
    } catch (err) {
      setError("Что-то пошло не так. Попробуйте снова.");
      setLoading(false);
    }
  };

  // Тестовые карты для Stripe и Юкассы
  const stripeTestCard = {
    number: "4242424242424242",
    exp_month: "12",
    exp_year: "29",
    cvc: "123",
  };

  const kassaTestCard = {
    number: "5555555555554444",
    exp_month: "12",
    exp_year: "29",
    cvc: "123",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      {/* Навигация */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <Link
          href="/"
          className="text-base sm:text-lg text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition"
        >
          To the main page
        </Link>
        {/* <h1 className="text-3xl font-bold text-gray-800">Выберите оплату</h1> */}
      </div>

      {/* Блок выбора платежной системы */}
      <div className="space-y-3 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Select payment system</h2>
        {[
          { id: "stripe", label: "Stripe", value: "stripe" },
          { id: "kassa", label: "ЮKassa", value: "kassa" },
        ].map(option => (
          <label
            key={option.id}
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
          >
            <input
              type="radio"
              id={option.id}
              value={option.value}
              checked={paymentSystem === option.value}
              onChange={e => setPaymentSystem(e.target.value)}
              className="w-5 h-5 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-800">{option.label}</span>
          </label>
        ))}
      </div>

      {/* Форма оплаты */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Payment options</h2>

        <div className="space-y-3">
          {[
            { id: "forever", label: "Buy forever for $100", value: "forever" },
            { id: "monthly", label: "Monthly subscription for $3", value: "monthly" },
            { id: "yearly", label: "Yearly subscription for $30", value: "yearly" },
          ].map(option => (
            <label
              key={option.id}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
            >
              <input
                type="radio"
                id={option.id}
                value={option.value}
                checked={paymentType === option.value}
                onChange={e => setPaymentType(e.target.value)}
                className="w-5 h-5 text-blue-500 focus:ring-blue-400 border-gray-300"
              />
              <span className="text-gray-800">{option.label}</span>
            </label>
          ))}
        </div>

        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">Promo code</label>
          <input
            type="text"
            value={couponCode}
            onChange={e => setCouponCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter promo code"
          />
        </div>

        {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-3 text-white font-semibold rounded-lg ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 transition"
          }`}
        >
          {loading ? "Processing..." : "Proceed to payment"}
        </button>
      </form>
       {/* Тестовые карты */}
       <div className="bg-blue-50 p-4 rounded-lg mt-6 w-full max-w-lg">
        <h2 className="text-sm font-semibold text-gray-700 mb-2 text-center">
          You can make test payments using these cards
        </h2>
        <div className="text-sm text-gray-800 text-center mb-2">
          <div className="font-semibold">Stripe</div>
          Card Number: 4242 4242 4242 4242
        </div>
        <div className="text-sm text-gray-800 text-center mb-2">
          <div className="font-semibold">ЮKassa</div>
          Card Number: 5555 5555 5555 4444
        </div>
        <p className="text-xs text-gray-500 text-center">
          Same data: Card date - <span className="font-semibold">12/29</span>, CVC -{" "}
          <span className="font-semibold">123</span>
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
