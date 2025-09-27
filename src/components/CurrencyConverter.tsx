import { useState, useEffect } from "react";
import { ArrowUpDown, TrendingUp, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CurrencySelect } from "./CurrencySelect";
import { currencies, getCurrencyByCode } from "@/lib/currencies";
import { useExchangeRates } from "@/hooks/useExchangeRates";

export const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("IDR");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(0);

  const { getRate, updateRates, loading, lastUpdated } = useExchangeRates();

  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    const rate = getRate(fromCurrency, toCurrency);
    const converted = numAmount * rate;
    
    setConvertedAmount(converted);
    setExchangeRate(rate);
  }, [amount, fromCurrency, toCurrency, getRate]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const fromCurrencyData = getCurrencyByCode(fromCurrency);
  const toCurrencyData = getCurrencyByCode(toCurrency);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(num);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="bg-currency-card border-0 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Currency Converter
            </CardTitle>
            <div className="flex-1 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={updateRates}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Update Rates
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Convert between world currencies with real-time rates
          </p>
          {lastUpdated && (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2">
              <Clock className="h-3 w-3" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* From Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-currency-card-foreground">
              From
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="text-lg h-12 bg-background/50"
                />
              </div>
              <CurrencySelect
                value={fromCurrency}
                onValueChange={setFromCurrency}
                currencies={currencies}
              />
            </div>
            {fromCurrencyData && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{fromCurrencyData.flag}</span>
                <span>{fromCurrencyData.name}</span>
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={swapCurrencies}
              className="h-10 w-10 rounded-full border-2 border-currency-primary/20 hover:border-currency-primary hover:bg-currency-primary hover:text-primary-foreground transition-all duration-200"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-currency-card-foreground">
              To
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="h-12 px-3 py-2 bg-gradient-primary rounded-md flex items-center">
                  <span className="text-lg font-semibold text-primary-foreground">
                    {formatNumber(convertedAmount)}
                  </span>
                </div>
              </div>
              <CurrencySelect
                value={toCurrency}
                onValueChange={setToCurrency}
                currencies={currencies}
              />
            </div>
            {toCurrencyData && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{toCurrencyData.flag}</span>
                <span>{toCurrencyData.name}</span>
              </div>
            )}
          </div>

          {/* Exchange Rate Info */}
          <div className="bg-gradient-card rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-currency-success" />
              <span className="text-sm font-medium">Exchange Rate</span>
            </div>
            <p className="text-sm text-muted-foreground">
              1 {fromCurrency} = {formatNumber(exchangeRate)} {toCurrency}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Amount Buttons */}
      <Card className="bg-currency-card border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-currency-card-foreground mb-2 w-full">
              Quick amounts:
            </span>
            {[1, 10, 100, 1000, 10000].map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                size="sm"
                onClick={() => setAmount(quickAmount.toString())}
                className="hover:bg-currency-primary hover:text-primary-foreground border-currency-primary/20"
              >
                {quickAmount.toLocaleString()}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};