// Spacer / Divider block — controls vertical rhythm between modules (Behance-style).

const sizeMap = {
  small: "h-6 sm:h-8",
  medium: "h-12 sm:h-16",
  large: "h-20 sm:h-28",
  xlarge: "h-32 sm:h-44",
};

// size: "small" | "medium" | "large" | "xlarge"
// style: "blank" | "rule" | "dotted"
export default function Spacer({ block }) {
  const { size = "medium", style = "blank" } = block;
  const sizeClass = sizeMap[size] ?? sizeMap.medium;

  if (style === "blank") {
    return <div className={sizeClass} aria-hidden="true" />;
  }

  const borderStyle = style === "dotted" ? "border-dotted" : "border-solid";

  return (
    <div className={`${sizeClass} flex items-center px-4 sm:px-8 md:px-12 lg:px-20`} aria-hidden="true">
      <hr className={`w-full border-0 border-t ${borderStyle} border-textColor/20`} />
    </div>
  );
}
