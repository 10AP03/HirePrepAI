import {
  LineChart,
  Line,
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
          Score: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const ScoreTrendChart = ({ data }) => {
  const chartData = data.map((item) => ({
    name: `${item.subject} - ${item.topic}`,
    score: item.overallScore,
    date: new Date(item.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-white">
        Score Trend
      </h2>

      {chartData.length === 0 ? (
        <p className="text-gray-500">No performance data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#091520" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              stroke="#4b5563"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis
              domain={[0, 10]}
              stroke="#4b5563"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ fill: "#06b6d4", r: 4 }}
              activeDot={{ r: 6, fill: "#22d3ee" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ScoreTrendChart;