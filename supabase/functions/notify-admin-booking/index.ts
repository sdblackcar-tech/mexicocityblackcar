import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      guest_name, guest_email, guest_phone,
      service_type, vehicle_type,
      pickup_location, dropoff_location,
      requested_date, requested_time,
      hours, miles, greeters, extra_stops,
      quoted_total, conversation_summary, lang,
    } = body;

    if (!service_type) {
      return new Response(
        JSON.stringify({ error: 'service_type is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Save to database
    const { data: inserted, error: dbError } = await supabase
      .from('booking_requests')
      .insert({
        guest_name, guest_email, guest_phone,
        service_type, vehicle_type,
        pickup_location, dropoff_location,
        requested_date, requested_time,
        hours, miles, greeters: greeters || 0, extra_stops: extra_stops || 0,
        quoted_total, conversation_summary, lang: lang || 'en',
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('DB insert error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save booking request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Booking request saved: ${inserted.id}`);

    // 2. Send admin notification email via transactional email system
    const { error: emailError } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'admin-booking-notification',
        idempotencyKey: `admin-booking-${inserted.id}`,
        templateData: {
          guest_name, guest_email, guest_phone,
          service_type, vehicle_type,
          pickup_location, dropoff_location,
          requested_date, requested_time,
          hours, miles, quoted_total,
          conversation_summary: conversation_summary?.slice(0, 800),
        },
      },
    });

    if (emailError) {
      console.warn('Admin email notification failed (non-fatal):', emailError);
    } else {
      console.log('Admin email notification queued');
    }

    return new Response(
      JSON.stringify({ success: true, id: inserted.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Notify admin error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
