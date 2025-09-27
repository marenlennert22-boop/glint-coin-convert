import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ExchangeRate {
  from_currency: string;
  to_currency: string;
  rate: number;
  updated_at: string;
}

export const useExchangeRates = () => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch initial exchange rates
  const fetchRates = async () => {
    try {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('*');

      if (error) {
        console.error('Error fetching exchange rates:', error);
        toast({
          title: "Error",
          description: "Failed to fetch exchange rates. Using fallback data.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const ratesMap: Record<string, number> = {};
        let mostRecentUpdate: Date | null = null;

        data.forEach((rate: ExchangeRate) => {
          const key = `${rate.from_currency}-${rate.to_currency}`;
          ratesMap[key] = rate.rate;
          
          const updateTime = new Date(rate.updated_at);
          if (!mostRecentUpdate || updateTime > mostRecentUpdate) {
            mostRecentUpdate = updateTime;
          }
        });

        setRates(ratesMap);
        setLastUpdated(mostRecentUpdate);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch exchange rates. Using fallback data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update exchange rates by calling the edge function
  const updateRates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('update-exchange-rates');

      if (error) {
        console.error('Error updating exchange rates:', error);
        toast({
          title: "Update Failed",
          description: "Failed to update exchange rates from API.",
          variant: "destructive",
        });
        return;
      }

      if (data?.success) {
        toast({
          title: "Rates Updated",
          description: "Exchange rates have been updated with latest data.",
        });
        // Refresh the rates after update
        await fetchRates();
      }
    } catch (error) {
      console.error('Error updating exchange rates:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update exchange rates.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get exchange rate between two currencies
  const getRate = (fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return 1;

    // Try direct rate
    const directKey = `${fromCurrency}-${toCurrency}`;
    if (rates[directKey]) {
      return rates[directKey];
    }

    // Try reverse rate
    const reverseKey = `${toCurrency}-${fromCurrency}`;
    if (rates[reverseKey]) {
      return 1 / rates[reverseKey];
    }

    // Fallback to USD conversion
    const fromUsdKey = `USD-${fromCurrency}`;
    const toUsdKey = `USD-${toCurrency}`;
    const usdFromKey = `${fromCurrency}-USD`;
    const usdToKey = `${toCurrency}-USD`;

    let fromRate = 1;
    let toRate = 1;

    if (rates[fromUsdKey]) {
      fromRate = rates[fromUsdKey];
    } else if (rates[usdFromKey]) {
      fromRate = 1 / rates[usdFromKey];
    }

    if (rates[toUsdKey]) {
      toRate = rates[toUsdKey];
    } else if (rates[usdToKey]) {
      toRate = 1 / rates[usdToKey];
    }

    return toRate / fromRate;
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchRates();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('exchange-rates-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'exchange_rates'
        },
        (payload) => {
          console.log('Exchange rate change received:', payload);
          fetchRates(); // Refresh rates when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    rates,
    loading,
    lastUpdated,
    getRate,
    updateRates,
    fetchRates
  };
};