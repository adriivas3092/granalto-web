import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types/store";
import { cn } from "@/lib/utils";

const STYLES: Record<OrderStatus, string> = {
  pendiente: "bg-[#f4e9d8] text-[#8a6d1f]",
  pagado: "bg-[#e2ede2] text-[#3f6b41]",
  en_proceso: "bg-[#e7edf5] text-[#3a5a86]",
  enviado: "bg-[#e7edf5] text-[#3a5a86]",
  entregado: "bg-ink/10 text-ink",
  cancelado: "bg-stone-beige text-charcoal",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const label = ORDER_STATUS_LABELS[status] ?? status;
  return (
    <span className={cn("inline-block rounded-sm px-2 py-1 text-xs font-medium", STYLES[status] ?? "bg-stone-beige text-charcoal")}>
      {label}
    </span>
  );
}
