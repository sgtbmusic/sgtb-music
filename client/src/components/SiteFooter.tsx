import { BrandMark } from "@/components/BrandMark";
import { NAV_LINKS, SUNO_NAV } from "@/lib/site";
import { Link } from "wouter";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card/30">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <BrandMark />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            SGTB Music is the bridge between Suno AI and industry-ready records — song
            structure, Pro Tools engineering, distribution, and the social rollout that
            follows.
          </p>
        </div>

        <div>
          <h3 className="font-condensed mb-3 text-sm tracking-[0.24em] text-gold uppercase">
            Navigate
          </h3>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground transition-colors duration-150 hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={SUNO_NAV.href}
                className="text-neon transition-colors duration-150 hover:text-neon/80">
                {SUNO_NAV.label}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-condensed mb-3 text-sm tracking-[0.24em] text-gold uppercase">
            The Pipeline
          </h3>
          <p className="font-mono text-xs leading-relaxed text-muted-foreground">
            Idea → Suno → Structure → Pro Tools → Distribution → Promotion
          </p>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <span>© {year} SGTB Music. All rights reserved.</span>
          <span className="font-mono tracking-wider">Radio ready. Industry ready.</span>
        </div>
      </div>
    </footer>
  );
}
