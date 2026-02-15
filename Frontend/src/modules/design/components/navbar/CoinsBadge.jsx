import { Coins } from "lucide-react";
import React from "react";

const CoinsBadge = ({ coins = 2550 }) => (
  <div className="inline-flex items-center gap-3 bg-blue-50 px-5 py-2 rounded-full">
    <div className=" rounded-full bg-orange-400 flex items-center justify-center">
      <Coins size={20} className="text-white" />
    </div>
    <span className="text-gray-700 font-semibold text-md">
      {coins.toLocaleString()} Coins
    </span>
  </div>
);


export default CoinsBadge;
