type DashboardToolButtonProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientClassName: string;
  onClick: () => void;
};

export function DashboardToolButton({
  title,
  description,
  icon,
  onClick,
}: DashboardToolButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left text-white transition cursor-pointer hover:scale-[1.01] bg-[linear-gradient(90deg,#08c97a_0%,#10c0b0_100%)]`}
    >
      <span className="shrink-0">{icon}</span>

      <div>
        <p className="text-[18px] font-semibold leading-none">{title}</p>
        <p className="mt-1 text-[13px] text-white/90">{description}</p>
      </div>
    </button>
  );
}
