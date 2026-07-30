const Loader = ({
  text = "Loading...",
  fullScreen = true,
}) => {

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#05070f]">
        <div className="text-center">

          <div
            className="w-12 h-12 border-4 border-[#06b6d4] border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ boxShadow: "0 0 16px #06b6d440" }}
          ></div>

          <p className="text-[#5a7a90] font-medium">
            {text}
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-6">

      <div
        className="w-8 h-8 border-4 border-[#06b6d4] border-t-transparent rounded-full animate-spin mr-3"
        style={{ boxShadow: "0 0 12px #06b6d435" }}
      ></div>

      <span className="text-[#5a7a90]">
        {text}
      </span>

    </div>
  );
};

export default Loader;