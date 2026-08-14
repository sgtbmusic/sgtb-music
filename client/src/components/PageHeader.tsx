type PageHeaderProps = {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, accent, description }: PageHeaderProps) {
  return (
    <header className="container min-w-0 pt-14 pb-10 lg:pt-20">
      <p className="safe-wrap max-w-full font-mono text-[0.58rem] leading-5 tracking-[0.18em] text-neon uppercase sm:text-[0.65rem] sm:tracking-[0.3em]">
        {eyebrow}
      </p>
      <h1 className="safe-wrap font-display mt-3 max-w-full text-[clamp(2.4rem,12vw,4.8rem)] uppercase">
        <span className="text-foreground">{title} </span>
        {accent && <span className="text-gold-gradient">{accent}</span>}
      </h1>
      {description && (
        <p className="safe-wrap mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </header>
  );
}
