import { cn } from "@/lib/utils";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[SGTB UI Error]", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-background px-5 py-12 text-foreground">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,oklch(0.78_0.14_85/0.12),transparent_42%)]"
        />
        <section
          role="alert"
          className="glass-panel relative z-10 w-full max-w-xl rounded-2xl border border-gold/15 p-7 text-center sm:p-10"
        >
          <span className="mx-auto grid size-16 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
            <AlertTriangle className="size-7" aria-hidden />
          </span>
          <p className="font-mono mt-6 text-[0.62rem] tracking-[0.28em] text-neon uppercase">
            Playback interrupted
          </p>
          <h1 className="font-display mt-3 text-4xl uppercase sm:text-5xl">
            The signal dropped
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            This page hit an unexpected problem, but the rest of the SGTB Music
            site is still available. Reload the page or return home to keep
            moving.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={cn(
                "font-condensed inline-flex items-center justify-center gap-2 rounded-md bg-gold px-5 py-2.5 tracking-[0.14em] text-primary-foreground uppercase",
                "transition-colors hover:bg-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              )}
            >
              <RotateCcw className="size-4" aria-hidden />
              Reload page
            </button>
            <button
              type="button"
              onClick={() => window.location.assign("/home")}
              className="font-condensed inline-flex items-center justify-center gap-2 rounded-md border border-border px-5 py-2.5 tracking-[0.14em] uppercase transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <Home className="size-4" aria-hidden />
              Return home
            </button>
          </div>

          {import.meta.env.DEV && this.state.error && (
            <details className="mt-7 rounded-lg border border-border bg-background/60 p-3 text-left">
              <summary className="cursor-pointer text-xs text-muted-foreground">
                Development error details
              </summary>
              <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap text-xs text-destructive">
                {this.state.error.stack ?? this.state.error.message}
              </pre>
            </details>
          )}
        </section>
      </main>
    );
  }
}

export default ErrorBoundary;
