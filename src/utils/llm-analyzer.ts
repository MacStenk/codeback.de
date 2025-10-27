// LLM Analyzer Utilities
// /utils/llm-analyzer.ts
// Modular functions for analyzing website LLM-readability

export interface LLMAnalysisResult {
  score: number;
  issues: string[];
  recommendations: string[];
  positiveChecks?: string[];
  details: {
    hasSchemaOrg: boolean;
    hasSemanticHTML: boolean;
    isJSHeavy: boolean;
    hasMetaDescription: boolean;
    h1Count: number;
  };
}

/**
 * Main analysis function - analyzes HTML for LLM readability
 */
export function analyzeLLMReadability(html: string): LLMAnalysisResult {
  let score = 100;
  const issues: string[] = [];
  const recommendations: string[] = [];
  const positiveChecks: string[] = [];

  // Run all checks
  const schemaCheck = checkSchemaOrg(html);
  const semanticCheck = checkSemanticHTML(html);
  const jsCheck = checkIfJSHeavy(html);
  const metaCheck = checkMetaDescription(html);
  const headingCheck = checkHeadingStructure(html);
  const h1Check = checkH1Tags(html);

  // Calculate score and collect issues
  if (!schemaCheck.passed) {
    score -= 20;
    issues.push(schemaCheck.issue!);
    recommendations.push(schemaCheck.recommendation!);
  } else {
    positiveChecks.push('✅ Schema.org Markup vorhanden');
  }

  if (!semanticCheck.passed) {
    score -= 20;
    issues.push(semanticCheck.issue!);
    recommendations.push(semanticCheck.recommendation!);
  } else {
    positiveChecks.push('✅ Semantisches HTML5 verwendet');
  }

  if (jsCheck.isJSHeavy) {
    score -= 30;
    issues.push(jsCheck.issue!);
    recommendations.push(jsCheck.recommendation!);
  } else {
    positiveChecks.push('✅ Server-rendered Content erkannt');
  }

  if (!metaCheck.passed) {
    score -= 10;
    issues.push(metaCheck.issue!);
    recommendations.push(metaCheck.recommendation!);
  } else {
    positiveChecks.push('✅ Meta-Description vorhanden');
  }

  if (!headingCheck.passed) {
    score -= 10;
    issues.push(headingCheck.issue!);
    recommendations.push(headingCheck.recommendation!);
  }

  // H1 checks
  if (h1Check.count > 1) {
    score -= 5;
    issues.push(`Mehrere H1-Tags gefunden (${h1Check.count}) - verwirrt LLMs`);
    recommendations.push('Nutze nur EINE H1 pro Seite als Haupt-Titel');
  } else if (h1Check.count === 0) {
    score -= 10;
    issues.push('Keine H1-Überschrift gefunden - LLMs wissen nicht worum es geht');
    recommendations.push('Füge eine klare H1-Überschrift als Haupt-Titel hinzu');
  } else {
    positiveChecks.push('✅ Klare H1-Struktur');
  }

  // Additional positive checks
  if (html.includes('https://')) {
    positiveChecks.push('✅ HTTPS aktiv');
  }

  if (html.includes('og:') || html.includes('twitter:')) {
    positiveChecks.push('✅ Open Graph Markup');
  }

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  // Add strategic recommendations for low scores
  if (score < 60) {
    recommendations.push('Erwäge moderne JAMstack Frameworks (Astro, Next.js, Gatsby)');
    recommendations.push('Nutze Markdown für Content - ideal für LLM-Verständnis');
  }

  return {
    score,
    issues,
    recommendations,
    positiveChecks,
    details: {
      hasSchemaOrg: schemaCheck.passed,
      hasSemanticHTML: semanticCheck.passed,
      isJSHeavy: jsCheck.isJSHeavy,
      hasMetaDescription: metaCheck.passed,
      h1Count: h1Check.count
    }
  };
}

// Individual check functions

interface CheckResult {
  passed: boolean;
  issue?: string;
  recommendation?: string;
}

interface JSCheckResult {
  isJSHeavy: boolean;
  issue?: string;
  recommendation?: string;
}

interface H1CheckResult {
  count: number;
}

/**
 * Check for Schema.org markup
 */
export function checkSchemaOrg(html: string): CheckResult {
  const hasSchema = html.includes('schema.org') || 
                    html.includes('"@type"') || 
                    html.includes("'@type'");
  
  return {
    passed: hasSchema,
    issue: hasSchema ? undefined : 'Kein Schema.org Markup gefunden - LLMs können Inhalte nicht strukturiert verstehen',
    recommendation: hasSchema ? undefined : 'Füge Schema.org JSON-LD hinzu (z.B. Article, Person, Organization)'
  };
}

/**
 * Check for semantic HTML5 elements
 */
export function checkSemanticHTML(html: string): CheckResult {
  const semanticTags = [
    '<article',
    '<section',
    '<nav',
    '<header',
    '<footer',
    '<aside',
    '<main'
  ];
  
  const foundTags = semanticTags.filter(tag => html.includes(tag));
  const passed = foundTags.length >= 3;
  
  return {
    passed,
    issue: passed ? undefined : 'Keine semantischen HTML5 Elemente - Div-Soup ohne Struktur',
    recommendation: passed ? undefined : 'Nutze <article>, <section>, <nav>, <header>, <footer> statt nur <div>'
  };
}

/**
 * Check if site is JavaScript-heavy (SPA)
 */
export function checkIfJSHeavy(html: string): JSCheckResult {
  const spaIndicators = [
    'id="root"',
    'id="app"',
    'id="__next"',
    'react-root',
    'ng-app',
    'v-app',
    'data-reactroot'
  ];
  
  const hasSPAIndicator = spaIndicators.some(indicator => html.includes(indicator));
  
  // Check content size - SPAs often have minimal HTML
  const contentSize = html.length;
  const hasMinimalContent = contentSize < 5000;
  
  // Check for script-heavy content
  const scriptTags = (html.match(/<script/gi) || []).length;
  const hasLotsOfScripts = scriptTags > 5;
  
  const isJSHeavy = (hasSPAIndicator && hasMinimalContent) || hasLotsOfScripts;
  
  return {
    isJSHeavy,
    issue: isJSHeavy ? 'JavaScript-rendered Content erkannt - LLMs sehen nur leere Hülle!' : undefined,
    recommendation: isJSHeavy ? 'Nutze Server-Side Rendering (SSR) oder Static Site Generation (SSG)' : undefined
  };
}

/**
 * Check for meta description
 */
export function checkMetaDescription(html: string): CheckResult {
  const hasMeta = html.includes('name="description"') || 
                  html.includes('property="og:description"');
  
  return {
    passed: hasMeta,
    issue: hasMeta ? undefined : 'Keine Meta-Description - LLMs haben keine Zusammenfassung',
    recommendation: hasMeta ? undefined : 'Füge <meta name="description" content="..."> hinzu'
  };
}

/**
 * Check heading structure
 */
export function checkHeadingStructure(html: string): CheckResult {
  const hasH1 = html.includes('<h1');
  const hasH2 = html.includes('<h2');
  const passed = hasH1 && hasH2;
  
  return {
    passed,
    issue: passed ? undefined : 'Schwache Überschriften-Struktur - erschwert Verständnis',
    recommendation: passed ? undefined : 'Nutze klare H1-H6 Hierarchie für Content-Struktur'
  };
}

/**
 * Count H1 tags
 */
export function checkH1Tags(html: string): H1CheckResult {
  const matches = html.match(/<h1[^>]*>/gi);
  return {
    count: matches ? matches.length : 0
  };
}

/**
 * Extract clean text content (remove HTML tags)
 * Useful for future content analysis
 */
export function extractTextContent(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Estimate content quality based on text length and structure
 * Returns a quality score from 0-100
 */
export function estimateContentQuality(html: string): number {
  const text = extractTextContent(html);
  const wordCount = text.split(/\s+/).length;
  
  let quality = 50; // Base score
  
  // More words = better (but with diminishing returns)
  if (wordCount > 300) quality += 20;
  else if (wordCount > 150) quality += 10;
  else if (wordCount < 50) quality -= 20;
  
  // Check for lists (good for scannability)
  const hasLists = html.includes('<ul') || html.includes('<ol');
  if (hasLists) quality += 10;
  
  // Check for images (visual content)
  const imageCount = (html.match(/<img/gi) || []).length;
  if (imageCount > 0 && imageCount < 20) quality += 10;
  
  return Math.min(100, Math.max(0, quality));
}

/**
 * Future: Check for specific business types
 * Can be extended with more detailed Schema.org checks
 */
export function detectBusinessType(html: string): string | null {
  if (html.includes('LocalBusiness') || html.includes('"@type":"LocalBusiness"')) {
    return 'Local Business';
  }
  if (html.includes('Person') || html.includes('"@type":"Person"')) {
    return 'Personal Brand';
  }
  if (html.includes('Organization') || html.includes('"@type":"Organization"')) {
    return 'Organization';
  }
  if (html.includes('Article') || html.includes('"@type":"Article"')) {
    return 'Content Publisher';
  }
  return null;
}
