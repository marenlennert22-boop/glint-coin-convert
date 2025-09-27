import { CurrencyConverter } from "@/components/CurrencyConverter";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Currency Exchange
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Convert between world currencies with real-time exchange rates. 
            Fast, accurate, and completely free.
          </p>
        </div>
        
        <CurrencyConverter />
      </div>
    </div>
  );
};

export default Index;
