import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About — Science-Led Skincare",
  description:
    "The Essence is a science-first skincare house formulated around clinical actives, transparency, and honest pricing.",
};

const PRINCIPLES = [
  {
    title: "Single-active formulas",
    body: "Each product showcases one or two evidence-backed actives at clinically meaningful concentrations — no proprietary blends, no marketing names.",
  },
  {
    title: "Disclosed in full",
    body: "Every INCI ingredient appears on our website and on the label. If we wouldn't put it on the box, we wouldn't put it in the bottle.",
  },
  {
    title: "Honest pricing",
    body: "We price by formulation cost — not by perception. Most products are €10 to €30. The packaging is intentionally minimal.",
  },
  {
    title: "Independent science",
    body: "Our formulas are reviewed by independent dermatology consultants. Every claim is referenced. We publish our ingredient sources.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="container-tight py-20 text-center">
        <p className="eyebrow">Our story</p>
        <h1 className="mt-4 font-heading text-5xl md:text-7xl">
          A clinic, not a counter.
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-secondary">
          The Essence began as a simple frustration: skincare priced like luxury,
          formulated like marketing. We rebuilt the category around evidence,
          ingredients, and transparency.
        </p>
      </section>

      <section className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=2000&q=80"
          alt="The Essence laboratory"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </section>

      <section className="container-tight py-20">
        <h2 className="font-heading text-3xl md:text-5xl">Our principles.</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <div
              key={p.title}
              className="border border-border bg-surface p-6"
            >
              <h3 className="font-heading text-2xl">{p.title}</h3>
              <p className="mt-3 text-sm text-secondary">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button asChild size="lg">
            <Link href="/products">Shop the range</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
