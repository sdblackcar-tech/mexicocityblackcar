CREATE TABLE public.booking_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  service_type TEXT NOT NULL DEFAULT 'transfer',
  vehicle_type TEXT,
  pickup_location TEXT,
  dropoff_location TEXT,
  requested_date TEXT,
  requested_time TEXT,
  hours NUMERIC,
  miles NUMERIC,
  greeters INTEGER DEFAULT 0,
  extra_stops INTEGER DEFAULT 0,
  quoted_total NUMERIC,
  conversation_summary TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  lang TEXT DEFAULT 'en'
);

ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.booking_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated reads" ON public.booking_requests
  FOR SELECT TO authenticated
  USING (true);