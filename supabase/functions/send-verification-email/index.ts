
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Capturar y procesar los eventos de webhook de Supabase Auth
serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    
    // Verificamos que el evento sea de tipo signup o email_change
    if (payload.type === "signup" || payload.type === "email_change") {
      const { email, data } = payload;
      
      // Extraemos información para el enlace de verificación
      const confirmationToken = data?.confirmation_token;
      const confirmationUrl = `${Deno.env.get("SUPABASE_URL") || "https://salayaazmrghyqjddagm.supabase.co"}/auth/v1/verify?token=${confirmationToken}&type=signup&redirect_to=${encodeURIComponent("https://yourapp.com/verified")}`;
      
      // Obtenemos datos adicionales del usuario si están disponibles
      const firstName = data?.user_metadata?.first_name || data?.firstName || "";
      
      // Enviamos el correo electrónico personalizado
      const emailResponse = await resend.emails.send({
        from: "Homi <verificacion@tudominio.com>", // Cambia esto por tu dominio verificado en Resend
        to: [email],
        subject: "Verifica tu correo electrónico en Homi",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333333;">
            <div style="background-color: #7e22ce; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
              <h1 style="color: white; margin: 0;">¡Bienvenido a Homi!</h1>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              <p style="font-size: 16px; line-height: 1.5;">Hola ${firstName ? firstName : ""},</p>
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

      console.log("Email sent:", emailResponse);
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Si no es un evento que manejamos, simplemente devolvemos éxito
    return new Response(JSON.stringify({ success: true, noAction: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error processing webhook:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "Error processing webhook request",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
