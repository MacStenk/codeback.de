// API Route: Send Email Verification
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Mark as server-only (no prerendering)
export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Cloudflare Pages: Try runtime.env first, then import.meta.env
    const runtime = (locals as any).runtime;
    const apiKey = runtime?.env?.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
    
    console.log('🔑 Checking for RESEND_API_KEY...');
    console.log('🔑 Has runtime.env:', !!runtime?.env);
    console.log('🔑 Has RESEND_API_KEY in runtime:', !!runtime?.env?.RESEND_API_KEY);
    console.log('🔑 Has RESEND_API_KEY in import.meta:', !!import.meta.env.RESEND_API_KEY);
    console.log('🔑 Final apiKey found:', !!apiKey);
    
    if (!apiKey) {
      console.error('❌ RESEND_API_KEY not found anywhere');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500 }
      );
    }
    
    console.log('✅ RESEND_API_KEY found! Initializing Resend...');
    const resend = new Resend(apiKey);
    const { name, email, verificationToken, siteUrl } = await request.json();

    // Validate input
    if (!name || !email || !verificationToken) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and verification token are required' }),
        { status: 400 }
      );
    }

    const verificationUrl = `${siteUrl}/verify?token=${verificationToken}`;
    
    console.log('📧 Sending email to:', email);

    // Send verification email via Resend
    const { data, error } = await resend.emails.send({
      from: 'CodeBack <hi@codeback.de>',
      to: [email],
      subject: 'Bitte bestätige deine Email-Adresse ✉️',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #16a34a 0%, #059669 100%);
              color: white;
              padding: 30px 20px;
              border-radius: 12px 12px 0 0;
              text-align: center;
            }
            .content {
              background: #f9fafb;
              padding: 30px 20px;
              border: 1px solid #e5e7eb;
              border-top: none;
              border-radius: 0 0 12px 12px;
            }
            .verify-button {
              display: inline-block;
              background: #16a34a;
              color: white;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 20px 0;
              font-size: 16px;
            }
            .verify-button:hover {
              background: #15803d;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 14px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            .emoji {
              font-size: 48px;
              margin-bottom: 10px;
            }
            .info-box {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #16a34a;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="emoji">✉️</div>
            <h1 style="margin: 0; font-size: 24px;">Fast geschafft, ${name}!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Nur noch ein Klick zur Bestätigung</p>
          </div>
          
          <div class="content">
            <p><strong>Danke für dein Interesse an CodeBack!</strong></p>
            
            <p>Um deine Anfrage abzuschließen, bestätige bitte kurz deine Email-Adresse.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" class="verify-button">
                ✅ Email-Adresse bestätigen
              </a>
            </div>
            
            <div class="info-box">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                <strong>Was passiert dann?</strong><br>
                Nach der Bestätigung erhältst du sofort eine weitere Email mit den nächsten Schritten und allen Details zu deiner Anfrage.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #6b7280;">
              <em>Hinweis: Dieser Link ist 24 Stunden gültig.</em>
            </p>
            
            <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">
              Falls der Button nicht funktioniert, kopiere diesen Link:<br>
              <a href="${verificationUrl}" style="color: #16a34a; word-break: break-all;">${verificationUrl}</a>
            </p>
          </div>
          
          <div class="footer">
            <p><strong>Steven Noack</strong><br>
            CodeBack.de - LLM-native Websites<br>
            <a href="mailto:hi@codeback.de" style="color: #16a34a;">hi@codeback.de</a></p>
            
            <p style="font-size: 12px; margin-top: 20px; color: #9ca3af;">
              Du erhältst diese Email, weil du über unseren Briefing-Chat Kontakt aufgenommen hast.<br>
              <em>Powered by BriefingFlow - KI-gestütztes Lead Generation System</em>
            </p>
            
            <p style="font-size: 11px; margin-top: 20px; color: #9ca3af; line-height: 1.5;">
              <strong>Impressum:</strong><br>
              Steven Noack | CodeBack.de<br>
              Straße der Freundschaft 5A, 15328 Alt Tucheband<br>
              <a href="https://codeback.de/impressum" style="color: #16a34a;">Vollständiges Impressum</a> | 
              <a href="https://codeback.de/datenschutz" style="color: #16a34a;">Datenschutz</a>
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to send verification email', details: error }),
        { status: 500 }
      );
    }

    console.log('✅ Verification email sent successfully:', data);
    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: String(error) }),
      { status: 500 }
    );
  }
};
