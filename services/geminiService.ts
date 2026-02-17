
import { GoogleGenAI, Type } from "@google/genai";
import { EmailFlowContext } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeNurturingFlow = async (context: EmailFlowContext) => {
  const emailsPrompt = context.emails
    .map((e, i) => `Email ${i + 1}:\n${e.content}`)
    .join('\n\n---\n\n');

  const prompt = `
    You are a senior B2B SaaS lifecycle marketing strategist for Mouseflow.
    Evaluate a nurturing flow for leads who have downloaded educational materials (guides/checklists).

    STRATEGIC CONTEXT:
    - Audience: Problem-aware leads who have exchanged emails for educational content.
    - Logic: Reinforce value of downloaded materials -> Practical behavioral insights -> Mouseflow use cases (session replay, friction signals) -> Intent step (${context.goal}).
    - Language: ${context.language}
    - Industry: ${context.industry}
    - Personas: ${context.personas.join(', ')}
    - Mouseflow Features: Session replay, heatmaps, funnels/forms, rage clicks, friction signals.

    EMAILS TO AUDIT:
    ${emailsPrompt}

    YOUR TASKS (MANDATORY STRUCTURE):
    [PAGE 1] Dashboard: Provide a verdict on intent building, wins/risks, score (1-10), and the #1 "Fix First" priority.
    [PAGE 2] Flow Health: Check logical structure (Yes/No/Partially), momentum drops, CTA intent progression, and article mix. List 5-8 improvements.
    [PAGE 3] Email Review: For EACH email, provide role, positioning, what works, improvements, CTA strength (with reasoning), and article assessment.
    [PAGE 4] Rewrite: Provide a full rewritten version of the flow. Scannable copy, high-intent subjects, one primary CTA per email. Focus on friction signals.
    [PAGE 5] HubSpot Blocks: Provide a simple implementation layout plan for EACH email (Header, Insight, Articles, CTA, Footer).

    Return as valid JSON matching the responseSchema.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dashboard: {
            type: Type.OBJECT,
            properties: {
              verdict: { type: Type.STRING },
              winsRisks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    text: { type: Type.STRING }
                  },
                  required: ["type", "text"]
                }
              },
              score: { type: Type.NUMBER },
              fixFirst: { type: Type.STRING }
            },
            required: ["verdict", "winsRisks", "score", "fixFirst"]
          },
          flowHealth: {
            type: Type.OBJECT,
            properties: {
              logicalStructure: { type: Type.STRING },
              momentumCheck: { type: Type.STRING },
              ctaProgression: { type: Type.STRING },
              articleMix: { type: Type.STRING },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["logicalStructure", "momentumCheck", "ctaProgression", "articleMix", "improvements"]
          },
          emailReviews: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                positioning: { type: Type.STRING },
                whatWorks: { type: Type.ARRAY, items: { type: Type.STRING } },
                toImprove: { type: Type.ARRAY, items: { type: Type.STRING } },
                ctaStrength: {
                  type: Type.OBJECT,
                  properties: {
                    assessment: { type: Type.STRING },
                    reasoning: { type: Type.STRING }
                  },
                  required: ["assessment", "reasoning"]
                },
                articleReview: {
                  type: Type.OBJECT,
                  properties: {
                    status: { type: Type.STRING },
                    reasoning: { type: Type.STRING }
                  },
                  required: ["status", "reasoning"]
                }
              },
              required: ["name", "role", "positioning", "whatWorks", "toImprove", "ctaStrength", "articleReview"]
            }
          },
          rewrite: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                subjects: { type: Type.ARRAY, items: { type: Type.STRING } },
                preheader: { type: Type.STRING },
                strategicPurpose: { type: Type.STRING },
                copy: { type: Type.STRING },
                suggestedArticles: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["name", "subjects", "preheader", "strategicPurpose", "copy", "suggestedArticles"]
            }
          },
          hubspotLayout: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                emailName: { type: Type.STRING },
                blocks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      content: { type: Type.STRING }
                    },
                    required: ["label", "content"]
                  }
                }
              },
              required: ["emailName", "blocks"]
            }
          }
        },
        required: ["dashboard", "flowHealth", "emailReviews", "rewrite", "hubspotLayout"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Analysis failed. Please verify your inputs.");
  }
};
