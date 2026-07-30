const Button = ({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-semibold transition duration-200
      ${
        disabled
          ? "bg-[#0f1628] text-[#2d4a62] cursor-not-allowed border border-[#091520]"
          : "bg-[#06b6d4] hover:bg-[#22d3ee] text-[#020d14] shadow-[0_0_18px_#06b6d440]"
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;