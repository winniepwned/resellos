import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, CheckCircle2, Wand2, Tag, Globe, Check } from "lucide-react";
import { useState } from "react";
import type { ItemInsights } from "@/hooks/useItemInsights";
import { ResellScoreGauge } from "@/components/insights/ResellScoreGauge";
import { cn } from "@/lib/utils";

interface Props {
  insights: ItemInsights;
  purchasePrice: number;
  onPublish?: (platform: string, price: number) => void;
}

export function ReadyToListCard({ insights, purchasePrice, onPublish }: Props) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  
  // Publishing state
  const [platform, setPlatform] = useState("vinted");
  const [price, setPrice] = useState(insights.priceScenarios.optimal.toString());

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const calculateNetProfit = (sellPrice: number) => {
    const fees = sellPrice * 0.05;
    return (sellPrice - purchasePrice - fees).toFixed(2);
  };

  const handleFinalPublish = () => {
    if (onPublish && price) {
      onPublish(platform, parseFloat(price));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                Bereit zum Verkauf
              </CardTitle>
              <CardDescription>Die KI hat einen optimalen Text und Preise ermittelt.</CardDescription>
            </div>
            <div className="hidden sm:block scale-75 origin-right">
               <ResellScoreGauge score={insights.resellScore} size="sm" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-6 pt-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900 border-2">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Schnellverkauf</span>
                <span className="text-2xl font-bold">{insights.priceScenarios.quickSale}€</span>
                <span className="text-sm font-medium text-muted-foreground mt-1">Netto: <span className="text-green-500 font-bold">+{calculateNetProfit(insights.priceScenarios.quickSale)}€</span></span>
              </CardContent>
            </Card>
            <Card className="border-primary bg-primary/10 border-2 shadow-sm relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">Optimal</div>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                <span className="text-xs font-semibold text-primary uppercase tracking-widest mt-1">Zielpreis</span>
                <span className="text-3xl font-bold text-primary">{insights.priceScenarios.optimal}€</span>
                <span className="text-sm font-medium text-muted-foreground mt-1">Netto: <span className="text-green-500 font-bold">+{calculateNetProfit(insights.priceScenarios.optimal)}€</span></span>
              </CardContent>
            </Card>
            <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-900 border-2">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-widest">Max Profit</span>
                <span className="text-2xl font-bold">{insights.priceScenarios.maxProfit}€</span>
                <span className="text-sm font-medium text-muted-foreground mt-1">Netto: <span className="text-green-500 font-bold">+{calculateNetProfit(insights.priceScenarios.maxProfit)}€</span></span>
              </CardContent>
            </Card>
          </div>

          {/* Copy Paste Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5 group relative">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Tag className="w-3.5 h-3.5"/> Titel</label>
              <div className="relative">
                <div className="p-3 bg-muted/40 rounded-lg text-sm border font-medium pr-10">
                  {insights.listingText.title}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background backdrop-blur-sm shadow-sm"
                  onClick={() => handleCopy(insights.listingText.title, "title")}
                >
                  {copiedSection === "title" ? <CheckCircle2 className="h-4 w-4 text-green-500"/> : <Copy className="h-4 w-4 text-muted-foreground"/>}
                </Button>
              </div>
            </div>

            <div className="space-y-1.5 group relative">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Tag className="w-3.5 h-3.5"/> Beschreibung</label>
              <div className="relative">
                <div className="p-3 bg-muted/40 rounded-lg text-sm border whitespace-pre-wrap pr-10">
                  {insights.listingText.description}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background backdrop-blur-sm shadow-sm"
                  onClick={() => handleCopy(insights.listingText.description, "desc")}
                >
                  {copiedSection === "desc" ? <CheckCircle2 className="h-4 w-4 text-green-500"/> : <Copy className="h-4 w-4 text-muted-foreground"/>}
                </Button>
              </div>
            </div>

            <div className="space-y-1.5 group relative">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Tag className="w-3.5 h-3.5"/> Hashtags</label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-[10px] uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={() => handleCopy(insights.listingText.hashtags.join(" "), "tags")}
                >
                  {copiedSection === "tags" ? <CheckCircle2 className="h-3 w-3 mr-1 text-green-500"/> : <Copy className="h-3 w-3 mr-1"/>}
                  {copiedSection === "tags" ? "Kopiert" : "Alle kopieren"}
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 p-3 bg-muted/40 border rounded-lg">
                {insights.listingText.hashtags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-background border rounded-full text-xs text-primary font-medium opacity-90 hover:opacity-100 transition-opacity cursor-default">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Publishing Flow - Directly Visible */}
          <div className="pt-2 border-t mt-4 space-y-5 animate-in slide-in-from-bottom-2 fade-in duration-300">
            <h4 className="font-bold flex items-center gap-2"><Globe className="w-5 h-5 text-primary"/> Inserat Abschließen</h4>
            
            <div className="space-y-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Erfolgreich auf welcher Plattform gelistet?</label>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {["Vinted", "Kleinanzeigen"].map(p => (
                    <Button 
                      key={p} 
                      variant={platform.toLowerCase() === p.toLowerCase() ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setPlatform(p.toLowerCase())}
                      className={cn("rounded-full", platform.toLowerCase() === p.toLowerCase() && "shadow-sm")}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button 
                    variant={!["vinted", "kleinanzeigen"].includes(platform.toLowerCase()) ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setPlatform("andere")}
                    className={cn("rounded-full")}
                  >
                    Andere
                  </Button>
                </div>
                {!["vinted", "kleinanzeigen"].includes(platform.toLowerCase()) && (
                  <Input 
                    placeholder="Plattform eingeben (z.B. eBay)" 
                    value={platform === "andere" ? "" : platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="max-w-[250px] h-9"
                    autoFocus
                  />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Listenpreis festlegen</label>
                <div className="flex gap-1.5">
                  <button onClick={() => setPrice(insights.priceScenarios.quickSale.toString())} className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 hover:opacity-80 transition-opacity">⚡ {insights.priceScenarios.quickSale}€</button>
                  <button onClick={() => setPrice(insights.priceScenarios.optimal.toString())} className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary hover:opacity-80 transition-opacity">🎯 {insights.priceScenarios.optimal}€</button>
                  <button onClick={() => setPrice(insights.priceScenarios.maxProfit.toString())} className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 hover:opacity-80 transition-opacity">💎 {insights.priceScenarios.maxProfit}€</button>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">€</span>
                <Input 
                  type="number" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  className="pl-8 font-bold text-lg h-12 rounded-lg bg-background"
                />
              </div>
            </div>

            <div className="pt-2 flex">
              <Button className="w-full shadow-md text-md py-6 font-bold flex items-center gap-2" onClick={handleFinalPublish}>
                <Check className="w-5 h-5"/>
                Speichern & Online stellen
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
