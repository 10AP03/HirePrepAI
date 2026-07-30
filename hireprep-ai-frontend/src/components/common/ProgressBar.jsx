const ProgressBar = ({ value }) => {

  const getColor = () => {
    if (value >= 75) return { bar: "#06b6d4", glow: "#06b6d435" };
    if (value >= 50) return { bar: "#3b82f6", glow: "#3b82f635" };
    if (value >= 30) return { bar: "#fb923c", glow: "#fb923c35" };
    return { bar: "#f87171", glow: "#f8717135" };
  };

  const { bar, glow } = getColor();

  return (

    <div className="w-full bg-[#05070f] border border-[#091520] rounded-full h-2">

      <div
        className="h-2 rounded-full transition-all duration-500"
        style={{
          width: `${value}%`,
          background: bar,
          boxShadow: `0 0 8px ${glow}`,
        }}
      ></div>

    </div>

  );

};

export default ProgressBar;