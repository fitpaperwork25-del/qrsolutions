import Stripe from "https://esm.sh/stripe@12.5.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter — $19/mo",
  pro: "Pro — $49/mo",
  enterprise: "Enterprise — $99/mo",
};

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_email || session.customer_details?.email;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan || "starter";
    const planLabel = PLAN_LABELS[plan] || plan;

    if (!email && !userId) {
      return new Response("Missing email and userId in checkout session", {
        status: 400,
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let result;

    if (email) {
      result = await supabase
        .from("businesses")
        .update({ status: "active", plan })
        .eq("email", email);
    } else {
      result = await supabase
        .from("businesses")
        .update({ status: "active", plan })
        .eq("id", userId);
    }

    if (result.error) {
      return new Response(`Supabase update error: ${result.error.message}`, {
        status: 500,
      });
    }

    // Send confirmation email via Resend
    if (email) {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        },
        body: JSON.stringify({
          from: "QRSolutions <onboarding@resend.dev>",
          to: email,
          subject: "You're squared in — welcome to QRSolutions",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #080808; color: #F0EDE8; padding: 40px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #E8C547; font-size: 32px; margin: 0;">QRS</h1>
                <p style="color: #666; font-size: 13px; letter-spacing: 2px;">WE SQUARE YOU</p>
              </div>
              <h2 style="font-size: 24px; margin-bottom: 16px;">You're in. Welcome.</h2>
              <p style="color: #aaa; line-height: 1.7; margin-bottom: 24px;">
                Your <strong style="color: #E8C547;">${planLabel}</strong> subscription is now active.
                Your business is ready to get squared.
              </p>
              <div style="background: #111; border: 1px solid #2a2a2a; padding: 24px; margin-bottom: 32px;">
                <p style="margin: 0 0 8px; color: #666; font-size: 13px;">NEXT STEPS</p>
                <p style="margin: 0 0 8px;">→ Log in to your staff dashboard</p>
                <p style="margin: 0 0 8px;">→ Set up your first location</p>
                <p style="margin: 0;">→ Generate your first QR code</p>
              </div>
              <div style="text-align: center; margin-bottom: 32px;">
                <a href="https://qrsolutions-phi.vercel.app/staff/login"
                   style="background: #E8C547; color: #080808; padding: 16px 40px; text-decoration: none; font-weight: 800; font-size: 16px; display: inline-block;">
                  GO TO DASHBOARD →
                </a>
              </div>
              <p style="color: #444; font-size: 13px; text-align: center;">
                Questions? Reply to this email or contact us at fitpaperwork25@gmail.com
              </p>
              <p style="color: #333; font-size: 12px; text-align: center; margin-top: 24px;">
                © 2026 QRSolutions. We square you.
              </p>
            </div>
          `,
        }),
      });

      if (!emailRes.ok) {
        console.error("Resend error:", await emailRes.text());
      } else {
        console.log("Confirmation email sent to:", email);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});