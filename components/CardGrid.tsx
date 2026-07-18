import type { ComponentProps } from "react";
import { Card } from "@/components/Card";

type CardItem = ComponentProps<typeof Card>;

type CardGridProps = {
  items: CardItem[];
};

export function CardGrid({ items }: CardGridProps) {
  return (
    <section className="grid grid-cols-1 gap-x-8 gap-y-14 px-4 py-2 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.slug} {...item} />
      ))}
    </section>
  );
}
