import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-12 h-12 border-4 border-primary border-dashed rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
