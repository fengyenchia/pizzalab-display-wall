import type { ComponentProps } from "react";
import { Card } from "@/components/Card";

type CardItem = ComponentProps<typeof Card>;

type CardGridProps = {
  items: CardItem[];
};

export function CardGrid({ items }: CardGridProps) {
  return (
    <section className="grid grid-cols-1 place-items-start justify-center gap-x-8 gap-y-14 py-2 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <Card key={`${item.id ?? "session"}-${index}`} {...item} />
      ))}
    </section>
  );
}
