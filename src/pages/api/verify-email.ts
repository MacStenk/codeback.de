// API Route: Verify Email Token
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

// Mark as server-only
export const prerender = false;

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    // Cloudflare Pages: Get env from runtime
    const runtime = (locals as any).runtime;
    const SUPABASE_URL = runtime?.env?.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = runtime?.env?.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('🔑 Verify - Checking env...');
    console.log('🔑 Has SUPABASE_URL:', !!SUPABASE_URL);
    console.log('🔑 Has SUPABASE_ANON_KEY:', !!SUPABASE_ANON_KEY);
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('❌ Supabase credentials not found');
      return new Response(
        JSON.stringify({ error: 'Database not configured' }),
        { status: 500 }
      );
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const token = url.searchParams.get('token')?.trim();
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Verification token is required' }),
        { status: 400 }
      );
    }

    console.log('🔍 Verifying token:', token);
    console.log('🔍 Token length:', token.length);

    // DEBUG: Check if we can query the table at all
    const { data: testQuery, error: testError } = await supabase
      .from('qualified_leads')
      .select('verification_token, email')
      .limit(3);
    
    console.log('🔍 Test query result:', { 
      count: testQuery?.length, 
      error: testError,
      tokens: testQuery?.map(l => l.verification_token)
    });

    // Find lead by verification token
    const { data: lead, error: findError } = await supabase
      .from('qualified_leads')
      .select('*')
      .eq('verification_token', token)
      .single();

    if (findError || !lead) {
      console.error('❌ Token lookup failed!');
      console.error('❌ Error:', JSON.stringify(findError));
      console.error('❌ Lead found:', !!lead);
      console.error('❌ Searched for token:', token);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid or expired verification token',
          verified: false,
          debug: {
            tokenReceived: token,
            errorCode: findError?.code,
            errorMessage: findError?.message
          }
        }),
        { status: 400 }
      );
    }

    // Check if already verified
    if (lead.email_verified) {
      console.log('ℹ️ Email already verified');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email already verified',
          alreadyVerified: true,
          verified: true,
          lead: {
            name: lead.name,
            email: lead.email
          }
        }),
        { status: 200 }
      );
    }

    // Update lead as verified
    const { error: updateError } = await supabase
      .from('qualified_leads')
      .update({
        email_verified: true,
        verified_at: new Date().toISOString()
      })
      .eq('verification_token', token);

    if (updateError) {
      console.error('❌ Failed to verify email:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify email' }),
        { status: 500 }
      );
    }

    console.log('✅ Email verified successfully for:', lead.email);

    // Now send the Magic Link email
    try {
      const magicLinkResponse = await fetch(`${url.origin}/api/send-magic-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          budget: lead.budget,
          timeline: lead.timeline,
          business: lead.business
        })
      });

      if (magicLinkResponse.ok) {
        console.log('✅ Magic link email sent after verification');
      } else {
        console.error('⚠️ Failed to send magic link email');
      }
    } catch (emailError) {
      console.error('⚠️ Error sending magic link:', emailError);
      // Don't fail the verification if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        verified: true,
        lead: {
          name: lead.name,
          email: lead.email
        }
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Verification error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
};
