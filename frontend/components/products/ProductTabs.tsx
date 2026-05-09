"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProductDetail } from "@/lib/types";

export function ProductTabs({ product }: { product: ProductDetail }) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="ingredients">Full ingredients</TabsTrigger>
        <TabsTrigger value="how-to-use">How to use</TabsTrigger>
      </TabsList>
      <TabsContent value="description">
        <div className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-foreground/85">
          {product.description}
        </div>
      </TabsContent>
      <TabsContent value="ingredients">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.18em] text-secondary">
            INCI list
          </p>
          <p className="font-mono text-sm leading-relaxed text-foreground/80">
            {product.ingredients}
          </p>
        </div>
      </TabsContent>
      <TabsContent value="how-to-use">
        <div className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-foreground/85">
          {product.how_to_use ||
            "Apply morning and evening to clean, dry skin. Layer light textures first; follow with a moisturizer. Always wear SPF 30+ during the day."}
        </div>
      </TabsContent>
    </Tabs>
  );
}
