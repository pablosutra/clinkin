import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import _isEmpty from "lodash/isEmpty";

export const Checkout = () => {
  const navigate = useNavigate();
  const elements = useElements();
  const stripe = useStripe();
  const { cart } = useSelector((state) => state);

  useEffect(() => {
    if (_isEmpty(cart)) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleSubmit = async (event) =>{
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    const result = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: "http://clinkin.mx",
        },
      });
  
  
      if (result.error) {
        // Show error to your customer (e.g., payment details incomplete)
        console.log(result.error.message);
      }
  }
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <PaymentElement 
          paymentMethodOrder={['oxxo', 'card']}
          wallets={{applePay: 'auto', googlePay: 'auto'}}
        />
        <button disabled={!stripe || !elements} className="button is-primary mt-4 is-fullwidth">Pagar</button>
      </form>
    </div>
  );
};
