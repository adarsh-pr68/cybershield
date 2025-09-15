-- Create enum types for threat management
CREATE TYPE threat_severity AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE mitigation_status AS ENUM ('unmitigated', 'in_progress', 'mitigated', 'false_positive');
CREATE TYPE threat_category AS ENUM ('malware', 'phishing', 'vulnerability', 'data_breach', 'ddos', 'insider_threat', 'ransomware', 'apt');

-- Create threats table
CREATE TABLE public.threats (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  severity threat_severity NOT NULL DEFAULT 'medium',
  category threat_category NOT NULL,
  source TEXT,
  cve_id TEXT,
  affected_systems BIGINT DEFAULT 0,
  mitigation_status mitigation_status NOT NULL DEFAULT 'unmitigated',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create threat_actors table
CREATE TABLE public.threat_actors (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  aliases TEXT,
  origin_country TEXT,
  activity_status TEXT DEFAULT 'active',
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create security_metrics table
CREATE TABLE public.security_metrics (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  metric_name TEXT NOT NULL,
  metric_value DOUBLE PRECISION NOT NULL,
  unit TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by TEXT
);

-- Create intel_feeds table
CREATE TABLE public.intel_feeds (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  feed_name TEXT NOT NULL,
  feed_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_actors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intel_feeds ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (for now, allow all authenticated users to access data)
-- You can restrict these later based on user roles
CREATE POLICY "Allow authenticated users to view threats" 
ON public.threats FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert threats" 
ON public.threats FOR INSERT 
TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update threats" 
ON public.threats FOR UPDATE 
TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete threats" 
ON public.threats FOR DELETE 
TO authenticated USING (true);

-- Similar policies for other tables
CREATE POLICY "Allow authenticated users full access to threat_actors" 
ON public.threat_actors FOR ALL 
TO authenticated USING (true);

CREATE POLICY "Allow authenticated users full access to security_metrics" 
ON public.security_metrics FOR ALL 
TO authenticated USING (true);

CREATE POLICY "Allow authenticated users full access to intel_feeds" 
ON public.intel_feeds FOR ALL 
TO authenticated USING (true);

-- Create function to automatically update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_threats_updated_at
  BEFORE UPDATE ON public.threats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.threats (title, description, severity, category, source, affected_systems, mitigation_status) VALUES
('Critical SQL Injection in Web Portal', 'SQL injection vulnerability discovered in main web portal affecting user authentication', 'critical', 'vulnerability', 'Internal Security Team', 15420, 'in_progress'),
('Phishing Campaign Targeting Employees', 'Widespread phishing campaign impersonating IT support targeting employee credentials', 'high', 'phishing', 'Security Operations Center', 89, 'unmitigated'),
('Ransomware IOCs Detected', 'Indicators of compromise for new ransomware variant detected in network traffic', 'high', 'ransomware', 'Threat Intelligence Feed', 0, 'mitigated'),
('Privilege Escalation CVE-2024-1234', 'New privilege escalation vulnerability in Windows systems', 'medium', 'vulnerability', 'CVE Database', 234, 'unmitigated');

INSERT INTO public.threat_actors (name, aliases, origin_country, activity_status) VALUES
('APT29', 'Cozy Bear, The Dukes', 'Russia', 'active'),
('Lazarus Group', 'Hidden Cobra, APT38', 'North Korea', 'active'),
('FIN7', 'Carbanak Group', 'Unknown', 'active');

INSERT INTO public.security_metrics (metric_name, metric_value, unit) VALUES
('Active Threats', 847, 'count'),
('Critical Alerts', 23, 'count'),
('Mean Time to Detection', 4.2, 'hours'),
('Security Score', 8.7, 'score');

INSERT INTO public.intel_feeds (feed_name, feed_url, is_active) VALUES
('MISP Community Feed', 'https://misp.circl.lu/events/csv/download', true),
('AlienVault OTX', 'https://otx.alienvault.com/api/v1/indicators', true),
('VirusTotal Intelligence', 'https://www.virustotal.com/vtapi/v2/', false);