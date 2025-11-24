interface BadgeProps {
  label: string;
  color?: "green" | "red" | "yellow" | "gray";
}

export default function Badge({ label, color = "gray" }: BadgeProps) {
  const colors = {
    green: "bg-green-500/20 text-green-400 border-green-500/30",
    red: "bg-red-500/20 text-red-400 border-red-500/30",
    yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    gray: "bg-neutral-700/40 text-gray-300 border-neutral-600/40",
  }[color];

  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-medium ${colors}`}
    >
      {label}
    </span>
  );
}
