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
          Avg Score: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const TopPerformersChart = ({ candidates }) => {
  const chartData = candidates.map((c) => ({
    name: c.name,
    averageScore: c.averageScore,
  }));

  return (
    <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-white">
        Top Performing Candidates
      </h2>

      {chartData.length === 0 ? (
        <p className="text-gray-500">No completed interviews yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid stroke="#091520" strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[0, 10]}
              stroke="#4b5563"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#4b5563"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#091520" }} />
            <Bar dataKey="averageScore" fill="#06b6d4" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TopPerformersChart;