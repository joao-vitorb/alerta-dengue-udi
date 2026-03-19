const preventionTips = [
  "Elimine água parada de vasos, pneus e recipientes",
  "Mantenha caixas d'água bem tampadas",
  "Use repelente e telas nas janelas",
  "Limpe calhas e ralos regularmente",
];

export function PreventionTipsCard() {
  return (
    <section className="rounded-[18px] border border-[#a9ddd1] bg-[#d9f2eb] p-4">
      <h2 className="text-[18px] font-semibold text-[#0b6450]">
        Dicas de Prevenção
      </h2>

      <ul className="mt-4 space-y-3">
        {preventionTips.map((tip) => (
          <li
            key={tip}
            className="flex items-start gap-2 text-[14px] leading-6 text-[#317666]"
          >
            <span className="mt-2.25 h-1.5 w-1.5 rounded-full bg-[#13a36d]" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
