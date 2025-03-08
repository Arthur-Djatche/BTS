export function Button({ children, className, ...props }) {
    return (
      <button
        className={`px-4 py-2 rounded-lg text-white font-bold ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
  