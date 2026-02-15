import React, { useEffect, useState } from 'react';

const LastUpdated = () => {
  const [lastUpdated] = useState(new Date()); // only set ONCE
  const [timeAgo, setTimeAgo] = useState("Just now");

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const diffMs = now - lastUpdated;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHr = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHr / 24);

      if (diffMin < 1) setTimeAgo("Just now");
      else if (diffMin < 60) setTimeAgo(`${diffMin} minute${diffMin > 1 ? "s" : ""} ago`);
      else if (diffHr < 24) setTimeAgo(`${diffHr} hour${diffHr > 1 ? "s" : ""} ago`);
      else setTimeAgo(`${diffDay} day${diffDay > 1 ? "s" : ""} ago`);
    };

    updateTimeAgo(); // run once
    const interval = setInterval(updateTimeAgo, 60000); // update every minute

    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <span className="text-xs text-gray-500">
      Updated: <span className="ml-1 font-medium text-gray-600">{timeAgo}</span>
    </span>
  );
};

export default LastUpdated;
