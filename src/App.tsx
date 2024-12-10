import { useState } from "react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import PaymentModal from "./components/PaymentModal";
import { processPayment, checkPaymentStatus } from "./api/payment.tsx";
import boldLogo from "/logoBold.png";
import { ShoppingCart, CreditCard } from "lucide-react";
import "./App.css";

interface Item {
  id: number;
  name: string;
  price: number;
}

const items: Item[] = [
  { id: 1, name: "Producto 1", price: 1000 },
  { id: 2, name: "Producto 2", price: 500 },
];

interface PaymentResponse {
  state: "idle" | "processing" | "success" | "error",
  subject: string
}
export default function PaymentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentResponse>({state:"idle", subject: ''});

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handlePayment = async () => {
    setIsModalOpen(true);
    setPaymentStatus({state:"processing", subject:''});
    try {
      await processPayment(total);
      startPolling();
    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentStatus({state:"error", subject:''});
    }
  };

  const startPolling = () => {
    const pollInterval = setInterval(async () => {
      try {
        const status = await checkPaymentStatus();
        if (status.state === "success") {
          setPaymentStatus(status as PaymentResponse);
          clearInterval(pollInterval);
        } else if (status.state === "error") {
          setPaymentStatus(status as PaymentResponse);
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    }, 5000);
  };

  return (
    <div className="min-h-screen container mx-auto p-16">
      <Card className="mt-16 shadow-xl shadow-gray-300 dark:shadow-gray-700 w-full max-w-md h-[50vh] backdrop-blur-sm overflow-hidden bg-white/50">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <CardTitle className="text-2xl flex items-center justify-center">
            <ShoppingCart className="mr-2" />
            Resumen de tu compra
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between py-2 border-b border-gray-200 last:border-b-0"
              >
                <span className="font-medium">{item.name}</span>
                <span className="text-green-600">${item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className='flex justify-between bg-secondary/50 rounded-b-lg p4'>
          <strong>Total:</strong>
          <strong>${total.toFixed(2)}</strong>
        </CardFooter>
      </Card>
      <div className="mt-4 flex gap-1">
        <Button onClick={handlePayment} className="w-full text-lg">
          <CreditCard className="mr-2" />
          Pagar com mi datafono
        </Button>

        <img
          src={boldLogo}
          className="logo rounded"
          alt="bold logo"
          width={40}
        />
      </div>
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        status={paymentStatus.state}
        idSubject={paymentStatus.subject}
      />
    </div>
  );
}
