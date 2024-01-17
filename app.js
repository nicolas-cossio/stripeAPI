const express = require('express');
const { resolve } = require("path");
const bodyParser = require('body-parser');
const { insertTransaction } = require('./model/transactionDao');
const { getTransaction } = require('./model/transactionDao');
const { get } = require('http');
const env = require('dotenv').config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 3000;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(resolve(__dirname, 'public')));

// Key
app.get('/config', (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLIC_KEY
    });
});

// 1. Checkout screen
app.get('/', (req, res) => {
    const path = resolve('public/checkout.html');
    res.sendFile(path);
});

// 2. Payment screen
app.post('/process-payment', async (req, res) => {
    // Enviamos los parametros ingresados en el formulario de checkout.html:
    const { amount, currency } = req.body;
    // amount = amount * 100;
    res.redirect(`/payment.html?amount=${amount}&currency=${currency}`);

});

app.post('/create-payment-intent', async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: req.body.currency,
        payment_method_types: ['card']
    });
    res.send({ clientSecret: paymentIntent.client_secret });
});

// 3. Confirmation screen
app.post('/save-payment', (req, res) => {
    // Convertimos el timestamp a un formato legible:
    const timestampInSecond = req.body.created;
    const timestampInMilli = timestampInSecond * 1000;
    const dateObject = new Date(timestampInMilli);
    const date = dateObject.toLocaleString('es-PE', { timeZone: 'America/Lima' });

    const transaction = {
        id: req.body.id,
        amount: req.body.amount,
        currency: req.body.currency,
        status: req.body.status,
        created_at: date
    };
    // Una vez se haya confirmado el pago se almacena en la bd.
    insertTransaction(transaction);
    res.send({ message: 'Payment saved' });
});

// 4. Pantalla de reporte.
// Para no ensuciar el flujo solicitado el acceso al reporte será por url.
// localhost:3000/reporte
app.get('/reporte', (req, res) => {
    const path = resolve('public/reporte.html');
    res.sendFile(path);
});

app.post('/transactions', express.json(), async (req, res) => {
    const transactions = await getTransaction(req.body.transactionId);
    res.send(transactions.rows);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});