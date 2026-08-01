type PageHeaderProps = {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, accent, description }: PageHeaderProps) {
  return (
    <header className="container pt-14 pb-10 lg:pt-20">
      <p className="font-mono text-[0.65rem] tracking-[0.3em] text-neon uppercase">
        {eyebrow}
      </p>
      <h1 className="font-display mt-3 text-[clamp(2.4rem,7vw,4.8rem)] uppercase">
        <span className="text-foreground">{title} </span>
        {accent && <span className="text-gold-gradient">{accent}</span>}
      </h1>
      {description && (
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </header>
  );
}
