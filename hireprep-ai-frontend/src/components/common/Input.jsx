const Input = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className="mb-4">

      {label && (
        <label className="block mb-2 text-sm font-medium text-[#5a7a90]">
          {label}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-[#05070f] border border-[#091520] rounded-lg px-3 py-2 
        text-[#eef6ff] placeholder-[#1e3348]
        focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d425]
        transition duration-200 ${className}`}
      />

    </div>
  );
};

export default Input;