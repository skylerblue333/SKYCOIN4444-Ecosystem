import { Suspense, lazy } from "react";
import { Navigation } from "@/components/Navigation";
import { BottomTabBar } from "@/components/BottomTabBar";
import { PriceTicker } from "@/components/PriceTicker";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Redirect, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAppStore } from "./shared/state/appStore";
import { OSShell } from "./shells/os/OSShell";
import { QuickLaunchBar } from "./shells/os/QuickLaunchBar";
import { AlwaysOnVoice } from "./components/AlwaysOnVoice";
import { HopeCompanion } from "./components/HopeCompanion";
import { AchievementToastContainer } from "./components/AchievementToast";
import BottomSidebar from "./components/BottomSidebar";

// Lazy-loaded pages — each becomes its own chunk, preventing OOM at build time
// Core
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Notifications = lazy(() => import("./pages/Notifications"));
const NotificationsHub = lazy(() => import("./pages/NotificationsHub"));
const Messages = lazy(() => import("./pages/Messages"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/Signin"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Social
const Social = lazy(() => import("./pages/Social"));
const SocialMedia = lazy(() => import("./pages/SocialMedia"));
const Community = lazy(() => import("./pages/Community"));
const Guilds = lazy(() => import("./pages/Guilds"));
const Stories = lazy(() => import("./pages/Stories"));
const Explore = lazy(() => import("./pages/Explore"));
const Discover = lazy(() => import("./pages/Discover"));

// Streaming & Video
const Streaming = lazy(() => import("./pages/Streaming"));
const VideoArea = lazy(() => import("./pages/VideoArea"));
const CreatorDashboard = lazy(() => import("./pages/CreatorDashboard"));
const CreatorStudio = lazy(() => import("./pages/CreatorStudio"));
const Live = lazy(() => import("./pages/Live"));

// Marketplace & Commerce
const Marketplace = lazy(() => import("./pages/Marketplace"));
const EscrowShop = lazy(() => import("./pages/EscrowShop"));
const Payments = lazy(() => import("./pages/Payments"));
const SkyStore = lazy(() => import("./pages/SkyStore"));

// Crypto & DeFi
const Crypto = lazy(() => import("./pages/Crypto"));
const TokenDashboard = lazy(() => import("./pages/TokenDashboard"));
const TokenSwap = lazy(() => import("./pages/TokenSwap"));
const StakingPortal = lazy(() => import("./pages/StakingPortal"));
const Farming = lazy(() => import("./pages/Farming"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Trading = lazy(() => import("./pages/Trading"));
const AITrading = lazy(() => import("./pages/AITrading"));
const DayTradeRoom = lazy(() => import("./pages/DayTradeRoom"));

// GameFi
const Arcade = lazy(() => import("./pages/Arcade"));
const Gaming = lazy(() => import("./pages/Gaming"));
const GameCrash = lazy(() => import("./pages/GameCrash"));
const GameSlots = lazy(() => import("./pages/GameSlots"));
const GameBlackjack = lazy(() => import("./pages/GameBlackjack"));
const GameDice = lazy(() => import("./pages/GameDice"));
const GameRoulette = lazy(() => import("./pages/GameRoulette"));
const GamePlinko = lazy(() => import("./pages/GamePlinko"));
const TrumpMining = lazy(() => import("./pages/TrumpMining"));
const HopeAI = lazy(() => import("./pages/HopeAI"));
const HopeAIMeta = lazy(() => import("./pages/HopeAIMeta"));
const MissionControl = lazy(() => import("./pages/MissionControl"));
const GlobalOperationsCenter = lazy(() => import("./pages/GlobalOperationsCenter"));
const AIToolsHub = lazy(() => import("./pages/AIToolsHub"));
const SkySchool = lazy(() => import("./pages/SkySchool"));
const TradingTerminal = lazy(() => import("./pages/TradingTerminal"));
const SocialFeedV2 = lazy(() => import("./pages/SocialFeedV2"));
const Tournaments = lazy(() => import("./pages/Tournaments"));
// AI
const AIBrain = lazy(() => import("./pages/AIBrain"));
const AICore = lazy(() => import("./pages/AICore"));
const AIEngineer = lazy(() => import("./pages/AIEngineer"));
const AICodeStudio = lazy(() => import("./pages/AICodeStudio"));
const AICopyStudio = lazy(() => import("./pages/AICopyStudio"));
const AIAgent = lazy(() => import("./pages/AIAgent"));
const CodeIntelligence = lazy(() => import("./pages/CodeIntelligence"));
const AIIntelligenceHub = lazy(() => import("./pages/AIIntelligenceHub"));

// Governance & Community
const Governance = lazy(() => import("./pages/Governance"));
const Charity = lazy(() => import("./pages/Charity"));
const Leaderboards = lazy(() => import("./pages/Leaderboards"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Referrals = lazy(() => import("./pages/Referrals"));
const PlatformStatus = lazy(() => import("./pages/PlatformStatus"));
const TwoFactorSetup = lazy(() => import("./pages/TwoFactorSetup"));
const SecurityDashboard = lazy(() => import("./pages/SecurityDashboard"));
const AdvancedAnalytics = lazy(() => import("./pages/AdvancedAnalytics"));
const AuditLog = lazy(() => import("./pages/AuditLog"));
const APIKeys = lazy(() => import("./pages/APIKeys"));
const TokenMetrics = lazy(() => import("./pages/TokenMetrics"));
const VestingSchedule = lazy(() => import("./pages/VestingSchedule"));

// Analytics & Business
const Analytics = lazy(() => import("./pages/Analytics"));
const DMInbox = lazy(() => import("@/pages/DMInbox"));
const NFTGallery = lazy(() => import("@/pages/NFTGallery"));
const Reels = lazy(() => import("@/pages/Reels"));
const YieldFarming = lazy(() => import("@/pages/YieldFarming"));
const WhaleMonitor = lazy(() => import("@/pages/WhaleMonitor"));
const InvestorRoom = lazy(() => import("./pages/InvestorRoom"));
const Ecosystem = lazy(() => import("./pages/Ecosystem"));
const Economics = lazy(() => import("./pages/Economics"));
const Growth = lazy(() => import("./pages/Growth"));
const Retention = lazy(() => import("./pages/Retention"));

// Admin & Dev
const Admin = lazy(() => import("./pages/Admin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminWalletManager = lazy(() => import("./pages/AdminWalletManager"));
const CryptoResearchHub = lazy(() => import("./pages/CryptoResearchHub"));
const MiningCalculator = lazy(() => import("./pages/MiningCalculator"));
const MinerDashboard = lazy(() => import("./pages/MinerDashboard"));
const MiningDashboard = lazy(() => import("./pages/MiningDashboard"));
const PresentationWithChat = lazy(() => import("./pages/PresentationWithChat"));
const DatingDiscovery = lazy(() => import("./pages/DatingDiscovery"));
const DatingMessages = lazy(() => import("./pages/DatingMessages"));
const DatingMatches = lazy(() => import("./pages/DatingMatches"));
const DatingProfile = lazy(() => import("./pages/DatingProfile"));
const DatingSubscription = lazy(() => import("./pages/DatingSubscription"));
const DatingProfileSetup = lazy(() => import("./pages/DatingProfileSetup"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AIModerationQueue = lazy(() => import("./pages/AIModerationQueue"));
const Security = lazy(() => import("./pages/Security"));
const CodeQuality = lazy(() => import("./pages/CodeQuality"));
const CodeQualityDashboard = lazy(() => import("./pages/CodeQualityDashboard"));
const DeveloperArea = lazy(() => import("./pages/DeveloperArea"));
const Engineer = lazy(() => import("./pages/Engineer"));
const Beta = lazy(() => import("./pages/Beta"));
const GeneratedApiExplorer = lazy(() => import("./pages/GeneratedApiExplorer"));
const GeneratedGallery = lazy(() => import("./pages/GeneratedGallery"));

// Education & Features
const School = lazy(() => import("./pages/School"));
const Learning = lazy(() => import("./pages/Learning"));
const Features = lazy(() => import("./pages/Features"));
const ProofVault = lazy(() => import("./pages/ProofVault"));

// Additional pages from merged codebases
const ComponentShowcase = lazy(() => import("./pages/ComponentShowcase"));
const AnomalyDetection = lazy(() => import("./pages/AnomalyDetection"));
const DevOps = lazy(() => import("./pages/DevOps"));
const LogisticsOptimizer = lazy(() => import("./pages/LogisticsOptimizer"));
const SentimentPipeline = lazy(() => import("./pages/SentimentPipeline"));
const ICOLaunchpad = lazy(() => import("./pages/ICOLaunchpad"));
const DeveloperMarketplace = lazy(() => import("./pages/DeveloperMarketplace"));
const InvestorPitch = lazy(() => import("./pages/InvestorPitch"));
const EventPlanner = lazy(() => import("./pages/EventPlanner"));
const UniversalSearch = lazy(() => import("./pages/UniversalSearch"));
const Enterprise = lazy(() => import("./pages/Enterprise"));
const TournamentBracketPage = lazy(() => import("./pages/TournamentBracket"));
const GovernanceWizard = lazy(() => import("./pages/GovernanceWizard"));
const VODArchive = lazy(() => import("./pages/VODArchive"));
const CharityLeaderboard = lazy(() => import("./pages/CharityLeaderboard"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));

// Strategic Engines (Ecosystem Integration Layer)
const FeedbackHub = lazy(() => import("./pages/FeedbackHub"));
const AdaptiveRoadmap = lazy(() => import("./pages/AdaptiveRoadmap"));
const AgentDebate = lazy(() => import("./pages/AgentDebate"));
const CompetitiveRadar = lazy(() => import("./pages/CompetitiveRadar"));
const BehavioralIntelligence = lazy(() => import("./pages/BehavioralIntelligence"));
const ExperimentFactory = lazy(() => import("./pages/ExperimentFactory"));
const NarrativeEngine = lazy(() => import("./pages/NarrativeEngine"));
const ConnectorIntelligence = lazy(() => import("./pages/ConnectorIntelligence"));
const ProductBrain = lazy(() => import("./pages/ProductBrain"));
const CompanySimulator = lazy(() => import("./pages/CompanySimulator"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const APIDocs = lazy(() => import("./pages/APIDocs"));
const AdvancedAdminPanel = lazy(() => import("./pages/AdvancedAdminPanel"));

// Page loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// The OS shell owns only its three self-contained surfaces ( "/", and the
// discover/execute/identity home). Every other path is an explicit feature
// route that must render through the legacy router — even while the OS shell is
// the active experience. This keeps the OS home intact AND makes deep routes
// like /mission-control reachable without forcing users into legacy mode.
const OS_HOME_PATHS = new Set(["/", "/discover", "/execute", "/identity"]);
function Router() {
  const { shell } = useAppStore();
  const [location] = useLocation();
  if (shell === "os" && OS_HOME_PATHS.has(location)) return <OSShell />;
  return <LegacyRouter />;
}
function LegacyRouter() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <QuickLaunchBar />
      <BottomTabBar />
      <PriceTicker />
      <BottomSidebar />
      <main className="pt-16 pb-20 lg:pb-0">
    <Suspense fallback={<PageLoader />}>
      <ErrorBoundary>
      <Switch>
        {/* Core */}
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/profile" component={Profile} />
        <Route path="/profile/:id" component={Profile} />
        <Route path="/settings" component={Settings} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/notifications-hub">{() => <Redirect to="/notifications" />}</Route>
        <Route path="/messages" component={Messages} />
        <Route path="/dm" component={Messages} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/signup" component={SignUp} />
        <Route path="/signin" component={SignIn} />

        {/* Social */}
        <Route path="/social" component={Social} />
        <Route path="/feed" component={SocialMedia} />
        <Route path="/social-media">{() => <Redirect to="/social" />}</Route>
        <Route path="/community" component={Community} />
        <Route path="/guilds" component={Guilds} />
        <Route path="/stories" component={Stories} />
        <Route path="/explore" component={Explore} />
        <Route path="/discover" component={Discover} />

        {/* Streaming & Video */}
        <Route path="/streaming" component={Streaming} />
        <Route path="/live" component={Live} />
        <Route path="/video" component={VideoArea} />
        <Route path="/creator" component={CreatorDashboard} />
        <Route path="/creator-dashboard" component={CreatorDashboard} />
        <Route path="/creator-studio" component={CreatorStudio} />

        {/* Marketplace */}
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/shop">{() => <Redirect to="/marketplace" />}</Route>
        <Route path="/escrow-shop">{() => <Redirect to="/marketplace" />}</Route>
        <Route path="/sky-store" component={SkyStore} />
        <Route path="/store">{() => <Redirect to="/sky-store" />}</Route>
        <Route path="/payments" component={Payments} />

        {/* Crypto & DeFi */}
        <Route path="/crypto" component={Crypto} />
        <Route path="/token" component={TokenDashboard} />
        <Route path="/token-dashboard" component={TokenDashboard} />
        <Route path="/swap" component={TokenSwap} />
        <Route path="/token-swap" component={TokenSwap} />
        <Route path="/staking" component={StakingPortal} />
        <Route path="/farming" component={Farming} />
        <Route path="/launchpad" component={Farming} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/trading" component={Trading} />
        <Route path="/ai-trading" component={AITrading} />
        <Route path="/day-trade" component={DayTradeRoom} />

        {/* GameFi */}
        <Route path="/arcade" component={Arcade} />
        <Route path="/gaming" component={Gaming} />
        <Route path="/games" component={Gaming} />
        <Route path="/game/crash" component={GameCrash} />
        <Route path="/game/slots" component={GameSlots} />
        <Route path="/game/blackjack" component={GameBlackjack} />
        <Route path="/game/dice" component={GameDice} />
        <Route path="/game/roulette" component={GameRoulette} />
        <Route path="/game/plinko" component={GamePlinko} />
        <Route path="/trump-mining" component={TrumpMining} />
        <Route path="/hope-ai" component={HopeAI} />
        <Route path="/hope-ai-meta" component={HopeAIMeta} />
        <Route path="/mission-control" component={MissionControl} />
        <Route path="/command-center">{() => <Redirect to="/mission-control" />}</Route>
        <Route path="/global-ops" component={GlobalOperationsCenter} />
        <Route path="/global-operations-center">{() => <Redirect to="/global-ops" />}</Route>
        <Route path="/ai-tools" component={AIToolsHub} />
        <Route path="/ai-agent" component={AIAgent} />
        <Route path="/sky-school">{() => <Redirect to="/school" />}</Route>
        <Route path="/trading-terminal" component={TradingTerminal} />
        <Route path="/social-v2">{() => <Redirect to="/social" />}</Route>
        <Route path="/tournaments" component={Tournaments} />

        {/* AI */}
        <Route path="/ai-brain" component={AIBrain} />
        <Route path="/ai" component={AIBrain} />
        <Route path="/ai-core" component={AICore} />
        <Route path="/ai-engineer" component={AIEngineer} />
        <Route path="/ai-code-studio" component={AICodeStudio} />
        <Route path="/ai-copy-studio" component={AICopyStudio} />

        {/* Governance & Community */}
        <Route path="/governance" component={Governance} />
        <Route path="/charity" component={Charity} />
        <Route path="/leaderboards">{() => <Redirect to="/leaderboard" />}</Route>
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/referrals" component={Referrals} />
          <Route path="/status" component={PlatformStatus} />
          <Route path="/security" component={SecurityDashboard} />
          <Route path="/security-panel" component={Security} />
          <Route path="/audit-log" component={AuditLog} />
          <Route path="/api-keys" component={APIKeys} />
          <Route path="/token-metrics" component={TokenMetrics} />
          <Route path="/vesting" component={VestingSchedule} />
          <Route path="/api-docs" component={APIDocs} />
          <Route path="/admin-advanced" component={AdvancedAdminPanel} />

        {/* Analytics & Business */}
        <Route path="/analytics" component={Analytics} />
        <Route path="/investor" component={InvestorPortal} />
        <Route path="/investor-portal" component={InvestorPortal} />
        <Route path="/ai-market-agents" component={AIMarketAgents} />
        <Route path="/ai-agents-market" component={AIMarketAgents} />
        <Route path="/ecosystem" component={Ecosystem} />
        <Route path="/platform-map" component={PlatformMap} />
        <Route path="/economics" component={Economics} />
        <Route path="/growth" component={Growth} />
        <Route path="/retention" component={Retention} />

        {/* Strategic Engines */}
        <Route path="/feedback-hub" component={FeedbackHub} />
        <Route path="/adaptive-roadmap" component={AdaptiveRoadmap} />
        <Route path="/agent-debate" component={AgentDebate} />
        <Route path="/competitive-radar" component={CompetitiveRadar} />
        <Route path="/behavioral-intelligence" component={BehavioralIntelligence} />
        <Route path="/experiment-factory" component={ExperimentFactory} />
        <Route path="/narrative-engine" component={NarrativeEngine} />
        <Route path="/connector-intelligence" component={ConnectorIntelligence} />
        <Route path="/product-brain" component={ProductBrain} />
        <Route path="/company-simulator" component={CompanySimulator} />
        <Route path="/analytics" component={AnalyticsDashboard} />
        <Route path="/advanced-analytics" component={AdvancedAnalytics} />

        {/* Admin & Dev */}
        <Route path="/admin" component={Admin} />
        <Route path="/admin-dashboard">{() => <Redirect to="/admin" />}</Route>
        <Route path="/admin/wallet" component={AdminWalletManager} />
        <Route path="/crypto-research" component={CryptoResearchHub} />
        <Route path="/mining-calculator" component={MiningCalculator} />
        <Route path="/miner-dashboard" component={MinerDashboard} />
        <Route path="/mining" component={MiningDashboard} />
        <Route path="/presentation" component={PresentationWithChat} />

        {/* Dating & Social Matching */}
        <Route path="/dating/setup" component={DatingProfileSetup} />
        <Route path="/dating" component={DatingDiscovery} />
        <Route path="/dating/discover" component={DatingDiscovery} />
        <Route path="/dating/messages" component={DatingMessages} />
        <Route path="/dating/matches" component={DatingMatches} />
        <Route path="/dating/profile" component={DatingProfile} />
        <Route path="/dating/subscription" component={DatingSubscription} />
        <Route path="/dating/premium" component={DatingSubscription} />
        <Route path="/admin-panel">{() => <Redirect to="/admin" />}</Route>
        <Route path="/admin/moderation" component={AIModerationQueue} />
          <Route path="/2fa" component={TwoFactorSetup} />
        <Route path="/code-quality" component={CodeQuality} />
        <Route path="/code-quality-dashboard" component={CodeQualityDashboard} />
        <Route path="/developer" component={DeveloperArea} />
        <Route path="/engineer" component={Engineer} />
        <Route path="/beta" component={Beta} />
        <Route path="/api-explorer" component={GeneratedApiExplorer} />
        <Route path="/gallery" component={GeneratedGallery} />

        {/* Education & Features */}
        <Route path="/school" component={School} />
        <Route path="/learning" component={Learning} />
        <Route path="/features" component={Features} />
        <Route path="/proof-vault" component={ProofVault} />
        <Route path="/components" component={ComponentShowcase} />
        <Route path="/language-partners" component={LanguagePartnerDiscovery} />
        <Route path="/practice-sessions" component={PracticeSessions} />
        <Route path="/progress-tracking" component={ProgressTracking} />
        <Route path="/bounty-system" component={BountySystem} />
        <Route path="/messaging" component={UnifiedMessaging} />
        <Route path="/video-chat" component={VideoChat} />
        <Route path="/video-chat/:partnerId" component={VideoChat} />
        <Route path="/translation-social" component={TranslationEnabledSocialFeed} />
        <Route path="/translation-community" component={TranslationEnabledCommunity} />
        <Route path="/platform-dashboard" component={UnifiedPlatformDashboard} />
        <Route path="/teaching-opportunities" component={TeachingOpportunities} />
        <Route path="/language-exchange-admin" component={LanguageExchangeAdmin} />

        {/* Fallback */}
        {/* New Enterprise & DevOps Pages */}
        <Route path="/anomaly-detection" component={AnomalyDetection} />
        <Route path="/devops" component={DevOps} />
        <Route path="/logistics" component={LogisticsOptimizer} />
        <Route path="/sentiment" component={SentimentPipeline} />
        <Route path="/ico" component={InvestorPortal} />
        <Route path="/404" component={NotFound} />
        <Route path="/developer-marketplace" component={DeveloperMarketplace} />
        <Route path="/investor-pitch" component={InvestorPitch} />
        <Route path="/event-planner" component={EventPlanner} />
        <Route path="/search" component={UniversalSearch} />
        <Route path="/enterprise" component={Enterprise} />
                  <Route path="/webhooks" component={WebhookManager} />
          <Route path="/rate-limits" component={RateLimitDashboard} />
          <Route path="/clips" component={StreamClip} />
          <Route path="/quests" component={GameFiQuestBoard} />
                    <Route path="/affiliate" component={AffiliateDashboard} />
                    <Route path="/mega-marketplace">{() => <Redirect to="/marketplace" />}</Route>
                    <Route path="/admin-orders" component={AdminOrders} />
                    <Route path="/profitability" component={Profitability} />
          <Route path="/vod-archive" component={VODArchive} />
          <Route path="/charity-leaderboard" component={CharityLeaderboard} />
          <Route path="/gaming-for-charity" component={GamingForCharity} />
          <Route path="/games/crypto-quiz" component={GameCryptoQuiz} />
          <Route path="/games/token-tap" component={GameTokenTap} />
          <Route path="/games/block-builder" component={GameBlockBuilder} />
          <Route path="/creator-onboarding" component={CreatorOnboarding} />
          <Route path="/create/article" component={CreateArticle} />
          <Route path="/create/audio" component={CreateAudio} />
          <Route path="/create/live" component={CreateLiveStream} />
          <Route path="/create/drop" component={CreateDrop} />
          <Route path="/create-reel" component={CreateReel} />
          <Route path="/communities/create" component={CommunityCreate} />
          <Route path="/shadow-identity" component={ShadowIdentity} />
          <Route path="/notification-intelligence" component={NotificationIntelligence} />
          <Route path="/compliance-center" component={ComplianceCenter} />
          <Route path="/ai-persona-feed" component={AIPersonaFeed} />
          <Route path="/economic-layer" component={EconomicLayer} />
          <Route path="/trust-safety" component={TrustSafetyDashboard} />
          <Route path="/code-intelligence" component={CodeIntelligence} />
          <Route path="/ai-intelligence" component={AIIntelligenceHub} />
          <Route path="/governance-wizard" component={GovernanceWizard} />
          <Route path="/tournament-bracket" component={TournamentBracketPage} />
          <Route path="/order-history" component={OrderHistory} />
          <Route path="/agents" component={AgentsDashboard} />
          <Route path="/agents/builder" component={AgentBuilder} />
          <Route path="/agents/marketplace" component={AgentMarketplace} />
          <Route path="/agents/sprint" component={AgentSprint} />
          <Route path="/agents/:id" component={AgentDetail} />
          <Route path="/creator-analytics" component={CreatorAnalytics} />
          <Route path="/creator-monetization" component={CreatorMonetization} />
          <Route path="/shadowfans" component={NSFWPlatform} />
          <Route path="/nsfw" component={NSFWPlatform} />
          <Route path="/adult" component={NSFWPlatform} />
          <Route path="/profile-edit" component={ProfileEdit} />
          <Route path="/school/dashboard" component={SchoolDashboard} />
          <Route path="/school/course/:id" component={SchoolCourse} />
          <Route path="/school/lesson/:id" component={SchoolLesson} />
          <Route path="/school/quiz/:id" component={SchoolQuiz} />
          <Route path="/school/certificate/:id" component={SchoolCertificate} />
          <Route path="/mining" component={Mining} />
          <Route path="/crypto-mine" component={CryptoMine} />
          <Route path="/earn" component={EarnHub} />
          <Route path="/earn-hub" component={EarnHub} />
          <Route path="/watch-earn" component={WatchEarn} />
          <Route path="/about" component={About} />
          <Route path="/live-gifting" component={LiveGifting} />
          <Route path="/dex" component={DEXDepthChart} />
          <Route path="/stream-gifting" component={StreamGifting} />
          <Route path="/checkout" component={StripeCheckout} />
          <Route path="/checkout/success" component={StripeCheckout} />
          {/* YC MVP Surfaces */}
          <Route path="/chat" component={ChatMVP} />
          <Route path="/action-panel" component={ActionPanel} />
          <Route path="/profile-wallet" component={ProfileWallet} />
          {/* Phase 9 — Intelligence Layer */}
          <Route path="/agent-coordination" component={AgentCoordinationHub} />
          <Route path="/memory-system" component={MemorySystem} />
          <Route path="/predictive-systems" component={PredictiveSystems} />
          <Route path="/self-healing" component={SelfHealingInfra} />
          <Route path="/adaptive-personalization" component={AdaptivePersonalization} />
          {/* Phase 10 — Data Economy */}
          <Route path="/data-lake" component={DataLake} />
          <Route path="/analytics-products" component={AnalyticsProducts} />
          <Route path="/reputation-system" component={ReputationSystem} />
          <Route path="/creator-intelligence" component={CreatorIntelligence} />
          <Route path="/ai-training-loops" component={AITrainingLoops} />
          {/* Phase 12 — Sovereign Network */}
          <Route path="/decentralized-identity" component={DecentralizedIdentity} />
          <Route path="/token-governance" component={TokenGovernance} />
          <Route path="/cross-chain" component={CrossChainInterop} />
          <Route path="/protocol-layer" component={ProtocolLayer} />
          <Route path="/ai-personas" component={AIPersonaSystem} />
          <Route path="/defensibility" component={DefensibilityMoat} />
          <Route path="/retention-engine" component={RetentionEngine} />
          <Route path="/system-architecture" component={SystemArchitecture} />
          <Route path="/gtm-strategy" component={GTMStrategy} />
          <Route path="/ai-agents" component={AIAgentMarket} />
          <Route path="/build-roadmap" component={BuildRoadmap} />
          <Route path="/pricing-engine" component={PricingEngine} />
          <Route path="/payment-infra" component={PaymentInfra} />
          <Route path="/security-compliance">{() => <Redirect to="/security" />}</Route>
          <Route path="/production-architecture" component={ProductionArchitecture} />
          <Route path="/build-order" component={BuildOrder} />
          <Route path="/master-architecture" component={MasterArchitecture} />
          <Route path="/dating" component={DatingHome} />
          <Route path="/dating/matches" component={MatchFeed} />
          <Route path="/dating/chat/:id" component={MatchChat} />
          <Route path="/dating/matchmaker" component={AIMatchmaker} />
          <Route path="/dating/premium" component={DatingPremium} />
          <Route path="/ambient-feed">{() => <Redirect to="/social" />}</Route>
          <Route path="/entity-profile/:id" component={EntityProfile} />
          <Route path="/match-space" component={MatchSpace} />
          <Route path="/world-brain" component={WorldBrain} />
          <Route path="/actions" component={ActionObjects} />
          <Route path="/unhidden" component={UnhiddenMode} />
          <Route path="/system-observability" component={SystemObservability} />
          <Route path="/automation-engine" component={AutomationEngine} />
          <Route path="/world-simulation" component={WorldSimulationControl} />
          <Route path="/economy-control" component={EconomyControl} />
          <Route path="/hope-ai-control" component={HOPEAIControl} />
          <Route path="/unhidden-interface" component={UnhiddenInterface} />
          <Route path="/power-tools" component={PowerUserTools} />
          <Route path="/legendary" component={LegendaryStatus} />
          <Route path="/founder" component={LegendaryStatus} />
          <Route path="/crypto-hub">{() => <Redirect to="/wallet" />}</Route>
          <Route path="/dm" component={DMInbox} />
          <Route path="/nft-gallery" component={NFTGallery} />
          <Route path="/reels" component={Reels} />
          <Route path="/yield-farming" component={YieldFarming} />
          <Route path="/whale-monitor" component={WhaleMonitor} />
          <Route path="/trust-system" component={TrustSystem} />
          <Route path="/dhgate">{() => <Redirect to="/marketplace" />}</Route>
          <Route path="/dhgate-shop">{() => <Redirect to="/marketplace" />}</Route>
          <Route path="/privacy" component={PrivacyVault} />
          <Route path="/privacy-vault" component={PrivacyVault} />
          <Route path="/ghost-mode" component={GhostMode} />
          <Route path="/shadow-relay" component={ShadowRelay} />
          <Route path="/tor-bridge" component={TorBridge} />
          <Route path="/anti-surveillance" component={AntiSurveillance} />
          <Route path="/voice-commands" component={VoiceCommandsRegistry} />
          <Route path="/mobile-app" component={MobileApp} />
          <Route path="/browser-extension" component={BrowserExtension} />
          <Route path="/embed-sdk" component={EmbedSDK} />
          <Route path="/developer-protocol" component={DeveloperProtocol} />
          <Route path="/crm" component={CRM} />
          <Route path="/knowledge-base" component={KnowledgeBase} />
          <Route path="/help" component={KnowledgeBase} />
          <Route path="/agent-coordination" component={AgentCoordination} />
          <Route path="/unified-feed">{() => <Redirect to="/social" />}</Route>
          <Route path="/automation-workflows" component={AutomationWorkflows} />
          <Route path="/unified-identity" component={UnifiedIdentity} />
          <Route path="/payment-ledger" component={UnifiedPaymentLedger} />
          <Route path="/system-status">{() => <Redirect to="/status" />}</Route>
          <Route path="/status" component={SystemStatus} />
          <Route path="/trending" component={Trending} />
          <Route path="/channels" component={Channels} />
          <Route path="/events" component={Events} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/defi" component={DeFiPage} />
          <Route path="/achievements" component={Achievements} />
          <Route path="/spin" component={SpinWheel} />
          <Route path="/battle-pass" component={BattlePass} />
          <Route path="/bookmarks" component={Bookmarks} />
          <Route path="/hashtags" component={HashtagExplorer} />
          <Route path="/social-graph" component={SocialGraph} />
          <Route path="/clan-wars" component={ClanWars} />
          <Route path="/p2e-shop" component={P2EShop} />
          <Route path="/shop" component={P2EShop} />
          <Route path="/subscriptions" component={Subscriptions} />

          <Route path="/tip-jar" component={TipJar} />
          <Route path="/tips" component={TipJar} />
          <Route path="/content-scheduler" component={ContentScheduler} />
          <Route path="/scheduler" component={ContentScheduler} />
          <Route path="/live-reactions" component={LiveReactions} />
          <Route path="/reactions" component={LiveReactions} />
          <Route path="/server-installer" component={ServerInstaller} />
          <Route path="/self-host" component={ServerInstaller} />
          <Route path="/creator-spotlight" component={CreatorSpotlight} />
          <Route path="/book" component={BookPage} />
          <Route path="/the-chosen-one" component={BookPage} />
          <Route path="/nsfw-feed" component={NSFWFeed} />
          <Route path="/18plus" component={NSFWFeed} />
          <Route path="/content-vault" component={ContentVault} />
          <Route path="/vault" component={ContentVault} />
          <Route path="/payout" component={PayoutDashboard} />
          <Route path="/payout-dashboard" component={PayoutDashboard} />
          <Route path="/server-health" component={ServerHealth} />
          <Route path="/health" component={ServerHealth} />
          <Route path="/art-store" component={DigitalArtStore} />
          <Route path="/digital-art" component={DigitalArtStore} />
          <Route path="/creator/:handle" component={CreatorProfile} />
          <Route path="/age-gate" component={AgeGate} />
          {/* ─── New Engine Routes ─────────────────────────────────────────── */}
          <Route path="/blockchain-custody" component={BlockchainCustody} />
          <Route path="/free-will" component={FreeWillDashboard} />
          <Route path="/digital-nation" component={DigitalNationMode} />
          <Route path="/enterprise-analytics" component={EnterpriseAnalytics} />
          <Route path="/situation-room" component={SituationRoom} />
          <Route path="/life-command" component={LifeCommand} />
          <Route path="/destiny-engine" component={DestinyEngine} />
          <Route path="/central-bank" component={SKY444CentralBank} />
          <Route path="/citizen-passport" component={CitizenPassport} />
          <Route path="/memory-constellation" component={MemoryConstellation} />
          <Route path="/agent-city" component={AgentCity} />
          <Route path="/civilization" component={CivilizationSimulator} />
          <Route path="/investor-metrics" component={InvestorMetrics} />
      <Route path="/productcatalog" component={ProductCatalog} />
      <Route path="/productdetail" component={ProductDetail} />
      <Route path="/productreviews" component={ProductReviews} />
      <Route path="/productcomparison" component={ProductComparison} />
      <Route path="/inventorymanagement" component={InventoryManagement} />
      <Route path="/shoppingcart" component={ShoppingCart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/ordertracking" component={OrderTracking} />
      <Route path="/returnmanagement" component={ReturnManagement} />
      <Route path="/wishlistmanagement" component={WishlistManagement} />
      <Route path="/sellerdashboard" component={SellerDashboard} />
      <Route path="/productlisting" component={ProductListing} />
      <Route path="/bulkupload" component={BulkUpload} />
      <Route path="/shippingmanagement" component={ShippingManagement} />
      <Route path="/vendoranalytics" component={VendorAnalytics} />
      <Route path="/dashboardoverview" component={DashboardOverview} />
      <Route path="/salesanalytics" component={SalesAnalytics} />
      <Route path="/customeranalytics" component={CustomerAnalytics} />
      <Route path="/conversionfunnel" component={ConversionFunnel} />
      <Route path="/cohortanalysis" component={CohortAnalysis} />
      <Route path="/customreports" component={CustomReports} />
      <Route path="/dataexport" component={DataExport} />
      <Route path="/scheduledreports" component={ScheduledReports} />
      <Route path="/realtimemonitoring" component={RealTimeMonitoring} />
      <Route path="/alertmanagement" component={AlertManagement} />
      <Route path="/performancemetrics" component={PerformanceMetrics} />
      <Route path="/userbehavior" component={UserBehavior} />
      <Route path="/engagementmetrics" component={EngagementMetrics} />
      <Route path="/retentionanalytics" component={RetentionAnalytics} />
      <Route path="/userdirectory" component={UserDirectory} />
      <Route path="/userpermissions" component={UserPermissions} />
      <Route path="/accesscontrol" component={AccessControl} />
      <Route path="/auditlog" component={AuditLog} />
      <Route path="/useronboarding" component={UserOnboarding} />
      <Route path="/organizationsettings" component={OrganizationSettings} />
      <Route path="/departmentmanagement" component={DepartmentManagement} />
      <Route path="/teammanagement" component={TeamManagement} />
      <Route path="/rolemanagement" component={RoleManagement} />
      <Route path="/policymanagement" component={PolicyManagement} />
      <Route path="/compliancedashboard" component={ComplianceDashboard} />
      <Route path="/dataprivacy" component={DataPrivacy} />
      <Route path="/securityaudit" component={SecurityAudit} />
      <Route path="/backupmanagement" component={BackupManagement} />
      <Route path="/disasterrecovery" component={DisasterRecovery} />
      <Route path="/invoicemanagement" component={InvoiceManagement} />
      <Route path="/billinghistory" component={BillingHistory} />
      <Route path="/subscriptionmanagement" component={SubscriptionManagement} />
      <Route path="/costallocation" component={CostAllocation} />
      <Route path="/expensemanagement" component={ExpenseManagement} />
      <Route path="/projectboard" component={ProjectBoard} />
      <Route path="/ganttchart" component={GanttChart} />
      <Route path="/roadmapview" component={RoadmapView} />
      <Route path="/milestonetracking" component={MilestoneTracking} />
      <Route path="/resourceallocation" component={ResourceAllocation} />
      <Route path="/tasklist" component={TaskList} />
      <Route path="/taskdetail" component={TaskDetail} />
      <Route path="/timetracking" component={TimeTracking} />
      <Route path="/dependencygraph" component={DependencyGraph} />
      <Route path="/prioritymatrix" component={PriorityMatrix} />
      <Route path="/documentsharing" component={DocumentSharing} />
      <Route path="/commentthread" component={CommentThread} />
      <Route path="/activityfeed" component={ActivityFeed} />
      <Route path="/fileversioning" component={FileVersioning} />
      <Route path="/blogeditor" component={BlogEditor} />
      <Route path="/blogpublisher" component={BlogPublisher} />
      <Route path="/contentlibrary" component={ContentLibrary} />
      <Route path="/mediagallery" component={MediaGallery} />
      <Route path="/documenteditor" component={DocumentEditor} />
      <Route path="/videouploader" component={VideoUploader} />
      <Route path="/videoeditor" component={VideoEditor} />
      <Route path="/livestreamsetup" component={LiveStreamSetup} />
      <Route path="/streamanalytics" component={StreamAnalytics} />
      <Route path="/playlistmanager" component={PlaylistManager} />
      <Route path="/podcaststudio" component={PodcastStudio} />
      <Route path="/audiolibrary" component={AudioLibrary} />
      <Route path="/transcriptionmanager" component={TranscriptionManager} />
      <Route path="/audioanalytics" component={AudioAnalytics} />
      <Route path="/publishingschedule" component={PublishingSchedule} />
      <Route path="/distributionchannels" component={DistributionChannels} />
      <Route path="/seooptimizer" component={SEOOptimizer} />
      <Route path="/analyticsreports" component={AnalyticsReports} />
      <Route path="/communityhub" component={CommunityHub} />
      <Route path="/forumcategories" component={ForumCategories} />
      <Route path="/threadmanagement" component={ThreadManagement} />
      <Route path="/moderationdashboard" component={ModerationDashboard} />
      <Route path="/communityguidelines" component={CommunityGuidelines} />
      <Route path="/eventcalendar" component={EventCalendar} />
      <Route path="/eventcreation" component={EventCreation} />
      <Route path="/eventregistration" component={EventRegistration} />
      <Route path="/eventanalytics" component={EventAnalytics} />
      <Route path="/venuemanagement" component={VenueManagement} />
      <Route path="/groupdirectory" component={GroupDirectory} />
      <Route path="/groupmanagement" component={GroupManagement} />
      <Route path="/groupchat" component={GroupChat} />
      <Route path="/groupevents" component={GroupEvents} />
      <Route path="/membershiptiers" component={MembershipTiers} />
      <Route path="/connectionrequests" component={ConnectionRequests} />
      <Route path="/campaignbuilder" component={CampaignBuilder} />
      <Route path="/emailcampaigns" component={EmailCampaigns} />
      <Route path="/smscampaigns" component={SMSCampaigns} />
      <Route path="/socialmediacampaigns" component={SocialMediaCampaigns} />
      <Route path="/pushnotifications" component={PushNotifications} />
      <Route path="/audiencesegmentation" component={AudienceSegmentation} />
      <Route path="/contactmanagement" component={ContactManagement} />
      <Route path="/mailinglists" component={MailingLists} />
      <Route path="/leadscoring" component={LeadScoring} />
      <Route path="/personabuilder" component={PersonaBuilder} />
      <Route path="/campaignanalytics" component={CampaignAnalytics} />
      <Route path="/abtesting" component={ABTesting} />
      <Route path="/conversionoptimization" component={ConversionOptimization} />
      <Route path="/attributionmodeling" component={AttributionModeling} />
      <Route path="/marketingroi" component={MarketingROI} />
      <Route path="/templatelibrary" component={TemplateLibrary} />
      <Route path="/coursebuilder" component={CourseBuilder} />
      <Route path="/lessoneditor" component={LessonEditor} />
      <Route path="/quizbuilder" component={QuizBuilder} />
      <Route path="/assignmenttracker" component={AssignmentTracker} />
      <Route path="/gradebook" component={GradeBook} />
      <Route path="/coursecatalog" component={CourseCatalog} />
      <Route path="/mylearning" component={MyLearning} />
      <Route path="/learningpath" component={LearningPath} />
      <Route path="/certificatemanager" component={CertificateManager} />
      <Route path="/skillbadges" component={SkillBadges} />
      <Route path="/classroommanagement" component={ClassroomManagement} />
      <Route path="/studentprogress" component={StudentProgress} />
      <Route path="/ticketqueue" component={TicketQueue} />
      <Route path="/ticketdetail" component={TicketDetail} />
      <Route path="/ticketassignment" component={TicketAssignment} />
      <Route path="/knowledgebase" component={KnowledgeBase} />
      <Route path="/faqmanagement" component={FAQManagement} />
      <Route path="/livechat" component={LiveChat} />
      <Route path="/chathistory" component={ChatHistory} />
      <Route path="/chatbot" component={ChatBot} />
      <Route path="/emailtemplates" component={EmailTemplates} />
      <Route path="/autoresponder" component={AutoResponder} />
      <Route path="/supportmetrics" component={SupportMetrics} />
      <Route path="/responsetime" component={ResponseTime} />
      <Route path="/apidocumentation" component={APIDocumentation} />
      <Route path="/apitesting" component={APITesting} />
      <Route path="/apimonitoring" component={APIMonitoring} />
      <Route path="/ratelimiting" component={RateLimiting} />
      <Route path="/versionmanagement" component={VersionManagement} />
      <Route path="/coderepository" component={CodeRepository} />
      <Route path="/deploymentpipeline" component={DeploymentPipeline} />
      <Route path="/environmentmanagement" component={EnvironmentManagement} />
      <Route path="/logviewer" component={LogViewer} />
      <Route path="/errortracking" component={ErrorTracking} />
      <Route path="/sdkdownload" component={SDKDownload} />
      <Route path="/codesamples" component={CodeSamples} />
      <Route path="/developercommunity" component={DeveloperCommunity} />
      <Route path="/bugreporting" component={BugReporting} />
      <Route path="/featurerequests" component={FeatureRequests} />
      <Route path="/networkgraph" component={NetworkGraph} />
      <Route path="/mutualconnections" component={MutualConnections} />
      <Route path="/discussionboard" component={DiscussionBoard} />
      <Route path="/resourcelibrary" component={ResourceLibrary} />
      <Route path="/assetmanagement" component={AssetManagement} />
      <Route path="/brandguidelines" component={BrandGuidelines} />
      <Route path="/contentcalendar" component={ContentCalendar} />
      <Route path="/satisfactionsurvey" component={SatisfactionSurvey} />
      <Route path="/agentperformance" component={AgentPerformance} />
      <Route path="/portfoliooverview" component={PortfolioOverview} />
      <Route path="/stocksearch" component={StockSearch} />
      <Route path="/stockchart" component={StockChart} />
      <Route path="/watchlist" component={WatchList} />
      <Route path="/tradehistory" component={TradeHistory} />
      <Route path="/budgetplanner" component={BudgetPlanner} />
      <Route path="/expensetracker" component={ExpenseTracker} />
      <Route path="/savingsgoals" component={SavingsGoals} />
      <Route path="/retirementplanner" component={RetirementPlanner} />
      <Route path="/taxplanning" component={TaxPlanning} />
      <Route path="/financialreports" component={FinancialReports} />
      <Route path="/taxreports" component={TaxReports} />
      <Route path="/networthtracker" component={NetWorthTracker} />
      <Route path="/cashflowanalysis" component={CashFlowAnalysis} />
      <Route path="/aiassistant" component={AIAssistant} />
      <Route path="/mlmodels" component={MLModels} />
      <Route path="/recommendations" component={Recommendations} />
      <Route path="/predictiveanalytics" component={PredictiveAnalytics} />
      <Route path="/nlptools" component={NLPTools} />
      <Route path="/workflowbuilder" component={WorkflowBuilder} />
      <Route path="/automationrules" component={AutomationRules} />
      <Route path="/taskautomation" component={TaskAutomation} />
      <Route path="/triggersactions" component={TriggersActions} />
      <Route path="/scheduledjobs" component={ScheduledJobs} />
      <Route path="/advancedsearch" component={AdvancedSearch} />
      <Route path="/savedsearches" component={SavedSearches} />
      <Route path="/destinationguide" component={DestinationGuide} />
      <Route path="/tripplanner" component={TripPlanner} />
      <Route path="/flightsearch" component={FlightSearch} />
      <Route path="/hotelsearch" component={HotelSearch} />
      <Route path="/carrental" component={CarRental} />
      <Route path="/mytrips" component={MyTrips} />
      <Route path="/traveldocuments" component={TravelDocuments} />
      <Route path="/travelbudget" component={TravelBudget} />
      <Route path="/travelphotos" component={TravelPhotos} />
      <Route path="/travelreviews" component={TravelReviews} />
      <Route path="/travelblog" component={TravelBlog} />
      <Route path="/traveltips" component={TravelTips} />
      <Route path="/healthdashboard" component={HealthDashboard} />
      <Route path="/activitytracking" component={ActivityTracking} />
      <Route path="/nutritiontracker" component={NutritionTracker} />
      <Route path="/sleeptracking" component={SleepTracking} />
      <Route path="/moodtracker" component={MoodTracker} />
      <Route path="/healtharticles" component={HealthArticles} />
      <Route path="/exerciselibrary" component={ExerciseLibrary} />
      <Route path="/mealplans" component={MealPlans} />
      <Route path="/healthgoals" component={HealthGoals} />
      <Route path="/medicationreminder" component={MedicationReminder} />
      <Route path="/propertylisting" component={PropertyListing} />
      <Route path="/propertydetail" component={PropertyDetail} />
      <Route path="/virtualtour" component={VirtualTour} />
      <Route path="/propertycomparison" component={PropertyComparison} />
      <Route path="/savedproperties" component={SavedProperties} />
      <Route path="/mortgagecalculator" component={MortgageCalculator} />
      <Route path="/offermanagement" component={OfferManagement} />
      <Route path="/documentsigning" component={DocumentSigning} />
      <Route path="/closingchecklist" component={ClosingChecklist} />
      <Route path="/propertytransfer" component={PropertyTransfer} />
      <Route path="/gamelobby" component={GameLobby} />
      <Route path="/gameroom" component={GameRoom} />
      <Route path="/leaderboards" component={Leaderboards} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/gamesettings" component={GameSettings} />
      <Route path="/moviecatalog" component={MovieCatalog} />
      <Route path="/moviedetail" component={MovieDetail} />
      <Route path="/watchlist" component={WatchList} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/multiplayerlobby" component={MultiplayerLobby} />
      <Route path="/gamechat" component={GameChat} />
      <Route path="/tournaments" component={Tournaments} />
      <Route path="/calculator" component={Calculator} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/notesapp" component={NotesApp} />
      <Route path="/todolist" component={TodoList} />
      <Route path="/reminders" component={Reminders} />
      <Route path="/fileconverter" component={FileConverter} />
      <Route path="/texttools" component={TextTools} />
      <Route path="/imagetools" component={ImageTools} />
      <Route path="/videotools" component={VideoTools} />
      <Route path="/codeformatter" component={CodeFormatter} />
      <Route path="/helpcenter" component={HelpCenter} />
      <Route path="/feedback" component={Feedback} />
      <Route path="/roadmap" component={Roadmap} />
      <Route path="/changelog" component={ChangeLog} />
      <Route path="/status" component={Status} />
      <Route path="/languagesettings" component={LanguageSettings} />
      <Route path="/regionalsettings" component={RegionalSettings} />
      <Route path="/notificationpreferences" component={NotificationPreferences} />
      <Route path="/mobilehome" component={MobileHome} />
      <Route path="/mobilemenu" component={MobileMenu} />
      <Route path="/mobilesettings" component={MobileSettings} />
      <Route path="/mobilenotifications" component={MobileNotifications} />
      <Route path="/mobilemessages" component={MobileMessages} />
      <Route path="/mobilewallet" component={MobileWallet} />
      <Route path="/mobiletrading" component={MobileTrading} />
      <Route path="/mobilegaming" component={MobileGaming} />
      <Route path="/mobilestreaming" component={MobileStreaming} />
      <Route path="/mobileshop" component={MobileShop} />
      <Route path="/mobileprofile" component={MobileProfile} />
      <Route path="/mobilesearch" component={MobileSearch} />
      <Route path="/slackintegration" component={SlackIntegration} />
      <Route path="/discordintegration" component={DiscordIntegration} />
      <Route path="/telegramintegration" component={TelegramIntegration} />
      <Route path="/emailintegration" component={EmailIntegration} />
      <Route path="/smsintegration" component={SMSIntegration} />
      <Route path="/webhookmanager" component={WebhookManager} />
      <Route path="/zapierintegration" component={ZapierIntegration} />
      <Route path="/ifttt" component={IFTTT} />
      <Route path="/apiintegration" component={APIIntegration} />
      <Route path="/oauthproviders" component={OAuthProviders} />
      <Route path="/sso" component={SSO} />
      <Route path="/ldapintegration" component={LDAPIntegration} />
      <Route path="/salesforceintegration" component={SalesforceIntegration} />
      <Route path="/hubspotintegration" component={HubSpotIntegration} />
      <Route path="/stripeintegration" component={StripeIntegration} />
      <Route path="/paypalintegration" component={PayPalIntegration} />
      <Route path="/termsofservice" component={TermsOfService} />
      <Route path="/privacypolicy" component={PrivacyPolicy} />
      <Route path="/cookiepolicy" component={CookiePolicy} />
      <Route path="/dataprocessing" component={DataProcessing} />
      <Route path="/compliancechecker" component={ComplianceChecker} />
      <Route path="/audittrail" component={AuditTrail} />
      <Route path="/dataretention" component={DataRetention} />
      <Route path="/gdpr" component={GDPR} />
      <Route path="/ccpa" component={CCPA} />
      <Route path="/hipaa" component={HIPAA} />
      <Route path="/soc2" component={SOC2} />
      <Route path="/legaldocuments" component={LegalDocuments} />
      <Route path="/customdashboard" component={CustomDashboard} />
      <Route path="/datavisualization" component={DataVisualization} />
      <Route path="/predictivemodels" component={PredictiveModels} />
      <Route path="/mlinsights" component={MLInsights} />
      <Route path="/anomalydetection" component={AnomalyDetection} />
      <Route path="/trendanalysis" component={TrendAnalysis} />
      <Route path="/forecastingengine" component={ForecastingEngine} />
      <Route path="/segmentationanalysis" component={SegmentationAnalysis} />
      <Route path="/churnprediction" component={ChurnPrediction} />
      <Route path="/ltvanalysis" component={LTVAnalysis} />
      <Route path="/rfmanalysis" component={RFMAnalysis} />
      <Route path="/abtestingadvanced" component={ABTestingAdvanced} />
      <Route path="/multivariatetesting" component={MultivariateTesting} />
      <Route path="/experimenttracker" component={ExperimentTracker} />
      <Route path="/smartcontracts" component={SmartContracts} />
      <Route path="/contractabi" component={ContractABI} />
      <Route path="/nftgallery" component={NFTGallery} />
      <Route path="/nftminting" component={NFTMinting} />
      <Route path="/daogovernance" component={DAOGovernance} />
      <Route path="/daotreasury" component={DAOTreasury} />
      <Route path="/tokenomicscalculator" component={TokenomicsCalculator} />
      <Route path="/stakingdashboard" component={StakingDashboard} />
      <Route path="/liquiditypools" component={LiquidityPools} />
      <Route path="/yieldfarming" component={YieldFarming} />
      <Route path="/bridgetransactions" component={BridgeTransactions} />
      <Route path="/walletconnect" component={WalletConnect} />
      <Route path="/web3auth" component={Web3Auth} />
      <Route path="/ensresolver" component={ENSResolver} />
      <Route path="/gastracker" component={GasTracker} />
      <Route path="/transactionexplorer" component={TransactionExplorer} />
      <Route path="/blockchainmonitor" component={BlockchainMonitor} />
      <Route path="/smartcontractaudit" component={SmartContractAudit} />
      <Route path="/vendoronboarding" component={VendorOnboarding} />
      <Route path="/vendorverification" component={VendorVerification} />
      <Route path="/commissionmanagement" component={CommissionManagement} />
      <Route path="/payoutmanagement" component={PayoutManagement} />
      <Route path="/disputeresolution" component={DisputeResolution} />
      <Route path="/reviewmoderation" component={ReviewModeration} />
      <Route path="/productapproval" component={ProductApproval} />
      <Route path="/categorymanagement" component={CategoryManagement} />
      <Route path="/pricingrules" component={PricingRules} />
      <Route path="/promotionengine" component={PromotionEngine} />
      <Route path="/bulkoperations" component={BulkOperations} />
      <Route path="/marketplaceanalytics" component={MarketplaceAnalytics} />
      <Route path="/vendorperformance" component={VendorPerformance} />
      <Route path="/customerdisputes" component={CustomerDisputes} />
      <Route path="/apikeys" component={APIKeys} />
      <Route path="/apiusage" component={APIUsage} />
      <Route path="/ratelimitconfig" component={RateLimitConfig} />
      <Route path="/apiversioning" component={APIVersioning} />
      <Route path="/deprecationpolicy" component={DeprecationPolicy} />
      <Route path="/apistatus" component={APIStatus} />
      <Route path="/incidentmanagement" component={IncidentManagement} />
      <Route path="/changelog" component={ChangeLog} />
      <Route path="/sdkmanagement" component={SDKManagement} />
      <Route path="/clientlibraries" component={ClientLibraries} />
      <Route path="/apimonitoring" component={APIMonitoring} />
      <Route path="/alertconfiguration" component={AlertConfiguration} />
          <Route component={NotFound} />
      
        </Switch>
      </ErrorBoundary>
    </Suspense>
      </main>
      <MobileBottomNav />
    </div>
  );
}

const WebhookManager = lazy(() => import("@/pages/WebhookManager"));
const GamingForCharity = lazy(() => import("./pages/GamingForCharity"));
const GameCryptoQuiz = lazy(() => import("./pages/GameCryptoQuiz"));
const GameTokenTap = lazy(() => import("./pages/GameTokenTap"));
const GameBlockBuilder = lazy(() => import("./pages/GameBlockBuilder"));
const CreatorOnboarding = lazy(() => import("./pages/CreatorOnboarding"));
const CreateArticle = lazy(() => import("./pages/CreateArticle"));
const CreateReel = lazy(() => import("./pages/CreateReel"));
const CommunityCreate = lazy(() => import("./pages/CommunityCreate"));
const CreateAudio = lazy(() => import("./pages/CreateAudio"));
const CreateLiveStream = lazy(() => import("./pages/CreateLiveStream"));
const CreateDrop = lazy(() => import("./pages/CreateDrop"));
const RateLimitDashboard = lazy(() => import("@/pages/RateLimitDashboard"));
const StreamClip = lazy(() => import("@/pages/StreamClip"));
const GameFiQuestBoard = lazy(() => import("@/pages/GameFiQuestBoard"));

const AffiliateDashboard = lazy(() => import("@/pages/AffiliateDashboard"));
const CryptoMine = lazy(() => import("./pages/CryptoMine"));
const MegaMarketplace = lazy(() => import("./pages/MegaMarketplace"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const Profitability = lazy(() => import("./pages/Profitability"));
const AgentBuilder = lazy(() => import("@/pages/AgentBuilder"));
const AgentDetail = lazy(() => import("@/pages/AgentDetail"));
const AgentMarketplace = lazy(() => import("@/pages/AgentMarketplace"));
const AgentSprint = lazy(() => import("@/pages/AgentSprint"));
const AgentsDashboard = lazy(() => import("@/pages/AgentsDashboard"));
const CreatorAnalytics = lazy(() => import("@/pages/CreatorAnalytics"));
const LiveGifting = lazy(() => import("./pages/LiveGifting"));
const CreatorMonetization = lazy(() => import("@/pages/CreatorMonetization"));
const ProfileEdit = lazy(() => import("@/pages/ProfileEdit"));
const SchoolCertificate = lazy(() => import("@/pages/SchoolCertificate"));
const SchoolCourse = lazy(() => import("@/pages/SchoolCourse"));
const SchoolDashboard = lazy(() => import("@/pages/SchoolDashboard"));
const SchoolLesson = lazy(() => import("@/pages/SchoolLesson"));
const SchoolQuiz = lazy(() => import("@/pages/SchoolQuiz"));

const Mining = lazy(() => import("@/pages/Mining"));
const WatchEarn = lazy(() => import("@/pages/WatchEarn"));
const About = lazy(() => import("@/pages/About"));
const DEXDepthChart = lazy(() => import("@/pages/DEXDepthChart"));
const StreamGifting = lazy(() => import("@/pages/StreamGifting"));
const StripeCheckout = lazy(() => import("@/pages/StripeCheckout"));
// YC MVP Surfaces
const ChatMVP = lazy(() => import("@/pages/ChatMVP"));
const ActionPanel = lazy(() => import("@/pages/ActionPanel"));
const ProfileWallet = lazy(() => import("@/pages/ProfileWallet"));
// Phase 9 — Intelligence Layer
const AgentCoordinationHub = lazy(() => import("@/pages/AgentCoordinationHub"));
const MemorySystem = lazy(() => import("@/pages/MemorySystem"));
const PredictiveSystems = lazy(() => import("@/pages/PredictiveSystems"));
const SelfHealingInfra = lazy(() => import("@/pages/SelfHealingInfra"));
const AdaptivePersonalization = lazy(() => import("@/pages/AdaptivePersonalization"));
// Phase 10 — Data Economy
const DataLake = lazy(() => import("@/pages/DataLake"));
const AnalyticsProducts = lazy(() => import("@/pages/AnalyticsProducts"));
const ReputationSystem = lazy(() => import("@/pages/ReputationSystem"));
const CreatorIntelligence = lazy(() => import("@/pages/CreatorIntelligence"));
const AITrainingLoops = lazy(() => import("@/pages/AITrainingLoops"));
// Phase 12 — Sovereign Network
const DecentralizedIdentity = lazy(() => import("@/pages/DecentralizedIdentity"));
const TokenGovernance = lazy(() => import("@/pages/TokenGovernance"));
const CrossChainInterop = lazy(() => import("@/pages/CrossChainInterop"));
const ProtocolLayer = lazy(() => import("@/pages/ProtocolLayer"));
const AIPersonaSystem = lazy(() => import("@/pages/AIPersonaSystem"));
const DefensibilityMoat = lazy(() => import("@/pages/DefensibilityMoat"));
const RetentionEngine = lazy(() => import("@/pages/RetentionEngine"));
const SystemArchitecture = lazy(() => import("@/pages/SystemArchitecture"));
const GTMStrategy = lazy(() => import("@/pages/GTMStrategy"));
const AIAgentMarket = lazy(() => import("@/pages/AIAgentMarket"));
const BuildRoadmap = lazy(() => import("@/pages/BuildRoadmap"));
const PricingEngine = lazy(() => import("@/pages/PricingEngine"));
const PaymentInfra = lazy(() => import("@/pages/PaymentInfra"));
const SecurityCompliance = lazy(() => import("@/pages/SecurityCompliance"));
const ProductionArchitecture = lazy(() => import("@/pages/ProductionArchitecture"));
const BuildOrder = lazy(() => import("@/pages/BuildOrder"));
const MasterArchitecture = lazy(() => import("@/pages/MasterArchitecture"));
const DatingHome = lazy(() => import("@/pages/DatingHome"));
const MatchFeed = lazy(() => import("@/pages/MatchFeed"));
const MatchChat = lazy(() => import("@/pages/MatchChat"));
const AIMatchmaker = lazy(() => import("@/pages/AIMatchmaker"));
const DatingPremium = lazy(() => import("@/pages/DatingPremium"));
const AmbientFeed = lazy(() => import("@/pages/AmbientFeed"));
const EntityProfile = lazy(() => import("@/pages/EntityProfile"));
const MatchSpace = lazy(() => import("@/pages/MatchSpace"));
const WorldBrain = lazy(() => import("@/pages/WorldBrain"));
const ActionObjects = lazy(() => import("@/pages/ActionObjects"));
const UnhiddenMode = lazy(() => import("@/pages/UnhiddenMode"));
const SystemObservability = lazy(() => import("@/pages/SystemObservability"));
const AutomationEngine = lazy(() => import("@/pages/AutomationEngine"));
const WorldSimulationControl = lazy(() => import("@/pages/WorldSimulationControl"));
const EconomyControl = lazy(() => import("@/pages/EconomyControl"));
const HOPEAIControl = lazy(() => import("@/pages/HOPEAIControl"));
const UnhiddenInterface = lazy(() => import("@/pages/UnhiddenInterface"));
const PowerUserTools = lazy(() => import("@/pages/PowerUserTools"));
const CryptoHub = lazy(() => import("@/pages/CryptoHub"));
const TrustSystem = lazy(() => import("@/pages/TrustSystem"));
const LegendaryStatus = lazy(() => import("@/pages/LegendaryStatus"));
const DHgateShop = lazy(() => import("@/pages/DHgateShop"));
const PrivacyVault = lazy(() => import("@/pages/PrivacyVault"));
const GhostMode = lazy(() => import("@/pages/GhostMode"));
const ShadowRelay = lazy(() => import("@/pages/ShadowRelay"));
const TorBridge = lazy(() => import("@/pages/TorBridge"));
const AntiSurveillance = lazy(() => import("@/pages/AntiSurveillance"));
const VoiceCommandsRegistry = lazy(() => import("@/pages/VoiceCommandsRegistry"));
const MobileApp = lazy(() => import("@/pages/MobileApp"));
const BrowserExtension = lazy(() => import("@/pages/BrowserExtension"));
const EmbedSDK = lazy(() => import("@/pages/EmbedSDK"));
const DeveloperProtocol = lazy(() => import("@/pages/DeveloperProtocol"));
const CRM = lazy(() => import("@/pages/CRM"));
const KnowledgeBase = lazy(() => import("@/pages/KnowledgeBase"));
const AgentCoordination = lazy(() => import("@/pages/AgentCoordination"));
const UnifiedFeed = lazy(() => import("@/pages/UnifiedFeed"));
const AutomationWorkflows = lazy(() => import("@/pages/AutomationWorkflows"));
const UnifiedIdentity = lazy(() => import("@/pages/UnifiedIdentity"));
const UnifiedPaymentLedger = lazy(() => import("@/pages/UnifiedPaymentLedger"));
const SystemStatus = lazy(() => import("@/pages/SystemStatus"));
const NSFWPlatform = lazy(() => import("@/pages/NSFWPlatform"));
const Trending = lazy(() => import("@/pages/Trending"));
const Channels = lazy(() => import("@/pages/Channels"));
const Events = lazy(() => import("@/pages/Events"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const DeFiPage = lazy(() => import("@/pages/DeFi"));
const Achievements = lazy(() => import("@/pages/Achievements"));
const Subscriptions = lazy(() => import("@/pages/Subscriptions"));

const TipJar = lazy(() => import("@/pages/TipJar"));
const ContentScheduler = lazy(() => import("@/pages/ContentScheduler"));
const LiveReactions = lazy(() => import("@/pages/LiveReactions"));
const ServerInstaller = lazy(() => import("@/pages/ServerInstaller"));
const CreatorSpotlight = lazy(() => import("@/pages/CreatorSpotlight"));
const BookPage = lazy(() => import("@/pages/BookPage"));
const NSFWFeed = lazy(() => import("@/pages/NSFWFeed"));
const ContentVault = lazy(() => import("@/pages/ContentVault"));
const PayoutDashboard = lazy(() => import("@/pages/PayoutDashboard"));
const ServerHealth = lazy(() => import("@/pages/ServerHealth"));
const DigitalArtStore = lazy(() => import("@/pages/DigitalArtStore"));
const CreatorProfile = lazy(() => import("@/pages/CreatorProfile"));
const AgeGate = lazy(() => import("@/pages/AgeGate"));
const ShadowIdentity = lazy(() => import("@/pages/ShadowIdentity"));
const NotificationIntelligence = lazy(() => import("@/pages/NotificationIntelligence"));
const ComplianceCenter = lazy(() => import("@/pages/ComplianceCenter"));
const AIPersonaFeed = lazy(() => import("@/pages/AIPersonaFeed"));
const EconomicLayer = lazy(() => import("@/pages/EconomicLayer"));
const TrustSafetyDashboard = lazy(() => import("@/pages/TrustSafetyDashboard"));
const EarnHub = lazy(() => import("./pages/EarnHub"));
const InvestorPortal = lazy(() => import("./pages/InvestorPortal"));
const PlatformMap = lazy(() => import("./pages/PlatformMap"));
const AIMarketAgents = lazy(() => import("./pages/AIMarketAgents"));
const SpinWheel = lazy(() => import("./pages/SpinWheel"));
const BattlePass = lazy(() => import("./pages/BattlePass"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const HashtagExplorer = lazy(() => import("./pages/HashtagExplorer"));
const SocialGraph = lazy(() => import("./pages/SocialGraph"));
const ClanWars = lazy(() => import("./pages/ClanWars"));
const P2EShop = lazy(() => import("./pages/P2EShop"));
const TeamWorkspace = lazy(() => import("./pages/TeamWorkspace"));
const ChinaEdition = lazy(() => import("./pages/ChinaEdition"));
const MultiCryptoMine = lazy(() => import("./pages/MultiCryptoMine"));
const ImpactMap = lazy(() => import("./pages/ImpactMap"));
const LanguagePartnerDiscovery = lazy(() => import("./pages/LanguagePartnerDiscovery"));
const PracticeSessions = lazy(() => import("./pages/PracticeSessions"));
const ProgressTracking = lazy(() => import("./pages/ProgressTracking"));
const BountySystem = lazy(() => import("./pages/BountySystem"));
const UnifiedMessaging = lazy(() => import("./pages/UnifiedMessaging"));
const VideoChat = lazy(() => import("./pages/VideoChat"));
const TranslationEnabledSocialFeed = lazy(() => import("./pages/TranslationEnabledSocialFeed"));
const TranslationEnabledCommunity = lazy(() => import("./pages/TranslationEnabledCommunity"));
const UnifiedPlatformDashboard = lazy(() => import("./pages/UnifiedPlatformDashboard"));
const TeachingOpportunities = lazy(() => import("./pages/TeachingOpportunities"));
const LanguageExchangeAdmin = lazy(() => import("./pages/LanguageExchangeAdmin"));
// ─── New Engine Pages ─────────────────────────────────────────────────────────
const BlockchainCustody = lazy(() => import("./pages/BlockchainCustody"));
const FreeWillDashboard = lazy(() => import("./pages/FreeWillDashboard"));
const DigitalNationMode = lazy(() => import("./pages/DigitalNationMode"));
const EnterpriseAnalytics = lazy(() => import("./pages/EnterpriseAnalytics"));
const SituationRoom = lazy(() => import("./pages/SituationRoom"));
const LifeCommand = lazy(() => import("./pages/LifeCommand"));
const DestinyEngine = lazy(() => import("./pages/DestinyEngine"));
const SKY444CentralBank = lazy(() => import("./pages/SKY444CentralBank"));
const CitizenPassport = lazy(() => import("./pages/CitizenPassport"));
const MemoryConstellation = lazy(() => import("./pages/MemoryConstellation"));
const AgentCity = lazy(() => import("./pages/AgentCity"));
const CivilizationSimulator = lazy(() => import("./pages/CivilizationSimulator"));
const InvestorMetrics = lazy(() => import("./pages/InvestorMetrics"));
const ProductCatalog = lazy(() => import("./pages/ProductCatalog"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ProductReviews = lazy(() => import("./pages/ProductReviews"));
const ProductComparison = lazy(() => import("./pages/ProductComparison"));
const InventoryManagement = lazy(() => import("./pages/InventoryManagement"));
const ShoppingCart = lazy(() => import("./pages/ShoppingCart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const ReturnManagement = lazy(() => import("./pages/ReturnManagement"));
const WishlistManagement = lazy(() => import("./pages/WishlistManagement"));
const SellerDashboard = lazy(() => import("./pages/SellerDashboard"));
const ProductListing = lazy(() => import("./pages/ProductListing"));
const BulkUpload = lazy(() => import("./pages/BulkUpload"));
const ShippingManagement = lazy(() => import("./pages/ShippingManagement"));
const VendorAnalytics = lazy(() => import("./pages/VendorAnalytics"));
const DashboardOverview = lazy(() => import("./pages/DashboardOverview"));
const SalesAnalytics = lazy(() => import("./pages/SalesAnalytics"));
const CustomerAnalytics = lazy(() => import("./pages/CustomerAnalytics"));
const ConversionFunnel = lazy(() => import("./pages/ConversionFunnel"));
const CohortAnalysis = lazy(() => import("./pages/CohortAnalysis"));
const CustomReports = lazy(() => import("./pages/CustomReports"));
const DataExport = lazy(() => import("./pages/DataExport"));
const ScheduledReports = lazy(() => import("./pages/ScheduledReports"));
const RealTimeMonitoring = lazy(() => import("./pages/RealTimeMonitoring"));
const AlertManagement = lazy(() => import("./pages/AlertManagement"));
const PerformanceMetrics = lazy(() => import("./pages/PerformanceMetrics"));
const UserBehavior = lazy(() => import("./pages/UserBehavior"));
const EngagementMetrics = lazy(() => import("./pages/EngagementMetrics"));
const RetentionAnalytics = lazy(() => import("./pages/RetentionAnalytics"));
const UserDirectory = lazy(() => import("./pages/UserDirectory"));
const UserPermissions = lazy(() => import("./pages/UserPermissions"));
const AccessControl = lazy(() => import("./pages/AccessControl"));
const UserOnboarding = lazy(() => import("./pages/UserOnboarding"));
const OrganizationSettings = lazy(() => import("./pages/OrganizationSettings"));
const DepartmentManagement = lazy(() => import("./pages/DepartmentManagement"));
const TeamManagement = lazy(() => import("./pages/TeamManagement"));
const RoleManagement = lazy(() => import("./pages/RoleManagement"));
const PolicyManagement = lazy(() => import("./pages/PolicyManagement"));
const ComplianceDashboard = lazy(() => import("./pages/ComplianceDashboard"));
const DataPrivacy = lazy(() => import("./pages/DataPrivacy"));
const SecurityAudit = lazy(() => import("./pages/SecurityAudit"));
const BackupManagement = lazy(() => import("./pages/BackupManagement"));
const DisasterRecovery = lazy(() => import("./pages/DisasterRecovery"));
const InvoiceManagement = lazy(() => import("./pages/InvoiceManagement"));
const BillingHistory = lazy(() => import("./pages/BillingHistory"));
const SubscriptionManagement = lazy(() => import("./pages/SubscriptionManagement"));
const CostAllocation = lazy(() => import("./pages/CostAllocation"));
const ExpenseManagement = lazy(() => import("./pages/ExpenseManagement"));
const ProjectBoard = lazy(() => import("./pages/ProjectBoard"));
const GanttChart = lazy(() => import("./pages/GanttChart"));
const RoadmapView = lazy(() => import("./pages/RoadmapView"));
const MilestoneTracking = lazy(() => import("./pages/MilestoneTracking"));
const ResourceAllocation = lazy(() => import("./pages/ResourceAllocation"));
const TaskList = lazy(() => import("./pages/TaskList"));
const TaskDetail = lazy(() => import("./pages/TaskDetail"));
const TimeTracking = lazy(() => import("./pages/TimeTracking"));
const DependencyGraph = lazy(() => import("./pages/DependencyGraph"));
const PriorityMatrix = lazy(() => import("./pages/PriorityMatrix"));
const DocumentSharing = lazy(() => import("./pages/DocumentSharing"));
const CommentThread = lazy(() => import("./pages/CommentThread"));
const ActivityFeed = lazy(() => import("./pages/ActivityFeed"));
const FileVersioning = lazy(() => import("./pages/FileVersioning"));
const BlogEditor = lazy(() => import("./pages/BlogEditor"));
const BlogPublisher = lazy(() => import("./pages/BlogPublisher"));
const ContentLibrary = lazy(() => import("./pages/ContentLibrary"));
const MediaGallery = lazy(() => import("./pages/MediaGallery"));
const DocumentEditor = lazy(() => import("./pages/DocumentEditor"));
const VideoUploader = lazy(() => import("./pages/VideoUploader"));
const VideoEditor = lazy(() => import("./pages/VideoEditor"));
const LiveStreamSetup = lazy(() => import("./pages/LiveStreamSetup"));
const StreamAnalytics = lazy(() => import("./pages/StreamAnalytics"));
const PlaylistManager = lazy(() => import("./pages/PlaylistManager"));
const PodcastStudio = lazy(() => import("./pages/PodcastStudio"));
const AudioLibrary = lazy(() => import("./pages/AudioLibrary"));
const TranscriptionManager = lazy(() => import("./pages/TranscriptionManager"));
const AudioAnalytics = lazy(() => import("./pages/AudioAnalytics"));
const PublishingSchedule = lazy(() => import("./pages/PublishingSchedule"));
const DistributionChannels = lazy(() => import("./pages/DistributionChannels"));
const SEOOptimizer = lazy(() => import("./pages/SEOOptimizer"));
const AnalyticsReports = lazy(() => import("./pages/AnalyticsReports"));
const CommunityHub = lazy(() => import("./pages/CommunityHub"));
const ForumCategories = lazy(() => import("./pages/ForumCategories"));
const ThreadManagement = lazy(() => import("./pages/ThreadManagement"));
const ModerationDashboard = lazy(() => import("./pages/ModerationDashboard"));
const CommunityGuidelines = lazy(() => import("./pages/CommunityGuidelines"));
const EventCalendar = lazy(() => import("./pages/EventCalendar"));
const EventCreation = lazy(() => import("./pages/EventCreation"));
const EventRegistration = lazy(() => import("./pages/EventRegistration"));
const EventAnalytics = lazy(() => import("./pages/EventAnalytics"));
const VenueManagement = lazy(() => import("./pages/VenueManagement"));
const GroupDirectory = lazy(() => import("./pages/GroupDirectory"));
const GroupManagement = lazy(() => import("./pages/GroupManagement"));
const GroupChat = lazy(() => import("./pages/GroupChat"));
const GroupEvents = lazy(() => import("./pages/GroupEvents"));
const MembershipTiers = lazy(() => import("./pages/MembershipTiers"));
const ConnectionRequests = lazy(() => import("./pages/ConnectionRequests"));
const CampaignBuilder = lazy(() => import("./pages/CampaignBuilder"));
const EmailCampaigns = lazy(() => import("./pages/EmailCampaigns"));
const SMSCampaigns = lazy(() => import("./pages/SMSCampaigns"));
const SocialMediaCampaigns = lazy(() => import("./pages/SocialMediaCampaigns"));
const PushNotifications = lazy(() => import("./pages/PushNotifications"));
const AudienceSegmentation = lazy(() => import("./pages/AudienceSegmentation"));
const ContactManagement = lazy(() => import("./pages/ContactManagement"));
const MailingLists = lazy(() => import("./pages/MailingLists"));
const LeadScoring = lazy(() => import("./pages/LeadScoring"));
const PersonaBuilder = lazy(() => import("./pages/PersonaBuilder"));
const CampaignAnalytics = lazy(() => import("./pages/CampaignAnalytics"));
const ABTesting = lazy(() => import("./pages/ABTesting"));
const ConversionOptimization = lazy(() => import("./pages/ConversionOptimization"));
const AttributionModeling = lazy(() => import("./pages/AttributionModeling"));
const MarketingROI = lazy(() => import("./pages/MarketingROI"));
const TemplateLibrary = lazy(() => import("./pages/TemplateLibrary"));
const CourseBuilder = lazy(() => import("./pages/CourseBuilder"));
const LessonEditor = lazy(() => import("./pages/LessonEditor"));
const QuizBuilder = lazy(() => import("./pages/QuizBuilder"));
const AssignmentTracker = lazy(() => import("./pages/AssignmentTracker"));
const GradeBook = lazy(() => import("./pages/GradeBook"));
const CourseCatalog = lazy(() => import("./pages/CourseCatalog"));
const MyLearning = lazy(() => import("./pages/MyLearning"));
const LearningPath = lazy(() => import("./pages/LearningPath"));
const CertificateManager = lazy(() => import("./pages/CertificateManager"));
const SkillBadges = lazy(() => import("./pages/SkillBadges"));
const ClassroomManagement = lazy(() => import("./pages/ClassroomManagement"));
const StudentProgress = lazy(() => import("./pages/StudentProgress"));
const TicketQueue = lazy(() => import("./pages/TicketQueue"));
const TicketDetail = lazy(() => import("./pages/TicketDetail"));
const TicketAssignment = lazy(() => import("./pages/TicketAssignment"));
const FAQManagement = lazy(() => import("./pages/FAQManagement"));
const LiveChat = lazy(() => import("./pages/LiveChat"));
const ChatHistory = lazy(() => import("./pages/ChatHistory"));
const ChatBot = lazy(() => import("./pages/ChatBot"));
const EmailTemplates = lazy(() => import("./pages/EmailTemplates"));
const AutoResponder = lazy(() => import("./pages/AutoResponder"));
const SupportMetrics = lazy(() => import("./pages/SupportMetrics"));
const ResponseTime = lazy(() => import("./pages/ResponseTime"));
const APIDocumentation = lazy(() => import("./pages/APIDocumentation"));
const APITesting = lazy(() => import("./pages/APITesting"));
const APIMonitoring = lazy(() => import("./pages/APIMonitoring"));
const RateLimiting = lazy(() => import("./pages/RateLimiting"));
const VersionManagement = lazy(() => import("./pages/VersionManagement"));
const CodeRepository = lazy(() => import("./pages/CodeRepository"));
const DeploymentPipeline = lazy(() => import("./pages/DeploymentPipeline"));
const EnvironmentManagement = lazy(() => import("./pages/EnvironmentManagement"));
const LogViewer = lazy(() => import("./pages/LogViewer"));
const ErrorTracking = lazy(() => import("./pages/ErrorTracking"));
const SDKDownload = lazy(() => import("./pages/SDKDownload"));
const CodeSamples = lazy(() => import("./pages/CodeSamples"));
const DeveloperCommunity = lazy(() => import("./pages/DeveloperCommunity"));
const BugReporting = lazy(() => import("./pages/BugReporting"));
const FeatureRequests = lazy(() => import("./pages/FeatureRequests"));
const NetworkGraph = lazy(() => import("./pages/NetworkGraph"));
const MutualConnections = lazy(() => import("./pages/MutualConnections"));
const DiscussionBoard = lazy(() => import("./pages/DiscussionBoard"));
const ResourceLibrary = lazy(() => import("./pages/ResourceLibrary"));
const AssetManagement = lazy(() => import("./pages/AssetManagement"));
const BrandGuidelines = lazy(() => import("./pages/BrandGuidelines"));
const ContentCalendar = lazy(() => import("./pages/ContentCalendar"));
const SatisfactionSurvey = lazy(() => import("./pages/SatisfactionSurvey"));
const AgentPerformance = lazy(() => import("./pages/AgentPerformance"));
const PortfolioOverview = lazy(() => import("./pages/PortfolioOverview"));
const StockSearch = lazy(() => import("./pages/StockSearch"));
const StockChart = lazy(() => import("./pages/StockChart"));
const WatchList = lazy(() => import("./pages/WatchList"));
const TradeHistory = lazy(() => import("./pages/TradeHistory"));
const BudgetPlanner = lazy(() => import("./pages/BudgetPlanner"));
const ExpenseTracker = lazy(() => import("./pages/ExpenseTracker"));
const SavingsGoals = lazy(() => import("./pages/SavingsGoals"));
const RetirementPlanner = lazy(() => import("./pages/RetirementPlanner"));
const TaxPlanning = lazy(() => import("./pages/TaxPlanning"));
const FinancialReports = lazy(() => import("./pages/FinancialReports"));
const TaxReports = lazy(() => import("./pages/TaxReports"));
const NetWorthTracker = lazy(() => import("./pages/NetWorthTracker"));
const CashFlowAnalysis = lazy(() => import("./pages/CashFlowAnalysis"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const MLModels = lazy(() => import("./pages/MLModels"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const PredictiveAnalytics = lazy(() => import("./pages/PredictiveAnalytics"));
const NLPTools = lazy(() => import("./pages/NLPTools"));
const WorkflowBuilder = lazy(() => import("./pages/WorkflowBuilder"));
const AutomationRules = lazy(() => import("./pages/AutomationRules"));
const TaskAutomation = lazy(() => import("./pages/TaskAutomation"));
const TriggersActions = lazy(() => import("./pages/TriggersActions"));
const ScheduledJobs = lazy(() => import("./pages/ScheduledJobs"));
const AdvancedSearch = lazy(() => import("./pages/AdvancedSearch"));
const SavedSearches = lazy(() => import("./pages/SavedSearches"));
const DestinationGuide = lazy(() => import("./pages/DestinationGuide"));
const TripPlanner = lazy(() => import("./pages/TripPlanner"));
const FlightSearch = lazy(() => import("./pages/FlightSearch"));
const HotelSearch = lazy(() => import("./pages/HotelSearch"));
const CarRental = lazy(() => import("./pages/CarRental"));
const MyTrips = lazy(() => import("./pages/MyTrips"));
const TravelDocuments = lazy(() => import("./pages/TravelDocuments"));
const TravelBudget = lazy(() => import("./pages/TravelBudget"));
const TravelPhotos = lazy(() => import("./pages/TravelPhotos"));
const TravelReviews = lazy(() => import("./pages/TravelReviews"));
const TravelBlog = lazy(() => import("./pages/TravelBlog"));
const TravelTips = lazy(() => import("./pages/TravelTips"));
const HealthDashboard = lazy(() => import("./pages/HealthDashboard"));
const ActivityTracking = lazy(() => import("./pages/ActivityTracking"));
const NutritionTracker = lazy(() => import("./pages/NutritionTracker"));
const SleepTracking = lazy(() => import("./pages/SleepTracking"));
const MoodTracker = lazy(() => import("./pages/MoodTracker"));
const HealthArticles = lazy(() => import("./pages/HealthArticles"));
const ExerciseLibrary = lazy(() => import("./pages/ExerciseLibrary"));
const MealPlans = lazy(() => import("./pages/MealPlans"));
const HealthGoals = lazy(() => import("./pages/HealthGoals"));
const MedicationReminder = lazy(() => import("./pages/MedicationReminder"));
const PropertyListing = lazy(() => import("./pages/PropertyListing"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const VirtualTour = lazy(() => import("./pages/VirtualTour"));
const PropertyComparison = lazy(() => import("./pages/PropertyComparison"));
const SavedProperties = lazy(() => import("./pages/SavedProperties"));
const MortgageCalculator = lazy(() => import("./pages/MortgageCalculator"));
const OfferManagement = lazy(() => import("./pages/OfferManagement"));
const DocumentSigning = lazy(() => import("./pages/DocumentSigning"));
const ClosingChecklist = lazy(() => import("./pages/ClosingChecklist"));
const PropertyTransfer = lazy(() => import("./pages/PropertyTransfer"));
const GameLobby = lazy(() => import("./pages/GameLobby"));
const GameRoom = lazy(() => import("./pages/GameRoom"));
const GameSettings = lazy(() => import("./pages/GameSettings"));
const MovieCatalog = lazy(() => import("./pages/MovieCatalog"));
const MovieDetail = lazy(() => import("./pages/MovieDetail"));
const Reviews = lazy(() => import("./pages/Reviews"));
const MultiplayerLobby = lazy(() => import("./pages/MultiplayerLobby"));
const GameChat = lazy(() => import("./pages/GameChat"));
const Calculator = lazy(() => import("./pages/Calculator"));
const Calendar = lazy(() => import("./pages/Calendar"));
const NotesApp = lazy(() => import("./pages/NotesApp"));
const TodoList = lazy(() => import("./pages/TodoList"));
const Reminders = lazy(() => import("./pages/Reminders"));
const FileConverter = lazy(() => import("./pages/FileConverter"));
const TextTools = lazy(() => import("./pages/TextTools"));
const ImageTools = lazy(() => import("./pages/ImageTools"));
const VideoTools = lazy(() => import("./pages/VideoTools"));
const CodeFormatter = lazy(() => import("./pages/CodeFormatter"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const ChangeLog = lazy(() => import("./pages/ChangeLog"));
const Status = lazy(() => import("./pages/Status"));
const LanguageSettings = lazy(() => import("./pages/LanguageSettings"));
const RegionalSettings = lazy(() => import("./pages/RegionalSettings"));
const NotificationPreferences = lazy(() => import("./pages/NotificationPreferences"));
const MobileHome = lazy(() => import("./pages/MobileHome"));
const MobileMenu = lazy(() => import("./pages/MobileMenu"));
const MobileSettings = lazy(() => import("./pages/MobileSettings"));
const MobileNotifications = lazy(() => import("./pages/MobileNotifications"));
const MobileMessages = lazy(() => import("./pages/MobileMessages"));
const MobileWallet = lazy(() => import("./pages/MobileWallet"));
const MobileTrading = lazy(() => import("./pages/MobileTrading"));
const MobileGaming = lazy(() => import("./pages/MobileGaming"));
const MobileStreaming = lazy(() => import("./pages/MobileStreaming"));
const MobileShop = lazy(() => import("./pages/MobileShop"));
const MobileProfile = lazy(() => import("./pages/MobileProfile"));
const MobileSearch = lazy(() => import("./pages/MobileSearch"));
const SlackIntegration = lazy(() => import("./pages/SlackIntegration"));
const DiscordIntegration = lazy(() => import("./pages/DiscordIntegration"));
const TelegramIntegration = lazy(() => import("./pages/TelegramIntegration"));
const EmailIntegration = lazy(() => import("./pages/EmailIntegration"));
const SMSIntegration = lazy(() => import("./pages/SMSIntegration"));
const WebhookManager = lazy(() => import("./pages/WebhookManager"));
const ZapierIntegration = lazy(() => import("./pages/ZapierIntegration"));
const IFTTT = lazy(() => import("./pages/IFTTT"));
const APIIntegration = lazy(() => import("./pages/APIIntegration"));
const OAuthProviders = lazy(() => import("./pages/OAuthProviders"));
const SSO = lazy(() => import("./pages/SSO"));
const LDAPIntegration = lazy(() => import("./pages/LDAPIntegration"));
const SalesforceIntegration = lazy(() => import("./pages/SalesforceIntegration"));
const HubSpotIntegration = lazy(() => import("./pages/HubSpotIntegration"));
const StripeIntegration = lazy(() => import("./pages/StripeIntegration"));
const PayPalIntegration = lazy(() => import("./pages/PayPalIntegration"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const DataProcessing = lazy(() => import("./pages/DataProcessing"));
const ComplianceChecker = lazy(() => import("./pages/ComplianceChecker"));
const AuditTrail = lazy(() => import("./pages/AuditTrail"));
const DataRetention = lazy(() => import("./pages/DataRetention"));
const GDPR = lazy(() => import("./pages/GDPR"));
const CCPA = lazy(() => import("./pages/CCPA"));
const HIPAA = lazy(() => import("./pages/HIPAA"));
const SOC2 = lazy(() => import("./pages/SOC2"));
const LegalDocuments = lazy(() => import("./pages/LegalDocuments"));
const CustomDashboard = lazy(() => import("./pages/CustomDashboard"));
const DataVisualization = lazy(() => import("./pages/DataVisualization"));
const PredictiveModels = lazy(() => import("./pages/PredictiveModels"));
const MLInsights = lazy(() => import("./pages/MLInsights"));
const AnomalyDetection = lazy(() => import("./pages/AnomalyDetection"));
const TrendAnalysis = lazy(() => import("./pages/TrendAnalysis"));
const ForecastingEngine = lazy(() => import("./pages/ForecastingEngine"));
const SegmentationAnalysis = lazy(() => import("./pages/SegmentationAnalysis"));
const ChurnPrediction = lazy(() => import("./pages/ChurnPrediction"));
const LTVAnalysis = lazy(() => import("./pages/LTVAnalysis"));
const RFMAnalysis = lazy(() => import("./pages/RFMAnalysis"));
const ABTestingAdvanced = lazy(() => import("./pages/ABTestingAdvanced"));
const MultivariateTesting = lazy(() => import("./pages/MultivariateTesting"));
const ExperimentTracker = lazy(() => import("./pages/ExperimentTracker"));
const SmartContracts = lazy(() => import("./pages/SmartContracts"));
const ContractABI = lazy(() => import("./pages/ContractABI"));
const NFTGallery = lazy(() => import("./pages/NFTGallery"));
const NFTMinting = lazy(() => import("./pages/NFTMinting"));
const DAOGovernance = lazy(() => import("./pages/DAOGovernance"));
const DAOTreasury = lazy(() => import("./pages/DAOTreasury"));
const TokenomicsCalculator = lazy(() => import("./pages/TokenomicsCalculator"));
const StakingDashboard = lazy(() => import("./pages/StakingDashboard"));
const LiquidityPools = lazy(() => import("./pages/LiquidityPools"));
const YieldFarming = lazy(() => import("./pages/YieldFarming"));
const BridgeTransactions = lazy(() => import("./pages/BridgeTransactions"));
const WalletConnect = lazy(() => import("./pages/WalletConnect"));
const Web3Auth = lazy(() => import("./pages/Web3Auth"));
const ENSResolver = lazy(() => import("./pages/ENSResolver"));
const GasTracker = lazy(() => import("./pages/GasTracker"));
const TransactionExplorer = lazy(() => import("./pages/TransactionExplorer"));
const BlockchainMonitor = lazy(() => import("./pages/BlockchainMonitor"));
const SmartContractAudit = lazy(() => import("./pages/SmartContractAudit"));
const VendorOnboarding = lazy(() => import("./pages/VendorOnboarding"));
const VendorVerification = lazy(() => import("./pages/VendorVerification"));
const CommissionManagement = lazy(() => import("./pages/CommissionManagement"));
const PayoutManagement = lazy(() => import("./pages/PayoutManagement"));
const DisputeResolution = lazy(() => import("./pages/DisputeResolution"));
const ReviewModeration = lazy(() => import("./pages/ReviewModeration"));
const ProductApproval = lazy(() => import("./pages/ProductApproval"));
const CategoryManagement = lazy(() => import("./pages/CategoryManagement"));
const PricingRules = lazy(() => import("./pages/PricingRules"));
const PromotionEngine = lazy(() => import("./pages/PromotionEngine"));
const BulkOperations = lazy(() => import("./pages/BulkOperations"));
const MarketplaceAnalytics = lazy(() => import("./pages/MarketplaceAnalytics"));
const VendorPerformance = lazy(() => import("./pages/VendorPerformance"));
const CustomerDisputes = lazy(() => import("./pages/CustomerDisputes"));
const APIKeys = lazy(() => import("./pages/APIKeys"));
const APIUsage = lazy(() => import("./pages/APIUsage"));
const RateLimitConfig = lazy(() => import("./pages/RateLimitConfig"));
const APIVersioning = lazy(() => import("./pages/APIVersioning"));
const DeprecationPolicy = lazy(() => import("./pages/DeprecationPolicy"));
const APIStatus = lazy(() => import("./pages/APIStatus"));
const IncidentManagement = lazy(() => import("./pages/IncidentManagement"));
const ChangeLog = lazy(() => import("./pages/ChangeLog"));
const SDKManagement = lazy(() => import("./pages/SDKManagement"));
const ClientLibraries = lazy(() => import("./pages/ClientLibraries"));
const APIMonitoring = lazy(() => import("./pages/APIMonitoring"));
const AlertConfiguration = lazy(() => import("./pages/AlertConfiguration"));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
          <AlwaysOnVoice />
          <HopeCompanion />
          <AchievementToastContainer />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
