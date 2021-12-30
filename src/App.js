import React, {useState, useEffect} from 'react';
import { Checkout } from "./components/Checkout";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import _isEmpty from 'lodash/isEmpty';
const stripePromise = loadStripe('pk_test_51IXrBMLGnX2EtSPjrs6B6aiHwqYkDpA79wRRIRFdAYH16DPIEAMVPJd4SztCPnah1f7Kp1g6WTH6KZf6ViI3b0rQ00ax15R3zM', {locale: 'es'});

export const App = () => {
  const [clientSecret, setClientSecret] = useState("");
  const navigate = useNavigate();
  const {cart} = useSelector(state => state)
  useEffect(() => {
    if(_isEmpty(cart)){
      navigate('/')
      return
     }
    const total = Object.values(cart).reduce((acc,curr)=>{
      return ((curr.price) * curr.quantity) + acc;
      },0)
    const amount = total * 100
    // Create PaymentIntent as soon as the page loads
    fetch("http://localhost:4242/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({amount})
      })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

useEffect(()=> {
  if(_isEmpty(cart)){
   navigate('/')
  }
}, [cart])


  const options = {
    clientSecret,
    appearance: {
      theme: 'dark'
    }
  };

  if(clientSecret){
    return (
      <Elements stripe={stripePromise} options={options}>
        <Checkout />
      </Elements>
    );
  }
  return <p>Loading...</p>

};