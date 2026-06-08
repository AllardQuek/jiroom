import { Suspense } from "react";
import { ListingsPageInner } from "./ListingsPageInner";

export default function ListingsPage() {
  return (
    <Suspense>
      <ListingsPageInner />
    </Suspense>
  );
}
