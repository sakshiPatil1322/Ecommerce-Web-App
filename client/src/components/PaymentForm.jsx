import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PaymentForm = ({ totalAmount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/payment/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalAmount, paymentMethodId: paymentMethod.id }),
    });

    const data = await res.json();

    if (data.success) {
      onSuccess();
    } else {
      setError(data.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button className="btn btn-primary mt-3" type="submit" disabled={loading}>
        {loading ? "Processing..." : `Pay ₹${totalAmount}`}
      </button>
      {error && <p className="text-danger mt-2">{error}</p>}
    </form>
  );
};

export default PaymentForm;
