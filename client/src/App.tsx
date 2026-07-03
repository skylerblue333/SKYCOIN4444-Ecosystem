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
const ABTesting = lazy(() => import("./pages/ABTesting"));
const ABTestingAdvanced = lazy(() => import("./pages/ABTestingAdvanced"));
const AIAgent = lazy(() => import("./pages/AIAgent"));
const AIAgentEconomy = lazy(() => import("./pages/AIAgentEconomy"));
const AIAgentMarket = lazy(() => import("./pages/AIAgentMarket"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const AIBrain = lazy(() => import("./pages/AIBrain"));
const AICodeStudio = lazy(() => import("./pages/AICodeStudio"));
const AICopyStudio = lazy(() => import("./pages/AICopyStudio"));
const AICore = lazy(() => import("./pages/AICore"));
const AIEngineer = lazy(() => import("./pages/AIEngineer"));
const AIIntelligenceHub = lazy(() => import("./pages/AIIntelligenceHub"));
const AIMarketAgents = lazy(() => import("./pages/AIMarketAgents"));
const AIMatchmaker = lazy(() => import("./pages/AIMatchmaker"));
const AIModerationQueue = lazy(() => import("./pages/AIModerationQueue"));
const AIPersonaFeed = lazy(() => import("./pages/AIPersonaFeed"));
const AIPersonaSystem = lazy(() => import("./pages/AIPersonaSystem"));
const AIToolsHub = lazy(() => import("./pages/AIToolsHub"));
const AITrading = lazy(() => import("./pages/AITrading"));
const AITrainingLoops = lazy(() => import("./pages/AITrainingLoops"));
const APIDocs = lazy(() => import("./pages/APIDocs"));
const APIDocumentation = lazy(() => import("./pages/APIDocumentation"));
const APIIntegration = lazy(() => import("./pages/APIIntegration"));
const APIKeys = lazy(() => import("./pages/APIKeys"));
const APILogs = lazy(() => import("./pages/APILogs"));
const APIMonitoring = lazy(() => import("./pages/APIMonitoring"));
const APIStatus = lazy(() => import("./pages/APIStatus"));
const APITesting = lazy(() => import("./pages/APITesting"));
const APIUsage = lazy(() => import("./pages/APIUsage"));
const APIVersioning = lazy(() => import("./pages/APIVersioning"));
const About = lazy(() => import("./pages/About"));
const AccessControl = lazy(() => import("./pages/AccessControl"));
const AccessibilitySettings = lazy(() => import("./pages/AccessibilitySettings"));
const AccordionNavigation = lazy(() => import("./pages/AccordionNavigation"));
const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const Achievements = lazy(() => import("./pages/Achievements"));
const ActionObjects = lazy(() => import("./pages/ActionObjects"));
const ActionPanel = lazy(() => import("./pages/ActionPanel"));
const ActivityFeed = lazy(() => import("./pages/ActivityFeed"));
const ActivityTracking = lazy(() => import("./pages/ActivityTracking"));
const AdaptivePersonalization = lazy(() => import("./pages/AdaptivePersonalization"));
const AdaptiveRoadmap = lazy(() => import("./pages/AdaptiveRoadmap"));
const AddBankAccount = lazy(() => import("./pages/AddBankAccount"));
const AddCreditCard = lazy(() => import("./pages/AddCreditCard"));
const AddressBook = lazy(() => import("./pages/AddressBook"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AdminWalletManager = lazy(() => import("./pages/AdminWalletManager"));
const AdvancedAdminPanel = lazy(() => import("./pages/AdvancedAdminPanel"));
const AdvancedAnalytics = lazy(() => import("./pages/AdvancedAnalytics"));
const AdvancedSearch = lazy(() => import("./pages/AdvancedSearch"));
const AffiliateDashboard = lazy(() => import("./pages/AffiliateDashboard"));
const AgeGate = lazy(() => import("./pages/AgeGate"));
const AgentBuilder = lazy(() => import("./pages/AgentBuilder"));
const AgentCity = lazy(() => import("./pages/AgentCity"));
const AgentCoordination = lazy(() => import("./pages/AgentCoordination"));
const AgentCoordinationHub = lazy(() => import("./pages/AgentCoordinationHub"));
const AgentDebate = lazy(() => import("./pages/AgentDebate"));
const AgentDetail = lazy(() => import("./pages/AgentDetail"));
const AgentMarketplace = lazy(() => import("./pages/AgentMarketplace"));
const AgentPerformance = lazy(() => import("./pages/AgentPerformance"));
const AgentSprint = lazy(() => import("./pages/AgentSprint"));
const AgentsDashboard = lazy(() => import("./pages/AgentsDashboard"));
const AlertConfiguration = lazy(() => import("./pages/AlertConfiguration"));
const AlertDialog = lazy(() => import("./pages/AlertDialog"));
const AlertManagement = lazy(() => import("./pages/AlertManagement"));
const AmbientFeed = lazy(() => import("./pages/AmbientFeed"));
const Analytics = lazy(() => import("./pages/Analytics"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const AnalyticsProducts = lazy(() => import("./pages/AnalyticsProducts"));
const AnalyticsReports = lazy(() => import("./pages/AnalyticsReports"));
const AnomalyDetection = lazy(() => import("./pages/AnomalyDetection"));
const AntiSurveillance = lazy(() => import("./pages/AntiSurveillance"));
const Arcade = lazy(() => import("./pages/Arcade"));
const AssetManagement = lazy(() => import("./pages/AssetManagement"));
const AssignmentTracker = lazy(() => import("./pages/AssignmentTracker"));
const AttributionModeling = lazy(() => import("./pages/AttributionModeling"));
const AudienceSegmentation = lazy(() => import("./pages/AudienceSegmentation"));
const AudioAnalytics = lazy(() => import("./pages/AudioAnalytics"));
const AudioLibrary = lazy(() => import("./pages/AudioLibrary"));
const AudioPlayer = lazy(() => import("./pages/AudioPlayer"));
const AuditLog = lazy(() => import("./pages/AuditLog"));
const AuditTrail = lazy(() => import("./pages/AuditTrail"));
const AutoResponder = lazy(() => import("./pages/AutoResponder"));
const AutomationEngine = lazy(() => import("./pages/AutomationEngine"));
const AutomationRules = lazy(() => import("./pages/AutomationRules"));
const AutomationWorkflows = lazy(() => import("./pages/AutomationWorkflows"));
const BackupManagement = lazy(() => import("./pages/BackupManagement"));
const Badges = lazy(() => import("./pages/Badges"));
const BanSuspendUser = lazy(() => import("./pages/BanSuspendUser"));
const BattlePass = lazy(() => import("./pages/BattlePass"));
const BehavioralIntelligence = lazy(() => import("./pages/BehavioralIntelligence"));
const Beta = lazy(() => import("./pages/Beta"));
const BillingHistory = lazy(() => import("./pages/BillingHistory"));
const BlockUser = lazy(() => import("./pages/BlockUser"));
const BlockchainCustody = lazy(() => import("./pages/BlockchainCustody"));
const BlockchainMonitor = lazy(() => import("./pages/BlockchainMonitor"));
const BlogEditor = lazy(() => import("./pages/BlogEditor"));
const BlogPublisher = lazy(() => import("./pages/BlogPublisher"));
const BookPage = lazy(() => import("./pages/BookPage"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const BountySystem = lazy(() => import("./pages/BountySystem"));
const BrandGuidelines = lazy(() => import("./pages/BrandGuidelines"));
const BreadcrumbNavigation = lazy(() => import("./pages/BreadcrumbNavigation"));
const BridgeTransactions = lazy(() => import("./pages/BridgeTransactions"));
const BrowserExtension = lazy(() => import("./pages/BrowserExtension"));
const BudgetPlanner = lazy(() => import("./pages/BudgetPlanner"));
const BugReporting = lazy(() => import("./pages/BugReporting"));
const BuildOrder = lazy(() => import("./pages/BuildOrder"));
const BuildRoadmap = lazy(() => import("./pages/BuildRoadmap"));
const BulkOperations = lazy(() => import("./pages/BulkOperations"));
const BulkUpload = lazy(() => import("./pages/BulkUpload"));
const CCPA = lazy(() => import("./pages/CCPA"));
const CRM = lazy(() => import("./pages/CRM"));
const Calculator = lazy(() => import("./pages/Calculator"));
const Calendar = lazy(() => import("./pages/Calendar"));
const CalendarView = lazy(() => import("./pages/CalendarView"));
const CampaignAnalytics = lazy(() => import("./pages/CampaignAnalytics"));
const CampaignBuilder = lazy(() => import("./pages/CampaignBuilder"));
const CarRental = lazy(() => import("./pages/CarRental"));
const CardGridView = lazy(() => import("./pages/CardGridView"));
const CashFlowAnalysis = lazy(() => import("./pages/CashFlowAnalysis"));
const CategoryManagement = lazy(() => import("./pages/CategoryManagement"));
const CertificateManager = lazy(() => import("./pages/CertificateManager"));
const ChangeLog = lazy(() => import("./pages/ChangeLog"));
const Channels = lazy(() => import("./pages/Channels"));
const Charity = lazy(() => import("./pages/Charity"));
const CharityLeaderboard = lazy(() => import("./pages/CharityLeaderboard"));
const ChartDashboard = lazy(() => import("./pages/ChartDashboard"));
const ChatBot = lazy(() => import("./pages/ChatBot"));
const ChatHistory = lazy(() => import("./pages/ChatHistory"));
const ChatMVP = lazy(() => import("./pages/ChatMVP"));
const Chatbot = lazy(() => import("./pages/Chatbot"));
const CheckboxGroupForm = lazy(() => import("./pages/CheckboxGroupForm"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ChinaEdition = lazy(() => import("./pages/ChinaEdition"));
const ChurnPrediction = lazy(() => import("./pages/ChurnPrediction"));
const CitizenPassport = lazy(() => import("./pages/CitizenPassport"));
const CivilizationSimulator = lazy(() => import("./pages/CivilizationSimulator"));
const ClanWars = lazy(() => import("./pages/ClanWars"));
const ClassroomManagement = lazy(() => import("./pages/ClassroomManagement"));
const ClientLibraries = lazy(() => import("./pages/ClientLibraries"));
const ClosingChecklist = lazy(() => import("./pages/ClosingChecklist"));
const CodeFormatter = lazy(() => import("./pages/CodeFormatter"));
const CodeIntelligence = lazy(() => import("./pages/CodeIntelligence"));
const CodeQuality = lazy(() => import("./pages/CodeQuality"));
const CodeQualityDashboard = lazy(() => import("./pages/CodeQualityDashboard"));
const CodeRepository = lazy(() => import("./pages/CodeRepository"));
const CodeSamples = lazy(() => import("./pages/CodeSamples"));
const CohortAnalysis = lazy(() => import("./pages/CohortAnalysis"));
const ColorPickerDialog = lazy(() => import("./pages/ColorPickerDialog"));
const CommentThread = lazy(() => import("./pages/CommentThread"));
const CommentsSection = lazy(() => import("./pages/CommentsSection"));
const CommissionManagement = lazy(() => import("./pages/CommissionManagement"));
const Community = lazy(() => import("./pages/Community"));
const CommunityCreate = lazy(() => import("./pages/CommunityCreate"));
const CommunityGuidelines = lazy(() => import("./pages/CommunityGuidelines"));
const CommunityHub = lazy(() => import("./pages/CommunityHub"));
const CompanySimulator = lazy(() => import("./pages/CompanySimulator"));
const CompetitiveRadar = lazy(() => import("./pages/CompetitiveRadar"));
const ComplianceCenter = lazy(() => import("./pages/ComplianceCenter"));
const ComplianceChecker = lazy(() => import("./pages/ComplianceChecker"));
const ComplianceDashboard = lazy(() => import("./pages/ComplianceDashboard"));
const ComponentShowcase = lazy(() => import("./pages/ComponentShowcase"));
const ConfirmationDialog = lazy(() => import("./pages/ConfirmationDialog"));
const ConnectedApps = lazy(() => import("./pages/ConnectedApps"));
const ConnectionError = lazy(() => import("./pages/ConnectionError"));
const ConnectionRequests = lazy(() => import("./pages/ConnectionRequests"));
const ConnectorIntelligence = lazy(() => import("./pages/ConnectorIntelligence"));
const ContactManagement = lazy(() => import("./pages/ContactManagement"));
const ContactUsForm = lazy(() => import("./pages/ContactUsForm"));
const ContentCalendar = lazy(() => import("./pages/ContentCalendar"));
const ContentLibrary = lazy(() => import("./pages/ContentLibrary"));
const ContentModeration = lazy(() => import("./pages/ContentModeration"));
const ContentScheduler = lazy(() => import("./pages/ContentScheduler"));
const ContentVault = lazy(() => import("./pages/ContentVault"));
const ContextMenu = lazy(() => import("./pages/ContextMenu"));
const ContractABI = lazy(() => import("./pages/ContractABI"));
const ConversionFunnel = lazy(() => import("./pages/ConversionFunnel"));
const ConversionOptimization = lazy(() => import("./pages/ConversionOptimization"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const CostAllocation = lazy(() => import("./pages/CostAllocation"));
const CourseBuilder = lazy(() => import("./pages/CourseBuilder"));
const CourseCatalog = lazy(() => import("./pages/CourseCatalog"));
const CoverPhoto = lazy(() => import("./pages/CoverPhoto"));
const CreateArticle = lazy(() => import("./pages/CreateArticle"));
const CreateAudio = lazy(() => import("./pages/CreateAudio"));
const CreateDrop = lazy(() => import("./pages/CreateDrop"));
const CreateLiveStream = lazy(() => import("./pages/CreateLiveStream"));
const CreateReel = lazy(() => import("./pages/CreateReel"));
const CreatorAnalytics = lazy(() => import("./pages/CreatorAnalytics"));
const CreatorDashboard = lazy(() => import("./pages/CreatorDashboard"));
const CreatorEconomy = lazy(() => import("./pages/CreatorEconomy"));
const CreatorIntelligence = lazy(() => import("./pages/CreatorIntelligence"));
const CreatorMonetization = lazy(() => import("./pages/CreatorMonetization"));
const CreatorOnboarding = lazy(() => import("./pages/CreatorOnboarding"));
const CreatorProfile = lazy(() => import("./pages/CreatorProfile"));
const CreatorSpotlight = lazy(() => import("./pages/CreatorSpotlight"));
const CreatorStudio = lazy(() => import("./pages/CreatorStudio"));
const CrossChainInterop = lazy(() => import("./pages/CrossChainInterop"));
const Crypto = lazy(() => import("./pages/Crypto"));
const CryptoHub = lazy(() => import("./pages/CryptoHub"));
const CryptoMine = lazy(() => import("./pages/CryptoMine"));
const CryptoResearchHub = lazy(() => import("./pages/CryptoResearchHub"));
const CustomDashboard = lazy(() => import("./pages/CustomDashboard"));
const CustomReports = lazy(() => import("./pages/CustomReports"));
const CustomerAnalytics = lazy(() => import("./pages/CustomerAnalytics"));
const CustomerDisputes = lazy(() => import("./pages/CustomerDisputes"));
const DAOGovernance = lazy(() => import("./pages/DAOGovernance"));
const DAOTreasury = lazy(() => import("./pages/DAOTreasury"));
const DEXDepthChart = lazy(() => import("./pages/DEXDepthChart"));
const DHgateShop = lazy(() => import("./pages/DHgateShop"));
const DMInbox = lazy(() => import("./pages/DMInbox"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardOverview = lazy(() => import("./pages/DashboardOverview"));
const DataExport = lazy(() => import("./pages/DataExport"));
const DataGrid = lazy(() => import("./pages/DataGrid"));
const DataLake = lazy(() => import("./pages/DataLake"));
const DataPrivacy = lazy(() => import("./pages/DataPrivacy"));
const DataProcessing = lazy(() => import("./pages/DataProcessing"));
const DataRetention = lazy(() => import("./pages/DataRetention"));
const DataTable = lazy(() => import("./pages/DataTable"));
const DataVisualization = lazy(() => import("./pages/DataVisualization"));
const DatabaseManagement = lazy(() => import("./pages/DatabaseManagement"));
const DateInputForm = lazy(() => import("./pages/DateInputForm"));
const DatePickerDialog = lazy(() => import("./pages/DatePickerDialog"));
const DatingDiscovery = lazy(() => import("./pages/DatingDiscovery"));
const DatingHome = lazy(() => import("./pages/DatingHome"));
const DatingMatches = lazy(() => import("./pages/DatingMatches"));
const DatingMessages = lazy(() => import("./pages/DatingMessages"));
const DatingPremium = lazy(() => import("./pages/DatingPremium"));
const DatingProfile = lazy(() => import("./pages/DatingProfile"));
const DatingProfileSetup = lazy(() => import("./pages/DatingProfileSetup"));
const DatingSubscription = lazy(() => import("./pages/DatingSubscription"));
const DayTradeRoom = lazy(() => import("./pages/DayTradeRoom"));
const DeFi = lazy(() => import("./pages/DeFi"));
const DecentralizedIdentity = lazy(() => import("./pages/DecentralizedIdentity"));
const DefensibilityMoat = lazy(() => import("./pages/DefensibilityMoat"));
const DeleteAccount = lazy(() => import("./pages/DeleteAccount"));
const DeleteContent = lazy(() => import("./pages/DeleteContent"));
const DepartmentManagement = lazy(() => import("./pages/DepartmentManagement"));
const DependencyGraph = lazy(() => import("./pages/DependencyGraph"));
const DeploymentPipeline = lazy(() => import("./pages/DeploymentPipeline"));
const DeprecationPolicy = lazy(() => import("./pages/DeprecationPolicy"));
const DestinationGuide = lazy(() => import("./pages/DestinationGuide"));
const DestinyEngine = lazy(() => import("./pages/DestinyEngine"));
const DevOps = lazy(() => import("./pages/DevOps"));
const DeveloperArea = lazy(() => import("./pages/DeveloperArea"));
const DeveloperCommunity = lazy(() => import("./pages/DeveloperCommunity"));
const DeveloperMarketplace = lazy(() => import("./pages/DeveloperMarketplace"));
const DeveloperProtocol = lazy(() => import("./pages/DeveloperProtocol"));
const DigitalArtStore = lazy(() => import("./pages/DigitalArtStore"));
const DigitalNationMode = lazy(() => import("./pages/DigitalNationMode"));
const DigitalTwin = lazy(() => import("./pages/DigitalTwin"));
const DirectMessages = lazy(() => import("./pages/DirectMessages"));
const DisasterRecovery = lazy(() => import("./pages/DisasterRecovery"));
const DiscordIntegration = lazy(() => import("./pages/DiscordIntegration"));
const Discover = lazy(() => import("./pages/Discover"));
const DiscussionBoard = lazy(() => import("./pages/DiscussionBoard"));
const DiscussionForums = lazy(() => import("./pages/DiscussionForums"));
const DisputeResolution = lazy(() => import("./pages/DisputeResolution"));
const DistributionChannels = lazy(() => import("./pages/DistributionChannels"));
const DocumentEditor = lazy(() => import("./pages/DocumentEditor"));
const DocumentSharing = lazy(() => import("./pages/DocumentSharing"));
const DocumentSigning = lazy(() => import("./pages/DocumentSigning"));
const Documentation = lazy(() => import("./pages/Documentation"));
const DropdownMenu = lazy(() => import("./pages/DropdownMenu"));
const ENSResolver = lazy(() => import("./pages/ENSResolver"));
const EarnHub = lazy(() => import("./pages/EarnHub"));
const EconomicLayer = lazy(() => import("./pages/EconomicLayer"));
const Economics = lazy(() => import("./pages/Economics"));
const EconomyControl = lazy(() => import("./pages/EconomyControl"));
const Ecosystem = lazy(() => import("./pages/Ecosystem"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const EmailCampaigns = lazy(() => import("./pages/EmailCampaigns"));
const EmailInputForm = lazy(() => import("./pages/EmailInputForm"));
const EmailIntegration = lazy(() => import("./pages/EmailIntegration"));
const EmailNotifications = lazy(() => import("./pages/EmailNotifications"));
const EmailTemplates = lazy(() => import("./pages/EmailTemplates"));
const EmailVerification = lazy(() => import("./pages/EmailVerification"));
const EmbedSDK = lazy(() => import("./pages/EmbedSDK"));
const EmptySearchState = lazy(() => import("./pages/EmptySearchState"));
const EngagementMetrics = lazy(() => import("./pages/EngagementMetrics"));
const Engineer = lazy(() => import("./pages/Engineer"));
const Enterprise = lazy(() => import("./pages/Enterprise"));
const EnterpriseAPI = lazy(() => import("./pages/EnterpriseAPI"));
const EnterpriseAnalytics = lazy(() => import("./pages/EnterpriseAnalytics"));
const EntityProfile = lazy(() => import("./pages/EntityProfile"));
const EnvironmentManagement = lazy(() => import("./pages/EnvironmentManagement"));
const Error403 = lazy(() => import("./pages/Error403"));
const Error404 = lazy(() => import("./pages/Error404"));
const Error500 = lazy(() => import("./pages/Error500"));
const Error503 = lazy(() => import("./pages/Error503"));
const ErrorDialog = lazy(() => import("./pages/ErrorDialog"));
const ErrorTracking = lazy(() => import("./pages/ErrorTracking"));
const EscrowShop = lazy(() => import("./pages/EscrowShop"));
const EventAnalytics = lazy(() => import("./pages/EventAnalytics"));
const EventCalendar = lazy(() => import("./pages/EventCalendar"));
const EventCreation = lazy(() => import("./pages/EventCreation"));
const EventPlanner = lazy(() => import("./pages/EventPlanner"));
const EventRegistration = lazy(() => import("./pages/EventRegistration"));
const Events = lazy(() => import("./pages/Events"));
const ExerciseLibrary = lazy(() => import("./pages/ExerciseLibrary"));
const ExpenseManagement = lazy(() => import("./pages/ExpenseManagement"));
const ExpenseTracker = lazy(() => import("./pages/ExpenseTracker"));
const ExperimentFactory = lazy(() => import("./pages/ExperimentFactory"));
const ExperimentTracker = lazy(() => import("./pages/ExperimentTracker"));
const Explore = lazy(() => import("./pages/Explore"));
const ExportData = lazy(() => import("./pages/ExportData"));
const FAQManagement = lazy(() => import("./pages/FAQManagement"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const Farming = lazy(() => import("./pages/Farming"));
const Favorites = lazy(() => import("./pages/Favorites"));
const FeatureRequests = lazy(() => import("./pages/FeatureRequests"));
const FeatureTour = lazy(() => import("./pages/FeatureTour"));
const Features = lazy(() => import("./pages/Features"));
const Feedback = lazy(() => import("./pages/Feedback"));
const FeedbackDialog = lazy(() => import("./pages/FeedbackDialog"));
const FeedbackForm = lazy(() => import("./pages/FeedbackForm"));
const FeedbackHub = lazy(() => import("./pages/FeedbackHub"));
const FileBrowser = lazy(() => import("./pages/FileBrowser"));
const FileConverter = lazy(() => import("./pages/FileConverter"));
const FileDownload = lazy(() => import("./pages/FileDownload"));
const FilePreview = lazy(() => import("./pages/FilePreview"));
const FileUploadDialog = lazy(() => import("./pages/FileUploadDialog"));
const FileUploadForm = lazy(() => import("./pages/FileUploadForm"));
const FileUploadProgress = lazy(() => import("./pages/FileUploadProgress"));
const FileVersioning = lazy(() => import("./pages/FileVersioning"));
const FilterPanel = lazy(() => import("./pages/FilterPanel"));
const FinancialReports = lazy(() => import("./pages/FinancialReports"));
const FlightSearch = lazy(() => import("./pages/FlightSearch"));
const FollowList = lazy(() => import("./pages/FollowList"));
const FollowUnfollow = lazy(() => import("./pages/FollowUnfollow"));
const FollowerList = lazy(() => import("./pages/FollowerList"));
const ForecastingEngine = lazy(() => import("./pages/ForecastingEngine"));
const ForumCategories = lazy(() => import("./pages/ForumCategories"));
const FreeWillDashboard = lazy(() => import("./pages/FreeWillDashboard"));
const GDPR = lazy(() => import("./pages/GDPR"));
const GTMStrategy = lazy(() => import("./pages/GTMStrategy"));
const GameBlackjack = lazy(() => import("./pages/GameBlackjack"));
const GameBlockBuilder = lazy(() => import("./pages/GameBlockBuilder"));
const GameChat = lazy(() => import("./pages/GameChat"));
const GameCrash = lazy(() => import("./pages/GameCrash"));
const GameCryptoQuiz = lazy(() => import("./pages/GameCryptoQuiz"));
const GameDice = lazy(() => import("./pages/GameDice"));
const GameFiQuestBoard = lazy(() => import("./pages/GameFiQuestBoard"));
const GameLobby = lazy(() => import("./pages/GameLobby"));
const GamePlinko = lazy(() => import("./pages/GamePlinko"));
const GameRoom = lazy(() => import("./pages/GameRoom"));
const GameRoulette = lazy(() => import("./pages/GameRoulette"));
const GameSettings = lazy(() => import("./pages/GameSettings"));
const GameSlots = lazy(() => import("./pages/GameSlots"));
const GameTokenTap = lazy(() => import("./pages/GameTokenTap"));
const Gaming = lazy(() => import("./pages/Gaming"));
const GamingForCharity = lazy(() => import("./pages/GamingForCharity"));
const GanttChart = lazy(() => import("./pages/GanttChart"));
const GasFeeEstimator = lazy(() => import("./pages/GasFeeEstimator"));
const GasTracker = lazy(() => import("./pages/GasTracker"));
const GeneralSettings = lazy(() => import("./pages/GeneralSettings"));
const GeneratedApiExplorer = lazy(() => import("./pages/GeneratedApiExplorer"));
const GeneratedGallery = lazy(() => import("./pages/GeneratedGallery"));
const GettingStartedGuide = lazy(() => import("./pages/GettingStartedGuide"));
const GhostMode = lazy(() => import("./pages/GhostMode"));
const GlobalOperationsCenter = lazy(() => import("./pages/GlobalOperationsCenter"));
const GlobalSearch = lazy(() => import("./pages/GlobalSearch"));
const Governance = lazy(() => import("./pages/Governance"));
const GovernanceWizard = lazy(() => import("./pages/GovernanceWizard"));
const GradeBook = lazy(() => import("./pages/GradeBook"));
const GroupChat = lazy(() => import("./pages/GroupChat"));
const GroupDirectory = lazy(() => import("./pages/GroupDirectory"));
const GroupEvents = lazy(() => import("./pages/GroupEvents"));
const GroupManagement = lazy(() => import("./pages/GroupManagement"));
const Growth = lazy(() => import("./pages/Growth"));
const Guilds = lazy(() => import("./pages/Guilds"));
const HIPAA = lazy(() => import("./pages/HIPAA"));
const HOPEAIControl = lazy(() => import("./pages/HOPEAIControl"));
const HashtagExplorer = lazy(() => import("./pages/HashtagExplorer"));
const HashtagSearch = lazy(() => import("./pages/HashtagSearch"));
const HealthArticles = lazy(() => import("./pages/HealthArticles"));
const HealthDashboard = lazy(() => import("./pages/HealthDashboard"));
const HealthGoals = lazy(() => import("./pages/HealthGoals"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const Home = lazy(() => import("./pages/Home"));
const HopeAI = lazy(() => import("./pages/HopeAI"));
const HopeAIAdvanced = lazy(() => import("./pages/HopeAIAdvanced"));
const HopeAIMeta = lazy(() => import("./pages/HopeAIMeta"));
const HopeAIUpgrades = lazy(() => import("./pages/HopeAIUpgrades"));
const HotelSearch = lazy(() => import("./pages/HotelSearch"));
const HubSpotIntegration = lazy(() => import("./pages/HubSpotIntegration"));
const ICOLaunchpad = lazy(() => import("./pages/ICOLaunchpad"));
const IFTTT = lazy(() => import("./pages/IFTTT"));
const ImageGallery = lazy(() => import("./pages/ImageGallery"));
const ImageTools = lazy(() => import("./pages/ImageTools"));
const ImageViewer = lazy(() => import("./pages/ImageViewer"));
const ImpactMap = lazy(() => import("./pages/ImpactMap"));
const InAppNotifications = lazy(() => import("./pages/InAppNotifications"));
const IncidentManagement = lazy(() => import("./pages/IncidentManagement"));
const InputDialog = lazy(() => import("./pages/InputDialog"));
const InstructorDashboard = lazy(() => import("./pages/InstructorDashboard"));
const IntegrationSetup = lazy(() => import("./pages/IntegrationSetup"));
const Integrations = lazy(() => import("./pages/Integrations"));
const InventoryManagement = lazy(() => import("./pages/InventoryManagement"));
const InvestorMetrics = lazy(() => import("./pages/InvestorMetrics"));
const InvestorPitch = lazy(() => import("./pages/InvestorPitch"));
const InvestorPortal = lazy(() => import("./pages/InvestorPortal"));
const InvestorRoom = lazy(() => import("./pages/InvestorRoom"));
const InvoiceDetails = lazy(() => import("./pages/InvoiceDetails"));
const InvoiceManagement = lazy(() => import("./pages/InvoiceManagement"));
const KnowledgeBase = lazy(() => import("./pages/KnowledgeBase"));
const LDAPIntegration = lazy(() => import("./pages/LDAPIntegration"));
const LTVAnalysis = lazy(() => import("./pages/LTVAnalysis"));
const LanguageExchangeAdmin = lazy(() => import("./pages/LanguageExchangeAdmin"));
const LanguagePartnerDiscovery = lazy(() => import("./pages/LanguagePartnerDiscovery"));
const LanguageSettings = lazy(() => import("./pages/LanguageSettings"));
const LeadScoring = lazy(() => import("./pages/LeadScoring"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Leaderboards = lazy(() => import("./pages/Leaderboards"));
const Learning = lazy(() => import("./pages/Learning"));
const LearningPath = lazy(() => import("./pages/LearningPath"));
const LegalDocuments = lazy(() => import("./pages/LegalDocuments"));
const LegendaryStatus = lazy(() => import("./pages/LegendaryStatus"));
const LessonEditor = lazy(() => import("./pages/LessonEditor"));
const LifeCommand = lazy(() => import("./pages/LifeCommand"));
const Lightbox = lazy(() => import("./pages/Lightbox"));
const LikeReactionSystem = lazy(() => import("./pages/LikeReactionSystem"));
const LiquidityPools = lazy(() => import("./pages/LiquidityPools"));
const ListView = lazy(() => import("./pages/ListView"));
const Live = lazy(() => import("./pages/Live"));
const LiveChat = lazy(() => import("./pages/LiveChat"));
const LiveGifting = lazy(() => import("./pages/LiveGifting"));
const LiveReactions = lazy(() => import("./pages/LiveReactions"));
const LiveStreamSetup = lazy(() => import("./pages/LiveStreamSetup"));
const LivestreamDashboard = lazy(() => import("./pages/LivestreamDashboard"));
const LoadingDialog = lazy(() => import("./pages/LoadingDialog"));
const LogViewer = lazy(() => import("./pages/LogViewer"));
const Login = lazy(() => import("./pages/Login"));
const LogisticsOptimizer = lazy(() => import("./pages/LogisticsOptimizer"));
const MLInsights = lazy(() => import("./pages/MLInsights"));
const MLModels = lazy(() => import("./pages/MLModels"));
const MailingLists = lazy(() => import("./pages/MailingLists"));
const MainDashboard = lazy(() => import("./pages/MainDashboard"));
const MaintenanceMode = lazy(() => import("./pages/MaintenanceMode"));
const MapView = lazy(() => import("./pages/MapView"));
const MarketingROI = lazy(() => import("./pages/MarketingROI"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const MarketplaceAnalytics = lazy(() => import("./pages/MarketplaceAnalytics"));
const MasterArchitecture = lazy(() => import("./pages/MasterArchitecture"));
const MatchChat = lazy(() => import("./pages/MatchChat"));
const MatchFeed = lazy(() => import("./pages/MatchFeed"));
const MatchSpace = lazy(() => import("./pages/MatchSpace"));
const MealPlans = lazy(() => import("./pages/MealPlans"));
const MediaCarousel = lazy(() => import("./pages/MediaCarousel"));
const MediaGallery = lazy(() => import("./pages/MediaGallery"));
const MedicationReminder = lazy(() => import("./pages/MedicationReminder"));
const MegaMarketplace = lazy(() => import("./pages/MegaMarketplace"));
const MembershipTiers = lazy(() => import("./pages/MembershipTiers"));
const MemoryConstellation = lazy(() => import("./pages/MemoryConstellation"));
const MemoryGraphVisualizer = lazy(() => import("./pages/MemoryGraphVisualizer"));
const MemorySystem = lazy(() => import("./pages/MemorySystem"));
const Messages = lazy(() => import("./pages/Messages"));
const MilestoneTracking = lazy(() => import("./pages/MilestoneTracking"));
const MinerDashboard = lazy(() => import("./pages/MinerDashboard"));
const Mining = lazy(() => import("./pages/Mining"));
const MiningCalculator = lazy(() => import("./pages/MiningCalculator"));
const MiningDashboard = lazy(() => import("./pages/MiningDashboard"));
const MissionControl = lazy(() => import("./pages/MissionControl"));
const MobileApp = lazy(() => import("./pages/MobileApp"));
const MobileGaming = lazy(() => import("./pages/MobileGaming"));
const MobileHome = lazy(() => import("./pages/MobileHome"));
const MobileMenu = lazy(() => import("./pages/MobileMenu"));
const MobileMessages = lazy(() => import("./pages/MobileMessages"));
const MobileNotifications = lazy(() => import("./pages/MobileNotifications"));
const MobileProfile = lazy(() => import("./pages/MobileProfile"));
const MobileSearch = lazy(() => import("./pages/MobileSearch"));
const MobileSettings = lazy(() => import("./pages/MobileSettings"));
const MobileShop = lazy(() => import("./pages/MobileShop"));
const MobileStreaming = lazy(() => import("./pages/MobileStreaming"));
const MobileTrading = lazy(() => import("./pages/MobileTrading"));
const MobileWallet = lazy(() => import("./pages/MobileWallet"));
const ModerationDashboard = lazy(() => import("./pages/ModerationDashboard"));
const MoodTracker = lazy(() => import("./pages/MoodTracker"));
const MortgageCalculator = lazy(() => import("./pages/MortgageCalculator"));
const MovieCatalog = lazy(() => import("./pages/MovieCatalog"));
const MovieDetail = lazy(() => import("./pages/MovieDetail"));
const MultiCryptoMine = lazy(() => import("./pages/MultiCryptoMine"));
const MultiSelectForm = lazy(() => import("./pages/MultiSelectForm"));
const MultiplayerLobby = lazy(() => import("./pages/MultiplayerLobby"));
const MultivariateTesting = lazy(() => import("./pages/MultivariateTesting"));
const MutualConnections = lazy(() => import("./pages/MutualConnections"));
const MyLearning = lazy(() => import("./pages/MyLearning"));
const MyTrips = lazy(() => import("./pages/MyTrips"));
const NFTGallery = lazy(() => import("./pages/NFTGallery"));
const NFTMinting = lazy(() => import("./pages/NFTMinting"));
const NFTWallet = lazy(() => import("./pages/NFTWallet"));
const NLPTools = lazy(() => import("./pages/NLPTools"));
const NSFWFeed = lazy(() => import("./pages/NSFWFeed"));
const NSFWPlatform = lazy(() => import("./pages/NSFWPlatform"));
const NarrativeEngine = lazy(() => import("./pages/NarrativeEngine"));
const NetWorthTracker = lazy(() => import("./pages/NetWorthTracker"));
const NetworkGraph = lazy(() => import("./pages/NetworkGraph"));
const NotesApp = lazy(() => import("./pages/NotesApp"));
const NotificationCenter = lazy(() => import("./pages/NotificationCenter"));
const NotificationHistory = lazy(() => import("./pages/NotificationHistory"));
const NotificationIntelligence = lazy(() => import("./pages/NotificationIntelligence"));
const NotificationPreferences = lazy(() => import("./pages/NotificationPreferences"));
const NotificationSettings = lazy(() => import("./pages/NotificationSettings"));
const Notifications = lazy(() => import("./pages/Notifications"));
const NotificationsCenter = lazy(() => import("./pages/NotificationsCenter"));
const NotificationsHub = lazy(() => import("./pages/NotificationsHub"));
const NumberInputForm = lazy(() => import("./pages/NumberInputForm"));
const NutritionTracker = lazy(() => import("./pages/NutritionTracker"));
const OAuthProviders = lazy(() => import("./pages/OAuthProviders"));
const OfferManagement = lazy(() => import("./pages/OfferManagement"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const OnboardingTutorial = lazy(() => import("./pages/OnboardingTutorial"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const OrganizationSettings = lazy(() => import("./pages/OrganizationSettings"));
const P2EShop = lazy(() => import("./pages/P2EShop"));
const Pagination = lazy(() => import("./pages/Pagination"));
const PasswordInputForm = lazy(() => import("./pages/PasswordInputForm"));
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const PayPalIntegration = lazy(() => import("./pages/PayPalIntegration"));
const PaymentConfirmation = lazy(() => import("./pages/PaymentConfirmation"));
const PaymentInfra = lazy(() => import("./pages/PaymentInfra"));
const PaymentMethods = lazy(() => import("./pages/PaymentMethods"));
const PaymentSetup = lazy(() => import("./pages/PaymentSetup"));
const Payments = lazy(() => import("./pages/Payments"));
const PayoutDashboard = lazy(() => import("./pages/PayoutDashboard"));
const PayoutManagement = lazy(() => import("./pages/PayoutManagement"));
const PerformanceMetrics = lazy(() => import("./pages/PerformanceMetrics"));
const PersonaBuilder = lazy(() => import("./pages/PersonaBuilder"));
const Phase1Dashboard = lazy(() => import("./pages/Phase1Dashboard"));
const Phase2to4Dashboard = lazy(() => import("./pages/Phase2to4Dashboard"));
const PhoneVerification = lazy(() => import("./pages/PhoneVerification"));
const PlatformMap = lazy(() => import("./pages/PlatformMap"));
const PlatformStatus = lazy(() => import("./pages/PlatformStatus"));
const PlaylistManager = lazy(() => import("./pages/PlaylistManager"));
const PodcastStudio = lazy(() => import("./pages/PodcastStudio"));
const PolicyManagement = lazy(() => import("./pages/PolicyManagement"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const PortfolioOverview = lazy(() => import("./pages/PortfolioOverview"));
const PortfolioTracker = lazy(() => import("./pages/PortfolioTracker"));
const PowerUserTools = lazy(() => import("./pages/PowerUserTools"));
const PracticeSessions = lazy(() => import("./pages/PracticeSessions"));
const PredictiveAnalytics = lazy(() => import("./pages/PredictiveAnalytics"));
const PredictiveModels = lazy(() => import("./pages/PredictiveModels"));
const PredictiveSystems = lazy(() => import("./pages/PredictiveSystems"));
const PreferencesSetup = lazy(() => import("./pages/PreferencesSetup"));
const PresentationWithChat = lazy(() => import("./pages/PresentationWithChat"));
const Pricing = lazy(() => import("./pages/Pricing"));
const PricingEngine = lazy(() => import("./pages/PricingEngine"));
const PricingRules = lazy(() => import("./pages/PricingRules"));
const PriorityMatrix = lazy(() => import("./pages/PriorityMatrix"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const PrivacySettings = lazy(() => import("./pages/PrivacySettings"));
const PrivacyVault = lazy(() => import("./pages/PrivacyVault"));
const ProductApproval = lazy(() => import("./pages/ProductApproval"));
const ProductBrain = lazy(() => import("./pages/ProductBrain"));
const ProductCatalog = lazy(() => import("./pages/ProductCatalog"));
const ProductComparison = lazy(() => import("./pages/ProductComparison"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ProductListing = lazy(() => import("./pages/ProductListing"));
const ProductReviews = lazy(() => import("./pages/ProductReviews"));
const ProductionArchitecture = lazy(() => import("./pages/ProductionArchitecture"));
const Profile = lazy(() => import("./pages/Profile"));
const ProfileCompletion = lazy(() => import("./pages/ProfileCompletion"));
const ProfileDashboard = lazy(() => import("./pages/ProfileDashboard"));
const ProfileEdit = lazy(() => import("./pages/ProfileEdit"));
const ProfilePicture = lazy(() => import("./pages/ProfilePicture"));
const ProfilePreview = lazy(() => import("./pages/ProfilePreview"));
const ProfileWallet = lazy(() => import("./pages/ProfileWallet"));
const Profitability = lazy(() => import("./pages/Profitability"));
const ProgressBar = lazy(() => import("./pages/ProgressBar"));
const ProgressTracking = lazy(() => import("./pages/ProgressTracking"));
const ProjectBoard = lazy(() => import("./pages/ProjectBoard"));
const PromotionEngine = lazy(() => import("./pages/PromotionEngine"));
const ProofVault = lazy(() => import("./pages/ProofVault"));
const PropertyComparison = lazy(() => import("./pages/PropertyComparison"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const PropertyListing = lazy(() => import("./pages/PropertyListing"));
const PropertyTransfer = lazy(() => import("./pages/PropertyTransfer"));
const ProtocolLayer = lazy(() => import("./pages/ProtocolLayer"));
const PublishingSchedule = lazy(() => import("./pages/PublishingSchedule"));
const PushNotifications = lazy(() => import("./pages/PushNotifications"));
const QRCodeGenerator = lazy(() => import("./pages/QRCodeGenerator"));
const QuickActions = lazy(() => import("./pages/QuickActions"));
const QuickStats = lazy(() => import("./pages/QuickStats"));
const QuizBuilder = lazy(() => import("./pages/QuizBuilder"));
const RFMAnalysis = lazy(() => import("./pages/RFMAnalysis"));
const RadioButtonForm = lazy(() => import("./pages/RadioButtonForm"));
const RateLimitConfig = lazy(() => import("./pages/RateLimitConfig"));
const RateLimitDashboard = lazy(() => import("./pages/RateLimitDashboard"));
const RateLimitError = lazy(() => import("./pages/RateLimitError"));
const RateLimiting = lazy(() => import("./pages/RateLimiting"));
const RatingSystem = lazy(() => import("./pages/RatingSystem"));
const RealTimeMonitoring = lazy(() => import("./pages/RealTimeMonitoring"));
const ReceiptDownload = lazy(() => import("./pages/ReceiptDownload"));
const ReceiveCrypto = lazy(() => import("./pages/ReceiveCrypto"));
const RecentActivity = lazy(() => import("./pages/RecentActivity"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const RecommendationsFeed = lazy(() => import("./pages/RecommendationsFeed"));
const Reels = lazy(() => import("./pages/Reels"));
const Referrals = lazy(() => import("./pages/Referrals"));
const RefundRequests = lazy(() => import("./pages/RefundRequests"));
const RegionalSettings = lazy(() => import("./pages/RegionalSettings"));
const Reminders = lazy(() => import("./pages/Reminders"));
const ReportDialog = lazy(() => import("./pages/ReportDialog"));
const ReportUser = lazy(() => import("./pages/ReportUser"));
const ReportsDashboard = lazy(() => import("./pages/ReportsDashboard"));
const ReputationSystem = lazy(() => import("./pages/ReputationSystem"));
const ResourceAllocation = lazy(() => import("./pages/ResourceAllocation"));
const ResourceLibrary = lazy(() => import("./pages/ResourceLibrary"));
const ResponseTime = lazy(() => import("./pages/ResponseTime"));
const Retention = lazy(() => import("./pages/Retention"));
const RetentionAnalytics = lazy(() => import("./pages/RetentionAnalytics"));
const RetentionEngine = lazy(() => import("./pages/RetentionEngine"));
const RetirementPlanner = lazy(() => import("./pages/RetirementPlanner"));
const ReturnManagement = lazy(() => import("./pages/ReturnManagement"));
const ReturnsRefunds = lazy(() => import("./pages/ReturnsRefunds"));
const ReviewModeration = lazy(() => import("./pages/ReviewModeration"));
const Reviews = lazy(() => import("./pages/Reviews"));
const ReviewsRatings = lazy(() => import("./pages/ReviewsRatings"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const RoadmapView = lazy(() => import("./pages/RoadmapView"));
const RoleManagement = lazy(() => import("./pages/RoleManagement"));
const SDKDownload = lazy(() => import("./pages/SDKDownload"));
const SDKManagement = lazy(() => import("./pages/SDKManagement"));
const SEOOptimizer = lazy(() => import("./pages/SEOOptimizer"));
const SKY444CentralBank = lazy(() => import("./pages/SKY444CentralBank"));
const SMSCampaigns = lazy(() => import("./pages/SMSCampaigns"));
const SMSIntegration = lazy(() => import("./pages/SMSIntegration"));
const SMSTemplates = lazy(() => import("./pages/SMSTemplates"));
const SOC2 = lazy(() => import("./pages/SOC2"));
const SSO = lazy(() => import("./pages/SSO"));
const SalesAnalytics = lazy(() => import("./pages/SalesAnalytics"));
const SalesforceIntegration = lazy(() => import("./pages/SalesforceIntegration"));
const SatisfactionSurvey = lazy(() => import("./pages/SatisfactionSurvey"));
const SavedProperties = lazy(() => import("./pages/SavedProperties"));
const SavedSearches = lazy(() => import("./pages/SavedSearches"));
const SavingsGoals = lazy(() => import("./pages/SavingsGoals"));
const ScheduledJobs = lazy(() => import("./pages/ScheduledJobs"));
const ScheduledReports = lazy(() => import("./pages/ScheduledReports"));
const School = lazy(() => import("./pages/School"));
const SchoolCertificate = lazy(() => import("./pages/SchoolCertificate"));
const SchoolCourse = lazy(() => import("./pages/SchoolCourse"));
const SchoolDashboard = lazy(() => import("./pages/SchoolDashboard"));
const SchoolLesson = lazy(() => import("./pages/SchoolLesson"));
const SchoolQuiz = lazy(() => import("./pages/SchoolQuiz"));
const Search = lazy(() => import("./pages/Search"));
const SearchAnalytics = lazy(() => import("./pages/SearchAnalytics"));
const SearchHistory = lazy(() => import("./pages/SearchHistory"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const SearchSuggestions = lazy(() => import("./pages/SearchSuggestions"));
const Security = lazy(() => import("./pages/Security"));
const SecurityAudit = lazy(() => import("./pages/SecurityAudit"));
const SecurityCompliance = lazy(() => import("./pages/SecurityCompliance"));
const SecurityDashboard = lazy(() => import("./pages/SecurityDashboard"));
const SecuritySettings = lazy(() => import("./pages/SecuritySettings"));
const SegmentationAnalysis = lazy(() => import("./pages/SegmentationAnalysis"));
const SelectDropdownForm = lazy(() => import("./pages/SelectDropdownForm"));
const SelfHealingInfra = lazy(() => import("./pages/SelfHealingInfra"));
const SellerDashboard = lazy(() => import("./pages/SellerDashboard"));
const SellerProfile = lazy(() => import("./pages/SellerProfile"));
const SendCrypto = lazy(() => import("./pages/SendCrypto"));
const SentimentPipeline = lazy(() => import("./pages/SentimentPipeline"));
const ServerHealth = lazy(() => import("./pages/ServerHealth"));
const ServerInstaller = lazy(() => import("./pages/ServerInstaller"));
const ServerStatus = lazy(() => import("./pages/ServerStatus"));
const Settings = lazy(() => import("./pages/Settings"));
const SettingsDialog = lazy(() => import("./pages/SettingsDialog"));
const SetupWizard = lazy(() => import("./pages/SetupWizard"));
const ShadowIdentity = lazy(() => import("./pages/ShadowIdentity"));
const ShadowRelay = lazy(() => import("./pages/ShadowRelay"));
const ShareDialog = lazy(() => import("./pages/ShareDialog"));
const ShippingManagement = lazy(() => import("./pages/ShippingManagement"));
const ShoppingCart = lazy(() => import("./pages/ShoppingCart"));
const SidebarNavigation = lazy(() => import("./pages/SidebarNavigation"));
const SignUp = lazy(() => import("./pages/SignUp"));
const SignUpFlow = lazy(() => import("./pages/SignUpFlow"));
const SignUp_old = lazy(() => import("./pages/SignUp_old"));
const Signin = lazy(() => import("./pages/Signin"));
const SituationRoom = lazy(() => import("./pages/SituationRoom"));
const SkillBadges = lazy(() => import("./pages/SkillBadges"));
const SkySchool = lazy(() => import("./pages/SkySchool"));
const SkySchoolAI = lazy(() => import("./pages/SkySchoolAI"));
const SkySchoolQuiz = lazy(() => import("./pages/SkySchoolQuiz"));
const SkyStore = lazy(() => import("./pages/SkyStore"));
const SlackIntegration = lazy(() => import("./pages/SlackIntegration"));
const SleepTracking = lazy(() => import("./pages/SleepTracking"));
const SmartContractAudit = lazy(() => import("./pages/SmartContractAudit"));
const SmartContracts = lazy(() => import("./pages/SmartContracts"));
const Social = lazy(() => import("./pages/Social"));
const SocialFeedV2 = lazy(() => import("./pages/SocialFeedV2"));
const SocialGraph = lazy(() => import("./pages/SocialGraph"));
const SocialMedia = lazy(() => import("./pages/SocialMedia"));
const SocialMediaCampaigns = lazy(() => import("./pages/SocialMediaCampaigns"));
const SortOptions = lazy(() => import("./pages/SortOptions"));
const SpinWheel = lazy(() => import("./pages/SpinWheel"));
const StakingDashboard = lazy(() => import("./pages/StakingDashboard"));
const StakingPortal = lazy(() => import("./pages/StakingPortal"));
const StatisticsPanel = lazy(() => import("./pages/StatisticsPanel"));
const Status = lazy(() => import("./pages/Status"));
const StepperWizard = lazy(() => import("./pages/StepperWizard"));
const StockChart = lazy(() => import("./pages/StockChart"));
const StockSearch = lazy(() => import("./pages/StockSearch"));
const Stories = lazy(() => import("./pages/Stories"));
const StreamAnalytics = lazy(() => import("./pages/StreamAnalytics"));
const StreamClip = lazy(() => import("./pages/StreamClip"));
const StreamGifting = lazy(() => import("./pages/StreamGifting"));
const Streaming = lazy(() => import("./pages/Streaming"));
const StripeCheckout = lazy(() => import("./pages/StripeCheckout"));
const StripeIntegration = lazy(() => import("./pages/StripeIntegration"));
const StudentProgress = lazy(() => import("./pages/StudentProgress"));
const SubscriptionManagement = lazy(() => import("./pages/SubscriptionManagement"));
const Subscriptions = lazy(() => import("./pages/Subscriptions"));
const SuccessDialog = lazy(() => import("./pages/SuccessDialog"));
const SuccessScreen = lazy(() => import("./pages/SuccessScreen"));
const SupportMetrics = lazy(() => import("./pages/SupportMetrics"));
const SupportTicket = lazy(() => import("./pages/SupportTicket"));
const SystemArchitecture = lazy(() => import("./pages/SystemArchitecture"));
const SystemLogs = lazy(() => import("./pages/SystemLogs"));
const SystemObservability = lazy(() => import("./pages/SystemObservability"));
const SystemStatus = lazy(() => import("./pages/SystemStatus"));
const TabsNavigation = lazy(() => import("./pages/TabsNavigation"));
const TaskAutomation = lazy(() => import("./pages/TaskAutomation"));
const TaskDetail = lazy(() => import("./pages/TaskDetail"));
const TaskList = lazy(() => import("./pages/TaskList"));
const TaxPlanning = lazy(() => import("./pages/TaxPlanning"));
const TaxReports = lazy(() => import("./pages/TaxReports"));
const TeachingOpportunities = lazy(() => import("./pages/TeachingOpportunities"));
const TeamManagement = lazy(() => import("./pages/TeamManagement"));
const TeamWorkspace = lazy(() => import("./pages/TeamWorkspace"));
const TelegramIntegration = lazy(() => import("./pages/TelegramIntegration"));
const TemplateLibrary = lazy(() => import("./pages/TemplateLibrary"));
const TermsAcceptance = lazy(() => import("./pages/TermsAcceptance"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const TextInputForm = lazy(() => import("./pages/TextInputForm"));
const TextTools = lazy(() => import("./pages/TextTools"));
const ThemeSettings = lazy(() => import("./pages/ThemeSettings"));
const ThreadManagement = lazy(() => import("./pages/ThreadManagement"));
const TicketAssignment = lazy(() => import("./pages/TicketAssignment"));
const TicketDetail = lazy(() => import("./pages/TicketDetail"));
const TicketQueue = lazy(() => import("./pages/TicketQueue"));
const TimeInputForm = lazy(() => import("./pages/TimeInputForm"));
const TimePickerDialog = lazy(() => import("./pages/TimePickerDialog"));
const TimeTracking = lazy(() => import("./pages/TimeTracking"));
const TimelineView = lazy(() => import("./pages/TimelineView"));
const TimeoutError = lazy(() => import("./pages/TimeoutError"));
const TipJar = lazy(() => import("./pages/TipJar"));
const ToastNotifications = lazy(() => import("./pages/ToastNotifications"));
const TodoList = lazy(() => import("./pages/TodoList"));
const ToggleSwitchForm = lazy(() => import("./pages/ToggleSwitchForm"));
const TokenDashboard = lazy(() => import("./pages/TokenDashboard"));
const TokenGovernance = lazy(() => import("./pages/TokenGovernance"));
const TokenMetrics = lazy(() => import("./pages/TokenMetrics"));
const TokenSwap = lazy(() => import("./pages/TokenSwap"));
const TokenomicsCalculator = lazy(() => import("./pages/TokenomicsCalculator"));
const TorBridge = lazy(() => import("./pages/TorBridge"));
const TournamentBracket = lazy(() => import("./pages/TournamentBracket"));
const Tournaments = lazy(() => import("./pages/Tournaments"));
const TradeHistory = lazy(() => import("./pages/TradeHistory"));
const Trading = lazy(() => import("./pages/Trading"));
const TradingTerminal = lazy(() => import("./pages/TradingTerminal"));
const TransactionExplorer = lazy(() => import("./pages/TransactionExplorer"));
const TransactionHistory = lazy(() => import("./pages/TransactionHistory"));
const TranscriptionManager = lazy(() => import("./pages/TranscriptionManager"));
const TranslationEnabledCommunity = lazy(() => import("./pages/TranslationEnabledCommunity"));
const TranslationEnabledSocialFeed = lazy(() => import("./pages/TranslationEnabledSocialFeed"));
const TravelBlog = lazy(() => import("./pages/TravelBlog"));
const TravelBudget = lazy(() => import("./pages/TravelBudget"));
const TravelDocuments = lazy(() => import("./pages/TravelDocuments"));
const TravelPhotos = lazy(() => import("./pages/TravelPhotos"));
const TravelReviews = lazy(() => import("./pages/TravelReviews"));
const TravelTips = lazy(() => import("./pages/TravelTips"));
const TrendAnalysis = lazy(() => import("./pages/TrendAnalysis"));
const Trending = lazy(() => import("./pages/Trending"));
const TrendingItems = lazy(() => import("./pages/TrendingItems"));
const TrendingTopics = lazy(() => import("./pages/TrendingTopics"));
const TriggersActions = lazy(() => import("./pages/TriggersActions"));
const TripPlanner = lazy(() => import("./pages/TripPlanner"));
const TrumpMining = lazy(() => import("./pages/TrumpMining"));
const TrustSafetyDashboard = lazy(() => import("./pages/TrustSafetyDashboard"));
const TrustSystem = lazy(() => import("./pages/TrustSystem"));
const TwoFactorAuth = lazy(() => import("./pages/TwoFactorAuth"));
const TwoFactorSetup = lazy(() => import("./pages/TwoFactorSetup"));
const UnhiddenInterface = lazy(() => import("./pages/UnhiddenInterface"));
const UnhiddenMode = lazy(() => import("./pages/UnhiddenMode"));
const UnifiedFeed = lazy(() => import("./pages/UnifiedFeed"));
const UnifiedIdentity = lazy(() => import("./pages/UnifiedIdentity"));
const UnifiedMessaging = lazy(() => import("./pages/UnifiedMessaging"));
const UnifiedPaymentLedger = lazy(() => import("./pages/UnifiedPaymentLedger"));
const UnifiedPlatformDashboard = lazy(() => import("./pages/UnifiedPlatformDashboard"));
const UniversalSearch = lazy(() => import("./pages/UniversalSearch"));
const UpgradeDowngradePlan = lazy(() => import("./pages/UpgradeDowngradePlan"));
const UserBehavior = lazy(() => import("./pages/UserBehavior"));
const UserBio = lazy(() => import("./pages/UserBio"));
const UserDirectory = lazy(() => import("./pages/UserDirectory"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const UserMentions = lazy(() => import("./pages/UserMentions"));
const UserOnboarding = lazy(() => import("./pages/UserOnboarding"));
const UserPermissions = lazy(() => import("./pages/UserPermissions"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const UserStats = lazy(() => import("./pages/UserStats"));
const UserSuggestions = lazy(() => import("./pages/UserSuggestions"));
const VODArchive = lazy(() => import("./pages/VODArchive"));
const VendorAnalytics = lazy(() => import("./pages/VendorAnalytics"));
const VendorOnboarding = lazy(() => import("./pages/VendorOnboarding"));
const VendorPerformance = lazy(() => import("./pages/VendorPerformance"));
const VendorVerification = lazy(() => import("./pages/VendorVerification"));
const VenueManagement = lazy(() => import("./pages/VenueManagement"));
const Verification = lazy(() => import("./pages/Verification"));
const VerificationSteps = lazy(() => import("./pages/VerificationSteps"));
const VersionManagement = lazy(() => import("./pages/VersionManagement"));
const VestingSchedule = lazy(() => import("./pages/VestingSchedule"));
const VideoArea = lazy(() => import("./pages/VideoArea"));
const VideoChat = lazy(() => import("./pages/VideoChat"));
const VideoEditor = lazy(() => import("./pages/VideoEditor"));
const VideoPlayer = lazy(() => import("./pages/VideoPlayer"));
const VideoTools = lazy(() => import("./pages/VideoTools"));
const VideoTutorials = lazy(() => import("./pages/VideoTutorials"));
const VideoUploader = lazy(() => import("./pages/VideoUploader"));
const VirtualTour = lazy(() => import("./pages/VirtualTour"));
const VoiceCommands = lazy(() => import("./pages/VoiceCommands"));
const VoiceCommandsRegistry = lazy(() => import("./pages/VoiceCommandsRegistry"));
const Wallet = lazy(() => import("./pages/Wallet"));
const WalletConnect = lazy(() => import("./pages/WalletConnect"));
const WalletOverview = lazy(() => import("./pages/WalletOverview"));
const WarningDialog = lazy(() => import("./pages/WarningDialog"));
const WatchEarn = lazy(() => import("./pages/WatchEarn"));
const WatchList = lazy(() => import("./pages/WatchList"));
const Web3Auth = lazy(() => import("./pages/Web3Auth"));
const WebhookManager = lazy(() => import("./pages/WebhookManager"));
const Webhooks = lazy(() => import("./pages/Webhooks"));
const WelcomeScreen = lazy(() => import("./pages/WelcomeScreen"));
const WhaleMonitor = lazy(() => import("./pages/WhaleMonitor"));
const WishlistManagement = lazy(() => import("./pages/WishlistManagement"));
const WorkflowBuilder = lazy(() => import("./pages/WorkflowBuilder"));
const WorldBrain = lazy(() => import("./pages/WorldBrain"));
const WorldSimulationControl = lazy(() => import("./pages/WorldSimulationControl"));
const YieldFarming = lazy(() => import("./pages/YieldFarming"));
const ZapierIntegration = lazy(() => import("./pages/ZapierIntegration"));
        <Route path="/esting" component={ABTesting} />
        <Route path="/esting_dvanced" component={ABTestingAdvanced} />
        <Route path="/gent" component={AIAgent} />
        <Route path="/gent_conomy" component={AIAgentEconomy} />
        <Route path="/gent_arket" component={AIAgentMarket} />
        <Route path="/ssistant" component={AIAssistant} />
        <Route path="/rain" component={AIBrain} />
        <Route path="/ode_tudio" component={AICodeStudio} />
        <Route path="/opy_tudio" component={AICopyStudio} />
        <Route path="/ore" component={AICore} />
        <Route path="/ngineer" component={AIEngineer} />
        <Route path="/ntelligence_ub" component={AIIntelligenceHub} />
        <Route path="/arket_gents" component={AIMarketAgents} />
        <Route path="/atchmaker" component={AIMatchmaker} />
        <Route path="/oderation_ueue" component={AIModerationQueue} />
        <Route path="/ersona_eed" component={AIPersonaFeed} />
        <Route path="/ersona_ystem" component={AIPersonaSystem} />
        <Route path="/ools_ub" component={AIToolsHub} />
        <Route path="/rading" component={AITrading} />
        <Route path="/raining_oops" component={AITrainingLoops} />
        <Route path="/ocs" component={APIDocs} />
        <Route path="/ocumentation" component={APIDocumentation} />
        <Route path="/ntegration" component={APIIntegration} />
        <Route path="/eys" component={APIKeys} />
        <Route path="/ogs" component={APILogs} />
        <Route path="/onitoring" component={APIMonitoring} />
        <Route path="/tatus" component={APIStatus} />
        <Route path="/esting" component={APITesting} />
        <Route path="/sage" component={APIUsage} />
        <Route path="/ersioning" component={APIVersioning} />
        <Route path="/bout" component={About} />
        <Route path="/ccess_ontrol" component={AccessControl} />
        <Route path="/ccessibility_ettings" component={AccessibilitySettings} />
        <Route path="/ccordion_avigation" component={AccordionNavigation} />
        <Route path="/ccount_ettings" component={AccountSettings} />
        <Route path="/chievements" component={Achievements} />
        <Route path="/ction_bjects" component={ActionObjects} />
        <Route path="/ction_anel" component={ActionPanel} />
        <Route path="/ctivity_eed" component={ActivityFeed} />
        <Route path="/ctivity_racking" component={ActivityTracking} />
        <Route path="/daptive_ersonalization" component={AdaptivePersonalization} />
        <Route path="/daptive_oadmap" component={AdaptiveRoadmap} />
        <Route path="/dd_ank_ccount" component={AddBankAccount} />
        <Route path="/dd_redit_ard" component={AddCreditCard} />
        <Route path="/ddress_ook" component={AddressBook} />
        <Route path="/dmin" component={Admin} />
        <Route path="/dmin_ashboard" component={AdminDashboard} />
        <Route path="/dmin_rders" component={AdminOrders} />
        <Route path="/dmin_anel" component={AdminPanel} />
        <Route path="/dmin_allet_anager" component={AdminWalletManager} />
        <Route path="/dvanced_dmin_anel" component={AdvancedAdminPanel} />
        <Route path="/dvanced_nalytics" component={AdvancedAnalytics} />
        <Route path="/dvanced_earch" component={AdvancedSearch} />
        <Route path="/ffiliate_ashboard" component={AffiliateDashboard} />
        <Route path="/ge_ate" component={AgeGate} />
        <Route path="/gent_uilder" component={AgentBuilder} />
        <Route path="/gent_ity" component={AgentCity} />
        <Route path="/gent_oordination" component={AgentCoordination} />
        <Route path="/gent_oordination_ub" component={AgentCoordinationHub} />
        <Route path="/gent_ebate" component={AgentDebate} />
        <Route path="/gent_etail" component={AgentDetail} />
        <Route path="/gent_arketplace" component={AgentMarketplace} />
        <Route path="/gent_erformance" component={AgentPerformance} />
        <Route path="/gent_print" component={AgentSprint} />
        <Route path="/gents_ashboard" component={AgentsDashboard} />
        <Route path="/lert_onfiguration" component={AlertConfiguration} />
        <Route path="/lert_ialog" component={AlertDialog} />
        <Route path="/lert_anagement" component={AlertManagement} />
        <Route path="/mbient_eed" component={AmbientFeed} />
        <Route path="/nalytics" component={Analytics} />
        <Route path="/nalytics_ashboard" component={AnalyticsDashboard} />
        <Route path="/nalytics_roducts" component={AnalyticsProducts} />
        <Route path="/nalytics_eports" component={AnalyticsReports} />
        <Route path="/nomaly_etection" component={AnomalyDetection} />
        <Route path="/nti_urveillance" component={AntiSurveillance} />
        <Route path="/rcade" component={Arcade} />
        <Route path="/sset_anagement" component={AssetManagement} />
        <Route path="/ssignment_racker" component={AssignmentTracker} />
        <Route path="/ttribution_odeling" component={AttributionModeling} />
        <Route path="/udience_egmentation" component={AudienceSegmentation} />
        <Route path="/udio_nalytics" component={AudioAnalytics} />
        <Route path="/udio_ibrary" component={AudioLibrary} />
        <Route path="/udio_layer" component={AudioPlayer} />
        <Route path="/udit_og" component={AuditLog} />
        <Route path="/udit_rail" component={AuditTrail} />
        <Route path="/uto_esponder" component={AutoResponder} />
        <Route path="/utomation_ngine" component={AutomationEngine} />
        <Route path="/utomation_ules" component={AutomationRules} />
        <Route path="/utomation_orkflows" component={AutomationWorkflows} />
        <Route path="/ackup_anagement" component={BackupManagement} />
        <Route path="/adges" component={Badges} />
        <Route path="/an_uspend_ser" component={BanSuspendUser} />
        <Route path="/attle_ass" component={BattlePass} />
        <Route path="/ehavioral_ntelligence" component={BehavioralIntelligence} />
        <Route path="/eta" component={Beta} />
        <Route path="/illing_istory" component={BillingHistory} />
        <Route path="/lock_ser" component={BlockUser} />
        <Route path="/lockchain_ustody" component={BlockchainCustody} />
        <Route path="/lockchain_onitor" component={BlockchainMonitor} />
        <Route path="/log_ditor" component={BlogEditor} />
        <Route path="/log_ublisher" component={BlogPublisher} />
        <Route path="/ook_age" component={BookPage} />
        <Route path="/ookmarks" component={Bookmarks} />
        <Route path="/ounty_ystem" component={BountySystem} />
        <Route path="/rand_uidelines" component={BrandGuidelines} />
        <Route path="/readcrumb_avigation" component={BreadcrumbNavigation} />
        <Route path="/ridge_ransactions" component={BridgeTransactions} />
        <Route path="/rowser_xtension" component={BrowserExtension} />
        <Route path="/udget_lanner" component={BudgetPlanner} />
        <Route path="/ug_eporting" component={BugReporting} />
        <Route path="/uild_rder" component={BuildOrder} />
        <Route path="/uild_oadmap" component={BuildRoadmap} />
        <Route path="/ulk_perations" component={BulkOperations} />
        <Route path="/ulk_pload" component={BulkUpload} />
        <Route path="/" component={CCPA} />
        <Route path="/" component={CRM} />
        <Route path="/alculator" component={Calculator} />
        <Route path="/alendar" component={Calendar} />
        <Route path="/alendar_iew" component={CalendarView} />
        <Route path="/ampaign_nalytics" component={CampaignAnalytics} />
        <Route path="/ampaign_uilder" component={CampaignBuilder} />
        <Route path="/ar_ental" component={CarRental} />
        <Route path="/ard_rid_iew" component={CardGridView} />
        <Route path="/ash_low_nalysis" component={CashFlowAnalysis} />
        <Route path="/ategory_anagement" component={CategoryManagement} />
        <Route path="/ertificate_anager" component={CertificateManager} />
        <Route path="/hange_og" component={ChangeLog} />
        <Route path="/hannels" component={Channels} />
        <Route path="/harity" component={Charity} />
        <Route path="/harity_eaderboard" component={CharityLeaderboard} />
        <Route path="/hart_ashboard" component={ChartDashboard} />
        <Route path="/hat_ot" component={ChatBot} />
        <Route path="/hat_istory" component={ChatHistory} />
        <Route path="/hat___" component={ChatMVP} />
        <Route path="/hatbot" component={Chatbot} />
        <Route path="/heckbox_roup_orm" component={CheckboxGroupForm} />
        <Route path="/heckout" component={Checkout} />
        <Route path="/hina_dition" component={ChinaEdition} />
        <Route path="/hurn_rediction" component={ChurnPrediction} />
        <Route path="/itizen_assport" component={CitizenPassport} />
        <Route path="/ivilization_imulator" component={CivilizationSimulator} />
        <Route path="/lan_ars" component={ClanWars} />
        <Route path="/lassroom_anagement" component={ClassroomManagement} />
        <Route path="/lient_ibraries" component={ClientLibraries} />
        <Route path="/losing_hecklist" component={ClosingChecklist} />
        <Route path="/ode_ormatter" component={CodeFormatter} />
        <Route path="/ode_ntelligence" component={CodeIntelligence} />
        <Route path="/ode_uality" component={CodeQuality} />
        <Route path="/ode_uality_ashboard" component={CodeQualityDashboard} />
        <Route path="/ode_epository" component={CodeRepository} />
        <Route path="/ode_amples" component={CodeSamples} />
        <Route path="/ohort_nalysis" component={CohortAnalysis} />
        <Route path="/olor_icker_ialog" component={ColorPickerDialog} />
        <Route path="/omment_hread" component={CommentThread} />
        <Route path="/omments_ection" component={CommentsSection} />
        <Route path="/ommission_anagement" component={CommissionManagement} />
        <Route path="/ommunity" component={Community} />
        <Route path="/ommunity_reate" component={CommunityCreate} />
        <Route path="/ommunity_uidelines" component={CommunityGuidelines} />
        <Route path="/ommunity_ub" component={CommunityHub} />
        <Route path="/ompany_imulator" component={CompanySimulator} />
        <Route path="/ompetitive_adar" component={CompetitiveRadar} />
        <Route path="/ompliance_enter" component={ComplianceCenter} />
        <Route path="/ompliance_hecker" component={ComplianceChecker} />
        <Route path="/ompliance_ashboard" component={ComplianceDashboard} />
        <Route path="/omponent_howcase" component={ComponentShowcase} />
        <Route path="/onfirmation_ialog" component={ConfirmationDialog} />
        <Route path="/onnected_pps" component={ConnectedApps} />
        <Route path="/onnection_rror" component={ConnectionError} />
        <Route path="/onnection_equests" component={ConnectionRequests} />
        <Route path="/onnector_ntelligence" component={ConnectorIntelligence} />
        <Route path="/ontact_anagement" component={ContactManagement} />
        <Route path="/ontact_s_orm" component={ContactUsForm} />
        <Route path="/ontent_alendar" component={ContentCalendar} />
        <Route path="/ontent_ibrary" component={ContentLibrary} />
        <Route path="/ontent_oderation" component={ContentModeration} />
        <Route path="/ontent_cheduler" component={ContentScheduler} />
        <Route path="/ontent_ault" component={ContentVault} />
        <Route path="/ontext_enu" component={ContextMenu} />
        <Route path="/ontract___" component={ContractABI} />
        <Route path="/onversion_unnel" component={ConversionFunnel} />
        <Route path="/onversion_ptimization" component={ConversionOptimization} />
        <Route path="/ookie_olicy" component={CookiePolicy} />
        <Route path="/ost_llocation" component={CostAllocation} />
        <Route path="/ourse_uilder" component={CourseBuilder} />
        <Route path="/ourse_atalog" component={CourseCatalog} />
        <Route path="/over_hoto" component={CoverPhoto} />
        <Route path="/reate_rticle" component={CreateArticle} />
        <Route path="/reate_udio" component={CreateAudio} />
        <Route path="/reate_rop" component={CreateDrop} />
        <Route path="/reate_ive_tream" component={CreateLiveStream} />
        <Route path="/reate_eel" component={CreateReel} />
        <Route path="/reator_nalytics" component={CreatorAnalytics} />
        <Route path="/reator_ashboard" component={CreatorDashboard} />
        <Route path="/reator_conomy" component={CreatorEconomy} />
        <Route path="/reator_ntelligence" component={CreatorIntelligence} />
        <Route path="/reator_onetization" component={CreatorMonetization} />
        <Route path="/reator_nboarding" component={CreatorOnboarding} />
        <Route path="/reator_rofile" component={CreatorProfile} />
        <Route path="/reator_potlight" component={CreatorSpotlight} />
        <Route path="/reator_tudio" component={CreatorStudio} />
        <Route path="/ross_hain_nterop" component={CrossChainInterop} />
        <Route path="/rypto" component={Crypto} />
        <Route path="/rypto_ub" component={CryptoHub} />
        <Route path="/rypto_ine" component={CryptoMine} />
        <Route path="/rypto_esearch_ub" component={CryptoResearchHub} />
        <Route path="/ustom_ashboard" component={CustomDashboard} />
        <Route path="/ustom_eports" component={CustomReports} />
        <Route path="/ustomer_nalytics" component={CustomerAnalytics} />
        <Route path="/ustomer_isputes" component={CustomerDisputes} />
        <Route path="/overnance" component={DAOGovernance} />
        <Route path="/reasury" component={DAOTreasury} />
        <Route path="/epth_hart" component={DEXDepthChart} />
        <Route path="/gate_hop" component={DHgateShop} />
        <Route path="/nbox" component={DMInbox} />
        <Route path="/ashboard" component={Dashboard} />
        <Route path="/ashboard_verview" component={DashboardOverview} />
        <Route path="/ata_xport" component={DataExport} />
        <Route path="/ata_rid" component={DataGrid} />
        <Route path="/ata_ake" component={DataLake} />
        <Route path="/ata_rivacy" component={DataPrivacy} />
        <Route path="/ata_rocessing" component={DataProcessing} />
        <Route path="/ata_etention" component={DataRetention} />
        <Route path="/ata_able" component={DataTable} />
        <Route path="/ata_isualization" component={DataVisualization} />
        <Route path="/atabase_anagement" component={DatabaseManagement} />
        <Route path="/ate_nput_orm" component={DateInputForm} />
        <Route path="/ate_icker_ialog" component={DatePickerDialog} />
        <Route path="/ating_iscovery" component={DatingDiscovery} />
        <Route path="/ating_ome" component={DatingHome} />
        <Route path="/ating_atches" component={DatingMatches} />
        <Route path="/ating_essages" component={DatingMessages} />
        <Route path="/ating_remium" component={DatingPremium} />
        <Route path="/ating_rofile" component={DatingProfile} />
        <Route path="/ating_rofile_etup" component={DatingProfileSetup} />
        <Route path="/ating_ubscription" component={DatingSubscription} />
        <Route path="/ay_rade_oom" component={DayTradeRoom} />
        <Route path="/e_i" component={DeFi} />
        <Route path="/ecentralized_dentity" component={DecentralizedIdentity} />
        <Route path="/efensibility_oat" component={DefensibilityMoat} />
        <Route path="/elete_ccount" component={DeleteAccount} />
        <Route path="/elete_ontent" component={DeleteContent} />
        <Route path="/epartment_anagement" component={DepartmentManagement} />
        <Route path="/ependency_raph" component={DependencyGraph} />
        <Route path="/eployment_ipeline" component={DeploymentPipeline} />
        <Route path="/eprecation_olicy" component={DeprecationPolicy} />
        <Route path="/estination_uide" component={DestinationGuide} />
        <Route path="/estiny_ngine" component={DestinyEngine} />
        <Route path="/ev_ps" component={DevOps} />
        <Route path="/eveloper_rea" component={DeveloperArea} />
        <Route path="/eveloper_ommunity" component={DeveloperCommunity} />
        <Route path="/eveloper_arketplace" component={DeveloperMarketplace} />
        <Route path="/eveloper_rotocol" component={DeveloperProtocol} />
        <Route path="/igital_rt_tore" component={DigitalArtStore} />
        <Route path="/igital_ation_ode" component={DigitalNationMode} />
        <Route path="/igital_win" component={DigitalTwin} />
        <Route path="/irect_essages" component={DirectMessages} />
        <Route path="/isaster_ecovery" component={DisasterRecovery} />
        <Route path="/iscord_ntegration" component={DiscordIntegration} />
        <Route path="/iscover" component={Discover} />
        <Route path="/iscussion_oard" component={DiscussionBoard} />
        <Route path="/iscussion_orums" component={DiscussionForums} />
        <Route path="/ispute_esolution" component={DisputeResolution} />
        <Route path="/istribution_hannels" component={DistributionChannels} />
        <Route path="/ocument_ditor" component={DocumentEditor} />
        <Route path="/ocument_haring" component={DocumentSharing} />
        <Route path="/ocument_igning" component={DocumentSigning} />
        <Route path="/ocumentation" component={Documentation} />
        <Route path="/ropdown_enu" component={DropdownMenu} />
        <Route path="/esolver" component={ENSResolver} />
        <Route path="/arn_ub" component={EarnHub} />
        <Route path="/conomic_ayer" component={EconomicLayer} />
        <Route path="/conomics" component={Economics} />
        <Route path="/conomy_ontrol" component={EconomyControl} />
        <Route path="/cosystem" component={Ecosystem} />
        <Route path="/dit_rofile" component={EditProfile} />
        <Route path="/mail_ampaigns" component={EmailCampaigns} />
        <Route path="/mail_nput_orm" component={EmailInputForm} />
        <Route path="/mail_ntegration" component={EmailIntegration} />
        <Route path="/mail_otifications" component={EmailNotifications} />
        <Route path="/mail_emplates" component={EmailTemplates} />
        <Route path="/mail_erification" component={EmailVerification} />
        <Route path="/mbed___" component={EmbedSDK} />
        <Route path="/mpty_earch_tate" component={EmptySearchState} />
        <Route path="/ngagement_etrics" component={EngagementMetrics} />
        <Route path="/ngineer" component={Engineer} />
        <Route path="/nterprise" component={Enterprise} />
        <Route path="/nterprise___" component={EnterpriseAPI} />
        <Route path="/nterprise_nalytics" component={EnterpriseAnalytics} />
        <Route path="/ntity_rofile" component={EntityProfile} />
        <Route path="/nvironment_anagement" component={EnvironmentManagement} />
        <Route path="/rror403" component={Error403} />
        <Route path="/rror404" component={Error404} />
        <Route path="/rror500" component={Error500} />
        <Route path="/rror503" component={Error503} />
        <Route path="/rror_ialog" component={ErrorDialog} />
        <Route path="/rror_racking" component={ErrorTracking} />
        <Route path="/scrow_hop" component={EscrowShop} />
        <Route path="/vent_nalytics" component={EventAnalytics} />
        <Route path="/vent_alendar" component={EventCalendar} />
        <Route path="/vent_reation" component={EventCreation} />
        <Route path="/vent_lanner" component={EventPlanner} />
        <Route path="/vent_egistration" component={EventRegistration} />
        <Route path="/vents" component={Events} />
        <Route path="/xercise_ibrary" component={ExerciseLibrary} />
        <Route path="/xpense_anagement" component={ExpenseManagement} />
        <Route path="/xpense_racker" component={ExpenseTracker} />
        <Route path="/xperiment_actory" component={ExperimentFactory} />
        <Route path="/xperiment_racker" component={ExperimentTracker} />
        <Route path="/xplore" component={Explore} />
        <Route path="/xport_ata" component={ExportData} />
        <Route path="/anagement" component={FAQManagement} />
        <Route path="/age" component={FAQPage} />
        <Route path="/arming" component={Farming} />
        <Route path="/avorites" component={Favorites} />
        <Route path="/eature_equests" component={FeatureRequests} />
        <Route path="/eature_our" component={FeatureTour} />
        <Route path="/eatures" component={Features} />
        <Route path="/eedback" component={Feedback} />
        <Route path="/eedback_ialog" component={FeedbackDialog} />
        <Route path="/eedback_orm" component={FeedbackForm} />
        <Route path="/eedback_ub" component={FeedbackHub} />
        <Route path="/ile_rowser" component={FileBrowser} />
        <Route path="/ile_onverter" component={FileConverter} />
        <Route path="/ile_ownload" component={FileDownload} />
        <Route path="/ile_review" component={FilePreview} />
        <Route path="/ile_pload_ialog" component={FileUploadDialog} />
        <Route path="/ile_pload_orm" component={FileUploadForm} />
        <Route path="/ile_pload_rogress" component={FileUploadProgress} />
        <Route path="/ile_ersioning" component={FileVersioning} />
        <Route path="/ilter_anel" component={FilterPanel} />
        <Route path="/inancial_eports" component={FinancialReports} />
        <Route path="/light_earch" component={FlightSearch} />
        <Route path="/ollow_ist" component={FollowList} />
        <Route path="/ollow_nfollow" component={FollowUnfollow} />
        <Route path="/ollower_ist" component={FollowerList} />
        <Route path="/orecasting_ngine" component={ForecastingEngine} />
        <Route path="/orum_ategories" component={ForumCategories} />
        <Route path="/ree_ill_ashboard" component={FreeWillDashboard} />
        <Route path="/" component={GDPR} />
        <Route path="/trategy" component={GTMStrategy} />
        <Route path="/ame_lackjack" component={GameBlackjack} />
        <Route path="/ame_lock_uilder" component={GameBlockBuilder} />
        <Route path="/ame_hat" component={GameChat} />
        <Route path="/ame_rash" component={GameCrash} />
        <Route path="/ame_rypto_uiz" component={GameCryptoQuiz} />
        <Route path="/ame_ice" component={GameDice} />
        <Route path="/ame_i_uest_oard" component={GameFiQuestBoard} />
        <Route path="/ame_obby" component={GameLobby} />
        <Route path="/ame_linko" component={GamePlinko} />
        <Route path="/ame_oom" component={GameRoom} />
        <Route path="/ame_oulette" component={GameRoulette} />
        <Route path="/ame_ettings" component={GameSettings} />
        <Route path="/ame_lots" component={GameSlots} />
        <Route path="/ame_oken_ap" component={GameTokenTap} />
        <Route path="/aming" component={Gaming} />
        <Route path="/aming_or_harity" component={GamingForCharity} />
        <Route path="/antt_hart" component={GanttChart} />
        <Route path="/as_ee_stimator" component={GasFeeEstimator} />
        <Route path="/as_racker" component={GasTracker} />
        <Route path="/eneral_ettings" component={GeneralSettings} />
        <Route path="/enerated_pi_xplorer" component={GeneratedApiExplorer} />
        <Route path="/enerated_allery" component={GeneratedGallery} />
        <Route path="/etting_tarted_uide" component={GettingStartedGuide} />
        <Route path="/host_ode" component={GhostMode} />
        <Route path="/lobal_perations_enter" component={GlobalOperationsCenter} />
        <Route path="/lobal_earch" component={GlobalSearch} />
        <Route path="/overnance" component={Governance} />
        <Route path="/overnance_izard" component={GovernanceWizard} />
        <Route path="/rade_ook" component={GradeBook} />
        <Route path="/roup_hat" component={GroupChat} />
        <Route path="/roup_irectory" component={GroupDirectory} />
        <Route path="/roup_vents" component={GroupEvents} />
        <Route path="/roup_anagement" component={GroupManagement} />
        <Route path="/rowth" component={Growth} />
        <Route path="/uilds" component={Guilds} />
        <Route path="/" component={HIPAA} />
        <Route path="/ontrol" component={HOPEAIControl} />
        <Route path="/ashtag_xplorer" component={HashtagExplorer} />
        <Route path="/ashtag_earch" component={HashtagSearch} />
        <Route path="/ealth_rticles" component={HealthArticles} />
        <Route path="/ealth_ashboard" component={HealthDashboard} />
        <Route path="/ealth_oals" component={HealthGoals} />
        <Route path="/elp_enter" component={HelpCenter} />
        <Route path="/ome" component={Home} />
        <Route path="/ope__" component={HopeAI} />
        <Route path="/ope___dvanced" component={HopeAIAdvanced} />
        <Route path="/ope___eta" component={HopeAIMeta} />
        <Route path="/ope___pgrades" component={HopeAIUpgrades} />
        <Route path="/otel_earch" component={HotelSearch} />
        <Route path="/ub_pot_ntegration" component={HubSpotIntegration} />
        <Route path="/aunchpad" component={ICOLaunchpad} />
        <Route path="/" component={IFTTT} />
        <Route path="/mage_allery" component={ImageGallery} />
        <Route path="/mage_ools" component={ImageTools} />
        <Route path="/mage_iewer" component={ImageViewer} />
        <Route path="/mpact_ap" component={ImpactMap} />
        <Route path="/n_pp_otifications" component={InAppNotifications} />
        <Route path="/ncident_anagement" component={IncidentManagement} />
        <Route path="/nput_ialog" component={InputDialog} />
        <Route path="/nstructor_ashboard" component={InstructorDashboard} />
        <Route path="/ntegration_etup" component={IntegrationSetup} />
        <Route path="/ntegrations" component={Integrations} />
        <Route path="/nventory_anagement" component={InventoryManagement} />
        <Route path="/nvestor_etrics" component={InvestorMetrics} />
        <Route path="/nvestor_itch" component={InvestorPitch} />
        <Route path="/nvestor_ortal" component={InvestorPortal} />
        <Route path="/nvestor_oom" component={InvestorRoom} />
        <Route path="/nvoice_etails" component={InvoiceDetails} />
        <Route path="/nvoice_anagement" component={InvoiceManagement} />
        <Route path="/nowledge_ase" component={KnowledgeBase} />
        <Route path="/ntegration" component={LDAPIntegration} />
        <Route path="/nalysis" component={LTVAnalysis} />
        <Route path="/anguage_xchange_dmin" component={LanguageExchangeAdmin} />
        <Route path="/anguage_artner_iscovery" component={LanguagePartnerDiscovery} />
        <Route path="/anguage_ettings" component={LanguageSettings} />
        <Route path="/ead_coring" component={LeadScoring} />
        <Route path="/eaderboard" component={Leaderboard} />
        <Route path="/eaderboards" component={Leaderboards} />
        <Route path="/earning" component={Learning} />
        <Route path="/earning_ath" component={LearningPath} />
        <Route path="/egal_ocuments" component={LegalDocuments} />
        <Route path="/egendary_tatus" component={LegendaryStatus} />
        <Route path="/esson_ditor" component={LessonEditor} />
        <Route path="/ife_ommand" component={LifeCommand} />
        <Route path="/ightbox" component={Lightbox} />
        <Route path="/ike_eaction_ystem" component={LikeReactionSystem} />
        <Route path="/iquidity_ools" component={LiquidityPools} />
        <Route path="/ist_iew" component={ListView} />
        <Route path="/ive" component={Live} />
        <Route path="/ive_hat" component={LiveChat} />
        <Route path="/ive_ifting" component={LiveGifting} />
        <Route path="/ive_eactions" component={LiveReactions} />
        <Route path="/ive_tream_etup" component={LiveStreamSetup} />
        <Route path="/ivestream_ashboard" component={LivestreamDashboard} />
        <Route path="/oading_ialog" component={LoadingDialog} />
        <Route path="/og_iewer" component={LogViewer} />
        <Route path="/ogin" component={Login} />
        <Route path="/ogistics_ptimizer" component={LogisticsOptimizer} />
        <Route path="/nsights" component={MLInsights} />
        <Route path="/odels" component={MLModels} />
        <Route path="/ailing_ists" component={MailingLists} />
        <Route path="/ain_ashboard" component={MainDashboard} />
        <Route path="/aintenance_ode" component={MaintenanceMode} />
        <Route path="/ap_iew" component={MapView} />
        <Route path="/arketing___" component={MarketingROI} />
        <Route path="/arketplace" component={Marketplace} />
        <Route path="/arketplace_nalytics" component={MarketplaceAnalytics} />
        <Route path="/aster_rchitecture" component={MasterArchitecture} />
        <Route path="/atch_hat" component={MatchChat} />
        <Route path="/atch_eed" component={MatchFeed} />
        <Route path="/atch_pace" component={MatchSpace} />
        <Route path="/eal_lans" component={MealPlans} />
        <Route path="/edia_arousel" component={MediaCarousel} />
        <Route path="/edia_allery" component={MediaGallery} />
        <Route path="/edication_eminder" component={MedicationReminder} />
        <Route path="/ega_arketplace" component={MegaMarketplace} />
        <Route path="/embership_iers" component={MembershipTiers} />
        <Route path="/emory_onstellation" component={MemoryConstellation} />
        <Route path="/emory_raph_isualizer" component={MemoryGraphVisualizer} />
        <Route path="/emory_ystem" component={MemorySystem} />
        <Route path="/essages" component={Messages} />
        <Route path="/ilestone_racking" component={MilestoneTracking} />
        <Route path="/iner_ashboard" component={MinerDashboard} />
        <Route path="/ining" component={Mining} />
        <Route path="/ining_alculator" component={MiningCalculator} />
        <Route path="/ining_ashboard" component={MiningDashboard} />
        <Route path="/ission_ontrol" component={MissionControl} />
        <Route path="/obile_pp" component={MobileApp} />
        <Route path="/obile_aming" component={MobileGaming} />
        <Route path="/obile_ome" component={MobileHome} />
        <Route path="/obile_enu" component={MobileMenu} />
        <Route path="/obile_essages" component={MobileMessages} />
        <Route path="/obile_otifications" component={MobileNotifications} />
        <Route path="/obile_rofile" component={MobileProfile} />
        <Route path="/obile_earch" component={MobileSearch} />
        <Route path="/obile_ettings" component={MobileSettings} />
        <Route path="/obile_hop" component={MobileShop} />
        <Route path="/obile_treaming" component={MobileStreaming} />
        <Route path="/obile_rading" component={MobileTrading} />
        <Route path="/obile_allet" component={MobileWallet} />
        <Route path="/oderation_ashboard" component={ModerationDashboard} />
        <Route path="/ood_racker" component={MoodTracker} />
        <Route path="/ortgage_alculator" component={MortgageCalculator} />
        <Route path="/ovie_atalog" component={MovieCatalog} />
        <Route path="/ovie_etail" component={MovieDetail} />
        <Route path="/ulti_rypto_ine" component={MultiCryptoMine} />
        <Route path="/ulti_elect_orm" component={MultiSelectForm} />
        <Route path="/ultiplayer_obby" component={MultiplayerLobby} />
        <Route path="/ultivariate_esting" component={MultivariateTesting} />
        <Route path="/utual_onnections" component={MutualConnections} />
        <Route path="/y_earning" component={MyLearning} />
        <Route path="/y_rips" component={MyTrips} />
        <Route path="/allery" component={NFTGallery} />
        <Route path="/inting" component={NFTMinting} />
        <Route path="/allet" component={NFTWallet} />
        <Route path="/ools" component={NLPTools} />
        <Route path="/eed" component={NSFWFeed} />
        <Route path="/latform" component={NSFWPlatform} />
        <Route path="/arrative_ngine" component={NarrativeEngine} />
        <Route path="/et_orth_racker" component={NetWorthTracker} />
        <Route path="/etwork_raph" component={NetworkGraph} />
        <Route path="/otes_pp" component={NotesApp} />
        <Route path="/otification_enter" component={NotificationCenter} />
        <Route path="/otification_istory" component={NotificationHistory} />
        <Route path="/otification_ntelligence" component={NotificationIntelligence} />
        <Route path="/otification_references" component={NotificationPreferences} />
        <Route path="/otification_ettings" component={NotificationSettings} />
        <Route path="/otifications" component={Notifications} />
        <Route path="/otifications_enter" component={NotificationsCenter} />
        <Route path="/otifications_ub" component={NotificationsHub} />
        <Route path="/umber_nput_orm" component={NumberInputForm} />
        <Route path="/utrition_racker" component={NutritionTracker} />
        <Route path="/uth_roviders" component={OAuthProviders} />
        <Route path="/ffer_anagement" component={OfferManagement} />
        <Route path="/nboarding" component={Onboarding} />
        <Route path="/nboarding_utorial" component={OnboardingTutorial} />
        <Route path="/rder_onfirmation" component={OrderConfirmation} />
        <Route path="/rder_istory" component={OrderHistory} />
        <Route path="/rder_racking" component={OrderTracking} />
        <Route path="/rganization_ettings" component={OrganizationSettings} />
        <Route path="/2__hop" component={P2EShop} />
        <Route path="/agination" component={Pagination} />
        <Route path="/assword_nput_orm" component={PasswordInputForm} />
        <Route path="/assword_eset" component={PasswordReset} />
        <Route path="/ay_al_ntegration" component={PayPalIntegration} />
        <Route path="/ayment_onfirmation" component={PaymentConfirmation} />
        <Route path="/ayment_nfra" component={PaymentInfra} />
        <Route path="/ayment_ethods" component={PaymentMethods} />
        <Route path="/ayment_etup" component={PaymentSetup} />
        <Route path="/ayments" component={Payments} />
        <Route path="/ayout_ashboard" component={PayoutDashboard} />
        <Route path="/ayout_anagement" component={PayoutManagement} />
        <Route path="/erformance_etrics" component={PerformanceMetrics} />
        <Route path="/ersona_uilder" component={PersonaBuilder} />
        <Route path="/hase1_ashboard" component={Phase1Dashboard} />
        <Route path="/hase2to4_ashboard" component={Phase2to4Dashboard} />
        <Route path="/hone_erification" component={PhoneVerification} />
        <Route path="/latform_ap" component={PlatformMap} />
        <Route path="/latform_tatus" component={PlatformStatus} />
        <Route path="/laylist_anager" component={PlaylistManager} />
        <Route path="/odcast_tudio" component={PodcastStudio} />
        <Route path="/olicy_anagement" component={PolicyManagement} />
        <Route path="/ortfolio" component={Portfolio} />
        <Route path="/ortfolio_verview" component={PortfolioOverview} />
        <Route path="/ortfolio_racker" component={PortfolioTracker} />
        <Route path="/ower_ser_ools" component={PowerUserTools} />
        <Route path="/ractice_essions" component={PracticeSessions} />
        <Route path="/redictive_nalytics" component={PredictiveAnalytics} />
        <Route path="/redictive_odels" component={PredictiveModels} />
        <Route path="/redictive_ystems" component={PredictiveSystems} />
        <Route path="/references_etup" component={PreferencesSetup} />
        <Route path="/resentation_ith_hat" component={PresentationWithChat} />
        <Route path="/ricing" component={Pricing} />
        <Route path="/ricing_ngine" component={PricingEngine} />
        <Route path="/ricing_ules" component={PricingRules} />
        <Route path="/riority_atrix" component={PriorityMatrix} />
        <Route path="/rivacy_olicy" component={PrivacyPolicy} />
        <Route path="/rivacy_ettings" component={PrivacySettings} />
        <Route path="/rivacy_ault" component={PrivacyVault} />
        <Route path="/roduct_pproval" component={ProductApproval} />
        <Route path="/roduct_rain" component={ProductBrain} />
        <Route path="/roduct_atalog" component={ProductCatalog} />
        <Route path="/roduct_omparison" component={ProductComparison} />
        <Route path="/roduct_etail" component={ProductDetail} />
        <Route path="/roduct_isting" component={ProductListing} />
        <Route path="/roduct_eviews" component={ProductReviews} />
        <Route path="/roduction_rchitecture" component={ProductionArchitecture} />
        <Route path="/rofile" component={Profile} />
        <Route path="/rofile_ompletion" component={ProfileCompletion} />
        <Route path="/rofile_ashboard" component={ProfileDashboard} />
        <Route path="/rofile_dit" component={ProfileEdit} />
        <Route path="/rofile_icture" component={ProfilePicture} />
        <Route path="/rofile_review" component={ProfilePreview} />
        <Route path="/rofile_allet" component={ProfileWallet} />
        <Route path="/rofitability" component={Profitability} />
        <Route path="/rogress_ar" component={ProgressBar} />
        <Route path="/rogress_racking" component={ProgressTracking} />
        <Route path="/roject_oard" component={ProjectBoard} />
        <Route path="/romotion_ngine" component={PromotionEngine} />
        <Route path="/roof_ault" component={ProofVault} />
        <Route path="/roperty_omparison" component={PropertyComparison} />
        <Route path="/roperty_etail" component={PropertyDetail} />
        <Route path="/roperty_isting" component={PropertyListing} />
        <Route path="/roperty_ransfer" component={PropertyTransfer} />
        <Route path="/rotocol_ayer" component={ProtocolLayer} />
        <Route path="/ublishing_chedule" component={PublishingSchedule} />
        <Route path="/ush_otifications" component={PushNotifications} />
        <Route path="/ode_enerator" component={QRCodeGenerator} />
        <Route path="/uick_ctions" component={QuickActions} />
        <Route path="/uick_tats" component={QuickStats} />
        <Route path="/uiz_uilder" component={QuizBuilder} />
        <Route path="/nalysis" component={RFMAnalysis} />
        <Route path="/adio_utton_orm" component={RadioButtonForm} />
        <Route path="/ate_imit_onfig" component={RateLimitConfig} />
        <Route path="/ate_imit_ashboard" component={RateLimitDashboard} />
        <Route path="/ate_imit_rror" component={RateLimitError} />
        <Route path="/ate_imiting" component={RateLimiting} />
        <Route path="/ating_ystem" component={RatingSystem} />
        <Route path="/eal_ime_onitoring" component={RealTimeMonitoring} />
        <Route path="/eceipt_ownload" component={ReceiptDownload} />
        <Route path="/eceive_rypto" component={ReceiveCrypto} />
        <Route path="/ecent_ctivity" component={RecentActivity} />
        <Route path="/ecommendations" component={Recommendations} />
        <Route path="/ecommendations_eed" component={RecommendationsFeed} />
        <Route path="/eels" component={Reels} />
        <Route path="/eferrals" component={Referrals} />
        <Route path="/efund_equests" component={RefundRequests} />
        <Route path="/egional_ettings" component={RegionalSettings} />
        <Route path="/eminders" component={Reminders} />
        <Route path="/eport_ialog" component={ReportDialog} />
        <Route path="/eport_ser" component={ReportUser} />
        <Route path="/eports_ashboard" component={ReportsDashboard} />
        <Route path="/eputation_ystem" component={ReputationSystem} />
        <Route path="/esource_llocation" component={ResourceAllocation} />
        <Route path="/esource_ibrary" component={ResourceLibrary} />
        <Route path="/esponse_ime" component={ResponseTime} />
        <Route path="/etention" component={Retention} />
        <Route path="/etention_nalytics" component={RetentionAnalytics} />
        <Route path="/etention_ngine" component={RetentionEngine} />
        <Route path="/etirement_lanner" component={RetirementPlanner} />
        <Route path="/eturn_anagement" component={ReturnManagement} />
        <Route path="/eturns_efunds" component={ReturnsRefunds} />
        <Route path="/eview_oderation" component={ReviewModeration} />
        <Route path="/eviews" component={Reviews} />
        <Route path="/eviews_atings" component={ReviewsRatings} />
        <Route path="/oadmap" component={Roadmap} />
        <Route path="/oadmap_iew" component={RoadmapView} />
        <Route path="/ole_anagement" component={RoleManagement} />
        <Route path="/ownload" component={SDKDownload} />
        <Route path="/anagement" component={SDKManagement} />
        <Route path="/ptimizer" component={SEOOptimizer} />
        <Route path="/444_entral_ank" component={SKY444CentralBank} />
        <Route path="/ampaigns" component={SMSCampaigns} />
        <Route path="/ntegration" component={SMSIntegration} />
        <Route path="/emplates" component={SMSTemplates} />
        <Route path="/2" component={SOC2} />
        <Route path="/" component={SSO} />
        <Route path="/ales_nalytics" component={SalesAnalytics} />
        <Route path="/alesforce_ntegration" component={SalesforceIntegration} />
        <Route path="/atisfaction_urvey" component={SatisfactionSurvey} />
        <Route path="/aved_roperties" component={SavedProperties} />
        <Route path="/aved_earches" component={SavedSearches} />
        <Route path="/avings_oals" component={SavingsGoals} />
        <Route path="/cheduled_obs" component={ScheduledJobs} />
        <Route path="/cheduled_eports" component={ScheduledReports} />
        <Route path="/chool" component={School} />
        <Route path="/chool_ertificate" component={SchoolCertificate} />
        <Route path="/chool_ourse" component={SchoolCourse} />
        <Route path="/chool_ashboard" component={SchoolDashboard} />
        <Route path="/chool_esson" component={SchoolLesson} />
        <Route path="/chool_uiz" component={SchoolQuiz} />
        <Route path="/earch" component={Search} />
        <Route path="/earch_nalytics" component={SearchAnalytics} />
        <Route path="/earch_istory" component={SearchHistory} />
        <Route path="/earch_esults" component={SearchResults} />
        <Route path="/earch_uggestions" component={SearchSuggestions} />
        <Route path="/ecurity" component={Security} />
        <Route path="/ecurity_udit" component={SecurityAudit} />
        <Route path="/ecurity_ompliance" component={SecurityCompliance} />
        <Route path="/ecurity_ashboard" component={SecurityDashboard} />
        <Route path="/ecurity_ettings" component={SecuritySettings} />
        <Route path="/egmentation_nalysis" component={SegmentationAnalysis} />
        <Route path="/elect_ropdown_orm" component={SelectDropdownForm} />
        <Route path="/elf_ealing_nfra" component={SelfHealingInfra} />
        <Route path="/eller_ashboard" component={SellerDashboard} />
        <Route path="/eller_rofile" component={SellerProfile} />
        <Route path="/end_rypto" component={SendCrypto} />
        <Route path="/entiment_ipeline" component={SentimentPipeline} />
        <Route path="/erver_ealth" component={ServerHealth} />
        <Route path="/erver_nstaller" component={ServerInstaller} />
        <Route path="/erver_tatus" component={ServerStatus} />
        <Route path="/ettings" component={Settings} />
        <Route path="/ettings_ialog" component={SettingsDialog} />
        <Route path="/etup_izard" component={SetupWizard} />
        <Route path="/hadow_dentity" component={ShadowIdentity} />
        <Route path="/hadow_elay" component={ShadowRelay} />
        <Route path="/hare_ialog" component={ShareDialog} />
        <Route path="/hipping_anagement" component={ShippingManagement} />
        <Route path="/hopping_art" component={ShoppingCart} />
        <Route path="/idebar_avigation" component={SidebarNavigation} />
        <Route path="/ign_p" component={SignUp} />
        <Route path="/ign_p_low" component={SignUpFlow} />
        <Route path="/ign_p_old" component={SignUp_old} />
        <Route path="/ignin" component={Signin} />
        <Route path="/ituation_oom" component={SituationRoom} />
        <Route path="/kill_adges" component={SkillBadges} />
        <Route path="/ky_chool" component={SkySchool} />
        <Route path="/ky_chool__" component={SkySchoolAI} />
        <Route path="/ky_chool_uiz" component={SkySchoolQuiz} />
        <Route path="/ky_tore" component={SkyStore} />
        <Route path="/lack_ntegration" component={SlackIntegration} />
        <Route path="/leep_racking" component={SleepTracking} />
        <Route path="/mart_ontract_udit" component={SmartContractAudit} />
        <Route path="/mart_ontracts" component={SmartContracts} />
        <Route path="/ocial" component={Social} />
        <Route path="/ocial_eed_2" component={SocialFeedV2} />
        <Route path="/ocial_raph" component={SocialGraph} />
        <Route path="/ocial_edia" component={SocialMedia} />
        <Route path="/ocial_edia_ampaigns" component={SocialMediaCampaigns} />
        <Route path="/ort_ptions" component={SortOptions} />
        <Route path="/pin_heel" component={SpinWheel} />
        <Route path="/taking_ashboard" component={StakingDashboard} />
        <Route path="/taking_ortal" component={StakingPortal} />
        <Route path="/tatistics_anel" component={StatisticsPanel} />
        <Route path="/tatus" component={Status} />
        <Route path="/tepper_izard" component={StepperWizard} />
        <Route path="/tock_hart" component={StockChart} />
        <Route path="/tock_earch" component={StockSearch} />
        <Route path="/tories" component={Stories} />
        <Route path="/tream_nalytics" component={StreamAnalytics} />
        <Route path="/tream_lip" component={StreamClip} />
        <Route path="/tream_ifting" component={StreamGifting} />
        <Route path="/treaming" component={Streaming} />
        <Route path="/tripe_heckout" component={StripeCheckout} />
        <Route path="/tripe_ntegration" component={StripeIntegration} />
        <Route path="/tudent_rogress" component={StudentProgress} />
        <Route path="/ubscription_anagement" component={SubscriptionManagement} />
        <Route path="/ubscriptions" component={Subscriptions} />
        <Route path="/uccess_ialog" component={SuccessDialog} />
        <Route path="/uccess_creen" component={SuccessScreen} />
        <Route path="/upport_etrics" component={SupportMetrics} />
        <Route path="/upport_icket" component={SupportTicket} />
        <Route path="/ystem_rchitecture" component={SystemArchitecture} />
        <Route path="/ystem_ogs" component={SystemLogs} />
        <Route path="/ystem_bservability" component={SystemObservability} />
        <Route path="/ystem_tatus" component={SystemStatus} />
        <Route path="/abs_avigation" component={TabsNavigation} />
        <Route path="/ask_utomation" component={TaskAutomation} />
        <Route path="/ask_etail" component={TaskDetail} />
        <Route path="/ask_ist" component={TaskList} />
        <Route path="/ax_lanning" component={TaxPlanning} />
        <Route path="/ax_eports" component={TaxReports} />
        <Route path="/eaching_pportunities" component={TeachingOpportunities} />
        <Route path="/eam_anagement" component={TeamManagement} />
        <Route path="/eam_orkspace" component={TeamWorkspace} />
        <Route path="/elegram_ntegration" component={TelegramIntegration} />
        <Route path="/emplate_ibrary" component={TemplateLibrary} />
        <Route path="/erms_cceptance" component={TermsAcceptance} />
        <Route path="/erms_f_ervice" component={TermsOfService} />
        <Route path="/ext_nput_orm" component={TextInputForm} />
        <Route path="/ext_ools" component={TextTools} />
        <Route path="/heme_ettings" component={ThemeSettings} />
        <Route path="/hread_anagement" component={ThreadManagement} />
        <Route path="/icket_ssignment" component={TicketAssignment} />
        <Route path="/icket_etail" component={TicketDetail} />
        <Route path="/icket_ueue" component={TicketQueue} />
        <Route path="/ime_nput_orm" component={TimeInputForm} />
        <Route path="/ime_icker_ialog" component={TimePickerDialog} />
        <Route path="/ime_racking" component={TimeTracking} />
        <Route path="/imeline_iew" component={TimelineView} />
        <Route path="/imeout_rror" component={TimeoutError} />
        <Route path="/ip_ar" component={TipJar} />
        <Route path="/oast_otifications" component={ToastNotifications} />
        <Route path="/odo_ist" component={TodoList} />
        <Route path="/oggle_witch_orm" component={ToggleSwitchForm} />
        <Route path="/oken_ashboard" component={TokenDashboard} />
        <Route path="/oken_overnance" component={TokenGovernance} />
        <Route path="/oken_etrics" component={TokenMetrics} />
        <Route path="/oken_wap" component={TokenSwap} />
        <Route path="/okenomics_alculator" component={TokenomicsCalculator} />
        <Route path="/or_ridge" component={TorBridge} />
        <Route path="/ournament_racket" component={TournamentBracket} />
        <Route path="/ournaments" component={Tournaments} />
        <Route path="/rade_istory" component={TradeHistory} />
        <Route path="/rading" component={Trading} />
        <Route path="/rading_erminal" component={TradingTerminal} />
        <Route path="/ransaction_xplorer" component={TransactionExplorer} />
        <Route path="/ransaction_istory" component={TransactionHistory} />
        <Route path="/ranscription_anager" component={TranscriptionManager} />
        <Route path="/ranslation_nabled_ommunity" component={TranslationEnabledCommunity} />
        <Route path="/ranslation_nabled_ocial_eed" component={TranslationEnabledSocialFeed} />
        <Route path="/ravel_log" component={TravelBlog} />
        <Route path="/ravel_udget" component={TravelBudget} />
        <Route path="/ravel_ocuments" component={TravelDocuments} />
        <Route path="/ravel_hotos" component={TravelPhotos} />
        <Route path="/ravel_eviews" component={TravelReviews} />
        <Route path="/ravel_ips" component={TravelTips} />
        <Route path="/rend_nalysis" component={TrendAnalysis} />
        <Route path="/rending" component={Trending} />
        <Route path="/rending_tems" component={TrendingItems} />
        <Route path="/rending_opics" component={TrendingTopics} />
        <Route path="/riggers_ctions" component={TriggersActions} />
        <Route path="/rip_lanner" component={TripPlanner} />
        <Route path="/rump_ining" component={TrumpMining} />
        <Route path="/rust_afety_ashboard" component={TrustSafetyDashboard} />
        <Route path="/rust_ystem" component={TrustSystem} />
        <Route path="/wo_actor_uth" component={TwoFactorAuth} />
        <Route path="/wo_actor_etup" component={TwoFactorSetup} />
        <Route path="/nhidden_nterface" component={UnhiddenInterface} />
        <Route path="/nhidden_ode" component={UnhiddenMode} />
        <Route path="/nified_eed" component={UnifiedFeed} />
        <Route path="/nified_dentity" component={UnifiedIdentity} />
        <Route path="/nified_essaging" component={UnifiedMessaging} />
        <Route path="/nified_ayment_edger" component={UnifiedPaymentLedger} />
        <Route path="/nified_latform_ashboard" component={UnifiedPlatformDashboard} />
        <Route path="/niversal_earch" component={UniversalSearch} />
        <Route path="/pgrade_owngrade_lan" component={UpgradeDowngradePlan} />
        <Route path="/ser_ehavior" component={UserBehavior} />
        <Route path="/ser_io" component={UserBio} />
        <Route path="/ser_irectory" component={UserDirectory} />
        <Route path="/ser_anagement" component={UserManagement} />
        <Route path="/ser_entions" component={UserMentions} />
        <Route path="/ser_nboarding" component={UserOnboarding} />
        <Route path="/ser_ermissions" component={UserPermissions} />
        <Route path="/ser_rofile" component={UserProfile} />
        <Route path="/ser_tats" component={UserStats} />
        <Route path="/ser_uggestions" component={UserSuggestions} />
        <Route path="/rchive" component={VODArchive} />
        <Route path="/endor_nalytics" component={VendorAnalytics} />
        <Route path="/endor_nboarding" component={VendorOnboarding} />
        <Route path="/endor_erformance" component={VendorPerformance} />
        <Route path="/endor_erification" component={VendorVerification} />
        <Route path="/enue_anagement" component={VenueManagement} />
        <Route path="/erification" component={Verification} />
        <Route path="/erification_teps" component={VerificationSteps} />
        <Route path="/ersion_anagement" component={VersionManagement} />
        <Route path="/esting_chedule" component={VestingSchedule} />
        <Route path="/ideo_rea" component={VideoArea} />
        <Route path="/ideo_hat" component={VideoChat} />
        <Route path="/ideo_ditor" component={VideoEditor} />
        <Route path="/ideo_layer" component={VideoPlayer} />
        <Route path="/ideo_ools" component={VideoTools} />
        <Route path="/ideo_utorials" component={VideoTutorials} />
        <Route path="/ideo_ploader" component={VideoUploader} />
        <Route path="/irtual_our" component={VirtualTour} />
        <Route path="/oice_ommands" component={VoiceCommands} />
        <Route path="/oice_ommands_egistry" component={VoiceCommandsRegistry} />
        <Route path="/allet" component={Wallet} />
        <Route path="/allet_onnect" component={WalletConnect} />
        <Route path="/allet_verview" component={WalletOverview} />
        <Route path="/arning_ialog" component={WarningDialog} />
        <Route path="/atch_arn" component={WatchEarn} />
        <Route path="/atch_ist" component={WatchList} />
        <Route path="/eb3_uth" component={Web3Auth} />
        <Route path="/ebhook_anager" component={WebhookManager} />
        <Route path="/ebhooks" component={Webhooks} />
        <Route path="/elcome_creen" component={WelcomeScreen} />
        <Route path="/hale_onitor" component={WhaleMonitor} />
        <Route path="/ishlist_anagement" component={WishlistManagement} />
        <Route path="/orkflow_uilder" component={WorkflowBuilder} />
        <Route path="/orld_rain" component={WorldBrain} />
        <Route path="/orld_imulation_ontrol" component={WorldSimulationControl} />
        <Route path="/ield_arming" component={YieldFarming} />
        <Route path="/apier_ntegration" component={ZapierIntegration} />
{ Suspense, lazy } from "react";
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
const ABTesting = lazy(() => import("./pages/ABTesting"));
const ABTestingAdvanced = lazy(() => import("./pages/ABTestingAdvanced"));
const AIAgent = lazy(() => import("./pages/AIAgent"));
const AIAgentEconomy = lazy(() => import("./pages/AIAgentEconomy"));
const AIAgentMarket = lazy(() => import("./pages/AIAgentMarket"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const AIBrain = lazy(() => import("./pages/AIBrain"));
const AICodeStudio = lazy(() => import("./pages/AICodeStudio"));
const AICopyStudio = lazy(() => import("./pages/AICopyStudio"));
const AICore = lazy(() => import("./pages/AICore"));
const AIEngineer = lazy(() => import("./pages/AIEngineer"));
const AIIntelligenceHub = lazy(() => import("./pages/AIIntelligenceHub"));
const AIMarketAgents = lazy(() => import("./pages/AIMarketAgents"));
const AIMatchmaker = lazy(() => import("./pages/AIMatchmaker"));
const AIModerationQueue = lazy(() => import("./pages/AIModerationQueue"));
const AIPersonaFeed = lazy(() => import("./pages/AIPersonaFeed"));
const AIPersonaSystem = lazy(() => import("./pages/AIPersonaSystem"));
const AIToolsHub = lazy(() => import("./pages/AIToolsHub"));
const AITrading = lazy(() => import("./pages/AITrading"));
const AITrainingLoops = lazy(() => import("./pages/AITrainingLoops"));
const APIDocs = lazy(() => import("./pages/APIDocs"));
const APIDocumentation = lazy(() => import("./pages/APIDocumentation"));
const APIIntegration = lazy(() => import("./pages/APIIntegration"));
const APIKeys = lazy(() => import("./pages/APIKeys"));
const APILogs = lazy(() => import("./pages/APILogs"));
const APIMonitoring = lazy(() => import("./pages/APIMonitoring"));
const APIStatus = lazy(() => import("./pages/APIStatus"));
const APITesting = lazy(() => import("./pages/APITesting"));
const APIUsage = lazy(() => import("./pages/APIUsage"));
const APIVersioning = lazy(() => import("./pages/APIVersioning"));
const About = lazy(() => import("./pages/About"));
const AccessControl = lazy(() => import("./pages/AccessControl"));
const AccessibilitySettings = lazy(() => import("./pages/AccessibilitySettings"));
const AccordionNavigation = lazy(() => import("./pages/AccordionNavigation"));
const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const Achievements = lazy(() => import("./pages/Achievements"));
const ActionObjects = lazy(() => import("./pages/ActionObjects"));
const ActionPanel = lazy(() => import("./pages/ActionPanel"));
const ActivityFeed = lazy(() => import("./pages/ActivityFeed"));
const ActivityTracking = lazy(() => import("./pages/ActivityTracking"));
const AdaptivePersonalization = lazy(() => import("./pages/AdaptivePersonalization"));
const AdaptiveRoadmap = lazy(() => import("./pages/AdaptiveRoadmap"));
const AddBankAccount = lazy(() => import("./pages/AddBankAccount"));
const AddCreditCard = lazy(() => import("./pages/AddCreditCard"));
const AddressBook = lazy(() => import("./pages/AddressBook"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AdminWalletManager = lazy(() => import("./pages/AdminWalletManager"));
const AdvancedAdminPanel = lazy(() => import("./pages/AdvancedAdminPanel"));
const AdvancedAnalytics = lazy(() => import("./pages/AdvancedAnalytics"));
const AdvancedSearch = lazy(() => import("./pages/AdvancedSearch"));
const AffiliateDashboard = lazy(() => import("./pages/AffiliateDashboard"));
const AgeGate = lazy(() => import("./pages/AgeGate"));
const AgentBuilder = lazy(() => import("./pages/AgentBuilder"));
const AgentCity = lazy(() => import("./pages/AgentCity"));
const AgentCoordination = lazy(() => import("./pages/AgentCoordination"));
const AgentCoordinationHub = lazy(() => import("./pages/AgentCoordinationHub"));
const AgentDebate = lazy(() => import("./pages/AgentDebate"));
const AgentDetail = lazy(() => import("./pages/AgentDetail"));
const AgentMarketplace = lazy(() => import("./pages/AgentMarketplace"));
const AgentPerformance = lazy(() => import("./pages/AgentPerformance"));
const AgentSprint = lazy(() => import("./pages/AgentSprint"));
const AgentsDashboard = lazy(() => import("./pages/AgentsDashboard"));
const AlertConfiguration = lazy(() => import("./pages/AlertConfiguration"));
const AlertDialog = lazy(() => import("./pages/AlertDialog"));
const AlertManagement = lazy(() => import("./pages/AlertManagement"));
const AmbientFeed = lazy(() => import("./pages/AmbientFeed"));
const Analytics = lazy(() => import("./pages/Analytics"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const AnalyticsProducts = lazy(() => import("./pages/AnalyticsProducts"));
const AnalyticsReports = lazy(() => import("./pages/AnalyticsReports"));
const AnomalyDetection = lazy(() => import("./pages/AnomalyDetection"));
const AntiSurveillance = lazy(() => import("./pages/AntiSurveillance"));
const Arcade = lazy(() => import("./pages/Arcade"));
const AssetManagement = lazy(() => import("./pages/AssetManagement"));
const AssignmentTracker = lazy(() => import("./pages/AssignmentTracker"));
const AttributionModeling = lazy(() => import("./pages/AttributionModeling"));
const AudienceSegmentation = lazy(() => import("./pages/AudienceSegmentation"));
const AudioAnalytics = lazy(() => import("./pages/AudioAnalytics"));
const AudioLibrary = lazy(() => import("./pages/AudioLibrary"));
const AudioPlayer = lazy(() => import("./pages/AudioPlayer"));
const AuditLog = lazy(() => import("./pages/AuditLog"));
const AuditTrail = lazy(() => import("./pages/AuditTrail"));
const AutoResponder = lazy(() => import("./pages/AutoResponder"));
const AutomationEngine = lazy(() => import("./pages/AutomationEngine"));
const AutomationRules = lazy(() => import("./pages/AutomationRules"));
const AutomationWorkflows = lazy(() => import("./pages/AutomationWorkflows"));
const BackupManagement = lazy(() => import("./pages/BackupManagement"));
const Badges = lazy(() => import("./pages/Badges"));
const BanSuspendUser = lazy(() => import("./pages/BanSuspendUser"));
const BattlePass = lazy(() => import("./pages/BattlePass"));
const BehavioralIntelligence = lazy(() => import("./pages/BehavioralIntelligence"));
const Beta = lazy(() => import("./pages/Beta"));
const BillingHistory = lazy(() => import("./pages/BillingHistory"));
const BlockUser = lazy(() => import("./pages/BlockUser"));
const BlockchainCustody = lazy(() => import("./pages/BlockchainCustody"));
const BlockchainMonitor = lazy(() => import("./pages/BlockchainMonitor"));
const BlogEditor = lazy(() => import("./pages/BlogEditor"));
const BlogPublisher = lazy(() => import("./pages/BlogPublisher"));
const BookPage = lazy(() => import("./pages/BookPage"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const BountySystem = lazy(() => import("./pages/BountySystem"));
const BrandGuidelines = lazy(() => import("./pages/BrandGuidelines"));
const BreadcrumbNavigation = lazy(() => import("./pages/BreadcrumbNavigation"));
const BridgeTransactions = lazy(() => import("./pages/BridgeTransactions"));
const BrowserExtension = lazy(() => import("./pages/BrowserExtension"));
const BudgetPlanner = lazy(() => import("./pages/BudgetPlanner"));
const BugReporting = lazy(() => import("./pages/BugReporting"));
const BuildOrder = lazy(() => import("./pages/BuildOrder"));
const BuildRoadmap = lazy(() => import("./pages/BuildRoadmap"));
const BulkOperations = lazy(() => import("./pages/BulkOperations"));
const BulkUpload = lazy(() => import("./pages/BulkUpload"));
const CCPA = lazy(() => import("./pages/CCPA"));
const CRM = lazy(() => import("./pages/CRM"));
const Calculator = lazy(() => import("./pages/Calculator"));
const Calendar = lazy(() => import("./pages/Calendar"));
const CalendarView = lazy(() => import("./pages/CalendarView"));
const CampaignAnalytics = lazy(() => import("./pages/CampaignAnalytics"));
const CampaignBuilder = lazy(() => import("./pages/CampaignBuilder"));
const CarRental = lazy(() => import("./pages/CarRental"));
const CardGridView = lazy(() => import("./pages/CardGridView"));
const CashFlowAnalysis = lazy(() => import("./pages/CashFlowAnalysis"));
const CategoryManagement = lazy(() => import("./pages/CategoryManagement"));
const CertificateManager = lazy(() => import("./pages/CertificateManager"));
const ChangeLog = lazy(() => import("./pages/ChangeLog"));
const Channels = lazy(() => import("./pages/Channels"));
const Charity = lazy(() => import("./pages/Charity"));
const CharityLeaderboard = lazy(() => import("./pages/CharityLeaderboard"));
const ChartDashboard = lazy(() => import("./pages/ChartDashboard"));
const ChatBot = lazy(() => import("./pages/ChatBot"));
const ChatHistory = lazy(() => import("./pages/ChatHistory"));
const ChatMVP = lazy(() => import("./pages/ChatMVP"));
const Chatbot = lazy(() => import("./pages/Chatbot"));
const CheckboxGroupForm = lazy(() => import("./pages/CheckboxGroupForm"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ChinaEdition = lazy(() => import("./pages/ChinaEdition"));
const ChurnPrediction = lazy(() => import("./pages/ChurnPrediction"));
const CitizenPassport = lazy(() => import("./pages/CitizenPassport"));
const CivilizationSimulator = lazy(() => import("./pages/CivilizationSimulator"));
const ClanWars = lazy(() => import("./pages/ClanWars"));
const ClassroomManagement = lazy(() => import("./pages/ClassroomManagement"));
const ClientLibraries = lazy(() => import("./pages/ClientLibraries"));
const ClosingChecklist = lazy(() => import("./pages/ClosingChecklist"));
const CodeFormatter = lazy(() => import("./pages/CodeFormatter"));
const CodeIntelligence = lazy(() => import("./pages/CodeIntelligence"));
const CodeQuality = lazy(() => import("./pages/CodeQuality"));
const CodeQualityDashboard = lazy(() => import("./pages/CodeQualityDashboard"));
const CodeRepository = lazy(() => import("./pages/CodeRepository"));
const CodeSamples = lazy(() => import("./pages/CodeSamples"));
const CohortAnalysis = lazy(() => import("./pages/CohortAnalysis"));
const ColorPickerDialog = lazy(() => import("./pages/ColorPickerDialog"));
const CommentThread = lazy(() => import("./pages/CommentThread"));
const CommentsSection = lazy(() => import("./pages/CommentsSection"));
const CommissionManagement = lazy(() => import("./pages/CommissionManagement"));
const Community = lazy(() => import("./pages/Community"));
const CommunityCreate = lazy(() => import("./pages/CommunityCreate"));
const CommunityGuidelines = lazy(() => import("./pages/CommunityGuidelines"));
const CommunityHub = lazy(() => import("./pages/CommunityHub"));
const CompanySimulator = lazy(() => import("./pages/CompanySimulator"));
const CompetitiveRadar = lazy(() => import("./pages/CompetitiveRadar"));
const ComplianceCenter = lazy(() => import("./pages/ComplianceCenter"));
const ComplianceChecker = lazy(() => import("./pages/ComplianceChecker"));
const ComplianceDashboard = lazy(() => import("./pages/ComplianceDashboard"));
const ComponentShowcase = lazy(() => import("./pages/ComponentShowcase"));
const ConfirmationDialog = lazy(() => import("./pages/ConfirmationDialog"));
const ConnectedApps = lazy(() => import("./pages/ConnectedApps"));
const ConnectionError = lazy(() => import("./pages/ConnectionError"));
const ConnectionRequests = lazy(() => import("./pages/ConnectionRequests"));
const ConnectorIntelligence = lazy(() => import("./pages/ConnectorIntelligence"));
const ContactManagement = lazy(() => import("./pages/ContactManagement"));
const ContactUsForm = lazy(() => import("./pages/ContactUsForm"));
const ContentCalendar = lazy(() => import("./pages/ContentCalendar"));
const ContentLibrary = lazy(() => import("./pages/ContentLibrary"));
const ContentModeration = lazy(() => import("./pages/ContentModeration"));
const ContentScheduler = lazy(() => import("./pages/ContentScheduler"));
const ContentVault = lazy(() => import("./pages/ContentVault"));
const ContextMenu = lazy(() => import("./pages/ContextMenu"));
const ContractABI = lazy(() => import("./pages/ContractABI"));
const ConversionFunnel = lazy(() => import("./pages/ConversionFunnel"));
const ConversionOptimization = lazy(() => import("./pages/ConversionOptimization"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const CostAllocation = lazy(() => import("./pages/CostAllocation"));
const CourseBuilder = lazy(() => import("./pages/CourseBuilder"));
const CourseCatalog = lazy(() => import("./pages/CourseCatalog"));
const CoverPhoto = lazy(() => import("./pages/CoverPhoto"));
const CreateArticle = lazy(() => import("./pages/CreateArticle"));
const CreateAudio = lazy(() => import("./pages/CreateAudio"));
const CreateDrop = lazy(() => import("./pages/CreateDrop"));
const CreateLiveStream = lazy(() => import("./pages/CreateLiveStream"));
const CreateReel = lazy(() => import("./pages/CreateReel"));
const CreatorAnalytics = lazy(() => import("./pages/CreatorAnalytics"));
const CreatorDashboard = lazy(() => import("./pages/CreatorDashboard"));
const CreatorEconomy = lazy(() => import("./pages/CreatorEconomy"));
const CreatorIntelligence = lazy(() => import("./pages/CreatorIntelligence"));
const CreatorMonetization = lazy(() => import("./pages/CreatorMonetization"));
const CreatorOnboarding = lazy(() => import("./pages/CreatorOnboarding"));
const CreatorProfile = lazy(() => import("./pages/CreatorProfile"));
const CreatorSpotlight = lazy(() => import("./pages/CreatorSpotlight"));
const CreatorStudio = lazy(() => import("./pages/CreatorStudio"));
const CrossChainInterop = lazy(() => import("./pages/CrossChainInterop"));
const Crypto = lazy(() => import("./pages/Crypto"));
const CryptoHub = lazy(() => import("./pages/CryptoHub"));
const CryptoMine = lazy(() => import("./pages/CryptoMine"));
const CryptoResearchHub = lazy(() => import("./pages/CryptoResearchHub"));
const CustomDashboard = lazy(() => import("./pages/CustomDashboard"));
const CustomReports = lazy(() => import("./pages/CustomReports"));
const CustomerAnalytics = lazy(() => import("./pages/CustomerAnalytics"));
const CustomerDisputes = lazy(() => import("./pages/CustomerDisputes"));
const DAOGovernance = lazy(() => import("./pages/DAOGovernance"));
const DAOTreasury = lazy(() => import("./pages/DAOTreasury"));
const DEXDepthChart = lazy(() => import("./pages/DEXDepthChart"));
const DHgateShop = lazy(() => import("./pages/DHgateShop"));
const DMInbox = lazy(() => import("./pages/DMInbox"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardOverview = lazy(() => import("./pages/DashboardOverview"));
const DataExport = lazy(() => import("./pages/DataExport"));
const DataGrid = lazy(() => import("./pages/DataGrid"));
const DataLake = lazy(() => import("./pages/DataLake"));
const DataPrivacy = lazy(() => import("./pages/DataPrivacy"));
const DataProcessing = lazy(() => import("./pages/DataProcessing"));
const DataRetention = lazy(() => import("./pages/DataRetention"));
const DataTable = lazy(() => import("./pages/DataTable"));
const DataVisualization = lazy(() => import("./pages/DataVisualization"));
const DatabaseManagement = lazy(() => import("./pages/DatabaseManagement"));
const DateInputForm = lazy(() => import("./pages/DateInputForm"));
const DatePickerDialog = lazy(() => import("./pages/DatePickerDialog"));
const DatingDiscovery = lazy(() => import("./pages/DatingDiscovery"));
const DatingHome = lazy(() => import("./pages/DatingHome"));
const DatingMatches = lazy(() => import("./pages/DatingMatches"));
const DatingMessages = lazy(() => import("./pages/DatingMessages"));
const DatingPremium = lazy(() => import("./pages/DatingPremium"));
const DatingProfile = lazy(() => import("./pages/DatingProfile"));
const DatingProfileSetup = lazy(() => import("./pages/DatingProfileSetup"));
const DatingSubscription = lazy(() => import("./pages/DatingSubscription"));
const DayTradeRoom = lazy(() => import("./pages/DayTradeRoom"));
const DeFi = lazy(() => import("./pages/DeFi"));
const DecentralizedIdentity = lazy(() => import("./pages/DecentralizedIdentity"));
const DefensibilityMoat = lazy(() => import("./pages/DefensibilityMoat"));
const DeleteAccount = lazy(() => import("./pages/DeleteAccount"));
const DeleteContent = lazy(() => import("./pages/DeleteContent"));
const DepartmentManagement = lazy(() => import("./pages/DepartmentManagement"));
const DependencyGraph = lazy(() => import("./pages/DependencyGraph"));
const DeploymentPipeline = lazy(() => import("./pages/DeploymentPipeline"));
const DeprecationPolicy = lazy(() => import("./pages/DeprecationPolicy"));
const DestinationGuide = lazy(() => import("./pages/DestinationGuide"));
const DestinyEngine = lazy(() => import("./pages/DestinyEngine"));
const DevOps = lazy(() => import("./pages/DevOps"));
const DeveloperArea = lazy(() => import("./pages/DeveloperArea"));
const DeveloperCommunity = lazy(() => import("./pages/DeveloperCommunity"));
const DeveloperMarketplace = lazy(() => import("./pages/DeveloperMarketplace"));
const DeveloperProtocol = lazy(() => import("./pages/DeveloperProtocol"));
const DigitalArtStore = lazy(() => import("./pages/DigitalArtStore"));
const DigitalNationMode = lazy(() => import("./pages/DigitalNationMode"));
const DigitalTwin = lazy(() => import("./pages/DigitalTwin"));
const DirectMessages = lazy(() => import("./pages/DirectMessages"));
const DisasterRecovery = lazy(() => import("./pages/DisasterRecovery"));
const DiscordIntegration = lazy(() => import("./pages/DiscordIntegration"));
const Discover = lazy(() => import("./pages/Discover"));
const DiscussionBoard = lazy(() => import("./pages/DiscussionBoard"));
const DiscussionForums = lazy(() => import("./pages/DiscussionForums"));
const DisputeResolution = lazy(() => import("./pages/DisputeResolution"));
const DistributionChannels = lazy(() => import("./pages/DistributionChannels"));
const DocumentEditor = lazy(() => import("./pages/DocumentEditor"));
const DocumentSharing = lazy(() => import("./pages/DocumentSharing"));
const DocumentSigning = lazy(() => import("./pages/DocumentSigning"));
const Documentation = lazy(() => import("./pages/Documentation"));
const DropdownMenu = lazy(() => import("./pages/DropdownMenu"));
const ENSResolver = lazy(() => import("./pages/ENSResolver"));
const EarnHub = lazy(() => import("./pages/EarnHub"));
const EconomicLayer = lazy(() => import("./pages/EconomicLayer"));
const Economics = lazy(() => import("./pages/Economics"));
const EconomyControl = lazy(() => import("./pages/EconomyControl"));
const Ecosystem = lazy(() => import("./pages/Ecosystem"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const EmailCampaigns = lazy(() => import("./pages/EmailCampaigns"));
const EmailInputForm = lazy(() => import("./pages/EmailInputForm"));
const EmailIntegration = lazy(() => import("./pages/EmailIntegration"));
const EmailNotifications = lazy(() => import("./pages/EmailNotifications"));
const EmailTemplates = lazy(() => import("./pages/EmailTemplates"));
const EmailVerification = lazy(() => import("./pages/EmailVerification"));
const EmbedSDK = lazy(() => import("./pages/EmbedSDK"));
const EmptySearchState = lazy(() => import("./pages/EmptySearchState"));
const EngagementMetrics = lazy(() => import("./pages/EngagementMetrics"));
const Engineer = lazy(() => import("./pages/Engineer"));
const Enterprise = lazy(() => import("./pages/Enterprise"));
const EnterpriseAPI = lazy(() => import("./pages/EnterpriseAPI"));
const EnterpriseAnalytics = lazy(() => import("./pages/EnterpriseAnalytics"));
const EntityProfile = lazy(() => import("./pages/EntityProfile"));
const EnvironmentManagement = lazy(() => import("./pages/EnvironmentManagement"));
const Error403 = lazy(() => import("./pages/Error403"));
const Error404 = lazy(() => import("./pages/Error404"));
const Error500 = lazy(() => import("./pages/Error500"));
const Error503 = lazy(() => import("./pages/Error503"));
const ErrorDialog = lazy(() => import("./pages/ErrorDialog"));
const ErrorTracking = lazy(() => import("./pages/ErrorTracking"));
const EscrowShop = lazy(() => import("./pages/EscrowShop"));
const EventAnalytics = lazy(() => import("./pages/EventAnalytics"));
const EventCalendar = lazy(() => import("./pages/EventCalendar"));
const EventCreation = lazy(() => import("./pages/EventCreation"));
const EventPlanner = lazy(() => import("./pages/EventPlanner"));
const EventRegistration = lazy(() => import("./pages/EventRegistration"));
const Events = lazy(() => import("./pages/Events"));
const ExerciseLibrary = lazy(() => import("./pages/ExerciseLibrary"));
const ExpenseManagement = lazy(() => import("./pages/ExpenseManagement"));
const ExpenseTracker = lazy(() => import("./pages/ExpenseTracker"));
const ExperimentFactory = lazy(() => import("./pages/ExperimentFactory"));
const ExperimentTracker = lazy(() => import("./pages/ExperimentTracker"));
const Explore = lazy(() => import("./pages/Explore"));
const ExportData = lazy(() => import("./pages/ExportData"));
const FAQManagement = lazy(() => import("./pages/FAQManagement"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const Farming = lazy(() => import("./pages/Farming"));
const Favorites = lazy(() => import("./pages/Favorites"));
const FeatureRequests = lazy(() => import("./pages/FeatureRequests"));
const FeatureTour = lazy(() => import("./pages/FeatureTour"));
const Features = lazy(() => import("./pages/Features"));
const Feedback = lazy(() => import("./pages/Feedback"));
const FeedbackDialog = lazy(() => import("./pages/FeedbackDialog"));
const FeedbackForm = lazy(() => import("./pages/FeedbackForm"));
const FeedbackHub = lazy(() => import("./pages/FeedbackHub"));
const FileBrowser = lazy(() => import("./pages/FileBrowser"));
const FileConverter = lazy(() => import("./pages/FileConverter"));
const FileDownload = lazy(() => import("./pages/FileDownload"));
const FilePreview = lazy(() => import("./pages/FilePreview"));
const FileUploadDialog = lazy(() => import("./pages/FileUploadDialog"));
const FileUploadForm = lazy(() => import("./pages/FileUploadForm"));
const FileUploadProgress = lazy(() => import("./pages/FileUploadProgress"));
const FileVersioning = lazy(() => import("./pages/FileVersioning"));
const FilterPanel = lazy(() => import("./pages/FilterPanel"));
const FinancialReports = lazy(() => import("./pages/FinancialReports"));
const FlightSearch = lazy(() => import("./pages/FlightSearch"));
const FollowList = lazy(() => import("./pages/FollowList"));
const FollowUnfollow = lazy(() => import("./pages/FollowUnfollow"));
const FollowerList = lazy(() => import("./pages/FollowerList"));
const ForecastingEngine = lazy(() => import("./pages/ForecastingEngine"));
const ForumCategories = lazy(() => import("./pages/ForumCategories"));
const FreeWillDashboard = lazy(() => import("./pages/FreeWillDashboard"));
const GDPR = lazy(() => import("./pages/GDPR"));
const GTMStrategy = lazy(() => import("./pages/GTMStrategy"));
const GameBlackjack = lazy(() => import("./pages/GameBlackjack"));
const GameBlockBuilder = lazy(() => import("./pages/GameBlockBuilder"));
const GameChat = lazy(() => import("./pages/GameChat"));
const GameCrash = lazy(() => import("./pages/GameCrash"));
const GameCryptoQuiz = lazy(() => import("./pages/GameCryptoQuiz"));
const GameDice = lazy(() => import("./pages/GameDice"));
const GameFiQuestBoard = lazy(() => import("./pages/GameFiQuestBoard"));
const GameLobby = lazy(() => import("./pages/GameLobby"));
const GamePlinko = lazy(() => import("./pages/GamePlinko"));
const GameRoom = lazy(() => import("./pages/GameRoom"));
const GameRoulette = lazy(() => import("./pages/GameRoulette"));
const GameSettings = lazy(() => import("./pages/GameSettings"));
const GameSlots = lazy(() => import("./pages/GameSlots"));
const GameTokenTap = lazy(() => import("./pages/GameTokenTap"));
const Gaming = lazy(() => import("./pages/Gaming"));
const GamingForCharity = lazy(() => import("./pages/GamingForCharity"));
const GanttChart = lazy(() => import("./pages/GanttChart"));
const GasFeeEstimator = lazy(() => import("./pages/GasFeeEstimator"));
const GasTracker = lazy(() => import("./pages/GasTracker"));
const GeneralSettings = lazy(() => import("./pages/GeneralSettings"));
const GeneratedApiExplorer = lazy(() => import("./pages/GeneratedApiExplorer"));
const GeneratedGallery = lazy(() => import("./pages/GeneratedGallery"));
const GettingStartedGuide = lazy(() => import("./pages/GettingStartedGuide"));
const GhostMode = lazy(() => import("./pages/GhostMode"));
const GlobalOperationsCenter = lazy(() => import("./pages/GlobalOperationsCenter"));
const GlobalSearch = lazy(() => import("./pages/GlobalSearch"));
const Governance = lazy(() => import("./pages/Governance"));
const GovernanceWizard = lazy(() => import("./pages/GovernanceWizard"));
const GradeBook = lazy(() => import("./pages/GradeBook"));
const GroupChat = lazy(() => import("./pages/GroupChat"));
const GroupDirectory = lazy(() => import("./pages/GroupDirectory"));
const GroupEvents = lazy(() => import("./pages/GroupEvents"));
const GroupManagement = lazy(() => import("./pages/GroupManagement"));
const Growth = lazy(() => import("./pages/Growth"));
const Guilds = lazy(() => import("./pages/Guilds"));
const HIPAA = lazy(() => import("./pages/HIPAA"));
const HOPEAIControl = lazy(() => import("./pages/HOPEAIControl"));
const HashtagExplorer = lazy(() => import("./pages/HashtagExplorer"));
const HashtagSearch = lazy(() => import("./pages/HashtagSearch"));
const HealthArticles = lazy(() => import("./pages/HealthArticles"));
const HealthDashboard = lazy(() => import("./pages/HealthDashboard"));
const HealthGoals = lazy(() => import("./pages/HealthGoals"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const Home = lazy(() => import("./pages/Home"));
const HopeAI = lazy(() => import("./pages/HopeAI"));
const HopeAIAdvanced = lazy(() => import("./pages/HopeAIAdvanced"));
const HopeAIMeta = lazy(() => import("./pages/HopeAIMeta"));
const HopeAIUpgrades = lazy(() => import("./pages/HopeAIUpgrades"));
const HotelSearch = lazy(() => import("./pages/HotelSearch"));
const HubSpotIntegration = lazy(() => import("./pages/HubSpotIntegration"));
const ICOLaunchpad = lazy(() => import("./pages/ICOLaunchpad"));
const IFTTT = lazy(() => import("./pages/IFTTT"));
const ImageGallery = lazy(() => import("./pages/ImageGallery"));
const ImageTools = lazy(() => import("./pages/ImageTools"));
const ImageViewer = lazy(() => import("./pages/ImageViewer"));
const ImpactMap = lazy(() => import("./pages/ImpactMap"));
const InAppNotifications = lazy(() => import("./pages/InAppNotifications"));
const IncidentManagement = lazy(() => import("./pages/IncidentManagement"));
const InputDialog = lazy(() => import("./pages/InputDialog"));
const InstructorDashboard = lazy(() => import("./pages/InstructorDashboard"));
const IntegrationSetup = lazy(() => import("./pages/IntegrationSetup"));
const Integrations = lazy(() => import("./pages/Integrations"));
const InventoryManagement = lazy(() => import("./pages/InventoryManagement"));
const InvestorMetrics = lazy(() => import("./pages/InvestorMetrics"));
const InvestorPitch = lazy(() => import("./pages/InvestorPitch"));
const InvestorPortal = lazy(() => import("./pages/InvestorPortal"));
const InvestorRoom = lazy(() => import("./pages/InvestorRoom"));
const InvoiceDetails = lazy(() => import("./pages/InvoiceDetails"));
const InvoiceManagement = lazy(() => import("./pages/InvoiceManagement"));
const KnowledgeBase = lazy(() => import("./pages/KnowledgeBase"));
const LDAPIntegration = lazy(() => import("./pages/LDAPIntegration"));
const LTVAnalysis = lazy(() => import("./pages/LTVAnalysis"));
const LanguageExchangeAdmin = lazy(() => import("./pages/LanguageExchangeAdmin"));
const LanguagePartnerDiscovery = lazy(() => import("./pages/LanguagePartnerDiscovery"));
const LanguageSettings = lazy(() => import("./pages/LanguageSettings"));
const LeadScoring = lazy(() => import("./pages/LeadScoring"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Leaderboards = lazy(() => import("./pages/Leaderboards"));
const Learning = lazy(() => import("./pages/Learning"));
const LearningPath = lazy(() => import("./pages/LearningPath"));
const LegalDocuments = lazy(() => import("./pages/LegalDocuments"));
const LegendaryStatus = lazy(() => import("./pages/LegendaryStatus"));
const LessonEditor = lazy(() => import("./pages/LessonEditor"));
const LifeCommand = lazy(() => import("./pages/LifeCommand"));
const Lightbox = lazy(() => import("./pages/Lightbox"));
const LikeReactionSystem = lazy(() => import("./pages/LikeReactionSystem"));
const LiquidityPools = lazy(() => import("./pages/LiquidityPools"));
const ListView = lazy(() => import("./pages/ListView"));
const Live = lazy(() => import("./pages/Live"));
const LiveChat = lazy(() => import("./pages/LiveChat"));
const LiveGifting = lazy(() => import("./pages/LiveGifting"));
const LiveReactions = lazy(() => import("./pages/LiveReactions"));
const LiveStreamSetup = lazy(() => import("./pages/LiveStreamSetup"));
const LivestreamDashboard = lazy(() => import("./pages/LivestreamDashboard"));
const LoadingDialog = lazy(() => import("./pages/LoadingDialog"));
const LogViewer = lazy(() => import("./pages/LogViewer"));
const Login = lazy(() => import("./pages/Login"));
const LogisticsOptimizer = lazy(() => import("./pages/LogisticsOptimizer"));
const MLInsights = lazy(() => import("./pages/MLInsights"));
const MLModels = lazy(() => import("./pages/MLModels"));
const MailingLists = lazy(() => import("./pages/MailingLists"));
const MainDashboard = lazy(() => import("./pages/MainDashboard"));
const MaintenanceMode = lazy(() => import("./pages/MaintenanceMode"));
const MapView = lazy(() => import("./pages/MapView"));
const MarketingROI = lazy(() => import("./pages/MarketingROI"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const MarketplaceAnalytics = lazy(() => import("./pages/MarketplaceAnalytics"));
const MasterArchitecture = lazy(() => import("./pages/MasterArchitecture"));
const MatchChat = lazy(() => import("./pages/MatchChat"));
const MatchFeed = lazy(() => import("./pages/MatchFeed"));
const MatchSpace = lazy(() => import("./pages/MatchSpace"));
const MealPlans = lazy(() => import("./pages/MealPlans"));
const MediaCarousel = lazy(() => import("./pages/MediaCarousel"));
const MediaGallery = lazy(() => import("./pages/MediaGallery"));
const MedicationReminder = lazy(() => import("./pages/MedicationReminder"));
const MegaMarketplace = lazy(() => import("./pages/MegaMarketplace"));
const MembershipTiers = lazy(() => import("./pages/MembershipTiers"));
const MemoryConstellation = lazy(() => import("./pages/MemoryConstellation"));
const MemoryGraphVisualizer = lazy(() => import("./pages/MemoryGraphVisualizer"));
const MemorySystem = lazy(() => import("./pages/MemorySystem"));
const Messages = lazy(() => import("./pages/Messages"));
const MilestoneTracking = lazy(() => import("./pages/MilestoneTracking"));
const MinerDashboard = lazy(() => import("./pages/MinerDashboard"));
const Mining = lazy(() => import("./pages/Mining"));
const MiningCalculator = lazy(() => import("./pages/MiningCalculator"));
const MiningDashboard = lazy(() => import("./pages/MiningDashboard"));
const MissionControl = lazy(() => import("./pages/MissionControl"));
const MobileApp = lazy(() => import("./pages/MobileApp"));
const MobileGaming = lazy(() => import("./pages/MobileGaming"));
const MobileHome = lazy(() => import("./pages/MobileHome"));
const MobileMenu = lazy(() => import("./pages/MobileMenu"));
const MobileMessages = lazy(() => import("./pages/MobileMessages"));
const MobileNotifications = lazy(() => import("./pages/MobileNotifications"));
const MobileProfile = lazy(() => import("./pages/MobileProfile"));
const MobileSearch = lazy(() => import("./pages/MobileSearch"));
const MobileSettings = lazy(() => import("./pages/MobileSettings"));
const MobileShop = lazy(() => import("./pages/MobileShop"));
const MobileStreaming = lazy(() => import("./pages/MobileStreaming"));
const MobileTrading = lazy(() => import("./pages/MobileTrading"));
const MobileWallet = lazy(() => import("./pages/MobileWallet"));
const ModerationDashboard = lazy(() => import("./pages/ModerationDashboard"));
const MoodTracker = lazy(() => import("./pages/MoodTracker"));
const MortgageCalculator = lazy(() => import("./pages/MortgageCalculator"));
const MovieCatalog = lazy(() => import("./pages/MovieCatalog"));
const MovieDetail = lazy(() => import("./pages/MovieDetail"));
const MultiCryptoMine = lazy(() => import("./pages/MultiCryptoMine"));
const MultiSelectForm = lazy(() => import("./pages/MultiSelectForm"));
const MultiplayerLobby = lazy(() => import("./pages/MultiplayerLobby"));
const MultivariateTesting = lazy(() => import("./pages/MultivariateTesting"));
const MutualConnections = lazy(() => import("./pages/MutualConnections"));
const MyLearning = lazy(() => import("./pages/MyLearning"));
const MyTrips = lazy(() => import("./pages/MyTrips"));
const NFTGallery = lazy(() => import("./pages/NFTGallery"));
const NFTMinting = lazy(() => import("./pages/NFTMinting"));
const NFTWallet = lazy(() => import("./pages/NFTWallet"));
const NLPTools = lazy(() => import("./pages/NLPTools"));
const NSFWFeed = lazy(() => import("./pages/NSFWFeed"));
const NSFWPlatform = lazy(() => import("./pages/NSFWPlatform"));
const NarrativeEngine = lazy(() => import("./pages/NarrativeEngine"));
const NetWorthTracker = lazy(() => import("./pages/NetWorthTracker"));
const NetworkGraph = lazy(() => import("./pages/NetworkGraph"));
const NotesApp = lazy(() => import("./pages/NotesApp"));
const NotificationCenter = lazy(() => import("./pages/NotificationCenter"));
const NotificationHistory = lazy(() => import("./pages/NotificationHistory"));
const NotificationIntelligence = lazy(() => import("./pages/NotificationIntelligence"));
const NotificationPreferences = lazy(() => import("./pages/NotificationPreferences"));
const NotificationSettings = lazy(() => import("./pages/NotificationSettings"));
const Notifications = lazy(() => import("./pages/Notifications"));
const NotificationsCenter = lazy(() => import("./pages/NotificationsCenter"));
const NotificationsHub = lazy(() => import("./pages/NotificationsHub"));
const NumberInputForm = lazy(() => import("./pages/NumberInputForm"));
const NutritionTracker = lazy(() => import("./pages/NutritionTracker"));
const OAuthProviders = lazy(() => import("./pages/OAuthProviders"));
const OfferManagement = lazy(() => import("./pages/OfferManagement"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const OnboardingTutorial = lazy(() => import("./pages/OnboardingTutorial"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const OrganizationSettings = lazy(() => import("./pages/OrganizationSettings"));
const P2EShop = lazy(() => import("./pages/P2EShop"));
const Pagination = lazy(() => import("./pages/Pagination"));
const PasswordInputForm = lazy(() => import("./pages/PasswordInputForm"));
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const PayPalIntegration = lazy(() => import("./pages/PayPalIntegration"));
const PaymentConfirmation = lazy(() => import("./pages/PaymentConfirmation"));
const PaymentInfra = lazy(() => import("./pages/PaymentInfra"));
const PaymentMethods = lazy(() => import("./pages/PaymentMethods"));
const PaymentSetup = lazy(() => import("./pages/PaymentSetup"));
const Payments = lazy(() => import("./pages/Payments"));
const PayoutDashboard = lazy(() => import("./pages/PayoutDashboard"));
const PayoutManagement = lazy(() => import("./pages/PayoutManagement"));
const PerformanceMetrics = lazy(() => import("./pages/PerformanceMetrics"));
const PersonaBuilder = lazy(() => import("./pages/PersonaBuilder"));
const Phase1Dashboard = lazy(() => import("./pages/Phase1Dashboard"));
const Phase2to4Dashboard = lazy(() => import("./pages/Phase2to4Dashboard"));
const PhoneVerification = lazy(() => import("./pages/PhoneVerification"));
const PlatformMap = lazy(() => import("./pages/PlatformMap"));
const PlatformStatus = lazy(() => import("./pages/PlatformStatus"));
const PlaylistManager = lazy(() => import("./pages/PlaylistManager"));
const PodcastStudio = lazy(() => import("./pages/PodcastStudio"));
const PolicyManagement = lazy(() => import("./pages/PolicyManagement"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const PortfolioOverview = lazy(() => import("./pages/PortfolioOverview"));
const PortfolioTracker = lazy(() => import("./pages/PortfolioTracker"));
const PowerUserTools = lazy(() => import("./pages/PowerUserTools"));
const PracticeSessions = lazy(() => import("./pages/PracticeSessions"));
const PredictiveAnalytics = lazy(() => import("./pages/PredictiveAnalytics"));
const PredictiveModels = lazy(() => import("./pages/PredictiveModels"));
const PredictiveSystems = lazy(() => import("./pages/PredictiveSystems"));
const PreferencesSetup = lazy(() => import("./pages/PreferencesSetup"));
const PresentationWithChat = lazy(() => import("./pages/PresentationWithChat"));
const Pricing = lazy(() => import("./pages/Pricing"));
const PricingEngine = lazy(() => import("./pages/PricingEngine"));
const PricingRules = lazy(() => import("./pages/PricingRules"));
const PriorityMatrix = lazy(() => import("./pages/PriorityMatrix"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const PrivacySettings = lazy(() => import("./pages/PrivacySettings"));
const PrivacyVault = lazy(() => import("./pages/PrivacyVault"));
const ProductApproval = lazy(() => import("./pages/ProductApproval"));
const ProductBrain = lazy(() => import("./pages/ProductBrain"));
const ProductCatalog = lazy(() => import("./pages/ProductCatalog"));
const ProductComparison = lazy(() => import("./pages/ProductComparison"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ProductListing = lazy(() => import("./pages/ProductListing"));
const ProductReviews = lazy(() => import("./pages/ProductReviews"));
const ProductionArchitecture = lazy(() => import("./pages/ProductionArchitecture"));
const Profile = lazy(() => import("./pages/Profile"));
const ProfileCompletion = lazy(() => import("./pages/ProfileCompletion"));
const ProfileDashboard = lazy(() => import("./pages/ProfileDashboard"));
const ProfileEdit = lazy(() => import("./pages/ProfileEdit"));
const ProfilePicture = lazy(() => import("./pages/ProfilePicture"));
const ProfilePreview = lazy(() => import("./pages/ProfilePreview"));
const ProfileWallet = lazy(() => import("./pages/ProfileWallet"));
const Profitability = lazy(() => import("./pages/Profitability"));
const ProgressBar = lazy(() => import("./pages/ProgressBar"));
const ProgressTracking = lazy(() => import("./pages/ProgressTracking"));
const ProjectBoard = lazy(() => import("./pages/ProjectBoard"));
const PromotionEngine = lazy(() => import("./pages/PromotionEngine"));
const ProofVault = lazy(() => import("./pages/ProofVault"));
const PropertyComparison = lazy(() => import("./pages/PropertyComparison"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const PropertyListing = lazy(() => import("./pages/PropertyListing"));
const PropertyTransfer = lazy(() => import("./pages/PropertyTransfer"));
const ProtocolLayer = lazy(() => import("./pages/ProtocolLayer"));
const PublishingSchedule = lazy(() => import("./pages/PublishingSchedule"));
const PushNotifications = lazy(() => import("./pages/PushNotifications"));
const QRCodeGenerator = lazy(() => import("./pages/QRCodeGenerator"));
const QuickActions = lazy(() => import("./pages/QuickActions"));
const QuickStats = lazy(() => import("./pages/QuickStats"));
const QuizBuilder = lazy(() => import("./pages/QuizBuilder"));
const RFMAnalysis = lazy(() => import("./pages/RFMAnalysis"));
const RadioButtonForm = lazy(() => import("./pages/RadioButtonForm"));
const RateLimitConfig = lazy(() => import("./pages/RateLimitConfig"));
const RateLimitDashboard = lazy(() => import("./pages/RateLimitDashboard"));
const RateLimitError = lazy(() => import("./pages/RateLimitError"));
const RateLimiting = lazy(() => import("./pages/RateLimiting"));
const RatingSystem = lazy(() => import("./pages/RatingSystem"));
const RealTimeMonitoring = lazy(() => import("./pages/RealTimeMonitoring"));
const ReceiptDownload = lazy(() => import("./pages/ReceiptDownload"));
const ReceiveCrypto = lazy(() => import("./pages/ReceiveCrypto"));
const RecentActivity = lazy(() => import("./pages/RecentActivity"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const RecommendationsFeed = lazy(() => import("./pages/RecommendationsFeed"));
const Reels = lazy(() => import("./pages/Reels"));
const Referrals = lazy(() => import("./pages/Referrals"));
const RefundRequests = lazy(() => import("./pages/RefundRequests"));
const RegionalSettings = lazy(() => import("./pages/RegionalSettings"));
const Reminders = lazy(() => import("./pages/Reminders"));
const ReportDialog = lazy(() => import("./pages/ReportDialog"));
const ReportUser = lazy(() => import("./pages/ReportUser"));
const ReportsDashboard = lazy(() => import("./pages/ReportsDashboard"));
const ReputationSystem = lazy(() => import("./pages/ReputationSystem"));
const ResourceAllocation = lazy(() => import("./pages/ResourceAllocation"));
const ResourceLibrary = lazy(() => import("./pages/ResourceLibrary"));
const ResponseTime = lazy(() => import("./pages/ResponseTime"));
const Retention = lazy(() => import("./pages/Retention"));
const RetentionAnalytics = lazy(() => import("./pages/RetentionAnalytics"));
const RetentionEngine = lazy(() => import("./pages/RetentionEngine"));
const RetirementPlanner = lazy(() => import("./pages/RetirementPlanner"));
const ReturnManagement = lazy(() => import("./pages/ReturnManagement"));
const ReturnsRefunds = lazy(() => import("./pages/ReturnsRefunds"));
const ReviewModeration = lazy(() => import("./pages/ReviewModeration"));
const Reviews = lazy(() => import("./pages/Reviews"));
const ReviewsRatings = lazy(() => import("./pages/ReviewsRatings"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const RoadmapView = lazy(() => import("./pages/RoadmapView"));
const RoleManagement = lazy(() => import("./pages/RoleManagement"));
const SDKDownload = lazy(() => import("./pages/SDKDownload"));
const SDKManagement = lazy(() => import("./pages/SDKManagement"));
const SEOOptimizer = lazy(() => import("./pages/SEOOptimizer"));
const SKY444CentralBank = lazy(() => import("./pages/SKY444CentralBank"));
const SMSCampaigns = lazy(() => import("./pages/SMSCampaigns"));
const SMSIntegration = lazy(() => import("./pages/SMSIntegration"));
const SMSTemplates = lazy(() => import("./pages/SMSTemplates"));
const SOC2 = lazy(() => import("./pages/SOC2"));
const SSO = lazy(() => import("./pages/SSO"));
const SalesAnalytics = lazy(() => import("./pages/SalesAnalytics"));
const SalesforceIntegration = lazy(() => import("./pages/SalesforceIntegration"));
const SatisfactionSurvey = lazy(() => import("./pages/SatisfactionSurvey"));
const SavedProperties = lazy(() => import("./pages/SavedProperties"));
const SavedSearches = lazy(() => import("./pages/SavedSearches"));
const SavingsGoals = lazy(() => import("./pages/SavingsGoals"));
const ScheduledJobs = lazy(() => import("./pages/ScheduledJobs"));
const ScheduledReports = lazy(() => import("./pages/ScheduledReports"));
const School = lazy(() => import("./pages/School"));
const SchoolCertificate = lazy(() => import("./pages/SchoolCertificate"));
const SchoolCourse = lazy(() => import("./pages/SchoolCourse"));
const SchoolDashboard = lazy(() => import("./pages/SchoolDashboard"));
const SchoolLesson = lazy(() => import("./pages/SchoolLesson"));
const SchoolQuiz = lazy(() => import("./pages/SchoolQuiz"));
const Search = lazy(() => import("./pages/Search"));
const SearchAnalytics = lazy(() => import("./pages/SearchAnalytics"));
const SearchHistory = lazy(() => import("./pages/SearchHistory"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const SearchSuggestions = lazy(() => import("./pages/SearchSuggestions"));
const Security = lazy(() => import("./pages/Security"));
const SecurityAudit = lazy(() => import("./pages/SecurityAudit"));
const SecurityCompliance = lazy(() => import("./pages/SecurityCompliance"));
const SecurityDashboard = lazy(() => import("./pages/SecurityDashboard"));
const SecuritySettings = lazy(() => import("./pages/SecuritySettings"));
const SegmentationAnalysis = lazy(() => import("./pages/SegmentationAnalysis"));
const SelectDropdownForm = lazy(() => import("./pages/SelectDropdownForm"));
const SelfHealingInfra = lazy(() => import("./pages/SelfHealingInfra"));
const SellerDashboard = lazy(() => import("./pages/SellerDashboard"));
const SellerProfile = lazy(() => import("./pages/SellerProfile"));
const SendCrypto = lazy(() => import("./pages/SendCrypto"));
const SentimentPipeline = lazy(() => import("./pages/SentimentPipeline"));
const ServerHealth = lazy(() => import("./pages/ServerHealth"));
const ServerInstaller = lazy(() => import("./pages/ServerInstaller"));
const ServerStatus = lazy(() => import("./pages/ServerStatus"));
const Settings = lazy(() => import("./pages/Settings"));
const SettingsDialog = lazy(() => import("./pages/SettingsDialog"));
const SetupWizard = lazy(() => import("./pages/SetupWizard"));
const ShadowIdentity = lazy(() => import("./pages/ShadowIdentity"));
const ShadowRelay = lazy(() => import("./pages/ShadowRelay"));
const ShareDialog = lazy(() => import("./pages/ShareDialog"));
const ShippingManagement = lazy(() => import("./pages/ShippingManagement"));
const ShoppingCart = lazy(() => import("./pages/ShoppingCart"));
const SidebarNavigation = lazy(() => import("./pages/SidebarNavigation"));
const SignUp = lazy(() => import("./pages/SignUp"));
const SignUpFlow = lazy(() => import("./pages/SignUpFlow"));
const SignUp_old = lazy(() => import("./pages/SignUp_old"));
const Signin = lazy(() => import("./pages/Signin"));
const SituationRoom = lazy(() => import("./pages/SituationRoom"));
const SkillBadges = lazy(() => import("./pages/SkillBadges"));
const SkySchool = lazy(() => import("./pages/SkySchool"));
const SkySchoolAI = lazy(() => import("./pages/SkySchoolAI"));
const SkySchoolQuiz = lazy(() => import("./pages/SkySchoolQuiz"));
const SkyStore = lazy(() => import("./pages/SkyStore"));
const SlackIntegration = lazy(() => import("./pages/SlackIntegration"));
const SleepTracking = lazy(() => import("./pages/SleepTracking"));
const SmartContractAudit = lazy(() => import("./pages/SmartContractAudit"));
const SmartContracts = lazy(() => import("./pages/SmartContracts"));
const Social = lazy(() => import("./pages/Social"));
const SocialFeedV2 = lazy(() => import("./pages/SocialFeedV2"));
const SocialGraph = lazy(() => import("./pages/SocialGraph"));
const SocialMedia = lazy(() => import("./pages/SocialMedia"));
const SocialMediaCampaigns = lazy(() => import("./pages/SocialMediaCampaigns"));
const SortOptions = lazy(() => import("./pages/SortOptions"));
const SpinWheel = lazy(() => import("./pages/SpinWheel"));
const StakingDashboard = lazy(() => import("./pages/StakingDashboard"));
const StakingPortal = lazy(() => import("./pages/StakingPortal"));
const StatisticsPanel = lazy(() => import("./pages/StatisticsPanel"));
const Status = lazy(() => import("./pages/Status"));
const StepperWizard = lazy(() => import("./pages/StepperWizard"));
const StockChart = lazy(() => import("./pages/StockChart"));
const StockSearch = lazy(() => import("./pages/StockSearch"));
const Stories = lazy(() => import("./pages/Stories"));
const StreamAnalytics = lazy(() => import("./pages/StreamAnalytics"));
const StreamClip = lazy(() => import("./pages/StreamClip"));
const StreamGifting = lazy(() => import("./pages/StreamGifting"));
const Streaming = lazy(() => import("./pages/Streaming"));
const StripeCheckout = lazy(() => import("./pages/StripeCheckout"));
const StripeIntegration = lazy(() => import("./pages/StripeIntegration"));
const StudentProgress = lazy(() => import("./pages/StudentProgress"));
const SubscriptionManagement = lazy(() => import("./pages/SubscriptionManagement"));
const Subscriptions = lazy(() => import("./pages/Subscriptions"));
const SuccessDialog = lazy(() => import("./pages/SuccessDialog"));
const SuccessScreen = lazy(() => import("./pages/SuccessScreen"));
const SupportMetrics = lazy(() => import("./pages/SupportMetrics"));
const SupportTicket = lazy(() => import("./pages/SupportTicket"));
const SystemArchitecture = lazy(() => import("./pages/SystemArchitecture"));
const SystemLogs = lazy(() => import("./pages/SystemLogs"));
const SystemObservability = lazy(() => import("./pages/SystemObservability"));
const SystemStatus = lazy(() => import("./pages/SystemStatus"));
const TabsNavigation = lazy(() => import("./pages/TabsNavigation"));
const TaskAutomation = lazy(() => import("./pages/TaskAutomation"));
const TaskDetail = lazy(() => import("./pages/TaskDetail"));
const TaskList = lazy(() => import("./pages/TaskList"));
const TaxPlanning = lazy(() => import("./pages/TaxPlanning"));
const TaxReports = lazy(() => import("./pages/TaxReports"));
const TeachingOpportunities = lazy(() => import("./pages/TeachingOpportunities"));
const TeamManagement = lazy(() => import("./pages/TeamManagement"));
const TeamWorkspace = lazy(() => import("./pages/TeamWorkspace"));
const TelegramIntegration = lazy(() => import("./pages/TelegramIntegration"));
const TemplateLibrary = lazy(() => import("./pages/TemplateLibrary"));
const TermsAcceptance = lazy(() => import("./pages/TermsAcceptance"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const TextInputForm = lazy(() => import("./pages/TextInputForm"));
const TextTools = lazy(() => import("./pages/TextTools"));
const ThemeSettings = lazy(() => import("./pages/ThemeSettings"));
const ThreadManagement = lazy(() => import("./pages/ThreadManagement"));
const TicketAssignment = lazy(() => import("./pages/TicketAssignment"));
const TicketDetail = lazy(() => import("./pages/TicketDetail"));
const TicketQueue = lazy(() => import("./pages/TicketQueue"));
const TimeInputForm = lazy(() => import("./pages/TimeInputForm"));
const TimePickerDialog = lazy(() => import("./pages/TimePickerDialog"));
const TimeTracking = lazy(() => import("./pages/TimeTracking"));
const TimelineView = lazy(() => import("./pages/TimelineView"));
const TimeoutError = lazy(() => import("./pages/TimeoutError"));
const TipJar = lazy(() => import("./pages/TipJar"));
const ToastNotifications = lazy(() => import("./pages/ToastNotifications"));
const TodoList = lazy(() => import("./pages/TodoList"));
const ToggleSwitchForm = lazy(() => import("./pages/ToggleSwitchForm"));
const TokenDashboard = lazy(() => import("./pages/TokenDashboard"));
const TokenGovernance = lazy(() => import("./pages/TokenGovernance"));
const TokenMetrics = lazy(() => import("./pages/TokenMetrics"));
const TokenSwap = lazy(() => import("./pages/TokenSwap"));
const TokenomicsCalculator = lazy(() => import("./pages/TokenomicsCalculator"));
const TorBridge = lazy(() => import("./pages/TorBridge"));
const TournamentBracket = lazy(() => import("./pages/TournamentBracket"));
const Tournaments = lazy(() => import("./pages/Tournaments"));
const TradeHistory = lazy(() => import("./pages/TradeHistory"));
const Trading = lazy(() => import("./pages/Trading"));
const TradingTerminal = lazy(() => import("./pages/TradingTerminal"));
const TransactionExplorer = lazy(() => import("./pages/TransactionExplorer"));
const TransactionHistory = lazy(() => import("./pages/TransactionHistory"));
const TranscriptionManager = lazy(() => import("./pages/TranscriptionManager"));
const TranslationEnabledCommunity = lazy(() => import("./pages/TranslationEnabledCommunity"));
const TranslationEnabledSocialFeed = lazy(() => import("./pages/TranslationEnabledSocialFeed"));
const TravelBlog = lazy(() => import("./pages/TravelBlog"));
const TravelBudget = lazy(() => import("./pages/TravelBudget"));
const TravelDocuments = lazy(() => import("./pages/TravelDocuments"));
const TravelPhotos = lazy(() => import("./pages/TravelPhotos"));
const TravelReviews = lazy(() => import("./pages/TravelReviews"));
const TravelTips = lazy(() => import("./pages/TravelTips"));
const TrendAnalysis = lazy(() => import("./pages/TrendAnalysis"));
const Trending = lazy(() => import("./pages/Trending"));
const TrendingItems = lazy(() => import("./pages/TrendingItems"));
const TrendingTopics = lazy(() => import("./pages/TrendingTopics"));
const TriggersActions = lazy(() => import("./pages/TriggersActions"));
const TripPlanner = lazy(() => import("./pages/TripPlanner"));
const TrumpMining = lazy(() => import("./pages/TrumpMining"));
const TrustSafetyDashboard = lazy(() => import("./pages/TrustSafetyDashboard"));
const TrustSystem = lazy(() => import("./pages/TrustSystem"));
const TwoFactorAuth = lazy(() => import("./pages/TwoFactorAuth"));
const TwoFactorSetup = lazy(() => import("./pages/TwoFactorSetup"));
const UnhiddenInterface = lazy(() => import("./pages/UnhiddenInterface"));
const UnhiddenMode = lazy(() => import("./pages/UnhiddenMode"));
const UnifiedFeed = lazy(() => import("./pages/UnifiedFeed"));
const UnifiedIdentity = lazy(() => import("./pages/UnifiedIdentity"));
const UnifiedMessaging = lazy(() => import("./pages/UnifiedMessaging"));
const UnifiedPaymentLedger = lazy(() => import("./pages/UnifiedPaymentLedger"));
const UnifiedPlatformDashboard = lazy(() => import("./pages/UnifiedPlatformDashboard"));
const UniversalSearch = lazy(() => import("./pages/UniversalSearch"));
const UpgradeDowngradePlan = lazy(() => import("./pages/UpgradeDowngradePlan"));
const UserBehavior = lazy(() => import("./pages/UserBehavior"));
const UserBio = lazy(() => import("./pages/UserBio"));
const UserDirectory = lazy(() => import("./pages/UserDirectory"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const UserMentions = lazy(() => import("./pages/UserMentions"));
const UserOnboarding = lazy(() => import("./pages/UserOnboarding"));
const UserPermissions = lazy(() => import("./pages/UserPermissions"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const UserStats = lazy(() => import("./pages/UserStats"));
const UserSuggestions = lazy(() => import("./pages/UserSuggestions"));
const VODArchive = lazy(() => import("./pages/VODArchive"));
const VendorAnalytics = lazy(() => import("./pages/VendorAnalytics"));
const VendorOnboarding = lazy(() => import("./pages/VendorOnboarding"));
const VendorPerformance = lazy(() => import("./pages/VendorPerformance"));
const VendorVerification = lazy(() => import("./pages/VendorVerification"));
const VenueManagement = lazy(() => import("./pages/VenueManagement"));
const Verification = lazy(() => import("./pages/Verification"));
const VerificationSteps = lazy(() => import("./pages/VerificationSteps"));
const VersionManagement = lazy(() => import("./pages/VersionManagement"));
const VestingSchedule = lazy(() => import("./pages/VestingSchedule"));
const VideoArea = lazy(() => import("./pages/VideoArea"));
const VideoChat = lazy(() => import("./pages/VideoChat"));
const VideoEditor = lazy(() => import("./pages/VideoEditor"));
const VideoPlayer = lazy(() => import("./pages/VideoPlayer"));
const VideoTools = lazy(() => import("./pages/VideoTools"));
const VideoTutorials = lazy(() => import("./pages/VideoTutorials"));
const VideoUploader = lazy(() => import("./pages/VideoUploader"));
const VirtualTour = lazy(() => import("./pages/VirtualTour"));
const VoiceCommands = lazy(() => import("./pages/VoiceCommands"));
const VoiceCommandsRegistry = lazy(() => import("./pages/VoiceCommandsRegistry"));
const Wallet = lazy(() => import("./pages/Wallet"));
const WalletConnect = lazy(() => import("./pages/WalletConnect"));
const WalletOverview = lazy(() => import("./pages/WalletOverview"));
const WarningDialog = lazy(() => import("./pages/WarningDialog"));
const WatchEarn = lazy(() => import("./pages/WatchEarn"));
const WatchList = lazy(() => import("./pages/WatchList"));
const Web3Auth = lazy(() => import("./pages/Web3Auth"));
const WebhookManager = lazy(() => import("./pages/WebhookManager"));
const Webhooks = lazy(() => import("./pages/Webhooks"));
const WelcomeScreen = lazy(() => import("./pages/WelcomeScreen"));
const WhaleMonitor = lazy(() => import("./pages/WhaleMonitor"));
const WishlistManagement = lazy(() => import("./pages/WishlistManagement"));
const WorkflowBuilder = lazy(() => import("./pages/WorkflowBuilder"));
const WorldBrain = lazy(() => import("./pages/WorldBrain"));
const WorldSimulationControl = lazy(() => import("./pages/WorldSimulationControl"));
const YieldFarming = lazy(() => import("./pages/YieldFarming"));
const ZapierIntegration = lazy(() => import("./pages/ZapierIntegration"));

