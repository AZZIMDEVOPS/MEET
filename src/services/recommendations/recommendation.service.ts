/**
 * MEET Recommendation Service
 * Provides people, event, community, and activity recommendations.
 * Currently uses demo data — will connect to ML service in production.
 */

import type { Profile, Event, Community, Activity } from '@/types'
import { DEMO_PROFILES, DEMO_EVENTS, DEMO_COMMUNITIES, DEMO_ACTIVITIES } from '@/lib/demo-data'

export interface RecommendationResult<T> {
  items: T[]
  scores: number[]
  reasoning: string[]
}

class RecommendationService {
  /**
   * Get recommended people based on user profile
   */
  async getPeopleRecommendations(
    userId?: string,
    userInterests?: string[],
    userCity?: string,
    limit = 10
  ): Promise<RecommendationResult<Profile>> {
    // In production: call ML recommendation API
    // For now: return scored demo data
    const profiles = DEMO_PROFILES.slice(0, limit)
    return {
      items: profiles,
      scores: profiles.map(() => Math.random() * 0.3 + 0.7),
      reasoning: profiles.map(() => 'Shared interests & location'),
    }
  }

  /**
   * Get recommended events
   */
  async getEventRecommendations(
    userId?: string,
    userInterests?: string[],
    userCity?: string,
    limit = 10
  ): Promise<RecommendationResult<Event>> {
    const events = DEMO_EVENTS.slice(0, limit)
    return {
      items: events,
      scores: events.map(() => Math.random() * 0.3 + 0.7),
      reasoning: events.map(() => 'Matches your interests'),
    }
  }

  /**
   * Get recommended communities
   */
  async getCommunityRecommendations(
    userId?: string,
    userInterests?: string[],
    limit = 6
  ): Promise<RecommendationResult<Community>> {
    const communities = DEMO_COMMUNITIES.slice(0, limit)
    return {
      items: communities,
      scores: communities.map(() => Math.random() * 0.3 + 0.7),
      reasoning: communities.map(() => 'Popular in your area'),
    }
  }

  /**
   * Get recommended activities
   */
  async getActivityRecommendations(
    userId?: string,
    userInterests?: string[],
    limit = 6
  ): Promise<RecommendationResult<Activity>> {
    const activities = DEMO_ACTIVITIES.slice(0, limit)
    return {
      items: activities,
      scores: activities.map(() => Math.random() * 0.3 + 0.7),
      reasoning: activities.map(() => 'Based on your profile'),
    }
  }

  /**
   * Score calculation for recommendations
   * Production implementation would use:
   * - Cosine similarity on interest vectors
   * - Geographic proximity scoring
   * - Social graph overlap (mutual connections)
   * - Activity/engagement history
   * - Collaborative filtering
   */
  private calculateScore(params: {
    sharedInterests: number
    distanceKm: number
    mutualConnections: number
    activityScore: number
  }): number {
    const interestWeight = 0.4
    const locationWeight = 0.25
    const socialWeight = 0.2
    const activityWeight = 0.15

    const interestScore = Math.min(params.sharedInterests / 5, 1) * interestWeight
    const locationScore = Math.max(0, 1 - params.distanceKm / 100) * locationWeight
    const socialScore = Math.min(params.mutualConnections / 10, 1) * socialWeight
    const activityScore = params.activityScore * activityWeight

    return interestScore + locationScore + socialScore + activityScore
  }
}

export const recommendationService = new RecommendationService()
