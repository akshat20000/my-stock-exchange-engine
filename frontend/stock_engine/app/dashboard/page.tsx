import AuthGuard from "@/Components/AuthGuard";
import Navbar from "@/Components/Navbar";
import TradeFeed from "@/Components/TradeFeed";
import OrderForm from "@/Components/OrderForm";

export default function Dashboard() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
        <Navbar />
        
        <main className="container mx-auto p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            Trading Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Column 1: The Order Form */}
            <div>
              <OrderForm />
            </div>

            {/* Column 2: The Trade Feed */}
            <div>
              <TradeFeed />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}