import React, { useEffect, useState } from "react";

export const LiveClock = React.memo(({ size = "xs", colorvalue = 600 }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const weekDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
       const day = weekDays[now.getDay()];

      // const day = now.toLocaleDateString("en-IN", {
      //   weekday: "long",
      // });

      const date = now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setTime(`${day}, ${date} • ${time}`);
    };

    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <span className={`text-${size} text-gray-${colorvalue} whitespace-nowrap`}>
      {time}
    </span>
  );
});
