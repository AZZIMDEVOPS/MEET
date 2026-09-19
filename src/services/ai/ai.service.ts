/**
 * MEET AI Service
 * Abstraction layer for AI capabilities.
 * Connects to OpenAI if configured, falls back to deterministic demo mode.
 */

import OpenAI from 'openai'

const DEMO_RESPONSES: Record<string, string> = {
  default: "I'd love to help you discover people, places and experiences. What are you looking for? You can ask me about events, communities, or interesting people to connect with.",
  events: "Here are some exciting events happening soon:\n\n• Nairobi Tech Meetup — Saturday, 2PM at iHub Nairobi\n• Photography Walk — Sunday, 7AM at Karura Forest\n• Startup Founders Night — Friday, 6PM at The Alchemist\n• Creative Networking — Next week at Village Market\n\nWould you like details about any of these?",
  people: "Based on your interests, you might want to meet:\n\n• Amara Osei — UX Designer, passionate about African tech\n• Kwame Mensah — Photographer and visual storyteller\n• Sadia Ibrahim — Startup founder and entrepreneur\n• David Kamau — Software engineer, loves hiking\n\nWould you like to connect with any of them?",
  communities: "Communities you might love:\n\n• Nairobi Creatives — 2.4K members, art & design\n• Kenya Tech Community — 8.7K members, technology\n• Weekend Explorers — 1.2K members, activities & hiking\n• Startup Kenya — 5.1K members, entrepreneurship\n\nWant to join any of these?",
  places: "Popular places people are meeting in Nairobi:\n\n• iHub — Tech & coworking, Ngong Road\n• Karura Forest — Nature & activities\n• The Alchemist — Social & events, Westlands\n• Java House Westgate — Coffee & networking\n\nShould I show you events at any of these?",
  food: "Food-related events near you:\n\n• Nairobi Food Festival — This weekend at KICC grounds\n• Cooking Masterclass — Italian cuisine, Saturday 3PM\n• Supper Club — Private dining experience, Friday\n\nInterested in joining any of these?",
  weekend: "Things to do this weekend in Nairobi:\n\n• Join the Photography Walk at Karura Forest (Sunday 7AM)\n• Attend Startup Founders Night at The Alchemist (Friday 6PM)\n• Explore Nairobi National Park with Weekend Explorers\n• Check out the Art Exhibition at GoDown Arts Centre\n\nWhich one sounds interesting?",
}

function getDemoResponse(query: string): string {
  const q = query.toLowerCase()
  if (q.includes('event') || q.includes('happening') || q.includes('weekend') && !q.includes('food')) return DEMO_RESPONSES.weekend
  if (q.includes('weekend') || q.includes('tonight') || q.includes('saturday') || q.includes('sunday')) return DEMO_RESPONSES.weekend
  if (q.includes('people') || q.includes('meet') || q.includes('connect') || q.includes('who')) return DEMO_RESPONSES.people
  if (q.includes('community') || q.includes('communities') || q.includes('group') || q.includes('join')) return DEMO_RESPONSES.communities
  if (q.includes('place') || q.includes('venue') || q.includes('cafe') || q.includes('where')) return DEMO_RESPONSES.places
  if (q.includes('food') || q.includes('restaurant') || q.includes('eat') || q.includes('cook')) return DEMO_RESPONSES.food
  if (q.includes('tech') || q.includes('startup') || q.includes('developer')) return DEMO_RESPONSES.events
  return DEMO_RESPONSES.default
}

class AIService {
  private client: OpenAI | null = null
  public isDemoMode: boolean = true

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
    if (apiKey && apiKey.startsWith('sk-')) {
      this.client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
      this.isDemoMode = false
    }
  }

  async chat(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>): Promise<{
    content: string
    isDemo: boolean
  }> {
    // Demo mode — return deterministic response
    if (this.isDemoMode || !this.client) {
      const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')
      const query = lastUserMessage?.content || ''
      await this.simulateDelay()
      return {
        content: getDemoResponse(query),
        isDemo: true,
      }
    }

    // Real OpenAI call
    try {
      const systemPrompt = `You are MEET AI, a social discovery assistant for the MEET platform — a social platform focused on helping people discover people, places and experiences. 
      
You help users:
- Find events happening near them (focus on Nairobi, Kenya but support global)
- Discover interesting people to connect with based on shared interests
- Find communities and groups to join
- Suggest activities and places to explore
- Provide personalized social recommendations

Keep responses concise, friendly and action-oriented. Do not use emojis in your responses.
Always encourage real-world connection — this is what MEET is about.`

      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        max_tokens: 500,
        temperature: 0.8,
      })

      return {
        content: response.choices[0].message.content || '',
        isDemo: false,
      }
    } catch (error) {
      console.error('OpenAI error, falling back to demo mode:', error)
      const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')
      const query = lastUserMessage?.content || ''
      return {
        content: getDemoResponse(query),
        isDemo: true,
      }
    }
  }

  private simulateDelay(): Promise<void> {
    const ms = 600 + Math.random() * 800
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const aiService = new AIService()

export const MEET_AI_SUGGESTIONS = [
  'Find tech events this weekend',
  'Who should I meet near me?',
  'Find photography communities',
  'What\'s happening in Nairobi tonight?',
  'Suggest hiking groups to join',
  'Find startup networking events',
  'Show me food events nearby',
  'Recommend creatives to connect with',
]
