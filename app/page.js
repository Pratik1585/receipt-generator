"use client";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const submit = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/generate-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        alert("Failed to generate receipt");
        setLoading(false);
        return;
      }

      // Convert response to blob
      const blob = await response.blob();

      // Create file URL
      const fileURL = window.URL.createObjectURL(blob);

      // Create temporary link and trigger download/open
      const link = document.createElement("a");
      link.href = fileURL;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();

      // WhatsApp message
      const message = `🧾 Payment Receipt

Dear ${form.customer || ""},

Your payment of ₹${form.amount || ""} has been received.

Thank you 🙏`;

      if (form.whatsapp) {
        window.open(
          `https://wa.me/91${form.whatsapp}?text=${encodeURIComponent(
            message
          )}`
        );
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">
          Payment Receipt Generator
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Create and send professional receipts instantly
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Business Name" onChange={(v)=>handleChange("businessName", v)} />
          <Input label="Business Address" onChange={(v)=>handleChange("address", v)} />
          <Input label="Phone Number" onChange={(v)=>handleChange("phone", v)} />
          <Input label="Receipt No" onChange={(v)=>handleChange("receiptNo", v)} />
          <Input label="Date" type="date" onChange={(v)=>handleChange("date", v)} />
          <Input label="Customer Name" onChange={(v)=>handleChange("customer", v)} />
          <Input label="Amount" onChange={(v)=>handleChange("amount", v)} />
          <Input label="Amount in Words" onChange={(v)=>handleChange("amountWords", v)} />
          <Input label="WhatsApp Number" onChange={(v)=>handleChange("whatsapp", v)} />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition duration-200 shadow-lg disabled:opacity-50"
        >
          {loading ? "Generating Receipt..." : "Generate & Send Receipt"}
        </button>
      </div>
    </div>
  );
}

function Input({ label, type = "text", onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}