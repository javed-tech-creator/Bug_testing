import { useEffect, useState } from "react";
import { ClockIcon, MapPinIcon, DocumentCheckIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import {PencilRuler} from 'lucide-react'
function useDashboardCardData() {
  const [isLoading, setIsLoading] = useState(true);
  const [CardsData, setCardsData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setCardsData([
        {
          icon: MapPinIcon,
          title: "Sites Surveyed",
          value: "127",
          color: "bg-gradient-to-r from-green-900 to-green-700 ",
          footer: {
            color: "text-green-500",
            value: "+8",
            label: "this month"
          }
        },
        {
          icon: DocumentCheckIcon,
          title: "Reports Pending",
          value: "23",
          color: "bg-gradient-to-r from-orange-900 to-orange-700",
          footer: {
            color: "text-orange-500",
            value: "15%",
            label: "completion rate"
          }
        },
        {
          icon: PencilRuler,
          title: "Measurements Done",
          value: "847",
          color: "bg-gradient-to-r from-blue-900 to-blue-700",
          footer: {
            color: "text-blue-500",
            value: "+12%",
            label: "accuracy rate"
          }
        },
        {
          icon: UserGroupIcon,
          title: "Field Teams",
          value: "8",
          color: "bg-gradient-to-r from-purple-900 to-purple-700",
          footer: {
            color: "text-green-500",
            value: "7 active",
            label: "teams deployed"
          }
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return { CardsData, isLoading, error };
}

export default useDashboardCardData