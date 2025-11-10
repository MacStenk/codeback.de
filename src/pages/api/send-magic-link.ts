// API Route: Send Magic Link Email
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Mark as server-only (no prerendering)
export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Cloudflare Pages: Try runtime.env first, then import.meta.env
    const runtime = (locals as any).runtime;
    const apiKey = runtime?.env?.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
    
    console.log('🔑 Magic Link - Checking for RESEND_API_KEY...');
    console.log('🔑 Has runtime.env:', !!runtime?.env);
    console.log('🔑 Has RESEND_API_KEY:', !!apiKey);
    
    if (!apiKey) {
      console.error('❌ RESEND_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500 }
      );
    }
    
    const resend = new Resend(apiKey);
    const { name, email, budget, timeline, business } = await request.json();

    // Validate input
    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: 'Name and email are required' }),
        { status: 400 }
      );
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'CodeBack <hi@codeback.de>',
      to: [email],
      subject: 'CodeBack - Deine nächsten Schritte 🚀',
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
            }
            .info-box {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #16a34a;
            }
            .info-row {
              display: flex;
              padding: 8px 0;
              border-bottom: 1px solid #f3f4f6;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              font-weight: 600;
              color: #6b7280;
              min-width: 120px;
            }
            .info-value {
              color: #111827;
            }
            .cta-button {
              display: inline-block;
              background: #16a34a;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 20px 0;
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
              font-size: 24px;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="emoji">🚀</div>
            <h1 style="margin: 0; font-size: 24px;">Hey ${name}!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Danke für dein Interesse an CodeBack</p>
          </div>
          
          <div class="content">
            <p><strong>Super, dass wir uns kennenlernen konnten!</strong></p>
            
            <p>Ich habe deine Anfrage erhalten und schaue sie mir gleich an. Hier sind deine Angaben im Überblick:</p>
            
            <div class="info-box">
              ${budget ? `
                <div class="info-row">
                  <span class="info-label">💰 Budget:</span>
                  <span class="info-value">${budget}</span>
                </div>
              ` : ''}
              ${timeline ? `
                <div class="info-row">
                  <span class="info-label">⏰ Timeline:</span>
                  <span class="info-value">${timeline}</span>
                </div>
              ` : ''}
              ${business ? `
                <div class="info-row">
                  <span class="info-label">🎯 Business:</span>
                  <span class="info-value">${business}</span>
                </div>
              ` : ''}
            </div>
            
            <h3>🎯 Was passiert jetzt?</h3>
            <p>Ich melde mich <strong>innerhalb von 24 Stunden</strong> bei dir mit:</p>
            <ul>
              <li>Einer ersten Einschätzung deines Projekts</li>
              <li>Vorschlägen für den nächsten Schritt</li>
              <li>Optional: Termin für ein 15-minütiges Strategiegespräch</li>
            </ul>
                  
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              <em>Tipp: Schau dir in der Zwischenzeit gerne unsere <a href="https://codeback.de/blog" style="color: #16a34a;">Case Studies</a> an - dort siehst du, wie wir andere Coaches & Berater sichtbar gemacht haben.</em>
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
        JSON.stringify({ error: 'Failed to send email', details: error }),
        { status: 500 }
      );
    }

    console.log('✅ Email sent successfully:', data);
    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
};
