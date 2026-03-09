type InfoCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  value?: string;
};

export function InfoCard({
  eyebrow,
  title,
  description,
  value,
}: InfoCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
        {eyebrow}
      </p>

      <div className="mt-3 space-y-2">
        {value ? (
          <p className="text-2xl font-semibold text-slate-900">{value}</p>
        ) : null}
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </article>
  );
}
