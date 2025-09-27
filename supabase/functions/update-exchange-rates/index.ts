import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting exchange rates update...');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get API key from secrets
    const exchangeApiKey = Deno.env.get('EXCHANGE_RATES_API_KEY');
    
    if (!exchangeApiKey) {
      throw new Error('EXCHANGE_RATES_API_KEY not found in environment variables');
    }

    console.log('Fetching exchange rates from API...');

    // Fetch real-time exchange rates from exchangerate-api.com
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${exchangeApiKey}/latest/USD`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.conversion_rates) {
      throw new Error('Invalid API response: missing conversion_rates');
    }

    console.log('Processing exchange rates...');

    const rates = data.conversion_rates;
    const upsertPromises = [];

    // Update rates with USD as base currency
    for (const [currency, rate] of Object.entries(rates)) {
      if (currency !== 'USD') {
        upsertPromises.push(
          supabase
            .from('exchange_rates')
            .upsert({
              from_currency: 'USD',
              to_currency: currency,
              rate: rate,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'from_currency,to_currency'
            })
        );

        // Also add reverse rate (e.g., EUR to USD)
        upsertPromises.push(
          supabase
            .from('exchange_rates')
            .upsert({
              from_currency: currency,
              to_currency: 'USD',
              rate: 1 / Number(rate),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'from_currency,to_currency'
            })
        );
      }
    }

    console.log(`Upserting ${upsertPromises.length} exchange rates...`);

    // Execute all upserts in parallel
    const results = await Promise.allSettled(upsertPromises);
    
    const failed = results.filter(result => result.status === 'rejected');
    if (failed.length > 0) {
      console.error('Some upserts failed:', failed);
    }

    const successful = results.filter(result => result.status === 'fulfilled').length;
    console.log(`Successfully updated ${successful} exchange rates`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Updated ${successful} exchange rates`,
        updatedAt: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error updating exchange rates:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});