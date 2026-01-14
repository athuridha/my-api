import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin' | 'owner';
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Property = {
  id: string;
  title: string;
  url: string;
  price: string;
  price_numeric: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  building_area: number | null;
  location: string;
  posting_date: string;
  image_url: string;
  mode: 'jual' | 'sewa';
  slug: string;
  prop_type: string | null;
  scraped_at: string;
  created_at: string;
};

export type ApiKey = {
  id: string;
  key: string;
  name: string;
  user_id: string;
  user_email: string;
  requests_count: number;
  requests_limit: number;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
};

export type RequestLog = {
  id: string;
  api_key_id: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number;
  ip_address: string;
  user_agent: string;
  created_at: string;
};
