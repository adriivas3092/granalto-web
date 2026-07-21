import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CheckoutForm } from "@/components/store/CheckoutForm";
import { getSessionUser, getMyProfile } from "@/lib/store/account";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const metadata = buildMetadata({
  title: "Finalizar compra",
  description: "Complete sus datos para confirmar el pedido en Granalto.",
  path: "/checkout",
});

export default async function CheckoutPage() {
  const user = await getSessionUser();
  if (!user) redirect("/cuenta/login?next=/checkout");
  const profile = await getMyProfile();

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6 lg:pt-36">
      <Breadcrumbs
        items={[
          { name: "Carrito", path: "/carrito" },
          { name: "Finalizar compra", path: "/checkout" },
        ]}
      />
      <h1 className="mb-8 mt-3 text-3xl md:text-4xl">Finalizar compra</h1>
      <CheckoutForm
        email={user.email ?? ""}
        defaultName={profile?.full_name ?? ""}
        defaultPhone={profile?.phone ?? ""}
        defaultAddress={profile?.address ?? ""}
      />
    </div>
  );
}
