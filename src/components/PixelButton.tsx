import { motion } from "framer-motion";
import { type HTMLMotionProps } from "framer-motion";

interface ButtonProps extends Omit<HTMLMotionProps<"div">, "size"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  responsive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export const PixelButton: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  responsive = true,
  className = "",
  disabled = false,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return "bg-gray-600 border-gray-300 hover:bg-gray-300 hover:text-gray-800";
      case "danger":
        return "bg-red-600 border-red-300 hover:bg-red-300 hover:text-red-800";
      default:
        return "bg-blue-700 text-white hover:bg-blue-400 hover:text-black  border-blue-300 hover:border-blue-800";
    }
  };

  const getSizeStyles = () => {
    if (responsive) {
      return "text-md px-3 py-1 border-2 outline-2 sm:text-xl sm:px-4 sm:py-1 sm:border-3 md:text-2xl md:px-6 md:py-2 md:border-4 md:outline-4 lg:text-3xl lg:px-8 lg:py-3";
    }

    switch (size) {
      case "sm":
        return "text-sm px-4 py-2 border-2 outline-2";
      case "lg":
        return "text-2xl px-8 py-4 border-4 outline-4";
      default:
        return "text-xl px-6 py-3 border-4 outline-4";
    }
  };

  const getResponsiveShadows = () => {
    if (responsive) {
      return `
        shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
        active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]
        sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
        sm:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
        md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        md:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        md:active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
      `;
    }
    return `
      shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
      hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
      active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
    `;
  };

  return (
    <motion.div
      {...props}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      className={`bg-transparent ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      whileTap={disabled ? undefined : {
        y: 2,
        transition: { duration: 0.1 },
      }}
      whileHover={disabled ? undefined : {
        scale: 1.02,
        transition: { duration: 0.1 },
      }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          props.onClick?.();
        }
      }}
      onClick={disabled ? undefined : props.onClick}
    >
      <span
        className={`
        font-pixel 
        uppercase text-white
        block
        ${getSizeStyles()}
        ${getVariantStyles()}
        outline outline-black
        ${disabled ? '' : 'active:translate-y-0.5'}
        transition-all duration-100
        image-rendering-pixelated
        select-none
        ${disabled ? '' : getResponsiveShadows()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      >
        {children}
      </span>
    </motion.div>
  );
};
