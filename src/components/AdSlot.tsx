type Props = {
  label?: string;
  className?: string;
};

export function AdSlot({ label = "พื้นที่โฆษณา", className = "" }: Props) {
  return <aside className={`ad-slot ${className}`}>{label}</aside>;
}