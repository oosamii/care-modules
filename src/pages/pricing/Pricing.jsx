import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axiosInstance from "../../constants/axiosInstance";
import toast from "react-hot-toast";

const Pricing = () => {
  const [prices, setPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, prices]);

  const fetchPrices = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/pricing/findAll");

      if (response.data.success) {
        setPrices(response.data.data);
        setFilteredPrices(response.data.data);
      } else {
        toast.error("Failed to fetch pricing data");
      }
    } catch (error) {
      toast.error("Error loading pricing");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredPrices(prices);
      return;
    }

    const filtered = prices.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setFilteredPrices(filtered);
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 ">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pricing</h1>
            <p className="text-sm text-gray-500">View Hospital Pricing</p>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-500 mt-10">
            Loading pricing data...
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredPrices.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-2xl shadow-sm p-6"
              >
                <h3 className="font-semibold text-gray-800">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-500 mt-2">{item.description}</p>

                <div className="mt-4 text-xl font-bold text-blue-600">
                  {item.currency} {item.amount}
                </div>

                <div className="text-xs text-gray-500 mt-1">
                  Tax: {item.tax_percent}%
                </div>

                <div className="text-xs text-gray-400 mt-2">
                  Category: {item.service_category}
                </div>

                <div className="text-xs text-gray-400">Code: {item.code}</div>

                <div className="mt-5">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      item.is_active
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredPrices.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No matching pricing records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;
