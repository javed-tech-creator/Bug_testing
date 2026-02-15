import { useSelector } from "react-redux";
import { useGetSalesEmployeeDashboardCardQuery } from "../../../api/sales/dashboard.sales.api";
import { CalendarDaysIcon, ClockIcon, InboxStackIcon, TrophyIcon } from "@heroicons/react/24/solid";

const useCardsData = () => {
 const res = useSelector((state) => state.auth.userData);
 const user = res?.user || {}
 const id = user?._id || null
  const { data, isLoading, error } = useGetSalesEmployeeDashboardCardQuery(
    { id },
    { skip: !id }
  );


  const CardsData = [
    {
      color: "gray",
      icon: InboxStackIcon,
      title: "Total Leads",
      value: data?.data?.result?.totalLead ?? "-",
      footer: {
        color: "text-green-500",
        value: "+55%",
        label: "than last month",
      },
    },
    {
      color: "gray",
      icon: ClockIcon,
      title: "Pending Leads",
      value: data?.data?.result?.ThisMonthPendingLead ?? "-",
      footer: {
        color: "text-green-500",
        value: "+3%",
        label: "than last month",
      },
    },
    {
      color: "gray",
      icon: CalendarDaysIcon,
      title: "This Month Leads",
      value: data?.data?.result?.thisMonthLead ?? "-",
      footer: {
        color: "text-red-500",
        value: "-2%",
        label: "Than Last Month",
      },
    },
    {
      color: "gray",
      icon: TrophyIcon,
      title: "Win Projects",
      value: data?.data?.result?.recceProjectWine ?? "-",
      footer: {
        color: "text-green-500",
        value: "+5%",
        label: "Than Last Month",
      },
    },
  ];

  return { CardsData, isLoading, error };
};

export default useCardsData;
