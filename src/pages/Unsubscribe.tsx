import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

type Status = 'loading' | 'valid' | 'already_unsubscribed' | 'invalid' | 'success' | 'error';

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    if (!token) { setStatus('invalid'); return; }
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    fetch(`${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`, {
      headers: { apikey: anonKey },
    })
      .then(r => r.json())
      .then(data => {
        if (data.valid === false && data.reason === 'already_unsubscribed') setStatus('already_unsubscribed');
        else if (data.valid) setStatus('valid');
        else setStatus('invalid');
      })
      .catch(() => setStatus('invalid'));
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;
    try {
      const { data, error } = await supabase.functions.invoke('handle-email-unsubscribe', { body: { token } });
      if (error) throw error;
      if (data?.success) setStatus('success');
      else if (data?.reason === 'already_unsubscribed') setStatus('already_unsubscribed');
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="font-display text-2xl text-gold tracking-wider">LUX TOUR TRAVEL</h1>
        <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent" />

        {status === 'loading' && <p className="text-muted-foreground">Verifying…</p>}

        {status === 'valid' && (
          <div className="space-y-4">
            <p className="text-foreground">Are you sure you want to unsubscribe from email notifications?</p>
            <button onClick={handleUnsubscribe}
              className="px-6 py-3 bg-gradient-to-br from-[hsl(var(--gold-dark))] to-[hsl(var(--gold))] text-primary-foreground rounded font-semibold tracking-wider text-sm hover:opacity-90 transition-opacity">
              Confirm Unsubscribe
            </button>
          </div>
        )}

        {status === 'success' && (
          <p className="text-foreground">You have been successfully unsubscribed. You will no longer receive email notifications.</p>
        )}

        {status === 'already_unsubscribed' && (
          <p className="text-muted-foreground">You have already been unsubscribed from these emails.</p>
        )}

        {status === 'invalid' && (
          <p className="text-destructive">Invalid or expired unsubscribe link.</p>
        )}

        {status === 'error' && (
          <p className="text-destructive">Something went wrong. Please try again later.</p>
        )}
      </div>
    </div>
  );
}
