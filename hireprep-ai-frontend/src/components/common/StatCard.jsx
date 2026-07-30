const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "#06b6d4",
}) => {

  return (

    <div
      className="bg-[#060a12] border border-[#091520] rounded-xl p-5 flex flex-col gap-2"
      style={{ boxShadow: `0 0 20px ${color}10` }}
    >

      <div className="flex items-center justify-between">

        <h2 className="text-[#2d4a62] text-sm uppercase tracking-widest">
          {title}
        </h2>

        {icon && (
          <span className="text-lg" style={{ color }}>
            {icon}
          </span>
        )}

      </div>

      <p className="text-3xl font-semibold text-[#eef6ff]">
        {value}
      </p>

      {subtitle && (
        <p className="text-xs" style={{ color }}>
          {subtitle}
        </p>
      )}

    </div>

  );

};

export default StatCard;