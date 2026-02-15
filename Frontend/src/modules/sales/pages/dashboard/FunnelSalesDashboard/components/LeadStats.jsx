import { FaChartBar, FaFileAlt } from "react-icons/fa";
import { FaArrowTrendUp, FaChartLine } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { MdCurrencyRupee } from "react-icons/md";

const LeadStats = () => {
  const stats = [
    {
      icon: <FaChartBar />,
      value: "10k",
      title: "Assigned Leads",
      change: "+8% from yesterday",
      bg: "bg-purple-100",
      iconBg: "bg-purple-600",
    },
    {
      icon: <FaFileAlt />,
      value: "3000",
      title: "Qualified Leads",
      change: "+5% from yesterday",
      bg: "bg-blue-100",
      iconBg: "bg-blue-600",
    },
    {
      icon: <FaArrowTrendUp />,
      value: "59.3%",
      title: "Conversion Rate",
      change: "+1.2% from yesterday",
      bg: "bg-yellow-100",
      iconBg: "bg-orange-400",
    },
    {
      icon: <FaChartLine />,
      value: "800",
      title: "Lost Leads",
      change: "0.5% from yesterday",
      bg: "bg-pink-100",
      iconBg: "bg-pink-500",
    },
    {
      icon: <MdCurrencyRupee />,
      value: "₹1.2L",
      title: "Expect. Incentive",
      change: "+5% from yesterday",
      bg: "bg-green-100",
      iconBg: "bg-green-500",
    },
    {
      icon: <GiMoneyStack />,
      value: "₹50.7L",
      title: "Total Revenue",
      change: "+5% from yesterday",
      bg: "bg-indigo-100",
      iconBg: "bg-blue-600",
    },
  ];

  return (
    <div className="w-full bg-white border rounded-xl shadow-sm p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`${item.bg} px-5 py-3 rounded-xl flex flex-col gap-2 min-h-[140px}`}
          >
            <div
              className={`${item.iconBg} text-white p-3 rounded-full text-2xl w-fit`}
            >
              {item.icon}
            </div>

            <h2 className="text-3xl font-bold text-gray-900">{item.value}</h2>

            <p className="text-lg text-gray-800 font-medium leading-tight">
              {item.title}
            </p>

            <span className="text-blue-600 text-sm font-medium">
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadStats;
