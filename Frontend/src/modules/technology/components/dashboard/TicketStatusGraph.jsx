import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const TicketStatusTrend = ({ data }) => {
  return (
    <Card className="rounded-xl shadow-md bg-white">
      <CardContent className="p-4">
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          Tickets Status Trend (Last 7 Days)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Open" stackId="a" fill="#f87171" name="Open" />
            <Bar dataKey="InProgress" stackId="a" fill="#facc15" name="In-Progress" />
            <Bar dataKey="Resolved" stackId="a" fill="#4ade80" name="Resolved" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TicketStatusTrend;
