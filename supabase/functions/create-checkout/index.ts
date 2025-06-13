
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");
    
    const { planId } = await req.json();
    logStep("Plan selected", { planId });

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { 
      apiVersion: "2023-10-16" 
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("No existing customer found");
    }

    // Define plan configurations with enhanced descriptions
    const planConfigs = {
      pro: {
        amount: 499, // 4.99€ in cents
        interval: "month",
        name: "Suscripción Plan PRO",
        description: "Acceso completo a HomiMatch con funcionalidades premium: swipes ilimitados, filtros avanzados y visibilidad prioritaria para encontrar a tu compañero de piso ideal.",
      },
      founder: {
        amount: 2499, // 24.99€ in cents
        interval: "year", 
        name: "Suscripción Plan Fundador",
        description: "Plan exclusivo para los primeros usuarios de HomiMatch. Incluye todas las ventajas PRO más acceso anticipado a nuevas funciones y distintivo especial en tu perfil.",
      }
    };

    const config = planConfigs[planId as keyof typeof planConfigs];
    if (!config) {
      throw new Error(`Invalid plan ID: ${planId}`);
    }

    logStep("Creating checkout session", config);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { 
              name: config.name,
              description: config.description,
              images: ["https://homimatch.lovable.app/lovable-uploads/efbbb383-cff5-4e9e-8b43-141970c0e74c.png"], // Logo de HomiMatch
            },
            unit_amount: config.amount,
            recurring: { interval: config.interval as "month" | "year" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/precios`,
      metadata: {
        user_id: user.id,
        plan_id: planId,
      },
      // Customize checkout appearance
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      // Custom checkout page configuration
      locale: 'es', // Spanish locale
      allow_promotion_codes: true, // Enable promo codes
      // Additional customization options
      custom_text: {
        submit: {
          message: "Al confirmar tu suscripción, podrás acceder inmediatamente a todas las funcionalidades premium de HomiMatch."
        }
      }
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
