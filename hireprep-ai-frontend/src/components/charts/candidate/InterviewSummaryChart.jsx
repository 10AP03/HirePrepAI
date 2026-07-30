import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#060a12] border border-[#091520] rounded p-3 shadow-lg">
        <p className="text-gray-400 text-sm mb-1">{label}</p>
        <p className="text-cyan-400 font-semibold">
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const InterviewSummaryChart = ({ totalInterviews, completedInterviews }) => {
  const chartData = [
    { name: "Total", value: totalInterviews },
    { name: "Completed", value: completedInterviews },
  ];

  return (
    <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-white">
        Interview Summary
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid stroke="#091520" strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            stroke="#4b5563"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <YAxis
            allowDecimals={false}
            stroke="#4b5563"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#091520" }} />
          <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InterviewSummaryChart;