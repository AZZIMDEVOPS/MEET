// MEET — Core TypeScript Types

export type AccountType = 'personal' | 'creator' | 'business' | 'organization';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  account_type: AccountType;
  is_verified: boolean;
  is_private: boolean;
  website: string | null;
  followers_count: number;
  following_count: number;
  connections_count: number;
  posts_count: number;
  created_at: string;
  updated_at: string;
}

export interface Interest {
  id: string;
  name: string;
  slug: string;
  icon: string;
  category: string;
  color: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Connection {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  content: string;
  post_type?: 'text' | 'image' | 'video' | 'audio' | 'poll';
  visibility?: 'public' | 'connections' | 'private';
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count?: number;
  created_at: string;
  updated_at?: string;
  author?: Profile;
  media?: PostMedia[];
  media_url?: string | null;
  location?: string | null;
  category?: string | null;
  tags?: string[];
  comments?: Comment[];
  is_liked?: boolean;
  is_saved?: boolean;
  event_link?: {
    id: string;
    title: string;
    date: string;
    venue: string;
  } | null;
}

export interface PostMedia {
  id: string;
  post_id: string;
  url: string;
  type: 'image' | 'video';
  order_index: number;
  alt_text: string | null;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  likes_count?: number;
  created_at: string;
  author?: Profile;
}

export type EventCategory =
  | 'music'
  | 'technology'
  | 'business'
  | 'networking'
  | 'sports'
  | 'fitness'
  | 'food'
  | 'art'
  | 'photography'
  | 'travel'
  | 'education'
  | 'gaming'
  | 'community'
  | 'entertainment'
  | 'other';

export interface Event {
  id: string;
  host_id: string;
  title: string;
  description: string;
  cover_url: string | null;
  start_date: string;
  end_date: string;
  venue_name: string;
  address: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  category: EventCategory;
  capacity: number | null;
  is_free: boolean;
  price: number | null;
  currency: string;
  is_online: boolean;
  online_url: string | null;
  attendees_count: number;
  interested_count: number;
  created_at: string;
  host?: Profile;
  is_attending?: boolean;
  is_interested?: boolean;
}

export interface Community {
  id: string;
  creator_id: string;
  name: string;
  slug: string;
  description: string;
  cover_url: string | null;
  avatar_url: string | null;
  category: string;
  is_private: boolean;
  members_count: number;
  posts_count: number;
  events_count: number;
  created_at: string;
  creator?: Profile;
  is_member?: boolean;
}

export interface Activity {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  country: string;
  participants_count: number;
  image_url: string | null;
  created_at: string;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  category: 'cafe' | 'restaurant' | 'park' | 'gallery' | 'coworking' | 'gym' | 'venue' | 'other';
  image_url: string | null;
  address: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  events_count: number;
  interested_count: number;
  created_at: string;
}

export type PostComment = Comment;

export interface Conversation {
  id: string;
  is_group: boolean;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  last_message?: Message;
  unread_count?: number;
  members?: Profile[];
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'audio';
  media_url: string | null;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
}

export type NotificationType =
  | 'new_connection'
  | 'connection_accepted'
  | 'new_follower'
  | 'event_joined'
  | 'event_invitation'
  | 'community_invitation'
  | 'post_liked'
  | 'post_commented'
  | 'post_shared'
  | 'message'
  | 'mention';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  actor_id: string | null;
  reference_id: string | null;
  reference_type: string | null;
  is_read: boolean;
  created_at: string;
  actor?: Profile;
}

export interface ReportReason {
  id: string;
  label: string;
  value: string;
}

// Adult Section
export interface AdultProfile {
  id: string;
  profile_id: string;
  bio: string | null;
  photos: string[];
  location_display: string | null;
  age: number | null;
  is_visible: boolean;
  created_at: string;
}

export interface AdultMatch {
  id: string;
  profile_a_id: string;
  profile_b_id: string;
  status: 'pending' | 'matched' | 'unmatched';
  created_at: string;
}

// Onboarding
export interface OnboardingState {
  step: number;
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  avatarUrl: string | null;
  interests: string[];
  city: string;
  country: string;
  lookingFor: string[];
}

// Discovery
export interface DiscoveryFilters {
  distance: number;
  interests: string[];
  ageMin: number;
  ageMax: number;
  dateFrom: string | null;
  dateTo: string | null;
  category: string | null;
  sortBy: 'popular' | 'new' | 'nearby';
}

// AI
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isDemo?: boolean;
}

export interface RecommendationResult<T> {
  items: T[];
  scores: number[];
  reasoning: string[];
}
