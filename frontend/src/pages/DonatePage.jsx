import { useState } from "react";

const DonatePage = () => {
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    setLoading(true);
    // We'll implement Stripe/PayPal later
    alert(`Donation of $${amount} – integration coming soon.`);
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold text-center mb-6">
        Support Our Ministry
      </h1>
      <div className="bg-white shadow rounded-lg p-6">
        <label className="block mb-4">
          <span className="text-gray-700">Donation Amount ($)</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
            min="1"
          />
        </label>
        <button
          onClick={handleDonate}
          disabled={loading}
          className="w-full bg-green-600 text-gray-900 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Donate Now"}
        </button>
        <p className="text-sm text-gray-400 mt-4 text-center">
          Your gift helps us share faith, provide study materials, and support
          our community.
        </p>
      </div>
    </div>
  );
};

export default DonatePage;
