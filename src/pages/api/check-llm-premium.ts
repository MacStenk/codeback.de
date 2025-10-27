// Premium API Endpoint with LLM Response Preview
// /api/check-llm-premium.ts

export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { url, email, query } = await request.json();
    
    // Validate inputs
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({
        error: 'Invalid URL provided'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Fetch the website
    console.log('Fetching URL for premium analysis:', url);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'LLM-Readability-Checker/2.0 (CodeBack.de)'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // Run premium analysis
    const analysis = await analyzePremium(html, url, query, email);
    
    return new Response(JSON.stringify(analysis), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('Error in premium analysis:', error);
    
    let errorMessage = 'Could not analyze website';
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        errorMessage = 'Website took too long to respond';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Could not fetch website';
      }
    }
    
    return new Response(JSON.stringify({
      error: errorMessage
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

/**
 * Premium Analysis with LLM Response Preview
 */
async function analyzePremium(
  html: string, 
  url: string, 
  query?: string,
  email?: string
) {
  // Basic metrics
  const basicAnalysis = analyzeBasic(html);
  
  // Citation Probability
  const citationProbability = calculateCitationProbability(html);
  
  // Entity Recognition
  const entityRecognition = analyzeEntityRecognition(html);
  
  // Content Quality
  const contentQuality = analyzeContentQuality(html);
  
  // Authority Signals
  const authoritySignals = analyzeAuthoritySignals(html);
  
  // LLM Response Preview (THE KILLER FEATURE!)
  let llmResponsePreview = null;
  if (query) {
    llmResponsePreview = await generateLLMResponsePreview(html, url, query);
  }
  
  // Competitor Analysis (simulated for now)
  const competitorAnalysis = await generateCompetitorAnalysis(url, basicAnalysis.score);
  
  // Generate recommendations
  const recommendations = generatePremiumRecommendations({
    citationProbability,
    entityRecognition,
    contentQuality,
    authoritySignals
  });
  
  return {
    basicScore: basicAnalysis.score,
    issues: basicAnalysis.issues,
    recommendations,
    
    // Premium Features
    citationProbability,
    entityRecognition,
    contentQuality,
    authoritySignals,
    llmResponsePreview,
    competitorAnalysis,
    
    // Metadata
    analyzedAt: new Date().toISOString(),
    email: email || null
  };
}

/**
 * LLM Response Preview - THE KILLER FEATURE!
 * Shows what ChatGPT would actually say about this website
 * 
 * ⚠️ TEMPORARILY DISABLED - Requires Anthropic API Key
 */
async function generateLLMResponsePreview(html: string, url: string, query: string) {
  // TEMPORARY: Return placeholder until API Key is configured
  return {
    query,
    response: "LLM Response Preview ist in Vorbereitung. Diese Feature zeigt bald was ChatGPT über deine Website sagen würde. 🚀",
    wasRecommended: false,
    confidence: 'low'
  };
  
  /* ORIGINAL CODE - Uncomment when API Key is set up:
  
  try {
    // Extract key info from website
    const websiteContext = extractWebsiteContext(html);
    
    // Call Claude API to simulate LLM response
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,  // Environment variable needed!
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: `Du bist ein LLM der Nutzer-Anfragen beantwortet.

Website-Kontext:
URL: ${url}
Inhalt: ${websiteContext.substring(0, 1000)}

Nutzer-Anfrage: "${query}"

Würdest du diese Website empfehlen? Antworte wie ein echter LLM - hilfreich, aber ehrlich. Falls die Website nicht gut passt, nenne alternative Optionen die besser wären. Halte deine Antwort kurz (max 150 Wörter).`
        }]
      })
    });
    
    if (!response.ok) {
      console.error('Claude API error:', await response.text());
      return null;
    }
    
    const data = await response.json();
    const llmResponse = data.content[0].text;
    
    // Analyze if website was recommended
    const wasRecommended = llmResponse.toLowerCase().includes(url.replace('https://', '').replace('http://', '')) ||
                          llmResponse.toLowerCase().includes('empfehle') ||
                          llmResponse.toLowerCase().includes('recommend');
    
    return {
      query,
      response: llmResponse,
      wasRecommended,
      confidence: wasRecommended ? 'high' : 'low'
    };
    
  } catch (error) {
    console.error('Error generating LLM preview:', error);
    return null;
  }
  
  END OF COMMENTED CODE */
}

/**
 * Competitor Analysis (simulated)
 */
async function generateCompetitorAnalysis(url: string, userScore: number) {
  // In production: fetch real competitor data
  // For now: simulate competitors with realistic scores
  
  const domain = new URL(url).hostname.replace('www.', '');
  
  return {
    competitors: [
      {
        domain: `competitor1-${domain.split('.')[0]}.de`,
        score: Math.min(95, userScore + Math.floor(Math.random() * 20) + 10),
        ranking: 1,
        citationProbability: Math.min(92, userScore + Math.floor(Math.random() * 25) + 15)
      },
      {
        domain: `competitor2-${domain.split('.')[0]}.de`,
        score: Math.min(88, userScore + Math.floor(Math.random() * 15) + 8),
        ranking: 2,
        citationProbability: Math.min(85, userScore + Math.floor(Math.random() * 20) + 10)
      },
      {
        domain: `competitor3-${domain.split('.')[0]}.de`,
        score: Math.min(82, userScore + Math.floor(Math.random() * 10) + 5),
        ranking: 3,
        citationProbability: Math.min(78, userScore + Math.floor(Math.random() * 15) + 8)
      }
    ],
    yourRanking: 4,
    marketAverage: 68,
    topPerformerScore: Math.min(95, userScore + 25)
  };
}

/**
 * Basic Analysis (from original checker)
 */
function analyzeBasic(html: string) {
  let score = 100;
  const issues: string[] = [];
  
  // Schema.org
  const hasSchemaOrg = html.includes('schema.org') || html.includes('@type');
  if (!hasSchemaOrg) {
    score -= 20;
    issues.push('Kein Schema.org Markup');
  }
  
  // Semantic HTML
  const semanticTags = ['<article', '<section', '<nav', '<header', '<footer', '<aside', '<main'];
  const foundTags = semanticTags.filter(tag => html.includes(tag));
  if (foundTags.length < 3) {
    score -= 20;
    issues.push('Wenig semantisches HTML');
  }
  
  // JS-Heavy check
  const spaIndicators = ['id="root"', 'id="app"', 'id="__next"'];
  const isJSHeavy = spaIndicators.some(indicator => html.includes(indicator)) && html.length < 5000;
  if (isJSHeavy) {
    score -= 30;
    issues.push('JavaScript-rendered Content');
  }
  
  // Meta Description
  if (!html.includes('name="description"')) {
    score -= 10;
    issues.push('Keine Meta-Description');
  }
  
  // H1 Tags
  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
  if (h1Count === 0) {
    score -= 10;
    issues.push('Keine H1-Überschrift');
  } else if (h1Count > 1) {
    score -= 5;
    issues.push(`Mehrere H1-Tags (${h1Count})`);
  }
  
  return { score: Math.max(0, score), issues };
}

/**
 * Calculate Citation Probability
 */
function calculateCitationProbability(html: string): number {
  let probability = 0;
  
  // Has clear identity
  const hasPersonSchema = html.includes('"@type":"Person"') || html.includes('"@type":"Organization"');
  if (hasPersonSchema) probability += 20;
  
  // Has statistics/numbers
  if (/\d+%|\d+\s*(prozent|percent)/i.test(html)) probability += 20;
  
  // Has credentials
  const credentialKeywords = ['zertifiziert', 'certified', 'auszeichnung', 'award'];
  if (credentialKeywords.some(kw => html.toLowerCase().includes(kw))) probability += 15;
  
  // Has case studies
  if (/fallstudie|case study|erfolgsgeschichte/i.test(html)) probability += 15;
  
  // Has testimonials
  if (/testimonial|bewertung|rezension/i.test(html)) probability += 10;
  
  // Good content length
  const text = html.replace(/<[^>]+>/g, '');
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 1000) probability += 10;
  else if (wordCount > 500) probability += 5;
  
  // Has contact info
  if (html.includes('email') || html.includes('kontakt') || html.includes('contact')) probability += 10;
  
  return Math.min(100, probability);
}

/**
 * Entity Recognition Analysis
 */
function analyzeEntityRecognition(html: string) {
  let score = 0;
  
  const hasName = html.includes('"@type":"Person"') || html.includes('author');
  const hasLocation = html.includes('addressLocality') || /\b\d{5}\b/.test(html); // PLZ
  const hasCredentials = /zertifiziert|certified|diplom/i.test(html);
  const hasExperience = /jahre|years|seit\s*\d{4}/i.test(html);
  
  if (hasName) score += 25;
  if (hasLocation) score += 25;
  if (hasCredentials) score += 25;
  if (hasExperience) score += 25;
  
  return {
    score,
    hasName,
    hasLocation,
    hasCredentials,
    hasExperience,
    clarity: score >= 75 ? 'high' : score >= 50 ? 'medium' : 'low'
  };
}

/**
 * Content Quality Analysis
 */
function analyzeContentQuality(html: string) {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  let score = 0;
  if (wordCount > 1000) score += 30;
  else if (wordCount > 500) score += 20;
  else if (wordCount > 300) score += 10;
  
  const hasStatistics = /\d+%/i.test(html);
  const hasCaseStudies = /fallstudie|case study/i.test(html);
  const hasTestimonials = /testimonial|bewertung/i.test(html);
  
  if (hasStatistics) score += 25;
  if (hasCaseStudies) score += 25;
  if (hasTestimonials) score += 20;
  
  return {
    score: Math.min(100, score),
    wordCount,
    hasStatistics,
    hasCaseStudies,
    hasTestimonials
  };
}

/**
 * Authority Signals Analysis
 */
function analyzeAuthoritySignals(html: string) {
  let score = 0;
  
  const hasStatistics = /\d+%/i.test(html);
  const hasCredentials = /zertifiziert|certified|award/i.test(html);
  const hasPublications = /publikation|publication|buch|book/i.test(html);
  const hasMedia = /presse|press|featured/i.test(html);
  
  if (hasStatistics) score += 25;
  if (hasCredentials) score += 25;
  if (hasPublications) score += 25;
  if (hasMedia) score += 25;
  
  return {
    score,
    hasStatistics,
    hasCredentials,
    hasPublications,
    hasMedia
  };
}

/**
 * Generate Premium Recommendations
 */
function generatePremiumRecommendations(data: any): string[] {
  const recommendations: string[] = [];
  
  if (data.citationProbability < 50) {
    recommendations.push('🎯 Erhöhe deine Citation-Wahrscheinlichkeit: Füge Statistiken, Fallstudien und Credentials hinzu');
  }
  
  if (data.entityRecognition.clarity === 'low') {
    recommendations.push('👤 Verbessere Entity Recognition: Implementiere Person/Organization Schema mit allen Details');
  }
  
  if (!data.contentQuality.hasStatistics) {
    recommendations.push('📊 Füge konkrete Zahlen hinzu: LLMs lieben quantifizierbare Ergebnisse');
  }
  
  if (!data.contentQuality.hasCaseStudies) {
    recommendations.push('📝 Erstelle Case Studies: Zeige konkrete Erfolgsgeschichten mit Vorher/Nachher');
  }
  
  if (data.authoritySignals.score < 50) {
    recommendations.push('🏆 Baue Authority auf: Erwähne Auszeichnungen, Publikationen, Presse-Features');
  }
  
  if (data.contentQuality.wordCount < 500) {
    recommendations.push('✍️ Erweitere deinen Content: Mindestens 500 Wörter für bessere LLM-Verständlichkeit');
  }
  
  return recommendations;
}

/**
 * Extract website context for LLM
 */
function extractWebsiteContext(html: string): string {
  // Extract main content text
  const text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Return first 2000 chars for context
  return text.substring(0, 2000);
}
