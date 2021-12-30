const express = require("express");
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
  host: '165.232.137.226',
  user: 'pruebas',
  password: 'pruebasSG176$#'
});

// This is your test secret API key.
const stripe = require("stripe")('sk_test_51IXrBMLGnX2EtSPjNk9A3nuXKybPtARAkZvSNkDc7Rz2Udb84aoz27dWAEa3bSqKZAjSJpiPORJMGzKYiQZpfZWD00C2KHy7A1');
const endpointSecret = "whsec_L84rlgBpoNbS5ybM5mLvanY4X5cYSR2H";

app.use(express.static("public"));
app.use(express.json());



app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;
let paymentIntent;
  try{
  // Create a PaymentIntent with the order amount and currency
  paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "mxn",
    payment_method_types: ['oxxo', 'card']
  });
  }catch(e){
    console.log(e)
  }


  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
app.get('/products',  async(req, res) => {
    const products = await stripe.products.list();
    res.send(products)
})

app.get('/prices',  async(req, res) => {
    const prices = await stripe.prices.list();
    res.send(prices)
})
app.post('/webhook', express.raw({type: 'application/json'}), (request, res)=> {
    const sig = request.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log({event})
  } catch (err) {
      console.error(`WebHook Error: ${err.message}`)
    //res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log({paymentIntent})
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
      case 'charge.succeeded':
        const charge = event.data.object;
        console.log({charge})
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.send(event);
});

app.get('/test-connection', ()=> {
  db.connect((err)=> {
      if(err){
        console.error(err.stack);
        return
      }
      console.log('todo biem')
  })
})

app.use((req, res, next) => {
    if (req.originalUrl === '/webhook') {
      next();
    } else {
      express.json()(req, res, next);
    }
  });

app.listen(4242, () => console.log("Node server listening on port 4242!"));