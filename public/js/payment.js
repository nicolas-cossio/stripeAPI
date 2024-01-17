window.addEventListener('DOMContentLoaded', async () => {
    const { publishableKey } = await fetch("/config").then(r => r.json());
    const stripe = Stripe(publishableKey);

    // Obtenemos los parametros de la url:
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const amount = urlParams.get("amount");
    const currency = urlParams.get("currency");

    // Hacemos la llamada al api para crear el payment intent:
    const { clientSecret } = await fetch("/create-payment-intent", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            amount: amount, 
            currency: currency 
        })
    }).then(r => r.json());


    // En este punto el la transacción ya se ha creado en stripe y se ha guardado en la bd como creada.
    const paymentIntent = {
        id: clientSecret.split("_secret")[0],
        amount: amount,
        currency: currency,
        status: "Creado",
        created: Math.floor(Date.now()/1000)
    }

    await fetch("/save-payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(paymentIntent)
    }).then(r => r.json());

    const elements = stripe.elements({ clientSecret});
    const paymentElement = elements.create("payment");
    paymentElement.mount("#payment-element");

    // Obtenemos la url base:
    const baseUrl = window.location.origin;

    // Formulario de pago y redireccion a confirmation.html:
    const form = document.getElementById("payment-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        // Devuelve una promesa por eso se usa await:
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${baseUrl}/confirmation.html`
            }
        });
        if (error) {
            console.error(error);
            const message = document.getElementById("error-messages");
            message.innerText = error.message;
        }
    });
});