import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Music from "./pages/Music";
import Services from "./pages/Services";
import Suno from "./pages/Suno";

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
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

