"use client";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({});

  const submit = async () => {
    const res = await fetch("http://localhost:5000/generate-receipt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    window.open(`http://localhost:5000/${data.pdf}`);

    const msg = `Payment received ₹${form.amount}. Receipt attached.`;
    window.open(
      `https://wa.me/91${form.whatsapp}?text=${encodeURIComponent(msg)}`
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Payment Receipt Generator</h2>

      <input placeholder="Business Name" onChange={e => setForm({...form, businessName: e.target.value})} /><br/>
      <input placeholder="Address" onChange={e => setForm({...form, address: e.target.value})} /><br/>
      <input placeholder="Phone" onChange={e => setForm({...form, phone: e.target.value})} /><br/>
      <input placeholder="Receipt No" onChange={e => setForm({...form, receiptNo: e.target.value})} /><br/>
      <input placeholder="Date" onChange={e => setForm({...form, date: e.target.value})} /><br/>
      <input placeholder="Customer Name" onChange={e => setForm({...form, customer: e.target.value})} /><br/>
      <input placeholder="Amount" onChange={e => setForm({...form, amount: e.target.value})} /><br/>
      <input placeholder="Amount in Words" onChange={e => setForm({...form, amountWords: e.target.value})} /><br/>
      <input placeholder="WhatsApp Number" onChange={e => setForm({...form, whatsapp: e.target.value})} /><br/><br/>

      <button onClick={submit}>Generate & Send</button>
    </div>
  );
}
