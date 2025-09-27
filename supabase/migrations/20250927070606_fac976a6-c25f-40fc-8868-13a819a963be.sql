-- Create table for storing exchange rates
CREATE TABLE public.exchange_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  rate DECIMAL(20, 8) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(from_currency, to_currency)
);

-- Enable RLS
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read exchange rates (public data)
CREATE POLICY "Exchange rates are viewable by everyone" 
ON public.exchange_rates 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_exchange_rates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_exchange_rates_updated_at
  BEFORE UPDATE ON public.exchange_rates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_exchange_rates_updated_at();

-- Insert some initial exchange rates
INSERT INTO public.exchange_rates (from_currency, to_currency, rate) VALUES
('USD', 'EUR', 0.85),
('USD', 'GBP', 0.73),
('USD', 'JPY', 110.0),
('USD', 'CNY', 6.45),
('EUR', 'USD', 1.18),
('GBP', 'USD', 1.37),
('JPY', 'USD', 0.0091),
('CNY', 'USD', 0.155)
ON CONFLICT (from_currency, to_currency) DO NOTHING;