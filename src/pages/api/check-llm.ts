// API Endpoint für LLM-Readability Check
// /api/check-llm.ts
export const prerender = false;
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { url } = await request.json();
    
    // Validate URL
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({
        error: 'Invalid URL provided'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch the website
    console.log('Fetching URL:', url);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'LLM-Readability-Checker/1.0 (CodeBack.de)'
      },
      // Timeout after 10 seconds
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // Analyze the HTML
    const analysis = analyzeLLMReadability(html);
    
    return new Response(JSON.stringify(analysis), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('Error analyzing website:', error);
    
    let errorMessage = 'Could not analyze website';
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        errorMessage = 'Website took too long to respond (timeout)';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Could not fetch website. Check if URL is correct.';
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

// Main analysis function
function analyzeLLMReadability(html: string) {
  let score = 100;
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check 1: Schema.org markup (-20 points)
  const hasSchemaOrg = html.includes('schema.org') || html.includes('@type');
  if (!hasSchemaOrg) {
    score -= 20;
    issues.push('Kein Schema.org Markup gefunden - LLMs können deine Inhalte nicht strukturiert verstehen');
    recommendations.push('Füge Schema.org Markup hinzu (z.B. Article, Person, Organization, LocalBusiness)');
  }

  // Check 2: Semantic HTML (-20 points)
  const hasSemanticHTML = checkSemanticHTML(html);
  if (!hasSemanticHTML) {
    score -= 20;
    issues.push('Keine semantischen HTML5 Elemente - Div-Soup ohne Struktur');
    recommendations.push('Nutze semantische HTML5 Tags: <article>, <section>, <nav>, <header>, <footer>');
  }

  // Check 3: JavaScript-heavy / SPA detection (-30 points)
  const isJSHeavy = checkIfJSHeavy(html);
  if (isJSHeavy) {
    score -= 30;
    issues.push('JavaScript-rendered Content erkannt - LLMs sehen nur leere Hülle!');
    recommendations.push('Nutze Server-Side Rendering (SSR) oder Static Site Generation (SSG)');
  }

  // Check 4: Meta Description (-10 points)
  const hasMetaDescription = html.includes('name="description"') || html.includes('property="og:description"');
  if (!hasMetaDescription) {
    score -= 10;
    issues.push('Keine Meta-Description - LLMs haben keine Zusammenfassung deiner Seite');
    recommendations.push('Füge eine aussagekräftige Meta-Description hinzu');
  }

  // Check 5: Content structure
  const hasGoodHeadings = checkHeadingStructure(html);
  if (!hasGoodHeadings) {
    score -= 10;
    issues.push('Schwache Überschriften-Struktur - erschwert das Verständnis');
    recommendations.push('Nutze klare H1-H6 Hierarchie für bessere Content-Struktur');
  }

  // Check 6: Multiple <h1> tags (bad practice)
  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
  if (h1Count > 1) {
    score -= 5;
    issues.push(`Mehrere H1-Tags gefunden (${h1Count}) - verwirrt LLMs`);
    recommendations.push('Nutze nur EINE H1 pro Seite als Haupt-Titel');
  }
  if (h1Count === 0) {
    score -= 10;
    issues.push('Keine H1-Überschrift gefunden - LLMs wissen nicht worum es geht');
    recommendations.push('Füge eine klare H1-Überschrift als Haupt-Titel hinzu');
  }

  // Positive checks
  const positiveChecks: string[] = [];
  
  if (html.includes('https://')) {
    positiveChecks.push('✅ HTTPS aktiv (Sicherheit)');
  }
  
  if (html.includes('og:') || html.includes('twitter:')) {
    positiveChecks.push('✅ Open Graph / Twitter Cards vorhanden');
  }

  if (html.includes('<article>') || html.includes('<main>')) {
    positiveChecks.push('✅ Haupt-Content klar markiert');
  }

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  // Add general recommendations if score is low
  if (score < 60) {
    recommendations.push('Erwäge den Wechsel zu einem LLM-optimierten Framework wie Astro oder Next.js');
    recommendations.push('Nutze Markdown für Content - LLMs lieben strukturierte Textformate');
  }

  return {
    score,
    issues,
    recommendations,
    positiveChecks,
    details: {
      hasSchemaOrg,
      hasSemanticHTML,
      isJSHeavy,
      hasMetaDescription,
      h1Count
    }
  };
}

// Helper: Check for semantic HTML elements
function checkSemanticHTML(html: string): boolean {
  const semanticTags = [
    '<article',
    '<section',
    '<nav',
    '<header',
    '<footer',
    '<aside',
    '<main'
  ];
  
  // Need at least 3 different semantic tags
  const foundTags = semanticTags.filter(tag => html.includes(tag));
  return foundTags.length >= 3;
}

// Helper: Check if site is JavaScript-heavy (SPA)
function checkIfJSHeavy(html: string): boolean {
  // Common patterns in SPAs
  const spaIndicators = [
    'id="root"',
    'id="app"',
    'id="__next"',
    'react-root',
    'ng-app',
    'v-app'
  ];
  
  // Check if any SPA indicator is present AND content is minimal
  const hasSPAIndicator = spaIndicators.some(indicator => html.includes(indicator));
  
  // Very rough check: if HTML is suspiciously small, it's probably JS-rendered
  const contentSize = html.length;
  const hasMinimalContent = contentSize < 5000; // Less than 5KB is suspicious
  
  return hasSPAIndicator && hasMinimalContent;
}

// Helper: Check heading structure
function checkHeadingStructure(html: string): boolean {
  // Check for presence of various heading levels
  const hasH1 = html.includes('<h1');
  const hasH2 = html.includes('<h2');
  
  // At minimum, should have H1 and H2
  return hasH1 && hasH2;
}
