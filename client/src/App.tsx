import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "wouter";

const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Home = lazy(() => import("@/pages/Home"));
const Music = lazy(() => import("@/pages/Music"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Services = lazy(() => import("@/pages/Services"));
const Suno = lazy(() => import("@/pages/Suno"));

function RouteLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-5 text-foreground"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,oklch(0.78_0.14_85/0.1),transparent_38%)]"
      />
      <div className="relative flex flex-col items-center text-center">
        <span className="relative grid size-14 place-items-center rounded-full border border-gold/25 bg-gold/8">
          <span className="absolute inset-2 animate-spin rounded-full border border-transparent border-t-gold motion-reduce:animate-none" />
          <span className="size-2 rounded-full bg-gold shadow-[0_0_18px_oklch(0.78_0.14_85/0.7)]" />
        </span>
        <span className="font-mono mt-5 text-[0.62rem] tracking-[0.28em] text-gold uppercase">
          Tuning the signal
        </span>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/music" component={Music} />
      <Route path="/suno" component={Suno} />
      <Route path="/contact" component={Contact} />
      <Route path="/404" component={NotFound} />
      {/* Legacy/alias paths keep deep links working */}
      <Route path="/suno-business">{() => <Redirect to="/suno" />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Suspense fallback={<RouteLoader />}>
          <Router />
        </Suspense>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
