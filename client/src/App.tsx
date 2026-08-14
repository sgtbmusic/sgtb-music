import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AccessGateway from "./components/AccessGateway";
import ArtistDraftPool from "./pages/ArtistDraftPool";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Music from "./pages/Music";
import Services from "./pages/Services";
import Suno from "./pages/Suno";
import Visuals from "./pages/Visuals";
import ExecutiveHQ from "./pages/ExecutiveHQ";
import Settings from "@/pages/Settings";
import AdminPortal from "@/pages/AdminPortal";
import Rewards from "@/pages/Rewards";
import { PersistentAudioPlayer } from "@/components/PersistentAudioPlayer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/artist-draft-pool" component={ArtistDraftPool} />
      <Route path="/services" component={Services} />
      <Route path="/music" component={Music} />
      <Route path="/suno" component={Suno} />
      <Route path="/visuals" component={Visuals} />
      <Route path={"/visuals"} component={Visuals} />
      <Route path={"/suno-hq"} component={ExecutiveHQ} />
      <Route path={"/admin-portal"} component={AdminPortal} />
      <Route path="/contact" component={Contact} />
      <Route path="/rewards" component={Rewards} />
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
          <AccessGateway>
            <Router />
            <PersistentAudioPlayer />
          </AccessGateway>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

