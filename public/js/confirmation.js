window.addEventListener('DOMContentLoaded', async () => {
    const { publishableKey } = await fetch("/config").then(r => r.json());
    const stripe = Stripe(publishableKey);

    const params = new URLSearchParams(window.location.href);
    const client_secret = params.get("payment_intent_client_secret");

    const {paymentIntent} = await stripe.retrievePaymentIntent(client_secret);

    // Imprimimos el id de la operacion
    const idOrden = document.getElementById("id-orden");
    idOrden.innerText = paymentIntent.id;

    // Imprimimos la fecha de la operacion
    const fechaOrden = document.getElementById("fecha-orden");
    const timestampInMilli = Date.now();
    const dateObject = new Date(timestampInMilli);
    const date = dateObject.toLocaleString('es-PE');
    fechaOrden.innerText = date;
    paymentIntent.created = timestampInMilli/1000;

    // Se hace la llamada a /save-payment para guardar la operacion en la bd.
    await fetch("/save-payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(paymentIntent)
    });

});