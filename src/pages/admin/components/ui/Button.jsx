import clsx from "clsx";

const VARIANTS = {
    primary: "bg-[#703dcb] text-white hover:bg-[#6234b8] focus:ring-[#703dcb]/40",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300",
    outline: "border border-[#703dcb] text-[#703dcb] hover:bg-[#703dcb]/10 focus:ring-[#703dcb]/30",
    ghost: "text-[#703dcb] hover:bg-[#703dcb]/10 focus:ring-[#703dcb]/30",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400/40",
};

const SIZES = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    className,
    disabled,
    ...props
}) {
    return (
        <button
            disabled={disabled}
            className={clsx(
                "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                VARIANTS[variant],
                SIZES[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
