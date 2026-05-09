import { HeroSection } from "@/components/home/HeroSection";
import { BestSellers } from "@/components/home/BestSellers";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ConcernsFinder } from "@/components/home/ConcernsFinder";
import { FeaturedProduct } from "@/components/home/FeaturedProduct";
import { ReviewsBanner } from "@/components/home/ReviewsBanner";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata = {
  title: "The Essence — Science-Led Skincare. Honest Pricing.",
  description:
    "Single-active formulas, transparent ingredient lists, and pricing that respects you. Skincare without the theatre.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BestSellers />
      <CategoryGrid />
      <ConcernsFinder />
      <FeaturedProduct />
      <ReviewsBanner />
      <NewsletterSection />
    </>
  );
}
