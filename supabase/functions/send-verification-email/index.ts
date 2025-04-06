
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Process Supabase Auth Webhook events
serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log("Webhook received:", JSON.stringify(payload, null, 2));
    
    // Log request headers to debug webhook issues
    const headers = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log("Request headers:", JSON.stringify(headers, null, 2));
    
    // Process signup or email change events that require verification
    if (payload.type === "signup" || payload.type === "email_change") {
      const { email, data } = payload;
      
      // Extract confirmation token
      const confirmationToken = data?.confirmation_token;
      
      if (!confirmationToken) {
        console.error("No confirmation token found in payload:", payload);
        return new Response(
          JSON.stringify({
            error: "No confirmation token found in payload",
            payload: payload,
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      // Create confirmation URL with proper redirect
      const confirmationUrl = `${Deno.env.get("SUPABASE_URL") || "https://salayaazmrghyqjddagm.supabase.co"}/auth/v1/verify?token=${confirmationToken}&type=signup&redirect_to=${encodeURIComponent("https://homi.lovable.dev/verified")}`;
      
      // Get user metadata if available
      const firstName = data?.user_metadata?.firstName || data?.user_metadata?.first_name || "";
      const lastName = data?.user_metadata?.lastName || data?.user_metadata?.last_name || "";
      const fullName = firstName && lastName ? `${firstName} ${lastName}` : firstName || "Usuario de Homi";
      
      console.log("Sending verification email to:", email);
      console.log("Confirmation URL:", confirmationUrl);
      console.log("User name:", fullName);
      
      // Send customized verification email with more personalization
      const emailResponse = await resend.emails.send({
        from: "Homi <noreply@resend.dev>",
        to: [email],
        subject: "Verifica tu correo electrónico en Homi",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333333;">
            <div style="background-color: #7e22ce; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
              <h1 style="color: white; margin: 0;">¡Bienvenido a Homi, ${firstName}!</h1>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              <p style="font-size: 16px; line-height: 1.5;">Hola ${fullName},</p>
              <p style="font-size: 16px; line-height: 1.5;">Gracias por registrarte en Homi, tu plataforma para encontrar el compañero de piso perfecto.</p>
              <p style="font-size: 16px; line-height: 1.5;">Para activar tu cuenta, por favor verifica tu correo electrónico haciendo clic en el siguiente botón:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${confirmationUrl}" style="background-color: #7e22ce; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Verificar mi correo electrónico
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666666;">Si no puedes hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:</p>
              <p style="font-size: 14px; color: #666666; word-break: break-all;">
                <a href="${confirmationUrl}" style="color: #7e22ce;">${confirmationUrl}</a>
              </p>
              
              <p style="font-size: 16px; line-height: 1.5; margin-top: 30px;">¿Tienes alguna pregunta? No dudes en contactarnos respondiendo a este correo.</p>
              
              <p style="font-size: 16px; line-height: 1.5;">¡Gracias por unirte a nuestra comunidad!</p>
              <p style="font-size: 16px; line-height: 1.5; margin-bottom: 0;">El equipo de Homi</p>
            </div>
            <div style="text-align: center; padding: 20px; color: #999999; font-size: 12px;">
              <p>Este correo fue enviado a ${email} porque te registraste en Homi.</p>
              <p>&copy; ${new Date().getFullYear()} Homi. Todos los derechos reservados.</p>
            </div>
          </div>
        `,
      });

      console.log("Email sent result:", emailResponse);
      
      return new Response(JSON.stringify({ success: true, emailSent: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // If not a handled event type, return success but no action
    console.log("No action needed for this event type:", payload.type);
    return new Response(JSON.stringify({ success: true, noAction: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error processing webhook:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "Error processing webhook request",
        stack: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
