// Enhanced LLM Analyzer with Premium Features
// /utils/llm-analyzer-premium.ts

export interface PremiumAnalysisResult {
  basicScore: number;
  issues: string[];
  recommendations: string[];
  
  // Premium Features
  citationProbability: number;
  entityRecognition: EntityRecognitionResult;
  contentQuality: ContentQualityResult;
  socialMetaTags: SocialMetaResult;
  imageOptimization: ImageOptimizationResult;
  authoritySignals: AuthoritySignalsResult;
  technicalSEO: TechnicalSEOResult;
}

export interface EntityRecognitionResult {
  score: number;
  hasName: boolean;
  hasLocation: boolean;
  hasCredentials: boolean;
  hasExperience: boolean;
  hasSpecialization: boolean;
  clarity: 'high' | 'medium' | 'low';
}

export interface ContentQualityResult {
  score: number;
  wordCount: number;
  readabilityScore: number;
  avgSentenceLength: number;
  contentToCodeRatio: number;
  hasStatistics: boolean;
  hasCaseStudies: boolean;
  hasTestimonials: boolean;
}

export interface SocialMetaResult {
  score: number;
  hasOpenGraph: boolean;
  hasTwitterCard: boolean;
  hasOGImage: boolean;
  hasOGDescription: boolean;
}

export interface ImageOptimizationResult {
  score: number;
  totalImages: number;
  withAltText: number;
  altTextCoverage: number;
  withLazyLoad: number;
}

export interface AuthoritySignalsResult {
  score: number;
  hasStatistics: boolean;
  hasNumbers: boolean;
  hasCredentials: boolean;
  hasAwards: boolean;
  hasPublications: boolean;
  hasMedia: boolean;
}

export interface TechnicalSEOResult {
  score: number;
  hasCanonical: boolean;
  hasRobotsMeta: boolean;
  hasStructuredData: boolean;
  structuredDataTypes: string[];
}

/**
 * Premium Analysis - Full Website Analysis
 */
export function analyzePremium(html: string, url: string): PremiumAnalysisResult {
  // Run all analyses
  const entityRecognition = analyzeEntityRecognition(html);
  const contentQuality = analyzeContentQuality(html);
  const socialMetaTags = analyzeSocialMetaTags(html);
  const imageOptimization = analyzeImageOptimization(html);
  const authoritySignals = analyzeAuthoritySignals(html);
  const technicalSEO = analyzeTechnicalSEO(html);
  
  // Calculate Citation Probability
  const citationProbability = calculateCitationProbability({
    entityRecognition,
    contentQuality,
    authoritySignals
  });
  
  // Calculate overall score (weighted)
  const basicScore = calculateWeightedScore({
    entityRecognition: entityRecognition.score,
    contentQuality: contentQuality.score,
    socialMetaTags: socialMetaTags.score,
    imageOptimization: imageOptimization.score,
    authoritySignals: authoritySignals.score,
    technicalSEO: technicalSEO.score
  });
  
  // Generate issues and recommendations
  const { issues, recommendations } = generateIssuesAndRecommendations({
    entityRecognition,
    contentQuality,
    socialMetaTags,
    imageOptimization,
    authoritySignals,
    technicalSEO
  });
  
  return {
    basicScore,
    issues,
    recommendations,
    citationProbability,
    entityRecognition,
    contentQuality,
    socialMetaTags,
    imageOptimization,
    authoritySignals,
    technicalSEO
  };
}

/**
 * Entity Recognition Analysis
 */
function analyzeEntityRecognition(html: string): EntityRecognitionResult {
  let score = 0;
  
  // Check for person/organization schema
  const hasPersonSchema = html.includes('"@type":"Person"') || 
                          html.includes('"@type":"Organization"');
  const hasName = hasPersonSchema || html.includes('author');
  if (hasName) score += 20;
  
  // Check for location
  const hasLocation = html.includes('address') || 
                      html.includes('location') || 
                      html.includes('"addressLocality"');
  if (hasLocation) score += 20;
  
  // Check for credentials
  const credentialKeywords = ['zertifiziert', 'ausbildung', 'certified', 'degree', 'qualification'];
  const hasCredentials = credentialKeywords.some(kw => html.toLowerCase().includes(kw));
  if (hasCredentials) score += 20;
  
  // Check for experience
  const experienceKeywords = ['jahre erfahrung', 'years experience', 'seit 20', 'founded'];
  const hasExperience = experienceKeywords.some(kw => html.toLowerCase().includes(kw));
  if (hasExperience) score += 20;
  
  // Check for specialization
  const hasSpecialization = html.includes('spezialisiert') || 
                            html.includes('expert') || 
                            html.includes('fokus');
  if (hasSpecialization) score += 20;
  
  // Determine clarity
  let clarity: 'high' | 'medium' | 'low' = 'low';
  if (score >= 80) clarity = 'high';
  else if (score >= 50) clarity = 'medium';
  
  return {
    score,
    hasName,
    hasLocation,
    hasCredentials,
    hasExperience,
    hasSpecialization,
    clarity
  };
}

/**
 * Content Quality Analysis
 */
function analyzeContentQuality(html: string): ContentQualityResult {
  const text = extractTextContent(html);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let score = 0;
  
  // Word count scoring
  const wordCount = words.length;
  if (wordCount > 1000) score += 20;
  else if (wordCount > 500) score += 15;
  else if (wordCount > 300) score += 10;
  else if (wordCount > 150) score += 5;
  
  // Readability (simplified Flesch score)
  const avgSentenceLength = words.length / Math.max(sentences.length, 1);
  const readabilityScore = Math.max(0, 100 - (avgSentenceLength * 2));
  if (readabilityScore > 70) score += 20;
  else if (readabilityScore > 50) score += 10;
  
  // Content to code ratio
  const contentToCodeRatio = (text.length / html.length) * 100;
  if (contentToCodeRatio > 20) score += 15;
  else if (contentToCodeRatio > 10) score += 10;
  else if (contentToCodeRatio > 5) score += 5;
  
  // Authority elements
  const hasStatistics = /\d+%|\d+\s*(prozent|percent)/i.test(html);
  if (hasStatistics) score += 15;
  
  const hasCaseStudies = /fallstudie|case study|erfolgsgeschichte/i.test(html);
  if (hasCaseStudies) score += 15;
  
  const hasTestimonials = /testimonial|bewertung|rezension|kundenstimme/i.test(html);
  if (hasTestimonials) score += 15;
  
  return {
    score: Math.min(100, score),
    wordCount,
    readabilityScore,
    avgSentenceLength,
    contentToCodeRatio,
    hasStatistics,
    hasCaseStudies,
    hasTestimonials
  };
}

/**
 * Social Meta Tags Analysis
 */
function analyzeSocialMetaTags(html: string): SocialMetaResult {
  let score = 0;
  
  const hasOpenGraph = html.includes('og:title') && html.includes('og:url');
  if (hasOpenGraph) score += 25;
  
  const hasTwitterCard = html.includes('twitter:card');
  if (hasTwitterCard) score += 25;
  
  const hasOGImage = html.includes('og:image');
  if (hasOGImage) score += 25;
  
  const hasOGDescription = html.includes('og:description');
  if (hasOGDescription) score += 25;
  
  return {
    score,
    hasOpenGraph,
    hasTwitterCard,
    hasOGImage,
    hasOGDescription
  };
}

/**
 * Image Optimization Analysis
 */
function analyzeImageOptimization(html: string): ImageOptimizationResult {
  const imgRegex = /<img[^>]+>/gi;
  const images = [...html.matchAll(imgRegex)];
  
  let withAltText = 0;
  let withLazyLoad = 0;
  
  images.forEach(img => {
    const imgTag = img[0];
    if (imgTag.includes('alt=') && !imgTag.includes('alt=""')) withAltText++;
    if (imgTag.includes('loading="lazy"')) withLazyLoad++;
  });
  
  const totalImages = images.length;
  const altTextCoverage = totalImages > 0 ? (withAltText / totalImages) * 100 : 0;
  
  let score = 0;
  if (altTextCoverage >= 90) score = 100;
  else if (altTextCoverage >= 70) score = 80;
  else if (altTextCoverage >= 50) score = 60;
  else if (altTextCoverage >= 30) score = 40;
  else score = 20;
  
  return {
    score,
    totalImages,
    withAltText,
    altTextCoverage,
    withLazyLoad
  };
}

/**
 * Authority Signals Analysis
 */
function analyzeAuthoritySignals(html: string): AuthoritySignalsResult {
  let score = 0;
  
  const hasStatistics = /\d+%|\d+\s*(prozent|percent)/i.test(html);
  if (hasStatistics) score += 20;
  
  const hasNumbers = /\d{2,}/g.test(html); // At least 2-digit numbers
  if (hasNumbers) score += 15;
  
  const credentialKeywords = ['zertifiziert', 'certified', 'auszeichnung', 'award', 'diplom'];
  const hasCredentials = credentialKeywords.some(kw => html.toLowerCase().includes(kw));
  if (hasCredentials) score += 20;
  
  const hasAwards = /auszeichnung|award|preis|prize/i.test(html);
  if (hasAwards) score += 15;
  
  const hasPublications = /publikation|publication|veröffentlichung|buch|book/i.test(html);
  if (hasPublications) score += 15;
  
  const hasMedia = /presse|press|featured|erwähnt/i.test(html);
  if (hasMedia) score += 15;
  
  return {
    score: Math.min(100, score),
    hasStatistics,
    hasNumbers,
    hasCredentials,
    hasAwards,
    hasPublications,
    hasMedia
  };
}

/**
 * Technical SEO Analysis
 */
function analyzeTechnicalSEO(html: string): TechnicalSEOResult {
  let score = 0;
  
  const hasCanonical = html.includes('rel="canonical"');
  if (hasCanonical) score += 25;
  
  const hasRobotsMeta = html.includes('name="robots"');
  if (hasRobotsMeta) score += 25;
  
  const hasStructuredData = html.includes('application/ld+json');
  if (hasStructuredData) score += 25;
  
  // Extract structured data types
  const structuredDataTypes: string[] = [];
  const jsonLdMatches = html.matchAll(/"@type"\s*:\s*"([^"]+)"/g);
  for (const match of jsonLdMatches) {
    structuredDataTypes.push(match[1]);
  }
  
  if (structuredDataTypes.length > 2) score += 25;
  else if (structuredDataTypes.length > 0) score += 15;
  
  return {
    score,
    hasCanonical,
    hasRobotsMeta,
    hasStructuredData,
    structuredDataTypes
  };
}

/**
 * Calculate Citation Probability
 * How likely is it that an LLM will cite/recommend this website?
 */
function calculateCitationProbability(data: {
  entityRecognition: EntityRecognitionResult;
  contentQuality: ContentQualityResult;
  authoritySignals: AuthoritySignalsResult;
}): number {
  let probability = 0;
  
  // Entity Recognition (30%)
  probability += (data.entityRecognition.score / 100) * 30;
  
  // Content Quality (35%)
  probability += (data.contentQuality.score / 100) * 35;
  
  // Authority Signals (35%)
  probability += (data.authoritySignals.score / 100) * 35;
  
  return Math.round(probability);
}

/**
 * Calculate Weighted Overall Score
 */
function calculateWeightedScore(scores: {
  entityRecognition: number;
  contentQuality: number;
  socialMetaTags: number;
  imageOptimization: number;
  authoritySignals: number;
  technicalSEO: number;
}): number {
  const weights = {
    entityRecognition: 0.20,
    contentQuality: 0.25,
    socialMetaTags: 0.10,
    imageOptimization: 0.10,
    authoritySignals: 0.20,
    technicalSEO: 0.15
  };
  
  const weightedScore = 
    scores.entityRecognition * weights.entityRecognition +
    scores.contentQuality * weights.contentQuality +
    scores.socialMetaTags * weights.socialMetaTags +
    scores.imageOptimization * weights.imageOptimization +
    scores.authoritySignals * weights.authoritySignals +
    scores.technicalSEO * weights.technicalSEO;
  
  return Math.round(weightedScore);
}

/**
 * Generate Issues and Recommendations
 */
function generateIssuesAndRecommendations(data: {
  entityRecognition: EntityRecognitionResult;
  contentQuality: ContentQualityResult;
  socialMetaTags: SocialMetaResult;
  imageOptimization: ImageOptimizationResult;
  authoritySignals: AuthoritySignalsResult;
  technicalSEO: TechnicalSEOResult;
}): { issues: string[]; recommendations: string[] } {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Entity Recognition
  if (data.entityRecognition.score < 60) {
    issues.push('LLMs können deine Identität nicht klar erkennen');
    recommendations.push('Füge strukturierte Person/Organization Schema hinzu');
  }
  if (!data.entityRecognition.hasLocation) {
    issues.push('Keine klare Standort-Information');
    recommendations.push('Füge Standort mit Schema.org addressLocality hinzu');
  }
  
  // Content Quality
  if (data.contentQuality.wordCount < 300) {
    issues.push('Zu wenig Content - LLMs bevorzugen ausführliche Inhalte');
    recommendations.push('Erweitere deinen Content auf mindestens 500 Wörter');
  }
  if (!data.contentQuality.hasStatistics) {
    issues.push('Keine Statistiken oder Zahlen - reduziert Zitierfähigkeit');
    recommendations.push('Füge konkrete Zahlen, Statistiken und Ergebnisse hinzu');
  }
  
  // Social Meta
  if (!data.socialMetaTags.hasOpenGraph) {
    issues.push('Keine Open Graph Tags - schlecht für Social Sharing');
    recommendations.push('Implementiere Open Graph Meta-Tags');
  }
  
  // Images
  if (data.imageOptimization.altTextCoverage < 80) {
    issues.push(`Nur ${Math.round(data.imageOptimization.altTextCoverage)}% der Bilder haben Alt-Text`);
    recommendations.push('Füge beschreibende Alt-Texte zu allen Bildern hinzu');
  }
  
  // Authority
  if (data.authoritySignals.score < 50) {
    issues.push('Schwache Authority-Signale - LLMs bevorzugen Expertise');
    recommendations.push('Füge Credentials, Auszeichnungen oder Publikationen hinzu');
  }
  
  // Technical SEO
  if (!data.technicalSEO.hasStructuredData) {
    issues.push('Keine strukturierten Daten - LLMs können Inhalte nicht verstehen');
    recommendations.push('Implementiere Schema.org JSON-LD Markup');
  }
  
  return { issues, recommendations };
}

/**
 * Helper: Extract text content from HTML
 */
function extractTextContent(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
