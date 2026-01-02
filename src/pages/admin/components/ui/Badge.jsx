import React from "react";

const variantMap = {
  primary: "bg-[#F3ECFF] text-[#7B3FE4]",
  secondary: "bg-gray-400 text-white",
  success: "bg-emerald-600 text-white",
  danger: "bg-red-600 text-white",
  warning: "bg-amber-500 text-black",
  info: "bg-sky-500 text-white",
  neutral: "bg-gray-200 text-gray-800",
  default: "bg-[#703dcb] text-white",
  outline:
    "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
};

const sizeMap = {
  xs: "text-xs px-1.5 py-0.5",
  sm: "text-sm px-2 py-0.5",
  md: "text-sm px-2.5 py-0.5",
  lg: "text-base px-3 py-1",
};

/**
 * Reusable Badge component (Tailwind)
 * - supports numeric counts, dot, variants, sizes and pill shape
 * - accessible: includes aria-label where appropriate
 */
export default function Badge({
  children,
  count,
  maxCount = 99,
  showDot = false,
  variant = "default",
  size = "md",
  pill = true,
  className = "",
  title,
  as: Component = "span",
}) {
  const classes = [
    "inline-flex items-center justify-center font-medium leading-none",
    variantMap[variant],
    sizeMap[size],
    pill ? "rounded-full" : "rounded-md",
    showDot ? "w-2 h-2 px-0 py-0" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // compute displayed content when count is provided
  let content = children;
  let ariaLabel = title;

  if (typeof count !== "undefined") {
    const num = typeof count === "string" ? count : Number(count);
    if (typeof num === "number" && !Number.isNaN(num) && maxCount > 0) {
      content = num > maxCount ? `${maxCount}+` : String(num);
      ariaLabel = `${content} notifications`;
    } else {
      content = String(count);
    }
  }

  if (showDot) {
    // Dot badge: small circle, no children
    return (
      <Component
        className={`${classes} ${variant === "neutral" ? "bg-gray-400" : ""} rounded-full`}
        title={title}
        aria-hidden={title ? "false" : "true"}
      />
    );
  }

  return (
    <Component className={classes} title={title} aria-label={ariaLabel}>
      {content}
    </Component>
  );
}


/* ==========================
   Example usages
   ==========================

<Badge variant="primary">New</Badge>
<Badge variant="danger" count={3} />
<Badge variant="warning" count={120} maxCount={99} />
<Badge variant="success" showDot />
<Badge variant="neutral" size="sm" pill={false}>Beta</Badge>

*/
