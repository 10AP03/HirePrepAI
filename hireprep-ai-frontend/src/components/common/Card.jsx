const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-[#060a12] border border-[#091520] rounded-xl p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;