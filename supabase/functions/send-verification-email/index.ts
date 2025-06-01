// @ts-nocheck
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
      const confirmationUrl = `${Deno.env.get("SUPABASE_URL") || "https://salayaazmrghyqjddagm.supabase.co"}/auth/v1/verify?token=${confirmationToken}&type=signup&redirect_to=${encodeURIComponent("https://homimatch.com/verified")}`;
      
      // Get user metadata if available
      const firstName = data?.user_metadata?.firstName || data?.user_metadata?.first_name || "";
      const lastName = data?.user_metadata?.lastName || data?.user_metadata?.last_name || "";
      const fullName = firstName && lastName ? `${firstName} ${lastName}` : firstName || "Usuario de Homi";
      
      console.log("Sending verification email to:", email);
      console.log("Confirmation URL:", confirmationUrl);
      console.log("User name:", fullName);
      
      // Send customized verification email with improved spam score
      const emailResponse = await resend.emails.send({
        from: "Homi <no-reply@resend.dev>",
        to: [email],
        subject: "Verifica tu correo electrónico - Homi",
        html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verificación de correo electrónico</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; background-color: #f9f9f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td style="padding: 20px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #7e22ce; padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">¡Bienvenido a Homi, ${firstName}!</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 30px 30px 20px;">
              <p>Hola ${fullName},</p>
              <p>Gracias por registrarte en Homi, tu plataforma para encontrar el compañero de piso perfecto.</p>
              <p>Para activar tu cuenta, por favor verifica tu correo electrónico haciendo clic en el botón a continuación:</p>
            </td>
          </tr>
          <!-- Button -->
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td style="background-color: #7e22ce; border-radius: 5px;">
                    <a href="${confirmationUrl}" target="_blank" style="display: block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold;">Verificar mi correo electrónico</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Alternative link -->
          <tr>
            <td style="padding: 0 30px 20px;">
              <p style="font-size: 14px; color: #666666;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
              <p style="font-size: 14px; word-break: break-all;">
                <a href="${confirmationUrl}" style="color: #7e22ce; text-decoration: underline;">${confirmationUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Contact info -->
          <tr>
            <td style="padding: 20px 30px;">
              <p style="margin-bottom: 0;">¡Gracias por unirte a nuestra comunidad!</p>
              <p style="margin-top: 5px;">El equipo de Homi</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666666;">
              <p>Este correo fue enviado a ${email} porque te registraste en Homi.</p>
              <p style="margin-bottom: 0;">&copy; ${new Date().getFullYear()} Homi. Todos los derechos reservados.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
        text: `Hola ${fullName},

Gracias por registrarte en Homi, tu plataforma para encontrar el compañero de piso perfecto.

Para activar tu cuenta, por favor verifica tu correo electrónico visitando el siguiente enlace:
${confirmationUrl}

¡Gracias por unirte a nuestra comunidad!
El equipo de Homi

Este correo fue enviado a ${email} porque te registraste en Homi.
© ${new Date().getFullYear()} Homi. Todos los derechos reservados.`,
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
