import TradeFeed from "@/Components/TradeFeed";

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Real-Time Stock Exchange Feed
      </h1>
      
      {/* This is your component */}
      <TradeFeed />
    </main>
  );
}