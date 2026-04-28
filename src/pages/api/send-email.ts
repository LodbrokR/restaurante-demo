import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    
    let htmlContent = <h2>Nuevo mensaje desde la web</h2><table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px;">;
    for (const [key, value] of data.entries()) {
        htmlContent += <tr><td style="padding: 8px; background: #f3f4f6; text-transform: capitalize;"><strong> + key + </strong></td><td style="padding: 8px;"> + value + </td></tr>;
    }
    htmlContent += </table>;

    const sendRes = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: 'lmedina.web@gmail.com', // CAMBIAR POR EL CORREO REGISTRADO EN RESEND
      subject: Nuevo formulario recibido,
      html: htmlContent,
    });

    if (sendRes.error) {
        return new Response(JSON.stringify({ error: sendRes.error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};

