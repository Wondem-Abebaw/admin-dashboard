import React from "react";

interface SpinProps {
  loading?: boolean;
  children?: React.ReactNode;
}

const Spinner: React.FC<SpinProps> = ({ loading, children }) => {
  // If no children are provided and no loading prop, just render the spinner
  if (loading === undefined && !children) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      {children && (
        <div className={loading ? "opacity-80" : ""}>{children}</div>
      )}
    </div>
  );
};

export default Spinner;
