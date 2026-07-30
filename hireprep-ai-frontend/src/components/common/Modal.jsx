const Modal = ({
  isOpen,
  title,
  children,
  onClose,
}) => {

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm">

      <div className="bg-[#060a12] border border-[#091520] rounded-xl shadow-lg p-6 w-full max-w-lg"
        style={{ boxShadow: "0 0 40px #06b6d415" }}
      >

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-lg font-semibold text-[#eef6ff]">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-[#2d4a62] hover:text-[#f87171] text-xl transition duration-200"
          >
            ✕
          </button>

        </div>

        {children}

      </div>

    </div>

  );
};

export default Modal;