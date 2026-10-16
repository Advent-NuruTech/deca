import OrderConfirmationPage from "@/components/public/pages/OrderConfirmationPage";

export default async function Page({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  return <OrderConfirmationPage orderNumber={orderNumber} />;
}
