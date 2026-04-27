Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
  console.log("Key exists:", !!STRIPE_SECRET_KEY);

  const { email, userId, plan } = await req.json();

  const PRICE_IDS: Record<string, string> = {
    starter: "price_1TQrWpEN4F1rX9xX6qbDm6LK",
    pro: "price_1TQrZQEN4F1rX9xXscNP0YMN",
    enterprise: "price_1TQraVEN4F1rX9xX31kBW3ez",
  };

  const priceId = PRICE_IDS[plan] ?? PRICE_IDS["pro"];

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      "payment_method_types[0]": "card",
      "mode": "subscription",
      "customer_email": email,
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      "metadata[userId]": userId,
      "metadata[plan]": plan,
      "success_url": "https://qrsolutions-phi.vercel.app/staff/dashboard",
      "cancel_url": "https://qrsolutions-phi.vercel.app/register",
    }),
  });

  const session = await response.json();
  console.log("Stripe response:", JSON.stringify(session));

  return new Response(JSON.stringify({ url: session.url }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
