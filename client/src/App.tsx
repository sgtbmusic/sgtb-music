import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { ReactNode } from "react";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AudioPlayerProvider } from "./contexts/AudioPlayerContext";
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
import AdminInbox from "@/pages/AdminInbox";
import Rewards from "@/pages/Rewards";
import { PersistentAudioPlayer } from "@/components/PersistentAudioPlayer";
import { FirstTimeOnboardingModal } from "@/components/FirstTimeOnboardingModal";
import SocialFeed from "./pages/SocialFeed";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import VerifyEmail from "@/pages/VerifyEmail";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

function VerificationGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [location] = useLocation();
  if (loading || !user || user.emailVerified !== 0 || location === "/verify-email") return <>{children}</>;
  return <VerifyEmail />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={SocialFeed} />
      <Route path="/home" component={Home} />
      <Route path="/upload" component={SocialFeed} />
      <Route path="/messages" component={Messages} />
      <Route path="/profile" component={Profile} />
      <Route path="/explore" component={Explore} />
      <Route path="/about" component={About} />
      <Route path="/artist-draft-pool" component={ArtistDraftPool} />
      <Route path="/services" component={Services} />
      <Route path="/music" component={Music} />
      <Route path="/suno" component={Suno} />
      <Route path="/visuals" component={Visuals} />
      <Route path={"/visuals"} component={Visuals} />
      <Route path={"/suno-hq"} component={ExecutiveHQ} />
      <Route path={"/admin-portal"} component={AdminPortal} />
      <Route path={"/admin/inbox"} component={AdminInbox} />
      <Route path="/contact" component={Contact} />
      <Route path="/rewards" component={Rewards} />
      <Route path="/settings" component={Settings} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
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
          <AudioPlayerProvider>
            <Toaster />
            <AccessGateway>
              <VerificationGate>
                <Router />
              </VerificationGate>
              <PersistentAudioPlayer />
              <FirstTimeOnboardingModal />
            </AccessGateway>
          </AudioPlayerProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

