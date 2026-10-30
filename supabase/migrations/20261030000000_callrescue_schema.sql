-- CallRescue: Multi-Tenant 4-Second Missed-Call SMS Auto-Responder & Speed-to-Lead SaaS
-- PostgreSQL Database Schema with Row-Level Security (RLS)

-- 1. Agencies Table (Platform licensing subscriber)
CREATE TABLE IF NOT EXISTS agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_name TEXT NOT NULL DEFAULT 'Vanguard Growth Media',
  custom_domain TEXT DEFAULT 'rescue.vanguardgrowth.io',
  brand_color TEXT NOT NULL DEFAULT '#f59e0b',
  contact_email TEXT NOT NULL DEFAULT 'operations@vanguardgrowth.io',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Client Accounts (Local clinics & home service businesses)
CREATE TABLE IF NOT EXISTS client_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  forward_number TEXT NOT NULL,
  tracking_number TEXT NOT NULL,
  monthly_retainer NUMERIC(10, 2) NOT NULL DEFAULT 199.00,
  missed_calls_month INTEGER NOT NULL DEFAULT 0,
  leads_rescued_month INTEGER NOT NULL DEFAULT 0,
  avg_rescue_seconds NUMERIC(4, 2) NOT NULL DEFAULT 3.4,
  estimated_pipeline_saved NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'warning', 'paused')),
  card_brand TEXT DEFAULT 'Visa',
  card_last4 TEXT DEFAULT '4242',
  next_billing TEXT DEFAULT 'Nov 1, 2026',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Call Logs (Real-time call radar events)
CREATE TABLE IF NOT EXISTS call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  caller_name TEXT NOT NULL,
  caller_number TEXT NOT NULL,
  call_status TEXT NOT NULL CHECK (call_status IN ('rescued', 'pending_reply', 'missed', 'escalated')),
  latency_seconds NUMERIC(4, 2) NOT NULL DEFAULT 3.2,
  estimated_value NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. SMS Threads & Two-Way Conversations
CREATE TABLE IF NOT EXISTS sms_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  caller_number TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('lead', 'bot', 'staff')),
  staff_name TEXT,
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Automations & Auto-Responder Rules
CREATE TABLE IF NOT EXISTS automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  instant_sms_template TEXT NOT NULL,
  typing_delay_seconds INTEGER NOT NULL DEFAULT 4,
  enable_webchat_widget BOOLEAN NOT NULL DEFAULT true,
  keyword_escalation TEXT NOT NULL DEFAULT 'emergency',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Integrations & Hardware Routing
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  twilio_account_sid TEXT,
  twilio_sender_number TEXT,
  carrier_forwarding_code TEXT DEFAULT '*71',
  crm_target TEXT DEFAULT 'Dentrix / Jobber Webhook',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row-Level Security (RLS)
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Public RLS Policies
CREATE POLICY "Public read for active client accounts"
  ON client_accounts FOR SELECT
  USING (true);

CREATE POLICY "Public insert for call logs"
  ON call_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public read/write for sms threads"
  ON sms_threads FOR ALL
  USING (true)
  WITH CHECK (true);
