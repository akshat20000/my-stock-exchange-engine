import TradeFeed from "@/Components/TradeFeed";
import OrderForm from "@/Components/OrderForm"; 

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Real-Time Stock Exchange Feed
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
  );
}