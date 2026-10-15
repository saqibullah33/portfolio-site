export interface EventMedia {
  id: number;
  event_id: number;
  url: string;
  type: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface PortfolioEvent {
  id: number;
  title: string;
  event_date: string | null;
  date_label: string;
  location: string;
  url: string;
  registered: number;
  checked_in: number | null;
  avg_rating: number | null;
  rating_count: number | null;
  feedback: string | null;
  status: "upcoming" | "past";
  cover_image: string | null;
  description: string | null;
  embed_url: string | null;
  x_post_url: string | null;
  created_at: string;
  media?: EventMedia[];
}

export interface EventInput {
  title: string;
  event_date?: string | null;
  date_label?: string;
  location?: string;
  url?: string;
  registered?: number;
  checked_in?: number | null;
  avg_rating?: number | null;
  rating_count?: number | null;
  feedback?: string | null;
  status?: string;
  cover_image?: string | null;
  description?: string | null;
  embed_url?: string | null;
  x_post_url?: string | null;
}
