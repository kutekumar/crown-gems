import { cn } from "@/lib/utils";

interface DiamondIconProps {
  className?: string;
  filled?: boolean;
}

export const DiamondIcon = ({ className, filled = false }: DiamondIconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={cn("w-4 h-4", className)}
    xmlns="http://www.w3.org/2000/svg"
  >
    {filled ? (
      <path
        d="M12 2L2 9L12 22L22 9L12 2Z"
        fill="currentColor"
      />
    ) : (
      <path
        d="M12 2L2 9L12 22L22 9L12 2ZM12 4.5L18.5 9L12 18.5L5.5 9L12 4.5Z"
        fill="currentColor"
      />
    )}
  </svg>
);

export const GemIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={cn("w-4 h-4", className)}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 3L2 8L12 21L22 8L18 3H6Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 8H22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 3L9 8L12 21L15 8L12 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SparkleIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={cn("w-4 h-4", className)}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
      fill="currentColor"
    />
    <path
      d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25L19 14Z"
      fill="currentColor"
    />
    <path
      d="M5 2L5.5 3.5L7 4L5.5 4.5L5 6L4.5 4.5L3 4L4.5 3.5L5 2Z"
      fill="currentColor"
    />
  </svg>
);

export const RatingDiamond = ({ className, filled = false }: DiamondIconProps) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    className={cn("w-3.5 h-3.5", className)}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 1L1 6L8 15L15 6L8 1Z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
