import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface ItemInsights {
  suggestedPrice: number;
  priceScenarios: {
    quickSale: number;
    optimal: number;
    maxProfit: number;
  };
  listingText: {
    title: string;
    description: string;
    hashtags: string[];
  };
  targetPlatforms: string[];
  resellScore: number;
}

export function useItemInsights(itemId: string | null) {
  return useQuery({
    queryKey: ["item", itemId, "insights"],
    queryFn: async () => {
      // Mocked insights returning immediately, since backend needs celery setup
      return null;
    },
    enabled: !!itemId,
  });
}

export function useGenerateInsights() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ itemId, brand, category }: { itemId: string; brand: string; category: string }): Promise<ItemInsights> => {
      // Simulate real Perplexity API call latency
      console.log(`Generating insights for item: ${itemId}`);
      await new Promise((resolve) => setTimeout(resolve, 4500));
      
      const suggestedPrice = 65.00;
      
      return {
        suggestedPrice,
        priceScenarios: {
          quickSale: 45.00,
          optimal: suggestedPrice,
          maxProfit: 85.00,
        },
        listingText: {
          title: `${brand} Vintage ${category} - Top Zustand`,
          description: `Biete hier einen wunderschönen ${brand} ${category} an. \n\nZustand ist sehr gut, kaum getragen. Bei Fragen gerne melden!\n\nDa Privatverkauf keine Rücknahme.`,
          hashtags: ["#vintage", `#${brand.toLowerCase().replace(/\s/g, '')}`, "#secondhand", "#streetwear"],
        },
        targetPlatforms: ["vinted", "kleinanzeigen"],
        resellScore: 82,
      };
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["item", variables.itemId, "insights"], data);
    },
  });
}
