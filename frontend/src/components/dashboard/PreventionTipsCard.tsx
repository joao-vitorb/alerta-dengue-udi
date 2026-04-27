const preventionTips = [
  "Elimine água parada de vasos, pneus e recipientes",
  "Mantenha caixas d'água bem tampadas",
  "Use repelente e telas nas janelas",
  "Limpe calhas e ralos regularmente",
];

export function PreventionTipsCard() {
  return (
    <section className="rounded-[14px] border border-[#a9ddd1] bg-[#d9f2eb] p-3 sm:rounded-[18px] sm:p-4">
      <h2 className="text-[16px] font-semibold text-[#0b6450] sm:text-[17px] lg:text-[18px]">
        Dicas de Prevenção
      </h2>

      <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
        {preventionTips.map((tip) => (
          <li
            key={tip}
            className="flex items-start gap-2 text-[13px] leading-5 text-[#317666] sm:text-[14px] sm:leading-6"
          >
            <span className="mt-1.75 h-1.5 w-1.5 rounded-full bg-[#13a36d] sm:mt-2.25" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
