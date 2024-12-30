import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, amount } = body;
    if (!name || !email || !amount) {
      return new Response(
        JSON.stringify({ error: "Please enter a valid email address", status: 400 }),
      );
    }

    let customer;
    const existingCustomer = await stripe.customers.list({ email }); //check for existing customer
    if (existingCustomer.data.length > 0) {
      customer = existingCustomer.data[0];
    } else {
      const newCustomer = await stripe.customers.create({ name, email });
      customer = newCustomer;
    }
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2024-11-20.acacia" },
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount) * 100, //make the amount an integer and convert to real amount
      currency: "eur",
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    new Response(
      JSON.stringify({
        paymentIntent: paymentIntent,
        ephemeralKey: ephemeralKey,
        customer: customer.id,
      }),
    );
  } catch (error) {
    console.log("error: ", error);
    return new Response(JSON.stringify({ error: error, status: 500 }));
  }
}
