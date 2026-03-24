export interface Item {
  id: string;
  user_id: string;
  title: string;
  brand: string;
  category: string | null;
  size: string | null;
  condition: string;
  color: string | null;
  purchase_price_ek: number;
  target_price: number | null;
  sold_price: number | null;
  status: ItemStatus;
  platform: string | null;
  notes: string | null;
  images: string[];
  listed_at: string | null;
  sold_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ItemStatus =
  | "draft"
  | "analyzing"
  | "ready"
  | "listed"
  | "sold"
  | "archived";

export interface ItemListResponse {
  items: Item[];
  next_cursor: string | null;
}

export interface AiInsight {
  id: string;
  item_id: string;
  resell_score: number | null;
  suggested_price_low: number | null;
  suggested_price_optimal: number | null;
  suggested_price_high: number | null;
  generated_title: string | null;
  generated_description: string | null;
  generated_hashtags: string | null;
  market_reasoning: string | null;
  competitor_count: number | null;
  avg_market_price: number | null;
  demand_level: string | null;
  analyzed_at: string | null;
}

export interface SourcingResult {
  id: string;
  task_id: string;
  status: string;
  input_keyword: string | null;
  detected_brand: string | null;
  detected_category: string | null;
  resell_score: number | null;
  estimated_profit_low: number | null;
  estimated_profit_high: number | null;
  market_reasoning: string | null;
  recommendation: "buy" | "skip" | "risky" | null;
  pipeline_steps: Record<string, unknown> | null;
  created_at: string;
  completed_at: string | null;
}

export interface AnalyticsOverview {
  total_profit: number;
  total_revenue: number;
  total_investment: number;
  roi_percent: number;
  avg_profit_per_item: number;
  items_sold: number;
  items_active: number;
}

export interface InventoryHealth {
  total_items: number;
  total_capital_invested: number;
  expected_revenue: number;
  expected_profit: number;
  items_by_status: Record<string, number>;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  item_id: string | null;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

export interface ConsentRecord {
  id: string;
  purpose: string;
  granted: boolean;
  granted_at: string | null;
  revoked_at: string | null;
  created_at: string;
}
