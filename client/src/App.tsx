import React, { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { BottomTabBar } from "@/components/BottomTabBar";

// Lazy load all pages
const ABTesting = lazy(() => import('./pages/ABTesting'));
const ABTestingAdvanced = lazy(() => import('./pages/ABTestingAdvanced'));
const AIAgentEconomy = lazy(() => import('./pages/AIAgentEconomy'));
const AIAgentMarket = lazy(() => import('./pages/AIAgentMarket'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const AIBrain = lazy(() => import('./pages/AIBrain'));
const AICodeStudio = lazy(() => import('./pages/AICodeStudio'));
const AICopyStudio = lazy(() => import('./pages/AICopyStudio'));
const AICore = lazy(() => import('./pages/AICore'));
const AIEngineer = lazy(() => import('./pages/AIEngineer'));
const AIMarketAgents = lazy(() => import('./pages/AIMarketAgents'));
const AIMatchmaker = lazy(() => import('./pages/AIMatchmaker'));
const AIModerationQueue = lazy(() => import('./pages/AIModerationQueue'));
const AIPersonaFeed = lazy(() => import('./pages/AIPersonaFeed'));
const AIPersonaSystem = lazy(() => import('./pages/AIPersonaSystem'));
const AIToolsHub = lazy(() => import('./pages/AIToolsHub'));
const AITrading = lazy(() => import('./pages/AITrading'));
const AITrainingLoops = lazy(() => import('./pages/AITrainingLoops'));
const APIDocs = lazy(() => import('./pages/APIDocs'));
const APIDocumentation = lazy(() => import('./pages/APIDocumentation'));
const APIIntegration = lazy(() => import('./pages/APIIntegration'));
const APIKeys = lazy(() => import('./pages/APIKeys'));
const APILogs = lazy(() => import('./pages/APILogs'));
const APIMonitoring = lazy(() => import('./pages/APIMonitoring'));
const APIStatus = lazy(() => import('./pages/APIStatus'));
const APITesting = lazy(() => import('./pages/APITesting'));
const APIUsage = lazy(() => import('./pages/APIUsage'));
const APIVersioning = lazy(() => import('./pages/APIVersioning'));
const APYTracking = lazy(() => import('./pages/APYTracking'));
const About = lazy(() => import('./pages/About'));
const AccessControl = lazy(() => import('./pages/AccessControl'));
const AccessibilitySettings = lazy(() => import('./pages/AccessibilitySettings'));
const AccordionNavigation = lazy(() => import('./pages/AccordionNavigation'));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));
const AchievementBadges = lazy(() => import('./pages/AchievementBadges'));
const Achievements = lazy(() => import('./pages/Achievements'));
const ActionObjects = lazy(() => import('./pages/ActionObjects'));
const ActionPanel = lazy(() => import('./pages/ActionPanel'));
const ActivityFeed = lazy(() => import('./pages/ActivityFeed'));
const ActivityTracking = lazy(() => import('./pages/ActivityTracking'));
const AdaptivePersonalization = lazy(() => import('./pages/AdaptivePersonalization'));
const AdaptiveRoadmap = lazy(() => import('./pages/AdaptiveRoadmap'));
const AddBankAccount = lazy(() => import('./pages/AddBankAccount'));
const AddCreditCard = lazy(() => import('./pages/AddCreditCard'));
const AddressBook = lazy(() => import('./pages/AddressBook'));
const AddressLookup = lazy(() => import('./pages/AddressLookup'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const AdminWalletManager = lazy(() => import('./pages/AdminWalletManager'));
const AdvancedAdminPanel = lazy(() => import('./pages/AdvancedAdminPanel'));
const AdvancedAnalytics = lazy(() => import('./pages/AdvancedAnalytics'));
const AdvancedOrders = lazy(() => import('./pages/AdvancedOrders'));
const AdvancedSearch = lazy(() => import('./pages/AdvancedSearch'));
const AffiliateDashboard = lazy(() => import('./pages/AffiliateDashboard'));
const AgeGate = lazy(() => import('./pages/AgeGate'));
const AgeVerification = lazy(() => import('./pages/AgeVerification'));
const AgentBuilder = lazy(() => import('./pages/AgentBuilder'));
const AgentCity = lazy(() => import('./pages/AgentCity'));
const AgentCoordination = lazy(() => import('./pages/AgentCoordination'));
const AgentCoordinationHub = lazy(() => import('./pages/AgentCoordinationHub'));
const AgentDebate = lazy(() => import('./pages/AgentDebate'));
const AgentDetail = lazy(() => import('./pages/AgentDetail'));
const AgentMarketplace = lazy(() => import('./pages/AgentMarketplace'));
const AgentPerformance = lazy(() => import('./pages/AgentPerformance'));
const AgentSprint = lazy(() => import('./pages/AgentSprint'));
const AgentsDashboard = lazy(() => import('./pages/AgentsDashboard'));
const AlertConfiguration = lazy(() => import('./pages/AlertConfiguration'));
const AlertDialog = lazy(() => import('./pages/AlertDialog'));
const AlertManagement = lazy(() => import('./pages/AlertManagement'));
const AmbientFeed = lazy(() => import('./pages/AmbientFeed'));
const Analytics = lazy(() => import('./pages/Analytics'));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));
const AnalyticsProducts = lazy(() => import('./pages/AnalyticsProducts'));
const AnalyticsReports = lazy(() => import('./pages/AnalyticsReports'));
const AnomalyDetection = lazy(() => import('./pages/AnomalyDetection'));
const AntiSurveillance = lazy(() => import('./pages/AntiSurveillance'));
const ApprovalWorkflows = lazy(() => import('./pages/ApprovalWorkflows'));
const Arcade = lazy(() => import('./pages/Arcade'));
const ArchiveManagement = lazy(() => import('./pages/ArchiveManagement'));
const AssetManagement = lazy(() => import('./pages/AssetManagement'));
const AssetTracking = lazy(() => import('./pages/AssetTracking'));
const AssignmentTracker = lazy(() => import('./pages/AssignmentTracker'));
const AttributionModeling = lazy(() => import('./pages/AttributionModeling'));
const AudienceSegmentation = lazy(() => import('./pages/AudienceSegmentation'));
const AudioAnalytics = lazy(() => import('./pages/AudioAnalytics'));
const AudioEditing = lazy(() => import('./pages/AudioEditing'));
const AudioLibrary = lazy(() => import('./pages/AudioLibrary'));
const AudioPlayer = lazy(() => import('./pages/AudioPlayer'));
const AuditLog = lazy(() => import('./pages/AuditLog'));
const AuditLogs = lazy(() => import('./pages/AuditLogs'));
const AuditTrail = lazy(() => import('./pages/AuditTrail'));
const AutoResponder = lazy(() => import('./pages/AutoResponder'));
const AutomationEngine = lazy(() => import('./pages/AutomationEngine'));
const AutomationRules = lazy(() => import('./pages/AutomationRules'));
const AutomationWorkflows = lazy(() => import('./pages/AutomationWorkflows'));
const BackupManagement = lazy(() => import('./pages/BackupManagement'));
const Badges = lazy(() => import('./pages/Badges'));
const BanSuspendUser = lazy(() => import('./pages/BanSuspendUser'));
const BatchGeneration = lazy(() => import('./pages/BatchGeneration'));
const BattlePass = lazy(() => import('./pages/BattlePass'));
const BehavioralIntelligence = lazy(() => import('./pages/BehavioralIntelligence'));
const Beta = lazy(() => import('./pages/Beta'));
const BillingHistory = lazy(() => import('./pages/BillingHistory'));
const BlockBrowser = lazy(() => import('./pages/BlockBrowser'));
const BlockRewards = lazy(() => import('./pages/BlockRewards'));
const BlockUser = lazy(() => import('./pages/BlockUser'));
const BlockchainCustody = lazy(() => import('./pages/BlockchainCustody'));
const BlockchainMonitor = lazy(() => import('./pages/BlockchainMonitor'));
const BlogEditor = lazy(() => import('./pages/BlogEditor'));
const BlogPublisher = lazy(() => import('./pages/BlogPublisher'));
const BookPage = lazy(() => import('./pages/BookPage'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const BountySystem = lazy(() => import('./pages/BountySystem'));
const BrandGuidelines = lazy(() => import('./pages/BrandGuidelines'));
const BreadcrumbNavigation = lazy(() => import('./pages/BreadcrumbNavigation'));
const BridgeTransactions = lazy(() => import('./pages/BridgeTransactions'));
const BrowserExtension = lazy(() => import('./pages/BrowserExtension'));
const BudgetPlanner = lazy(() => import('./pages/BudgetPlanner'));
const BugReporting = lazy(() => import('./pages/BugReporting'));
const BuildOrder = lazy(() => import('./pages/BuildOrder'));
const BuildRoadmap = lazy(() => import('./pages/BuildRoadmap'));
const BulkOperations = lazy(() => import('./pages/BulkOperations'));
const BulkOrdering = lazy(() => import('./pages/BulkOrdering'));
const BulkUpload = lazy(() => import('./pages/BulkUpload'));
const CCPA = lazy(() => import('./pages/CCPA'));
const CRM = lazy(() => import('./pages/CRM'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Calendar = lazy(() => import('./pages/Calendar'));
const CalendarView = lazy(() => import('./pages/CalendarView'));
const CampaignAnalytics = lazy(() => import('./pages/CampaignAnalytics'));
const CampaignBuilder = lazy(() => import('./pages/CampaignBuilder'));
const CampaignCreation = lazy(() => import('./pages/CampaignCreation'));
const CarRental = lazy(() => import('./pages/CarRental'));
const CardGridView = lazy(() => import('./pages/CardGridView'));
const CashFlowAnalysis = lazy(() => import('./pages/CashFlowAnalysis'));
const CategoryManagement = lazy(() => import('./pages/CategoryManagement'));
const CertificateManager = lazy(() => import('./pages/CertificateManager'));
const ChainExplorer = lazy(() => import('./pages/ChainExplorer'));
const ChangeLog = lazy(() => import('./pages/ChangeLog'));
const Charity = lazy(() => import('./pages/Charity'));
const CharityLeaderboard = lazy(() => import('./pages/CharityLeaderboard'));
const ChartAnalysis = lazy(() => import('./pages/ChartAnalysis'));
const ChartDashboard = lazy(() => import('./pages/ChartDashboard'));
const ChatBot = lazy(() => import('./pages/ChatBot'));
const ChatHistory = lazy(() => import('./pages/ChatHistory'));
const ChatMVP = lazy(() => import('./pages/ChatMVP'));
const CheckboxGroupForm = lazy(() => import('./pages/CheckboxGroupForm'));
const Checkout = lazy(() => import('./pages/Checkout'));
const CheckoutFlow = lazy(() => import('./pages/CheckoutFlow'));
const ChinaEdition = lazy(() => import('./pages/ChinaEdition'));
const ChurnPrediction = lazy(() => import('./pages/ChurnPrediction'));
const CitizenPassport = lazy(() => import('./pages/CitizenPassport'));
const CivilizationSimulator = lazy(() => import('./pages/CivilizationSimulator'));
const ClanWars = lazy(() => import('./pages/ClanWars'));
const ClassroomManagement = lazy(() => import('./pages/ClassroomManagement'));
const ClientLibraries = lazy(() => import('./pages/ClientLibraries'));
const ClosingChecklist = lazy(() => import('./pages/ClosingChecklist'));
const CodeCompletion = lazy(() => import('./pages/CodeCompletion'));
const CodeFormatter = lazy(() => import('./pages/CodeFormatter'));
const CodeHighlighting = lazy(() => import('./pages/CodeHighlighting'));
const CodeQuality = lazy(() => import('./pages/CodeQuality'));
const CodeQualityDashboard = lazy(() => import('./pages/CodeQualityDashboard'));
const CodeRepository = lazy(() => import('./pages/CodeRepository'));
const CodeSamples = lazy(() => import('./pages/CodeSamples'));
const CohortAnalysis = lazy(() => import('./pages/CohortAnalysis'));
const ColorPickerDialog = lazy(() => import('./pages/ColorPickerDialog'));
const CommentThread = lazy(() => import('./pages/CommentThread'));
const Comments = lazy(() => import('./pages/Comments'));
const CommentsSection = lazy(() => import('./pages/CommentsSection'));
const CommissionManagement = lazy(() => import('./pages/CommissionManagement'));
const Community = lazy(() => import('./pages/Community'));
const CommunityCreate = lazy(() => import('./pages/CommunityCreate'));
const CommunityEngagement = lazy(() => import('./pages/CommunityEngagement'));
const CommunityGuidelines = lazy(() => import('./pages/CommunityGuidelines'));
const CommunityHub = lazy(() => import('./pages/CommunityHub'));
const CompanySimulator = lazy(() => import('./pages/CompanySimulator'));
const CompetitiveRadar = lazy(() => import('./pages/CompetitiveRadar'));
const ComplianceCenter = lazy(() => import('./pages/ComplianceCenter'));
const ComplianceChecker = lazy(() => import('./pages/ComplianceChecker'));
const ComplianceChecking = lazy(() => import('./pages/ComplianceChecking'));
const ComplianceDashboard = lazy(() => import('./pages/ComplianceDashboard'));
const ComprehensiveEcosystemLanding = lazy(() => import('./pages/ComprehensiveEcosystemLanding'));
const ConfirmationDialog = lazy(() => import('./pages/ConfirmationDialog'));
const ConnectedApps = lazy(() => import('./pages/ConnectedApps'));
const ConnectionError = lazy(() => import('./pages/ConnectionError'));
const ConnectionRequests = lazy(() => import('./pages/ConnectionRequests'));
const ConnectorIntelligence = lazy(() => import('./pages/ConnectorIntelligence'));
const ContactManagement = lazy(() => import('./pages/ContactManagement'));
const ContactUsForm = lazy(() => import('./pages/ContactUsForm'));
const ContentCalendar = lazy(() => import('./pages/ContentCalendar'));
const ContentFlagging = lazy(() => import('./pages/ContentFlagging'));
const ContentLibrary = lazy(() => import('./pages/ContentLibrary'));
const ContentModeration = lazy(() => import('./pages/ContentModeration'));
const ContentScheduler = lazy(() => import('./pages/ContentScheduler'));
const ContentUpload = lazy(() => import('./pages/ContentUpload'));
const ContentVault = lazy(() => import('./pages/ContentVault'));
const ContextMenu = lazy(() => import('./pages/ContextMenu'));
const ContractABI = lazy(() => import('./pages/ContractABI'));
const ContractManagement = lazy(() => import('./pages/ContractManagement'));
const ContributionInterface = lazy(() => import('./pages/ContributionInterface'));
const ConversationArchive = lazy(() => import('./pages/ConversationArchive'));
const ConversationHistory = lazy(() => import('./pages/ConversationHistory'));
const ConversionFunnel = lazy(() => import('./pages/ConversionFunnel'));
const ConversionOptimization = lazy(() => import('./pages/ConversionOptimization'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const CostAllocation = lazy(() => import('./pages/CostAllocation'));
const CostBasisCalculation = lazy(() => import('./pages/CostBasisCalculation'));
const CourseBuilder = lazy(() => import('./pages/CourseBuilder'));
const CourseCatalog = lazy(() => import('./pages/CourseCatalog'));
const CoverPhoto = lazy(() => import('./pages/CoverPhoto'));
const CreateArticle = lazy(() => import('./pages/CreateArticle'));
const CreateAudio = lazy(() => import('./pages/CreateAudio'));
const CreateDrop = lazy(() => import('./pages/CreateDrop'));
const CreateReel = lazy(() => import('./pages/CreateReel'));
const CreatorAnalytics = lazy(() => import('./pages/CreatorAnalytics'));
const CreatorDashboard = lazy(() => import('./pages/CreatorDashboard'));
const CreatorEconomy = lazy(() => import('./pages/CreatorEconomy'));
const CreatorIntelligence = lazy(() => import('./pages/CreatorIntelligence'));
const CreatorMonetization = lazy(() => import('./pages/CreatorMonetization'));
const CreatorOnboarding = lazy(() => import('./pages/CreatorOnboarding'));
const CreatorProfile = lazy(() => import('./pages/CreatorProfile'));
const CreatorSpotlight = lazy(() => import('./pages/CreatorSpotlight'));
const CreatorStudio = lazy(() => import('./pages/CreatorStudio'));
const CrossChainInterop = lazy(() => import('./pages/CrossChainInterop'));
const Crypto = lazy(() => import('./pages/Crypto'));
const CryptoEnhancementsPage = lazy(() => import('./pages/CryptoEnhancementsPage'));
const CryptoHub = lazy(() => import('./pages/CryptoHub'));
const CryptoResearchHub = lazy(() => import('./pages/CryptoResearchHub'));
const CustomDashboard = lazy(() => import('./pages/CustomDashboard'));
const CustomReports = lazy(() => import('./pages/CustomReports'));
const CustomerAnalytics = lazy(() => import('./pages/CustomerAnalytics'));
const CustomerDisputes = lazy(() => import('./pages/CustomerDisputes'));
const DAOGovernance = lazy(() => import('./pages/DAOGovernance'));
const DAOTreasury = lazy(() => import('./pages/DAOTreasury'));
const DEXDepthChart = lazy(() => import('./pages/DEXDepthChart'));
const DHgateShop = lazy(() => import('./pages/DHgateShop'));
const DMInbox = lazy(() => import('./pages/DMInbox'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DashboardOverview = lazy(() => import('./pages/DashboardOverview'));
const DataExport = lazy(() => import('./pages/DataExport'));
const DataGrid = lazy(() => import('./pages/DataGrid'));
const DataLake = lazy(() => import('./pages/DataLake'));
const DataPrivacy = lazy(() => import('./pages/DataPrivacy'));
const DataProcessing = lazy(() => import('./pages/DataProcessing'));
const DataRetention = lazy(() => import('./pages/DataRetention'));
const DataTable = lazy(() => import('./pages/DataTable'));
const DataVisualization = lazy(() => import('./pages/DataVisualization'));
const DatabaseManagement = lazy(() => import('./pages/DatabaseManagement'));
const DateInputForm = lazy(() => import('./pages/DateInputForm'));
const DatePickerDialog = lazy(() => import('./pages/DatePickerDialog'));
const DatingDiscovery = lazy(() => import('./pages/DatingDiscovery'));
const DatingHome = lazy(() => import('./pages/DatingHome'));
const DatingMatches = lazy(() => import('./pages/DatingMatches'));
const DatingMessages = lazy(() => import('./pages/DatingMessages'));
const DatingPremium = lazy(() => import('./pages/DatingPremium'));
const DatingProfile = lazy(() => import('./pages/DatingProfile'));
const DatingProfileSetup = lazy(() => import('./pages/DatingProfileSetup'));
const DatingSubscription = lazy(() => import('./pages/DatingSubscription'));
const DayTradeRoom = lazy(() => import('./pages/DayTradeRoom'));
const DeFi = lazy(() => import('./pages/DeFi'));
const DecentralizedIdentity = lazy(() => import('./pages/DecentralizedIdentity'));
const DefensibilityMoat = lazy(() => import('./pages/DefensibilityMoat'));
const DeleteAccount = lazy(() => import('./pages/DeleteAccount'));
const DeleteContent = lazy(() => import('./pages/DeleteContent'));
const DepartmentManagement = lazy(() => import('./pages/DepartmentManagement'));
const DependencyGraph = lazy(() => import('./pages/DependencyGraph'));
const DeploymentPipeline = lazy(() => import('./pages/DeploymentPipeline'));
const DeprecationPolicy = lazy(() => import('./pages/DeprecationPolicy'));
const DerivativesTrading = lazy(() => import('./pages/DerivativesTrading'));
const DestinationGuide = lazy(() => import('./pages/DestinationGuide'));
const DestinyEngine = lazy(() => import('./pages/DestinyEngine'));
const DevOps = lazy(() => import('./pages/DevOps'));
const DeveloperArea = lazy(() => import('./pages/DeveloperArea'));
const DeveloperCommunity = lazy(() => import('./pages/DeveloperCommunity'));
const DeveloperMarketplace = lazy(() => import('./pages/DeveloperMarketplace'));
const DeveloperProtocol = lazy(() => import('./pages/DeveloperProtocol'));
const DifficultyCalculator = lazy(() => import('./pages/DifficultyCalculator'));
const DifficultyTracking = lazy(() => import('./pages/DifficultyTracking'));
const DigitalArtStore = lazy(() => import('./pages/DigitalArtStore'));
const DigitalNationMode = lazy(() => import('./pages/DigitalNationMode'));
const DigitalTwin = lazy(() => import('./pages/DigitalTwin'));
const DirectMessages = lazy(() => import('./pages/DirectMessages'));
const DirectMessaging = lazy(() => import('./pages/DirectMessaging'));
const DisasterRecovery = lazy(() => import('./pages/DisasterRecovery'));
const DiscordIntegration = lazy(() => import('./pages/DiscordIntegration'));
const Discover = lazy(() => import('./pages/Discover'));
const DiscussionBoard = lazy(() => import('./pages/DiscussionBoard'));
const DiscussionForums = lazy(() => import('./pages/DiscussionForums'));
const DisputeResolution = lazy(() => import('./pages/DisputeResolution'));
const DistributionChannels = lazy(() => import('./pages/DistributionChannels'));
const DocumentEditor = lazy(() => import('./pages/DocumentEditor'));
const DocumentManagement = lazy(() => import('./pages/DocumentManagement'));
const DocumentSharing = lazy(() => import('./pages/DocumentSharing'));
const DocumentSigning = lazy(() => import('./pages/DocumentSigning'));
const Documentation = lazy(() => import('./pages/Documentation'));
const DogecoinPoolSelection = lazy(() => import('./pages/DogecoinPoolSelection'));
const DonationProcessing = lazy(() => import('./pages/DonationProcessing'));
const DropdownMenu = lazy(() => import('./pages/DropdownMenu'));
const ENSResolver = lazy(() => import('./pages/ENSResolver'));
const EarningsTracker = lazy(() => import('./pages/EarningsTracker'));
const EarningsTracking = lazy(() => import('./pages/EarningsTracking'));
const EconomicLayer = lazy(() => import('./pages/EconomicLayer'));
const Economics = lazy(() => import('./pages/Economics'));
const EconomyControl = lazy(() => import('./pages/EconomyControl'));
const Ecosystem = lazy(() => import('./pages/Ecosystem'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const EmailCampaigns = lazy(() => import('./pages/EmailCampaigns'));
const EmailInputForm = lazy(() => import('./pages/EmailInputForm'));
const EmailIntegration = lazy(() => import('./pages/EmailIntegration'));
const EmailNotifications = lazy(() => import('./pages/EmailNotifications'));
const EmailTemplates = lazy(() => import('./pages/EmailTemplates'));
const EmailVerification = lazy(() => import('./pages/EmailVerification'));
const EmbedSDK = lazy(() => import('./pages/EmbedSDK'));
const EmptySearchState = lazy(() => import('./pages/EmptySearchState'));
const EngagementMetrics = lazy(() => import('./pages/EngagementMetrics'));
const Engineer = lazy(() => import('./pages/Engineer'));
const Scalable = lazy(() => import('./pages/Scalable'));
const ScalableAPI = lazy(() => import('./pages/ScalableAPI'));
const ScalableAnalytics = lazy(() => import('./pages/ScalableAnalytics'));
const EntityProfile = lazy(() => import('./pages/EntityProfile'));
const EnvironmentManagement = lazy(() => import('./pages/EnvironmentManagement'));
const Error403 = lazy(() => import('./pages/Error403'));
const Error404 = lazy(() => import('./pages/Error404'));
const Error500 = lazy(() => import('./pages/Error500'));
const Error503 = lazy(() => import('./pages/Error503'));
const ErrorDialog = lazy(() => import('./pages/ErrorDialog'));
const ErrorTracking = lazy(() => import('./pages/ErrorTracking'));
const EscrowShop = lazy(() => import('./pages/EscrowShop'));
const EthereumPoolSelector = lazy(() => import('./pages/EthereumPoolSelector'));
const EventAnalytics = lazy(() => import('./pages/EventAnalytics'));
const EventCalendar = lazy(() => import('./pages/EventCalendar'));
const EventCreation = lazy(() => import('./pages/EventCreation'));
const EventPlanner = lazy(() => import('./pages/EventPlanner'));
const EventRegistration = lazy(() => import('./pages/EventRegistration'));
const Events = lazy(() => import('./pages/Events'));
const ExecutionHistory = lazy(() => import('./pages/ExecutionHistory'));
const ExerciseLibrary = lazy(() => import('./pages/ExerciseLibrary'));
const ExpenseManagement = lazy(() => import('./pages/ExpenseManagement'));
const ExpenseTracker = lazy(() => import('./pages/ExpenseTracker'));
const ExperimentFactory = lazy(() => import('./pages/ExperimentFactory'));
const ExperimentTracker = lazy(() => import('./pages/ExperimentTracker'));
const Explore = lazy(() => import('./pages/Explore'));
const ExportData = lazy(() => import('./pages/ExportData'));
const FAQManagement = lazy(() => import('./pages/FAQManagement'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const Farming = lazy(() => import('./pages/Farming'));
const Favorites = lazy(() => import('./pages/Favorites'));
const FeatureRequests = lazy(() => import('./pages/FeatureRequests'));
const FeatureTour = lazy(() => import('./pages/FeatureTour'));
const Features = lazy(() => import('./pages/Features'));
const FeeCalculation = lazy(() => import('./pages/FeeCalculation'));
const FeedWithPosts = lazy(() => import('./pages/FeedWithPosts'));
const Feedback = lazy(() => import('./pages/Feedback'));
const FeedbackDialog = lazy(() => import('./pages/FeedbackDialog'));
const FeedbackForm = lazy(() => import('./pages/FeedbackForm'));
const FeedbackHub = lazy(() => import('./pages/FeedbackHub'));
const FileBrowser = lazy(() => import('./pages/FileBrowser'));
const FileConverter = lazy(() => import('./pages/FileConverter'));
const FileDownload = lazy(() => import('./pages/FileDownload'));
const FilePreview = lazy(() => import('./pages/FilePreview'));
const FileSharing = lazy(() => import('./pages/FileSharing'));
const FileUploadDialog = lazy(() => import('./pages/FileUploadDialog'));
const FileUploadForm = lazy(() => import('./pages/FileUploadForm'));
const FileUploadProgress = lazy(() => import('./pages/FileUploadProgress'));
const FileVersioning = lazy(() => import('./pages/FileVersioning'));
const FilterPanel = lazy(() => import('./pages/FilterPanel'));
const FinancialReports = lazy(() => import('./pages/FinancialReports'));
const FlightSearch = lazy(() => import('./pages/FlightSearch'));
const FollowList = lazy(() => import('./pages/FollowList'));
const FollowSystem = lazy(() => import('./pages/FollowSystem'));
const FollowUnfollow = lazy(() => import('./pages/FollowUnfollow'));
const FollowerList = lazy(() => import('./pages/FollowerList'));
const ForecastingEngine = lazy(() => import('./pages/ForecastingEngine'));
const ForumCategories = lazy(() => import('./pages/ForumCategories'));
const FrameworkTemplates = lazy(() => import('./pages/FrameworkTemplates'));
const FreeWillDashboard = lazy(() => import('./pages/FreeWillDashboard'));
const FundraiserTools = lazy(() => import('./pages/FundraiserTools'));
const GDPR = lazy(() => import('./pages/GDPR'));
const GTMStrategy = lazy(() => import('./pages/GTMStrategy'));
const GainLossTracking = lazy(() => import('./pages/GainLossTracking'));
const GameBlackjack = lazy(() => import('./pages/GameBlackjack'));
const GameBlockBuilder = lazy(() => import('./pages/GameBlockBuilder'));
const GameChat = lazy(() => import('./pages/GameChat'));
const GameCrash = lazy(() => import('./pages/GameCrash'));
const GameCryptoQuiz = lazy(() => import('./pages/GameCryptoQuiz'));
const GameFiQuestBoard = lazy(() => import('./pages/GameFiQuestBoard'));
const GameLobby = lazy(() => import('./pages/GameLobby'));
const GameRoom = lazy(() => import('./pages/GameRoom'));
const GameSettings = lazy(() => import('./pages/GameSettings'));
const GameSlots = lazy(() => import('./pages/GameSlots'));
const GameTokenTap = lazy(() => import('./pages/GameTokenTap'));
const Gaming = lazy(() => import('./pages/Gaming'));
const GamingForCharity = lazy(() => import('./pages/GamingForCharity'));
const GanttChart = lazy(() => import('./pages/GanttChart'));
const GasFeeEstimator = lazy(() => import('./pages/GasFeeEstimator'));
const GasPriceMonitor = lazy(() => import('./pages/GasPriceMonitor'));
const GasTracker = lazy(() => import('./pages/GasTracker'));
const GeneralSettings = lazy(() => import('./pages/GeneralSettings'));
const GeneratedApiExplorer = lazy(() => import('./pages/GeneratedApiExplorer'));
const GeneratedGallery = lazy(() => import('./pages/GeneratedGallery'));
const GettingStartedGuide = lazy(() => import('./pages/GettingStartedGuide'));
const GhostMode = lazy(() => import('./pages/GhostMode'));
const GlobalOperationsCenter = lazy(() => import('./pages/GlobalOperationsCenter'));
const GlobalSearch = lazy(() => import('./pages/GlobalSearch'));
const Governance = lazy(() => import('./pages/Governance'));
const GovernanceVoting = lazy(() => import('./pages/GovernanceVoting'));
const GovernanceWizard = lazy(() => import('./pages/GovernanceWizard'));
const GradeBook = lazy(() => import('./pages/GradeBook'));
const GroupChat = lazy(() => import('./pages/GroupChat'));
const GroupChats = lazy(() => import('./pages/GroupChats'));
const GroupDirectory = lazy(() => import('./pages/GroupDirectory'));
const GroupEvents = lazy(() => import('./pages/GroupEvents'));
const GroupManagement = lazy(() => import('./pages/GroupManagement'));
const Growth = lazy(() => import('./pages/Growth'));
const Guilds = lazy(() => import('./pages/Guilds'));
const HIPAA = lazy(() => import('./pages/HIPAA'));
const HOPEAIControl = lazy(() => import('./pages/HOPEAIControl'));
const HashRateMonitor = lazy(() => import('./pages/HashRateMonitor'));
const HashtagExplorer = lazy(() => import('./pages/HashtagExplorer'));
const HashtagSearch = lazy(() => import('./pages/HashtagSearch'));
const HealthArticles = lazy(() => import('./pages/HealthArticles'));
const HealthDashboard = lazy(() => import('./pages/HealthDashboard'));
const HealthGoals = lazy(() => import('./pages/HealthGoals'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Home = lazy(() => import('./pages/Home'));
const HopeAI = lazy(() => import('./pages/HopeAI'));
const HopeAIAdvanced = lazy(() => import('./pages/HopeAIAdvanced'));
const HopeAIMeta = lazy(() => import('./pages/HopeAIMeta'));
const HopeAIPage = lazy(() => import('./pages/HopeAIPage'));
const HopeAIUpgrades = lazy(() => import('./pages/HopeAIUpgrades'));
const HotelSearch = lazy(() => import('./pages/HotelSearch'));
const HubSpotIntegration = lazy(() => import('./pages/HubSpotIntegration'));
const ICOLaunchpad = lazy(() => import('./pages/ICOLaunchpad'));
const IFTTT = lazy(() => import('./pages/IFTTT'));
const ImageEditor = lazy(() => import('./pages/ImageEditor'));
const ImageGallery = lazy(() => import('./pages/ImageGallery'));
const ImageTools = lazy(() => import('./pages/ImageTools'));
const ImageViewer = lazy(() => import('./pages/ImageViewer'));
const ImpactMap = lazy(() => import('./pages/ImpactMap'));
const ImpactMetrics = lazy(() => import('./pages/ImpactMetrics'));
const InAppNotifications = lazy(() => import('./pages/InAppNotifications'));
const InGameCurrency = lazy(() => import('./pages/InGameCurrency'));
const IncidentManagement = lazy(() => import('./pages/IncidentManagement'));
const InputDialog = lazy(() => import('./pages/InputDialog'));
const InstructorDashboard = lazy(() => import('./pages/InstructorDashboard'));
const IntegrationSetup = lazy(() => import('./pages/IntegrationSetup'));
const Integrations = lazy(() => import('./pages/Integrations'));
const InventoryManagement = lazy(() => import('./pages/InventoryManagement'));
const InvestorMetrics = lazy(() => import('./pages/InvestorMetrics'));
const InvestorPitch = lazy(() => import('./pages/InvestorPitch'));
const InvestorPortal = lazy(() => import('./pages/InvestorPortal'));
const InvestorRoom = lazy(() => import('./pages/InvestorRoom'));
const InvoiceDetails = lazy(() => import('./pages/InvoiceDetails'));
const InvoiceManagement = lazy(() => import('./pages/InvoiceManagement'));
const KYCVerification = lazy(() => import('./pages/KYCVerification'));
const KnowledgeBase = lazy(() => import('./pages/KnowledgeBase'));
const LDAPIntegration = lazy(() => import('./pages/LDAPIntegration'));
const LTVAnalysis = lazy(() => import('./pages/LTVAnalysis'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LanguageExchangeAdmin = lazy(() => import('./pages/LanguageExchangeAdmin'));
const LanguagePartnerDiscovery = lazy(() => import('./pages/LanguagePartnerDiscovery'));
const LanguageSelector = lazy(() => import('./pages/LanguageSelector'));
const LanguageSettings = lazy(() => import('./pages/LanguageSettings'));
const LeadScoring = lazy(() => import('./pages/LeadScoring'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Leaderboards = lazy(() => import('./pages/Leaderboards'));
const Learning = lazy(() => import('./pages/Learning'));
const LearningPath = lazy(() => import('./pages/LearningPath'));
const LegalDocuments = lazy(() => import('./pages/LegalDocuments'));
const LegendaryStatus = lazy(() => import('./pages/LegendaryStatus'));
const LendingBorrowing = lazy(() => import('./pages/LendingBorrowing'));
const LessonEditor = lazy(() => import('./pages/LessonEditor'));
const LifeCommand = lazy(() => import('./pages/LifeCommand'));
const Lightbox = lazy(() => import('./pages/Lightbox'));
const LikeReactionSystem = lazy(() => import('./pages/LikeReactionSystem'));
const Likes = lazy(() => import('./pages/Likes'));
const LiquidityPools = lazy(() => import('./pages/LiquidityPools'));
const ListView = lazy(() => import('./pages/ListView'));
const Live = lazy(() => import('./pages/Live'));
const LiveChat = lazy(() => import('./pages/LiveChat'));
const LiveGifting = lazy(() => import('./pages/LiveGifting'));
const LiveReactions = lazy(() => import('./pages/LiveReactions'));
const LiveStreamSetup = lazy(() => import('./pages/LiveStreamSetup'));
const LivestreamDashboard = lazy(() => import('./pages/LivestreamDashboard'));
const LoadingDialog = lazy(() => import('./pages/LoadingDialog'));
const LogViewer = lazy(() => import('./pages/LogViewer'));
const Login = lazy(() => import('./pages/Login'));
const LogisticsOptimizer = lazy(() => import('./pages/LogisticsOptimizer'));
const MLInsights = lazy(() => import('./pages/MLInsights'));
const MLModels = lazy(() => import('./pages/MLModels'));
const MailingLists = lazy(() => import('./pages/MailingLists'));
const MainDashboard = lazy(() => import('./pages/MainDashboard'));
const MaintenanceMode = lazy(() => import('./pages/MaintenanceMode'));
const MapView = lazy(() => import('./pages/MapView'));
const MarkdownRendering = lazy(() => import('./pages/MarkdownRendering'));
const MarketingROI = lazy(() => import('./pages/MarketingROI'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const MarketplaceAnalytics = lazy(() => import('./pages/MarketplaceAnalytics'));
const MasterArchitecture = lazy(() => import('./pages/MasterArchitecture'));
const MatchChat = lazy(() => import('./pages/MatchChat'));
const MatchFeed = lazy(() => import('./pages/MatchFeed'));
const MatchSpace = lazy(() => import('./pages/MatchSpace'));
const MatchingAlgorithm = lazy(() => import('./pages/MatchingAlgorithm'));
const Matchmaking = lazy(() => import('./pages/Matchmaking'));
const MealPlans = lazy(() => import('./pages/MealPlans'));
const MediaCarousel = lazy(() => import('./pages/MediaCarousel'));
const MediaGallery = lazy(() => import('./pages/MediaGallery'));
const MedicationReminder = lazy(() => import('./pages/MedicationReminder'));
const MegaMarketplace = lazy(() => import('./pages/MegaMarketplace'));
const MembershipTiers = lazy(() => import('./pages/MembershipTiers'));
const MemoryConstellation = lazy(() => import('./pages/MemoryConstellation'));
const MemoryGraphVisualizer = lazy(() => import('./pages/MemoryGraphVisualizer'));
const MemorySystem = lazy(() => import('./pages/MemorySystem'));
const MessageEncryption = lazy(() => import('./pages/MessageEncryption'));
const MessageSearch = lazy(() => import('./pages/MessageSearch'));
const Messages = lazy(() => import('./pages/Messages'));
const MilestoneTracking = lazy(() => import('./pages/MilestoneTracking'));
const MinerDashboard = lazy(() => import('./pages/MinerDashboard'));
const MiningCalculator = lazy(() => import('./pages/MiningCalculator'));
const MiningDashboard = lazy(() => import('./pages/MiningDashboard'));
const MiningPoolSelector = lazy(() => import('./pages/MiningPoolSelector'));
const MissionControl = lazy(() => import('./pages/MissionControl'));
const MobileApp = lazy(() => import('./pages/MobileApp'));
const MobileGaming = lazy(() => import('./pages/MobileGaming'));
const MobileHome = lazy(() => import('./pages/MobileHome'));
const MobileMenu = lazy(() => import('./pages/MobileMenu'));
const MobileMessages = lazy(() => import('./pages/MobileMessages'));
const MobileNotifications = lazy(() => import('./pages/MobileNotifications'));
const MobileProfile = lazy(() => import('./pages/MobileProfile'));
const MobileSearch = lazy(() => import('./pages/MobileSearch'));
const MobileSettings = lazy(() => import('./pages/MobileSettings'));
const MobileShop = lazy(() => import('./pages/MobileShop'));
const MobileStreaming = lazy(() => import('./pages/MobileStreaming'));
const MobileTrading = lazy(() => import('./pages/MobileTrading'));
const MobileWallet = lazy(() => import('./pages/MobileWallet'));
const ModerationDashboard = lazy(() => import('./pages/ModerationDashboard'));
const MoodTracker = lazy(() => import('./pages/MoodTracker'));
const MortgageCalculator = lazy(() => import('./pages/MortgageCalculator'));
const MovieCatalog = lazy(() => import('./pages/MovieCatalog'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const MultiModelSelector = lazy(() => import('./pages/MultiModelSelector'));
const MultiSelectForm = lazy(() => import('./pages/MultiSelectForm'));
const MultiplayerLobby = lazy(() => import('./pages/MultiplayerLobby'));
const MultivariateTesting = lazy(() => import('./pages/MultivariateTesting'));
const MusicGeneration = lazy(() => import('./pages/MusicGeneration'));
const MutualConnections = lazy(() => import('./pages/MutualConnections'));
const MyLearning = lazy(() => import('./pages/MyLearning'));
const MyTrips = lazy(() => import('./pages/MyTrips'));
const NFTGallery = lazy(() => import('./pages/NFTGallery'));
const NFTMinting = lazy(() => import('./pages/NFTMinting'));
const NFTWallet = lazy(() => import('./pages/NFTWallet'));
const NLPTools = lazy(() => import('./pages/NLPTools'));
const NSFWFeed = lazy(() => import('./pages/NSFWFeed'));
const NSFWPlatform = lazy(() => import('./pages/NSFWPlatform'));
const NarrativeEngine = lazy(() => import('./pages/NarrativeEngine'));
const NetWorthTracker = lazy(() => import('./pages/NetWorthTracker'));
const NetworkGraph = lazy(() => import('./pages/NetworkGraph'));
const NetworkHealth = lazy(() => import('./pages/NetworkHealth'));
const NetworkStatistics = lazy(() => import('./pages/NetworkStatistics'));
const NotesApp = lazy(() => import('./pages/NotesApp'));
const NotificationCenter = lazy(() => import('./pages/NotificationCenter'));
const NotificationHistory = lazy(() => import('./pages/NotificationHistory'));
const NotificationIntelligence = lazy(() => import('./pages/NotificationIntelligence'));
const NotificationPreferences = lazy(() => import('./pages/NotificationPreferences'));
const NotificationSettings = lazy(() => import('./pages/NotificationSettings'));
const Notifications = lazy(() => import('./pages/Notifications'));
const NotificationsCenter = lazy(() => import('./pages/NotificationsCenter'));
const NotificationsHub = lazy(() => import('./pages/NotificationsHub'));
const NumberInputForm = lazy(() => import('./pages/NumberInputForm'));
const NutritionTracker = lazy(() => import('./pages/NutritionTracker'));
const OAuthProviders = lazy(() => import('./pages/OAuthProviders'));
const OfferManagement = lazy(() => import('./pages/OfferManagement'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const OnboardingTutorial = lazy(() => import('./pages/OnboardingTutorial'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const OrderPlacement = lazy(() => import('./pages/OrderPlacement'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const OrderTypes = lazy(() => import('./pages/OrderTypes'));
const OrganizationSettings = lazy(() => import('./pages/OrganizationSettings'));
const P2EShop = lazy(() => import('./pages/P2EShop'));
const Pagination = lazy(() => import('./pages/Pagination'));
const PasswordInputForm = lazy(() => import('./pages/PasswordInputForm'));
const PasswordReset = lazy(() => import('./pages/PasswordReset'));
const PayPalIntegration = lazy(() => import('./pages/PayPalIntegration'));
const PaymentConfirmation = lazy(() => import('./pages/PaymentConfirmation'));
const PaymentInfra = lazy(() => import('./pages/PaymentInfra'));
const PaymentMethods = lazy(() => import('./pages/PaymentMethods'));
const PaymentSetup = lazy(() => import('./pages/PaymentSetup'));
const Payments = lazy(() => import('./pages/Payments'));
const PayoutDashboard = lazy(() => import('./pages/PayoutDashboard'));
const PayoutManagement = lazy(() => import('./pages/PayoutManagement'));
const PerformanceMetrics = lazy(() => import('./pages/PerformanceMetrics'));
const PersonaBuilder = lazy(() => import('./pages/PersonaBuilder'));
const Phase1Dashboard = lazy(() => import('./pages/Phase1Dashboard'));
const Phase2to4Dashboard = lazy(() => import('./pages/Phase2to4Dashboard'));
const PhoneVerification = lazy(() => import('./pages/PhoneVerification'));
const PlatformMap = lazy(() => import('./pages/PlatformMap'));
const PlatformStatus = lazy(() => import('./pages/PlatformStatus'));
const PlaylistManager = lazy(() => import('./pages/PlaylistManager'));
const PodcastStudio = lazy(() => import('./pages/PodcastStudio'));
const PolicyManagement = lazy(() => import('./pages/PolicyManagement'));
const PoolPerformance = lazy(() => import('./pages/PoolPerformance'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const PortfolioOptimization = lazy(() => import('./pages/PortfolioOptimization'));
const PortfolioOverview = lazy(() => import('./pages/PortfolioOverview'));
const PortfolioTracker = lazy(() => import('./pages/PortfolioTracker'));
const PortfolioTracking = lazy(() => import('./pages/PortfolioTracking'));
const PositionManagement = lazy(() => import('./pages/PositionManagement'));
const PowerUserTools = lazy(() => import('./pages/PowerUserTools'));
const PracticeSessions = lazy(() => import('./pages/PracticeSessions'));
const PredictiveAnalytics = lazy(() => import('./pages/PredictiveAnalytics'));
const PredictiveModels = lazy(() => import('./pages/PredictiveModels'));
const PredictiveSystems = lazy(() => import('./pages/PredictiveSystems'));
const PreferencesSetup = lazy(() => import('./pages/PreferencesSetup'));
const PremiumFeatures = lazy(() => import('./pages/PremiumFeatures'));
const PresentationWithChat = lazy(() => import('./pages/PresentationWithChat'));
const PriceAlerts = lazy(() => import('./pages/PriceAlerts'));
const Pricing = lazy(() => import('./pages/Pricing'));
const PricingEngine = lazy(() => import('./pages/PricingEngine'));
const PricingManagement = lazy(() => import('./pages/PricingManagement'));
const PricingRules = lazy(() => import('./pages/PricingRules'));
const PriorityMatrix = lazy(() => import('./pages/PriorityMatrix'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const PrivacySettings = lazy(() => import('./pages/PrivacySettings'));
const PrivacyVault = lazy(() => import('./pages/PrivacyVault'));
const ProductApproval = lazy(() => import('./pages/ProductApproval'));
const ProductBrain = lazy(() => import('./pages/ProductBrain'));
const ProductCatalog = lazy(() => import('./pages/ProductCatalog'));
const ProductComparison = lazy(() => import('./pages/ProductComparison'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const ProductListing = lazy(() => import('./pages/ProductListing'));
const ProductListings = lazy(() => import('./pages/ProductListings'));
const ProductReviews = lazy(() => import('./pages/ProductReviews'));
const ProductionArchitecture = lazy(() => import('./pages/ProductionArchitecture'));
const Profile = lazy(() => import('./pages/Profile'));
const ProfileCompletion = lazy(() => import('./pages/ProfileCompletion'));
const ProfileCreation = lazy(() => import('./pages/ProfileCreation'));
const ProfileCustomization = lazy(() => import('./pages/ProfileCustomization'));
const ProfileDashboard = lazy(() => import('./pages/ProfileDashboard'));
const ProfileEdit = lazy(() => import('./pages/ProfileEdit'));
const ProfilePicture = lazy(() => import('./pages/ProfilePicture'));
const ProfilePreview = lazy(() => import('./pages/ProfilePreview'));
const ProfileView = lazy(() => import('./pages/ProfileView'));
const ProfileWallet = lazy(() => import('./pages/ProfileWallet'));
const Profitability = lazy(() => import('./pages/Profitability'));
const ProgressBar = lazy(() => import('./pages/ProgressBar'));
const ProgressTracking = lazy(() => import('./pages/ProgressTracking'));
const ProjectBoard = lazy(() => import('./pages/ProjectBoard'));
const ProjectListing = lazy(() => import('./pages/ProjectListing'));
const PromotionEngine = lazy(() => import('./pages/PromotionEngine'));
const PromptBuilder = lazy(() => import('./pages/PromptBuilder'));
const ProofVault = lazy(() => import('./pages/ProofVault'));
const PropertyComparison = lazy(() => import('./pages/PropertyComparison'));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));
const PropertyListing = lazy(() => import('./pages/PropertyListing'));
const PropertyTransfer = lazy(() => import('./pages/PropertyTransfer'));
const ProtocolLayer = lazy(() => import('./pages/ProtocolLayer'));
const PublishingSchedule = lazy(() => import('./pages/PublishingSchedule'));
const PushNotifications = lazy(() => import('./pages/PushNotifications'));
const QRCodeGenerator = lazy(() => import('./pages/QRCodeGenerator'));
const QuickActions = lazy(() => import('./pages/QuickActions'));
const QuickStats = lazy(() => import('./pages/QuickStats'));
const QuizBuilder = lazy(() => import('./pages/QuizBuilder'));
const RFMAnalysis = lazy(() => import('./pages/RFMAnalysis'));
const RFQSystem = lazy(() => import('./pages/RFQSystem'));
const RadioButtonForm = lazy(() => import('./pages/RadioButtonForm'));
const RateLimitConfig = lazy(() => import('./pages/RateLimitConfig'));
const RateLimitDashboard = lazy(() => import('./pages/RateLimitDashboard'));
const RateLimitError = lazy(() => import('./pages/RateLimitError'));
const RateLimiting = lazy(() => import('./pages/RateLimiting'));
const RatingSystem = lazy(() => import('./pages/RatingSystem'));
const ReadReceipts = lazy(() => import('./pages/ReadReceipts'));
const RealTimeGameEngine = lazy(() => import('./pages/RealTimeGameEngine'));
const RealTimeMonitoring = lazy(() => import('./pages/RealTimeMonitoring'));
const RealTimeStreaming = lazy(() => import('./pages/RealTimeStreaming'));
const RebalancingTools = lazy(() => import('./pages/RebalancingTools'));
const ReceiptDownload = lazy(() => import('./pages/ReceiptDownload'));
const ReceiveCrypto = lazy(() => import('./pages/ReceiveCrypto'));
const RecentActivity = lazy(() => import('./pages/RecentActivity'));
const Recommendations = lazy(() => import('./pages/Recommendations'));
const RecommendationsFeed = lazy(() => import('./pages/RecommendationsFeed'));
const RecommendedMatches = lazy(() => import('./pages/RecommendedMatches'));
const Reels = lazy(() => import('./pages/Reels'));
const RefactoringTools = lazy(() => import('./pages/RefactoringTools'));
const Referrals = lazy(() => import('./pages/Referrals'));
const RefundRequests = lazy(() => import('./pages/RefundRequests'));
const RegionalSettings = lazy(() => import('./pages/RegionalSettings'));
const Reminders = lazy(() => import('./pages/Reminders'));
const ReportDialog = lazy(() => import('./pages/ReportDialog'));
const ReportUser = lazy(() => import('./pages/ReportUser'));
const ReportsDashboard = lazy(() => import('./pages/ReportsDashboard'));
const Reputation = lazy(() => import('./pages/Reputation'));
const ReputationSystem = lazy(() => import('./pages/ReputationSystem'));
const ResourceAllocation = lazy(() => import('./pages/ResourceAllocation'));
const ResourceLibrary = lazy(() => import('./pages/ResourceLibrary'));
const ResponseTime = lazy(() => import('./pages/ResponseTime'));
const Retention = lazy(() => import('./pages/Retention'));
const RetentionAnalytics = lazy(() => import('./pages/RetentionAnalytics'));
const RetentionEngine = lazy(() => import('./pages/RetentionEngine'));
const RetirementPlanner = lazy(() => import('./pages/RetirementPlanner'));
const ReturnManagement = lazy(() => import('./pages/ReturnManagement'));
const ReturnsRefunds = lazy(() => import('./pages/ReturnsRefunds'));
const ReviewModeration = lazy(() => import('./pages/ReviewModeration'));
const Reviews = lazy(() => import('./pages/Reviews'));
const ReviewsRatings = lazy(() => import('./pages/ReviewsRatings'));
const RewardSystem = lazy(() => import('./pages/RewardSystem'));
const RewardsMonitoring = lazy(() => import('./pages/RewardsMonitoring'));
const RewardsTracking = lazy(() => import('./pages/RewardsTracking'));
const RiskAnalysis = lazy(() => import('./pages/RiskAnalysis'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const RoadmapView = lazy(() => import('./pages/RoadmapView'));
const RoleBasedAccess = lazy(() => import('./pages/RoleBasedAccess'));
const RoleManagement = lazy(() => import('./pages/RoleManagement'));
const SDKDownload = lazy(() => import('./pages/SDKDownload'));
const SDKManagement = lazy(() => import('./pages/SDKManagement'));
const SEOOptimizer = lazy(() => import('./pages/SEOOptimizer'));
const SKY444CentralBank = lazy(() => import('./pages/SKY444CentralBank'));
const SMSCampaigns = lazy(() => import('./pages/SMSCampaigns'));
const SMSIntegration = lazy(() => import('./pages/SMSIntegration'));
const SMSTemplates = lazy(() => import('./pages/SMSTemplates'));
const SOC2 = lazy(() => import('./pages/SOC2'));
const SSO = lazy(() => import('./pages/SSO'));
const SalesAnalytics = lazy(() => import('./pages/SalesAnalytics'));
const SalesforceIntegration = lazy(() => import('./pages/SalesforceIntegration'));
const SatisfactionSurvey = lazy(() => import('./pages/SatisfactionSurvey'));
const SavedProperties = lazy(() => import('./pages/SavedProperties'));
const SavedSearches = lazy(() => import('./pages/SavedSearches'));
const SavingsGoals = lazy(() => import('./pages/SavingsGoals'));
const ScheduledJobs = lazy(() => import('./pages/ScheduledJobs'));
const ScheduledReports = lazy(() => import('./pages/ScheduledReports'));
const School = lazy(() => import('./pages/School'));
const SchoolCertificate = lazy(() => import('./pages/SchoolCertificate'));
const SchoolCourse = lazy(() => import('./pages/SchoolCourse'));
const SchoolDashboard = lazy(() => import('./pages/SchoolDashboard'));
const SchoolLesson = lazy(() => import('./pages/SchoolLesson'));
const SchoolQuiz = lazy(() => import('./pages/SchoolQuiz'));
const Search = lazy(() => import('./pages/Search'));
const SearchAnalytics = lazy(() => import('./pages/SearchAnalytics'));
const SearchHistory = lazy(() => import('./pages/SearchHistory'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const SearchSuggestions = lazy(() => import('./pages/SearchSuggestions'));
const SeasonalEvents = lazy(() => import('./pages/SeasonalEvents'));
const Security = lazy(() => import('./pages/Security'));
const SecurityAudit = lazy(() => import('./pages/SecurityAudit'));
const SecurityCompliance = lazy(() => import('./pages/SecurityCompliance'));
const SecurityDashboard = lazy(() => import('./pages/SecurityDashboard'));
const SecuritySettings = lazy(() => import('./pages/SecuritySettings'));
const SegmentationAnalysis = lazy(() => import('./pages/SegmentationAnalysis'));
const SelectDropdownForm = lazy(() => import('./pages/SelectDropdownForm'));
const SelfHealingInfra = lazy(() => import('./pages/SelfHealingInfra'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
const SellerProfile = lazy(() => import('./pages/SellerProfile'));
const SendCrypto = lazy(() => import('./pages/SendCrypto'));
const SentimentPipeline = lazy(() => import('./pages/SentimentPipeline'));
const ServerHealth = lazy(() => import('./pages/ServerHealth'));
const ServerInstaller = lazy(() => import('./pages/ServerInstaller'));
const ServerStatus = lazy(() => import('./pages/ServerStatus'));
const Settings = lazy(() => import('./pages/Settings'));
const SettingsDialog = lazy(() => import('./pages/SettingsDialog'));
const SetupWizard = lazy(() => import('./pages/SetupWizard'));
const ShadowIdentity = lazy(() => import('./pages/ShadowIdentity'));
const ShadowRelay = lazy(() => import('./pages/ShadowRelay'));
const ShareDialog = lazy(() => import('./pages/ShareDialog'));
const Sharing = lazy(() => import('./pages/Sharing'));
const ShippingManagement = lazy(() => import('./pages/ShippingManagement'));
const ShoppingCart = lazy(() => import('./pages/ShoppingCart'));
const SidebarNavigation = lazy(() => import('./pages/SidebarNavigation'));
const SignUp = lazy(() => import('./pages/SignUp'));
const SignUpFlow = lazy(() => import('./pages/SignUpFlow'));
const SignUp_old = lazy(() => import('./pages/SignUp_old'));
const Signin = lazy(() => import('./pages/Signin'));
const SituationRoom = lazy(() => import('./pages/SituationRoom'));
const SkillBadges = lazy(() => import('./pages/SkillBadges'));
const SkySchool = lazy(() => import('./pages/SkySchool'));
const SkySchoolAI = lazy(() => import('./pages/SkySchoolAI'));
const SkySchoolQuiz = lazy(() => import('./pages/SkySchoolQuiz'));
const SkyStore = lazy(() => import('./pages/SkyStore'));
const SlackIntegration = lazy(() => import('./pages/SlackIntegration'));
const SleepTracking = lazy(() => import('./pages/SleepTracking'));
const SlippageProtection = lazy(() => import('./pages/SlippageProtection'));
const SmartContractAudit = lazy(() => import('./pages/SmartContractAudit'));
const SmartContractViewer = lazy(() => import('./pages/SmartContractViewer'));
const SmartContracts = lazy(() => import('./pages/SmartContracts'));
const SocialFeedV2 = lazy(() => import('./pages/SocialFeedV2'));
const SocialGraph = lazy(() => import('./pages/SocialGraph'));
const SocialMedia = lazy(() => import('./pages/SocialMedia'));
const SocialMediaCampaigns = lazy(() => import('./pages/SocialMediaCampaigns'));
const SolanaValidatorSetup = lazy(() => import('./pages/SolanaValidatorSetup'));
const SortOptions = lazy(() => import('./pages/SortOptions'));
const SpeechToText = lazy(() => import('./pages/SpeechToText'));
const SpinWheel = lazy(() => import('./pages/SpinWheel'));
const StakeDelegation = lazy(() => import('./pages/StakeDelegation'));
const StakingDashboard = lazy(() => import('./pages/StakingDashboard'));
const StakingOptions = lazy(() => import('./pages/StakingOptions'));
const StakingPortal = lazy(() => import('./pages/StakingPortal'));
const StatisticsPanel = lazy(() => import('./pages/StatisticsPanel'));
const Status = lazy(() => import('./pages/Status'));
const StepperWizard = lazy(() => import('./pages/StepperWizard'));
const StockChart = lazy(() => import('./pages/StockChart'));
const StockSearch = lazy(() => import('./pages/StockSearch'));
const Stories = lazy(() => import('./pages/Stories'));
const StreamAnalytics = lazy(() => import('./pages/StreamAnalytics'));
const StreamClip = lazy(() => import('./pages/StreamClip'));
const StreamGifting = lazy(() => import('./pages/StreamGifting'));
const StripeCheckout = lazy(() => import('./pages/StripeCheckout'));
const StripeIntegration = lazy(() => import('./pages/StripeIntegration'));
const StudentProgress = lazy(() => import('./pages/StudentProgress'));
const StyleSelector = lazy(() => import('./pages/StyleSelector'));
const SubscriptionManagement = lazy(() => import('./pages/SubscriptionManagement'));
const SubscriptionPlans = lazy(() => import('./pages/SubscriptionPlans'));
const SubscriptionSetup = lazy(() => import('./pages/SubscriptionSetup'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));
const SuccessDialog = lazy(() => import('./pages/SuccessDialog'));
const SuccessScreen = lazy(() => import('./pages/SuccessScreen'));
const SupportMetrics = lazy(() => import('./pages/SupportMetrics'));
const SupportTicket = lazy(() => import('./pages/SupportTicket'));
const SwapInterface = lazy(() => import('./pages/SwapInterface'));
const SwipeInterface = lazy(() => import('./pages/SwipeInterface'));
const SystemArchitecture = lazy(() => import('./pages/SystemArchitecture'));
const SystemLogs = lazy(() => import('./pages/SystemLogs'));
const SystemObservability = lazy(() => import('./pages/SystemObservability'));
const SystemStatus = lazy(() => import('./pages/SystemStatus'));
const TabsNavigation = lazy(() => import('./pages/TabsNavigation'));
const TaskAutomation = lazy(() => import('./pages/TaskAutomation'));
const TaskDetail = lazy(() => import('./pages/TaskDetail'));
const TaskList = lazy(() => import('./pages/TaskList'));
const TaxDocumentation = lazy(() => import('./pages/TaxDocumentation'));
const TaxPlanning = lazy(() => import('./pages/TaxPlanning'));
const TaxReports = lazy(() => import('./pages/TaxReports'));
const TeachingOpportunities = lazy(() => import('./pages/TeachingOpportunities'));
const TeamManagement = lazy(() => import('./pages/TeamManagement'));
const TeamWorkspace = lazy(() => import('./pages/TeamWorkspace'));
const TechnicalIndicators = lazy(() => import('./pages/TechnicalIndicators'));
const TelegramIntegration = lazy(() => import('./pages/TelegramIntegration'));
const TemplateLibrary = lazy(() => import('./pages/TemplateLibrary'));
const TermsAcceptance = lazy(() => import('./pages/TermsAcceptance'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const TestingFramework = lazy(() => import('./pages/TestingFramework'));
const TextInputForm = lazy(() => import('./pages/TextInputForm'));
const TextToSpeech = lazy(() => import('./pages/TextToSpeech'));
const TextTools = lazy(() => import('./pages/TextTools'));
const ThemeSettings = lazy(() => import('./pages/ThemeSettings'));
const ThreadManagement = lazy(() => import('./pages/ThreadManagement'));
const TicketAssignment = lazy(() => import('./pages/TicketAssignment'));
const TicketDetail = lazy(() => import('./pages/TicketDetail'));
const TicketQueue = lazy(() => import('./pages/TicketQueue'));
const TierComparison = lazy(() => import('./pages/TierComparison'));
const TimeInputForm = lazy(() => import('./pages/TimeInputForm'));
const TimePickerDialog = lazy(() => import('./pages/TimePickerDialog'));
const TimeTracking = lazy(() => import('./pages/TimeTracking'));
const TimelineView = lazy(() => import('./pages/TimelineView'));
const TimeoutError = lazy(() => import('./pages/TimeoutError'));
const TipJar = lazy(() => import('./pages/TipJar'));
const ToastNotifications = lazy(() => import('./pages/ToastNotifications'));
const TodoList = lazy(() => import('./pages/TodoList'));
const ToggleSwitchForm = lazy(() => import('./pages/ToggleSwitchForm'));
const TokenDashboard = lazy(() => import('./pages/TokenDashboard'));
const TokenGovernance = lazy(() => import('./pages/TokenGovernance'));
const TokenInformation = lazy(() => import('./pages/TokenInformation'));
const TokenMetrics = lazy(() => import('./pages/TokenMetrics'));
const TokenomicsCalculator = lazy(() => import('./pages/TokenomicsCalculator'));
const TorBridge = lazy(() => import('./pages/TorBridge'));
const TournamentBracket = lazy(() => import('./pages/TournamentBracket'));
const TournamentBrackets = lazy(() => import('./pages/TournamentBrackets'));
const Tournaments = lazy(() => import('./pages/Tournaments'));
const TradeHistory = lazy(() => import('./pages/TradeHistory'));
const Trading = lazy(() => import('./pages/Trading'));
const TradingTerminal = lazy(() => import('./pages/TradingTerminal'));
const TransactionExplorer = lazy(() => import('./pages/TransactionExplorer'));
const TransactionHistory = lazy(() => import('./pages/TransactionHistory'));
const TransactionViewer = lazy(() => import('./pages/TransactionViewer'));
const TranscriptionManager = lazy(() => import('./pages/TranscriptionManager'));
const TranslationEnabledCommunity = lazy(() => import('./pages/TranslationEnabledCommunity'));
const TranslationEnabledSocialFeed = lazy(() => import('./pages/TranslationEnabledSocialFeed'));
const TransparencyReports = lazy(() => import('./pages/TransparencyReports'));
const TravelBlog = lazy(() => import('./pages/TravelBlog'));
const TravelBudget = lazy(() => import('./pages/TravelBudget'));
const TravelDocuments = lazy(() => import('./pages/TravelDocuments'));
const TravelPhotos = lazy(() => import('./pages/TravelPhotos'));
const TravelReviews = lazy(() => import('./pages/TravelReviews'));
const TravelTips = lazy(() => import('./pages/TravelTips'));
const TreasuryManagement = lazy(() => import('./pages/TreasuryManagement'));
const TrendAnalysis = lazy(() => import('./pages/TrendAnalysis'));
const Trending = lazy(() => import('./pages/Trending'));
const TrendingItems = lazy(() => import('./pages/TrendingItems'));
const TrendingTopics = lazy(() => import('./pages/TrendingTopics'));
const TriggersActions = lazy(() => import('./pages/TriggersActions'));
const TripPlanner = lazy(() => import('./pages/TripPlanner'));
const TrumpMining = lazy(() => import('./pages/TrumpMining'));
const TrustSafetyDashboard = lazy(() => import('./pages/TrustSafetyDashboard'));
const TrustSystem = lazy(() => import('./pages/TrustSystem'));
const TwoFactorAuth = lazy(() => import('./pages/TwoFactorAuth'));
const TwoFactorSetup = lazy(() => import('./pages/TwoFactorSetup'));
const TypingIndicators = lazy(() => import('./pages/TypingIndicators'));
const UnhiddenInterface = lazy(() => import('./pages/UnhiddenInterface'));
const UnhiddenMode = lazy(() => import('./pages/UnhiddenMode'));
const UnifiedFeed = lazy(() => import('./pages/UnifiedFeed'));
const UnifiedIdentity = lazy(() => import('./pages/UnifiedIdentity'));
const UnifiedMessaging = lazy(() => import('./pages/UnifiedMessaging'));
const UnifiedPaymentLedger = lazy(() => import('./pages/UnifiedPaymentLedger'));
const UnifiedPlatformDashboard = lazy(() => import('./pages/UnifiedPlatformDashboard'));
const UniversalSearch = lazy(() => import('./pages/UniversalSearch'));
const UpdatedLandingPage = lazy(() => import('./pages/UpdatedLandingPage'));
const UpgradeDowngradePlan = lazy(() => import('./pages/UpgradeDowngradePlan'));
const Upscaling = lazy(() => import('./pages/Upscaling'));
const UserBehavior = lazy(() => import('./pages/UserBehavior'));
const UserBio = lazy(() => import('./pages/UserBio'));
const UserDirectory = lazy(() => import('./pages/UserDirectory'));
const UserDiscovery = lazy(() => import('./pages/UserDiscovery'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const UserMentions = lazy(() => import('./pages/UserMentions'));
const UserOnboarding = lazy(() => import('./pages/UserOnboarding'));
const UserPermissions = lazy(() => import('./pages/UserPermissions'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const UserProfiles = lazy(() => import('./pages/UserProfiles'));
const UserStats = lazy(() => import('./pages/UserStats'));
const UserSuggestions = lazy(() => import('./pages/UserSuggestions'));
const VODArchive = lazy(() => import('./pages/VODArchive'));
const ValidatorPerformance = lazy(() => import('./pages/ValidatorPerformance'));
const ValidatorSetup = lazy(() => import('./pages/ValidatorSetup'));
const VendorAnalytics = lazy(() => import('./pages/VendorAnalytics'));
const VendorDirectory = lazy(() => import('./pages/VendorDirectory'));
const VendorOnboarding = lazy(() => import('./pages/VendorOnboarding'));
const VendorPerformance = lazy(() => import('./pages/VendorPerformance'));
const VendorVerification = lazy(() => import('./pages/VendorVerification'));
const VenueManagement = lazy(() => import('./pages/VenueManagement'));
const Verification = lazy(() => import('./pages/Verification'));
const VerificationSteps = lazy(() => import('./pages/VerificationSteps'));
const VerificationSystem = lazy(() => import('./pages/VerificationSystem'));
const VersionManagement = lazy(() => import('./pages/VersionManagement'));
const VestingSchedule = lazy(() => import('./pages/VestingSchedule'));
const VideoArea = lazy(() => import('./pages/VideoArea'));
const VideoCall = lazy(() => import('./pages/VideoCall'));
const VideoChat = lazy(() => import('./pages/VideoChat'));
const VideoEditor = lazy(() => import('./pages/VideoEditor'));
const VideoPlayer = lazy(() => import('./pages/VideoPlayer'));
const VideoTools = lazy(() => import('./pages/VideoTools'));
const VideoTutorials = lazy(() => import('./pages/VideoTutorials'));
const VideoUploader = lazy(() => import('./pages/VideoUploader'));
const VirtualTour = lazy(() => import('./pages/VirtualTour'));
const VoiceCloning = lazy(() => import('./pages/VoiceCloning'));
const VoiceCommands = lazy(() => import('./pages/VoiceCommands'));
const VoiceCommandsRegistry = lazy(() => import('./pages/VoiceCommandsRegistry'));
const VoiceMessages = lazy(() => import('./pages/VoiceMessages'));
const WalkthroughPage = lazy(() => import('./pages/WalkthroughPage'));
const Wallet = lazy(() => import('./pages/Wallet'));
const WalletConnect = lazy(() => import('./pages/WalletConnect'));
const WalletIntegration = lazy(() => import('./pages/WalletIntegration'));
const WalletOverview = lazy(() => import('./pages/WalletOverview'));
const WarningDialog = lazy(() => import('./pages/WarningDialog'));
const WatchEarn = lazy(() => import('./pages/WatchEarn'));
const WatchList = lazy(() => import('./pages/WatchList'));
const Web3Auth = lazy(() => import('./pages/Web3Auth'));
const WebhookManager = lazy(() => import('./pages/WebhookManager'));
const Webhooks = lazy(() => import('./pages/Webhooks'));
const WelcomeScreen = lazy(() => import('./pages/WelcomeScreen'));
const WhaleMonitor = lazy(() => import('./pages/WhaleMonitor'));
const WhitelistManagement = lazy(() => import('./pages/WhitelistManagement'));
const WishlistManagement = lazy(() => import('./pages/WishlistManagement'));
const WorkflowAutomation = lazy(() => import('./pages/WorkflowAutomation'));
const WorkflowBuilder = lazy(() => import('./pages/WorkflowBuilder'));
const WorldBrain = lazy(() => import('./pages/WorldBrain'));
const WorldSimulationControl = lazy(() => import('./pages/WorldSimulationControl'));
const YieldFarming = lazy(() => import('./pages/YieldFarming'));
const ZapierIntegration = lazy(() => import('./pages/ZapierIntegration'));

const NotFound = lazy(() => import('./pages/NotFound'));

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <ErrorBoundary>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">
              <Suspense fallback={<div>Loading...</div>}>
                <Switch>
          <Route path="/abtesting" component={ABTesting} />
          <Route path="/abtestingadvanced" component={ABTestingAdvanced} />
          <Route path="/aiagenteconomy" component={AIAgentEconomy} />
          <Route path="/aiagentmarket" component={AIAgentMarket} />
          <Route path="/aiassistant" component={AIAssistant} />
          <Route path="/aibrain" component={AIBrain} />
          <Route path="/aicodestudio" component={AICodeStudio} />
          <Route path="/aicopystudio" component={AICopyStudio} />
          <Route path="/aicore" component={AICore} />
          <Route path="/aiengineer" component={AIEngineer} />
          <Route path="/aimarketagents" component={AIMarketAgents} />
          <Route path="/aimatchmaker" component={AIMatchmaker} />
          <Route path="/aimoderationqueue" component={AIModerationQueue} />
          <Route path="/aipersonafeed" component={AIPersonaFeed} />
          <Route path="/aipersonasystem" component={AIPersonaSystem} />
          <Route path="/aitoolshub" component={AIToolsHub} />
          <Route path="/aitrading" component={AITrading} />
          <Route path="/aitrainingloops" component={AITrainingLoops} />
          <Route path="/apidocs" component={APIDocs} />
          <Route path="/apidocumentation" component={APIDocumentation} />
          <Route path="/apiintegration" component={APIIntegration} />
          <Route path="/apikeys" component={APIKeys} />
          <Route path="/apilogs" component={APILogs} />
          <Route path="/apimonitoring" component={APIMonitoring} />
          <Route path="/apistatus" component={APIStatus} />
          <Route path="/apitesting" component={APITesting} />
          <Route path="/apiusage" component={APIUsage} />
          <Route path="/apiversioning" component={APIVersioning} />
          <Route path="/apytracking" component={APYTracking} />
          <Route path="/about" component={About} />
          <Route path="/accesscontrol" component={AccessControl} />
          <Route path="/accessibilitysettings" component={AccessibilitySettings} />
          <Route path="/accordionnavigation" component={AccordionNavigation} />
          <Route path="/accountsettings" component={AccountSettings} />
          <Route path="/achievementbadges" component={AchievementBadges} />
          <Route path="/achievements" component={Achievements} />
          <Route path="/actionobjects" component={ActionObjects} />
          <Route path="/actionpanel" component={ActionPanel} />
          <Route path="/activityfeed" component={ActivityFeed} />
          <Route path="/activitytracking" component={ActivityTracking} />
          <Route path="/adaptivepersonalization" component={AdaptivePersonalization} />
          <Route path="/adaptiveroadmap" component={AdaptiveRoadmap} />
          <Route path="/addbankaccount" component={AddBankAccount} />
          <Route path="/addcreditcard" component={AddCreditCard} />
          <Route path="/addressbook" component={AddressBook} />
          <Route path="/addresslookup" component={AddressLookup} />
          <Route path="/admin" component={Admin} />
          <Route path="/admindashboard" component={AdminDashboard} />
          <Route path="/adminorders" component={AdminOrders} />
          <Route path="/adminpanel" component={AdminPanel} />
          <Route path="/adminwalletmanager" component={AdminWalletManager} />
          <Route path="/advancedadminpanel" component={AdvancedAdminPanel} />
          <Route path="/advancedanalytics" component={AdvancedAnalytics} />
          <Route path="/advancedorders" component={AdvancedOrders} />
          <Route path="/advancedsearch" component={AdvancedSearch} />
          <Route path="/affiliatedashboard" component={AffiliateDashboard} />
          <Route path="/agegate" component={AgeGate} />
          <Route path="/ageverification" component={AgeVerification} />
          <Route path="/agentbuilder" component={AgentBuilder} />
          <Route path="/agentcity" component={AgentCity} />
          <Route path="/agentcoordination" component={AgentCoordination} />
          <Route path="/agentcoordinationhub" component={AgentCoordinationHub} />
          <Route path="/agentdebate" component={AgentDebate} />
          <Route path="/agentdetail" component={AgentDetail} />
          <Route path="/agentmarketplace" component={AgentMarketplace} />
          <Route path="/agentperformance" component={AgentPerformance} />
          <Route path="/agentsprint" component={AgentSprint} />
          <Route path="/agentsdashboard" component={AgentsDashboard} />
          <Route path="/alertconfiguration" component={AlertConfiguration} />
          <Route path="/alertdialog" component={AlertDialog} />
          <Route path="/alertmanagement" component={AlertManagement} />
          <Route path="/ambientfeed" component={AmbientFeed} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/analyticsdashboard" component={AnalyticsDashboard} />
          <Route path="/analyticsproducts" component={AnalyticsProducts} />
          <Route path="/analyticsreports" component={AnalyticsReports} />
          <Route path="/anomalydetection" component={AnomalyDetection} />
          <Route path="/antisurveillance" component={AntiSurveillance} />
          <Route path="/approvalworkflows" component={ApprovalWorkflows} />
          <Route path="/arcade" component={Arcade} />
          <Route path="/archivemanagement" component={ArchiveManagement} />
          <Route path="/assetmanagement" component={AssetManagement} />
          <Route path="/assettracking" component={AssetTracking} />
          <Route path="/assignmenttracker" component={AssignmentTracker} />
          <Route path="/attributionmodeling" component={AttributionModeling} />
          <Route path="/audiencesegmentation" component={AudienceSegmentation} />
          <Route path="/audioanalytics" component={AudioAnalytics} />
          <Route path="/audioediting" component={AudioEditing} />
          <Route path="/audiolibrary" component={AudioLibrary} />
          <Route path="/audioplayer" component={AudioPlayer} />
          <Route path="/auditlog" component={AuditLog} />
          <Route path="/auditlogs" component={AuditLogs} />
          <Route path="/audittrail" component={AuditTrail} />
          <Route path="/autoresponder" component={AutoResponder} />
          <Route path="/automationengine" component={AutomationEngine} />
          <Route path="/automationrules" component={AutomationRules} />
          <Route path="/automationworkflows" component={AutomationWorkflows} />
          <Route path="/backupmanagement" component={BackupManagement} />
          <Route path="/badges" component={Badges} />
          <Route path="/bansuspenduser" component={BanSuspendUser} />
          <Route path="/batchgeneration" component={BatchGeneration} />
          <Route path="/battlepass" component={BattlePass} />
          <Route path="/behavioralintelligence" component={BehavioralIntelligence} />
          <Route path="/beta" component={Beta} />
          <Route path="/billinghistory" component={BillingHistory} />
          <Route path="/blockbrowser" component={BlockBrowser} />
          <Route path="/blockrewards" component={BlockRewards} />
          <Route path="/blockuser" component={BlockUser} />
          <Route path="/blockchaincustody" component={BlockchainCustody} />
          <Route path="/blockchainmonitor" component={BlockchainMonitor} />
          <Route path="/blogeditor" component={BlogEditor} />
          <Route path="/blogpublisher" component={BlogPublisher} />
          <Route path="/bookpage" component={BookPage} />
          <Route path="/bookmarks" component={Bookmarks} />
          <Route path="/bountysystem" component={BountySystem} />
          <Route path="/brandguidelines" component={BrandGuidelines} />
          <Route path="/breadcrumbnavigation" component={BreadcrumbNavigation} />
          <Route path="/bridgetransactions" component={BridgeTransactions} />
          <Route path="/browserextension" component={BrowserExtension} />
          <Route path="/budgetplanner" component={BudgetPlanner} />
          <Route path="/bugreporting" component={BugReporting} />
          <Route path="/buildorder" component={BuildOrder} />
          <Route path="/buildroadmap" component={BuildRoadmap} />
          <Route path="/bulkoperations" component={BulkOperations} />
          <Route path="/bulkordering" component={BulkOrdering} />
          <Route path="/bulkupload" component={BulkUpload} />
          <Route path="/ccpa" component={CCPA} />
          <Route path="/crm" component={CRM} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/calendar" component={Calendar} />
          <Route path="/calendarview" component={CalendarView} />
          <Route path="/campaignanalytics" component={CampaignAnalytics} />
          <Route path="/campaignbuilder" component={CampaignBuilder} />
          <Route path="/campaigncreation" component={CampaignCreation} />
          <Route path="/carrental" component={CarRental} />
          <Route path="/cardgridview" component={CardGridView} />
          <Route path="/cashflowanalysis" component={CashFlowAnalysis} />
          <Route path="/categorymanagement" component={CategoryManagement} />
          <Route path="/certificatemanager" component={CertificateManager} />
          <Route path="/chainexplorer" component={ChainExplorer} />
          <Route path="/changelog" component={ChangeLog} />
          <Route path="/charity" component={Charity} />
          <Route path="/charityleaderboard" component={CharityLeaderboard} />
          <Route path="/chartanalysis" component={ChartAnalysis} />
          <Route path="/chartdashboard" component={ChartDashboard} />
          <Route path="/chatbot" component={ChatBot} />
          <Route path="/chathistory" component={ChatHistory} />
          <Route path="/chatmvp" component={ChatMVP} />
          <Route path="/checkboxgroupform" component={CheckboxGroupForm} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/checkoutflow" component={CheckoutFlow} />
          <Route path="/chinaedition" component={ChinaEdition} />
          <Route path="/churnprediction" component={ChurnPrediction} />
          <Route path="/citizenpassport" component={CitizenPassport} />
          <Route path="/civilizationsimulator" component={CivilizationSimulator} />
          <Route path="/clanwars" component={ClanWars} />
          <Route path="/classroommanagement" component={ClassroomManagement} />
          <Route path="/clientlibraries" component={ClientLibraries} />
          <Route path="/closingchecklist" component={ClosingChecklist} />
          <Route path="/codecompletion" component={CodeCompletion} />
          <Route path="/codeformatter" component={CodeFormatter} />
          <Route path="/codehighlighting" component={CodeHighlighting} />
          <Route path="/codequality" component={CodeQuality} />
          <Route path="/codequalitydashboard" component={CodeQualityDashboard} />
          <Route path="/coderepository" component={CodeRepository} />
          <Route path="/codesamples" component={CodeSamples} />
          <Route path="/cohortanalysis" component={CohortAnalysis} />
          <Route path="/colorpickerdialog" component={ColorPickerDialog} />
          <Route path="/commentthread" component={CommentThread} />
          <Route path="/comments" component={Comments} />
          <Route path="/commentssection" component={CommentsSection} />
          <Route path="/commissionmanagement" component={CommissionManagement} />
          <Route path="/community" component={Community} />
          <Route path="/communitycreate" component={CommunityCreate} />
          <Route path="/communityengagement" component={CommunityEngagement} />
          <Route path="/communityguidelines" component={CommunityGuidelines} />
          <Route path="/communityhub" component={CommunityHub} />
          <Route path="/companysimulator" component={CompanySimulator} />
          <Route path="/competitiveradar" component={CompetitiveRadar} />
          <Route path="/compliancecenter" component={ComplianceCenter} />
          <Route path="/compliancechecker" component={ComplianceChecker} />
          <Route path="/compliancechecking" component={ComplianceChecking} />
          <Route path="/compliancedashboard" component={ComplianceDashboard} />
          <Route path="/comprehensiveecosystemlanding" component={ComprehensiveEcosystemLanding} />
          <Route path="/confirmationdialog" component={ConfirmationDialog} />
          <Route path="/connectedapps" component={ConnectedApps} />
          <Route path="/connectionerror" component={ConnectionError} />
          <Route path="/connectionrequests" component={ConnectionRequests} />
          <Route path="/connectorintelligence" component={ConnectorIntelligence} />
          <Route path="/contactmanagement" component={ContactManagement} />
          <Route path="/contactusform" component={ContactUsForm} />
          <Route path="/contentcalendar" component={ContentCalendar} />
          <Route path="/contentflagging" component={ContentFlagging} />
          <Route path="/contentlibrary" component={ContentLibrary} />
          <Route path="/contentmoderation" component={ContentModeration} />
          <Route path="/contentscheduler" component={ContentScheduler} />
          <Route path="/contentupload" component={ContentUpload} />
          <Route path="/contentvault" component={ContentVault} />
          <Route path="/contextmenu" component={ContextMenu} />
          <Route path="/contractabi" component={ContractABI} />
          <Route path="/contractmanagement" component={ContractManagement} />
          <Route path="/contributioninterface" component={ContributionInterface} />
          <Route path="/conversationarchive" component={ConversationArchive} />
          <Route path="/conversationhistory" component={ConversationHistory} />
          <Route path="/conversionfunnel" component={ConversionFunnel} />
          <Route path="/conversionoptimization" component={ConversionOptimization} />
          <Route path="/cookiepolicy" component={CookiePolicy} />
          <Route path="/costallocation" component={CostAllocation} />
          <Route path="/costbasiscalculation" component={CostBasisCalculation} />
          <Route path="/coursebuilder" component={CourseBuilder} />
          <Route path="/coursecatalog" component={CourseCatalog} />
          <Route path="/coverphoto" component={CoverPhoto} />
          <Route path="/createarticle" component={CreateArticle} />
          <Route path="/createaudio" component={CreateAudio} />
          <Route path="/createdrop" component={CreateDrop} />
          <Route path="/createreel" component={CreateReel} />
          <Route path="/creatoranalytics" component={CreatorAnalytics} />
          <Route path="/creatordashboard" component={CreatorDashboard} />
          <Route path="/creatoreconomy" component={CreatorEconomy} />
          <Route path="/creatorintelligence" component={CreatorIntelligence} />
          <Route path="/creatormonetization" component={CreatorMonetization} />
          <Route path="/creatoronboarding" component={CreatorOnboarding} />
          <Route path="/creatorprofile" component={CreatorProfile} />
          <Route path="/creatorspotlight" component={CreatorSpotlight} />
          <Route path="/creatorstudio" component={CreatorStudio} />
          <Route path="/crosschaininterop" component={CrossChainInterop} />
          <Route path="/crypto" component={Crypto} />
          <Route path="/cryptoenhancementspage" component={CryptoEnhancementsPage} />
          <Route path="/cryptohub" component={CryptoHub} />
          <Route path="/cryptoresearchhub" component={CryptoResearchHub} />
          <Route path="/customdashboard" component={CustomDashboard} />
          <Route path="/customreports" component={CustomReports} />
          <Route path="/customeranalytics" component={CustomerAnalytics} />
          <Route path="/customerdisputes" component={CustomerDisputes} />
          <Route path="/daogovernance" component={DAOGovernance} />
          <Route path="/daotreasury" component={DAOTreasury} />
          <Route path="/dexdepthchart" component={DEXDepthChart} />
          <Route path="/dhgateshop" component={DHgateShop} />
          <Route path="/dminbox" component={DMInbox} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/dashboardoverview" component={DashboardOverview} />
          <Route path="/dataexport" component={DataExport} />
          <Route path="/datagrid" component={DataGrid} />
          <Route path="/datalake" component={DataLake} />
          <Route path="/dataprivacy" component={DataPrivacy} />
          <Route path="/dataprocessing" component={DataProcessing} />
          <Route path="/dataretention" component={DataRetention} />
          <Route path="/datatable" component={DataTable} />
          <Route path="/datavisualization" component={DataVisualization} />
          <Route path="/databasemanagement" component={DatabaseManagement} />
          <Route path="/dateinputform" component={DateInputForm} />
          <Route path="/datepickerdialog" component={DatePickerDialog} />
          <Route path="/datingdiscovery" component={DatingDiscovery} />
          <Route path="/datinghome" component={DatingHome} />
          <Route path="/datingmatches" component={DatingMatches} />
          <Route path="/datingmessages" component={DatingMessages} />
          <Route path="/datingpremium" component={DatingPremium} />
          <Route path="/datingprofile" component={DatingProfile} />
          <Route path="/datingprofilesetup" component={DatingProfileSetup} />
          <Route path="/datingsubscription" component={DatingSubscription} />
          <Route path="/daytraderoom" component={DayTradeRoom} />
          <Route path="/defi" component={DeFi} />
          <Route path="/decentralizedidentity" component={DecentralizedIdentity} />
          <Route path="/defensibilitymoat" component={DefensibilityMoat} />
          <Route path="/deleteaccount" component={DeleteAccount} />
          <Route path="/deletecontent" component={DeleteContent} />
          <Route path="/departmentmanagement" component={DepartmentManagement} />
          <Route path="/dependencygraph" component={DependencyGraph} />
          <Route path="/deploymentpipeline" component={DeploymentPipeline} />
          <Route path="/deprecationpolicy" component={DeprecationPolicy} />
          <Route path="/derivativestrading" component={DerivativesTrading} />
          <Route path="/destinationguide" component={DestinationGuide} />
          <Route path="/destinyengine" component={DestinyEngine} />
          <Route path="/devops" component={DevOps} />
          <Route path="/developerarea" component={DeveloperArea} />
          <Route path="/developercommunity" component={DeveloperCommunity} />
          <Route path="/developermarketplace" component={DeveloperMarketplace} />
          <Route path="/developerprotocol" component={DeveloperProtocol} />
          <Route path="/difficultycalculator" component={DifficultyCalculator} />
          <Route path="/difficultytracking" component={DifficultyTracking} />
          <Route path="/digitalartstore" component={DigitalArtStore} />
          <Route path="/digitalnationmode" component={DigitalNationMode} />
          <Route path="/digitaltwin" component={DigitalTwin} />
          <Route path="/directmessages" component={DirectMessages} />
          <Route path="/directmessaging" component={DirectMessaging} />
          <Route path="/disasterrecovery" component={DisasterRecovery} />
          <Route path="/discordintegration" component={DiscordIntegration} />
          <Route path="/discover" component={Discover} />
          <Route path="/discussionboard" component={DiscussionBoard} />
          <Route path="/discussionforums" component={DiscussionForums} />
          <Route path="/disputeresolution" component={DisputeResolution} />
          <Route path="/distributionchannels" component={DistributionChannels} />
          <Route path="/documenteditor" component={DocumentEditor} />
          <Route path="/documentmanagement" component={DocumentManagement} />
          <Route path="/documentsharing" component={DocumentSharing} />
          <Route path="/documentsigning" component={DocumentSigning} />
          <Route path="/documentation" component={Documentation} />
          <Route path="/dogecoinpoolselection" component={DogecoinPoolSelection} />
          <Route path="/donationprocessing" component={DonationProcessing} />
          <Route path="/dropdownmenu" component={DropdownMenu} />
          <Route path="/ensresolver" component={ENSResolver} />
          <Route path="/earningstracker" component={EarningsTracker} />
          <Route path="/earningstracking" component={EarningsTracking} />
          <Route path="/economiclayer" component={EconomicLayer} />
          <Route path="/economics" component={Economics} />
          <Route path="/economycontrol" component={EconomyControl} />
          <Route path="/ecosystem" component={Ecosystem} />
          <Route path="/editprofile" component={EditProfile} />
          <Route path="/emailcampaigns" component={EmailCampaigns} />
          <Route path="/emailinputform" component={EmailInputForm} />
          <Route path="/emailintegration" component={EmailIntegration} />
          <Route path="/emailnotifications" component={EmailNotifications} />
          <Route path="/emailtemplates" component={EmailTemplates} />
          <Route path="/emailverification" component={EmailVerification} />
          <Route path="/embedsdk" component={EmbedSDK} />
          <Route path="/emptysearchstate" component={EmptySearchState} />
          <Route path="/engagementmetrics" component={EngagementMetrics} />
          <Route path="/engineer" component={Engineer} />
          <Route path="/enterprise" component={Scalable} />
          <Route path="/enterpriseapi" component={ScalableAPI} />
          <Route path="/enterpriseanalytics" component={ScalableAnalytics} />
          <Route path="/entityprofile" component={EntityProfile} />
          <Route path="/environmentmanagement" component={EnvironmentManagement} />
          <Route path="/error403" component={Error403} />
          <Route path="/error404" component={Error404} />
          <Route path="/error500" component={Error500} />
          <Route path="/error503" component={Error503} />
          <Route path="/errordialog" component={ErrorDialog} />
          <Route path="/errortracking" component={ErrorTracking} />
          <Route path="/escrowshop" component={EscrowShop} />
          <Route path="/ethereumpoolselector" component={EthereumPoolSelector} />
          <Route path="/eventanalytics" component={EventAnalytics} />
          <Route path="/eventcalendar" component={EventCalendar} />
          <Route path="/eventcreation" component={EventCreation} />
          <Route path="/eventplanner" component={EventPlanner} />
          <Route path="/eventregistration" component={EventRegistration} />
          <Route path="/events" component={Events} />
          <Route path="/executionhistory" component={ExecutionHistory} />
          <Route path="/exerciselibrary" component={ExerciseLibrary} />
          <Route path="/expensemanagement" component={ExpenseManagement} />
          <Route path="/expensetracker" component={ExpenseTracker} />
          <Route path="/experimentfactory" component={ExperimentFactory} />
          <Route path="/experimenttracker" component={ExperimentTracker} />
          <Route path="/explore" component={Explore} />
          <Route path="/exportdata" component={ExportData} />
          <Route path="/faqmanagement" component={FAQManagement} />
          <Route path="/faqpage" component={FAQPage} />
          <Route path="/farming" component={Farming} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/featurerequests" component={FeatureRequests} />
          <Route path="/featuretour" component={FeatureTour} />
          <Route path="/features" component={Features} />
          <Route path="/feecalculation" component={FeeCalculation} />
          <Route path="/feedwithposts" component={FeedWithPosts} />
          <Route path="/feedback" component={Feedback} />
          <Route path="/feedbackdialog" component={FeedbackDialog} />
          <Route path="/feedbackform" component={FeedbackForm} />
          <Route path="/feedbackhub" component={FeedbackHub} />
          <Route path="/filebrowser" component={FileBrowser} />
          <Route path="/fileconverter" component={FileConverter} />
          <Route path="/filedownload" component={FileDownload} />
          <Route path="/filepreview" component={FilePreview} />
          <Route path="/filesharing" component={FileSharing} />
          <Route path="/fileuploaddialog" component={FileUploadDialog} />
          <Route path="/fileuploadform" component={FileUploadForm} />
          <Route path="/fileuploadprogress" component={FileUploadProgress} />
          <Route path="/fileversioning" component={FileVersioning} />
          <Route path="/filterpanel" component={FilterPanel} />
          <Route path="/financialreports" component={FinancialReports} />
          <Route path="/flightsearch" component={FlightSearch} />
          <Route path="/followlist" component={FollowList} />
          <Route path="/followsystem" component={FollowSystem} />
          <Route path="/followunfollow" component={FollowUnfollow} />
          <Route path="/followerlist" component={FollowerList} />
          <Route path="/forecastingengine" component={ForecastingEngine} />
          <Route path="/forumcategories" component={ForumCategories} />
          <Route path="/frameworktemplates" component={FrameworkTemplates} />
          <Route path="/freewilldashboard" component={FreeWillDashboard} />
          <Route path="/fundraisertools" component={FundraiserTools} />
          <Route path="/gdpr" component={GDPR} />
          <Route path="/gtmstrategy" component={GTMStrategy} />
          <Route path="/gainlosstracking" component={GainLossTracking} />
          <Route path="/gameblackjack" component={GameBlackjack} />
          <Route path="/gameblockbuilder" component={GameBlockBuilder} />
          <Route path="/gamechat" component={GameChat} />
          <Route path="/gamecrash" component={GameCrash} />
          <Route path="/gamecryptoquiz" component={GameCryptoQuiz} />
          <Route path="/gamefiquestboard" component={GameFiQuestBoard} />
          <Route path="/gamelobby" component={GameLobby} />
          <Route path="/gameroom" component={GameRoom} />
          <Route path="/gamesettings" component={GameSettings} />
          <Route path="/gameslots" component={GameSlots} />
          <Route path="/gametokentap" component={GameTokenTap} />
          <Route path="/gaming" component={Gaming} />
          <Route path="/gamingforcharity" component={GamingForCharity} />
          <Route path="/ganttchart" component={GanttChart} />
          <Route path="/gasfeeestimator" component={GasFeeEstimator} />
          <Route path="/gaspricemonitor" component={GasPriceMonitor} />
          <Route path="/gastracker" component={GasTracker} />
          <Route path="/generalsettings" component={GeneralSettings} />
          <Route path="/generatedapiexplorer" component={GeneratedApiExplorer} />
          <Route path="/generatedgallery" component={GeneratedGallery} />
          <Route path="/gettingstartedguide" component={GettingStartedGuide} />
          <Route path="/ghostmode" component={GhostMode} />
          <Route path="/globaloperationscenter" component={GlobalOperationsCenter} />
          <Route path="/globalsearch" component={GlobalSearch} />
          <Route path="/governance" component={Governance} />
          <Route path="/governancevoting" component={GovernanceVoting} />
          <Route path="/governancewizard" component={GovernanceWizard} />
          <Route path="/gradebook" component={GradeBook} />
          <Route path="/groupchat" component={GroupChat} />
          <Route path="/groupchats" component={GroupChats} />
          <Route path="/groupdirectory" component={GroupDirectory} />
          <Route path="/groupevents" component={GroupEvents} />
          <Route path="/groupmanagement" component={GroupManagement} />
          <Route path="/growth" component={Growth} />
          <Route path="/guilds" component={Guilds} />
          <Route path="/hipaa" component={HIPAA} />
          <Route path="/hopeaicontrol" component={HOPEAIControl} />
          <Route path="/hashratemonitor" component={HashRateMonitor} />
          <Route path="/hashtagexplorer" component={HashtagExplorer} />
          <Route path="/hashtagsearch" component={HashtagSearch} />
          <Route path="/healtharticles" component={HealthArticles} />
          <Route path="/healthdashboard" component={HealthDashboard} />
          <Route path="/healthgoals" component={HealthGoals} />
          <Route path="/helpcenter" component={HelpCenter} />
          <Route path="/home" component={Home} />
          <Route path="/hopeai" component={HopeAI} />
          <Route path="/hopeaiadvanced" component={HopeAIAdvanced} />
          <Route path="/hopeaimeta" component={HopeAIMeta} />
          <Route path="/hopeaipage" component={HopeAIPage} />
          <Route path="/hopeaiupgrades" component={HopeAIUpgrades} />
          <Route path="/hotelsearch" component={HotelSearch} />
          <Route path="/hubspotintegration" component={HubSpotIntegration} />
          <Route path="/icolaunchpad" component={ICOLaunchpad} />
          <Route path="/ifttt" component={IFTTT} />
          <Route path="/imageeditor" component={ImageEditor} />
          <Route path="/imagegallery" component={ImageGallery} />
          <Route path="/imagetools" component={ImageTools} />
          <Route path="/imageviewer" component={ImageViewer} />
          <Route path="/impactmap" component={ImpactMap} />
          <Route path="/impactmetrics" component={ImpactMetrics} />
          <Route path="/inappnotifications" component={InAppNotifications} />
          <Route path="/ingamecurrency" component={InGameCurrency} />
          <Route path="/incidentmanagement" component={IncidentManagement} />
          <Route path="/inputdialog" component={InputDialog} />
          <Route path="/instructordashboard" component={InstructorDashboard} />
          <Route path="/integrationsetup" component={IntegrationSetup} />
          <Route path="/integrations" component={Integrations} />
          <Route path="/inventorymanagement" component={InventoryManagement} />
          <Route path="/investormetrics" component={InvestorMetrics} />
          <Route path="/investorpitch" component={InvestorPitch} />
          <Route path="/investorportal" component={InvestorPortal} />
          <Route path="/investorroom" component={InvestorRoom} />
          <Route path="/invoicedetails" component={InvoiceDetails} />
          <Route path="/invoicemanagement" component={InvoiceManagement} />
          <Route path="/kycverification" component={KYCVerification} />
          <Route path="/knowledgebase" component={KnowledgeBase} />
          <Route path="/ldapintegration" component={LDAPIntegration} />
          <Route path="/ltvanalysis" component={LTVAnalysis} />
          <Route path="/landingpage" component={LandingPage} />
          <Route path="/languageexchangeadmin" component={LanguageExchangeAdmin} />
          <Route path="/languagepartnerdiscovery" component={LanguagePartnerDiscovery} />
          <Route path="/languageselector" component={LanguageSelector} />
          <Route path="/languagesettings" component={LanguageSettings} />
          <Route path="/leadscoring" component={LeadScoring} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/leaderboards" component={Leaderboards} />
          <Route path="/learning" component={Learning} />
          <Route path="/learningpath" component={LearningPath} />
          <Route path="/legaldocuments" component={LegalDocuments} />
          <Route path="/legendarystatus" component={LegendaryStatus} />
          <Route path="/lendingborrowing" component={LendingBorrowing} />
          <Route path="/lessoneditor" component={LessonEditor} />
          <Route path="/lifecommand" component={LifeCommand} />
          <Route path="/lightbox" component={Lightbox} />
          <Route path="/likereactionsystem" component={LikeReactionSystem} />
          <Route path="/likes" component={Likes} />
          <Route path="/liquiditypools" component={LiquidityPools} />
          <Route path="/listview" component={ListView} />
          <Route path="/live" component={Live} />
          <Route path="/livechat" component={LiveChat} />
          <Route path="/livegifting" component={LiveGifting} />
          <Route path="/livereactions" component={LiveReactions} />
          <Route path="/livestreamsetup" component={LiveStreamSetup} />
          <Route path="/livestreamdashboard" component={LivestreamDashboard} />
          <Route path="/loadingdialog" component={LoadingDialog} />
          <Route path="/logviewer" component={LogViewer} />
          <Route path="/login" component={Login} />
          <Route path="/logisticsoptimizer" component={LogisticsOptimizer} />
          <Route path="/mlinsights" component={MLInsights} />
          <Route path="/mlmodels" component={MLModels} />
          <Route path="/mailinglists" component={MailingLists} />
          <Route path="/maindashboard" component={MainDashboard} />
          <Route path="/maintenancemode" component={MaintenanceMode} />
          <Route path="/mapview" component={MapView} />
          <Route path="/markdownrendering" component={MarkdownRendering} />
          <Route path="/marketingroi" component={MarketingROI} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/marketplaceanalytics" component={MarketplaceAnalytics} />
          <Route path="/masterarchitecture" component={MasterArchitecture} />
          <Route path="/matchchat" component={MatchChat} />
          <Route path="/matchfeed" component={MatchFeed} />
          <Route path="/matchspace" component={MatchSpace} />
          <Route path="/matchingalgorithm" component={MatchingAlgorithm} />
          <Route path="/matchmaking" component={Matchmaking} />
          <Route path="/mealplans" component={MealPlans} />
          <Route path="/mediacarousel" component={MediaCarousel} />
          <Route path="/mediagallery" component={MediaGallery} />
          <Route path="/medicationreminder" component={MedicationReminder} />
          <Route path="/megamarketplace" component={MegaMarketplace} />
          <Route path="/membershiptiers" component={MembershipTiers} />
          <Route path="/memoryconstellation" component={MemoryConstellation} />
          <Route path="/memorygraphvisualizer" component={MemoryGraphVisualizer} />
          <Route path="/memorysystem" component={MemorySystem} />
          <Route path="/messageencryption" component={MessageEncryption} />
          <Route path="/messagesearch" component={MessageSearch} />
          <Route path="/messages" component={Messages} />
          <Route path="/milestonetracking" component={MilestoneTracking} />
          <Route path="/minerdashboard" component={MinerDashboard} />
          <Route path="/miningcalculator" component={MiningCalculator} />
          <Route path="/miningdashboard" component={MiningDashboard} />
          <Route path="/miningpoolselector" component={MiningPoolSelector} />
          <Route path="/missioncontrol" component={MissionControl} />
          <Route path="/mobileapp" component={MobileApp} />
          <Route path="/mobilegaming" component={MobileGaming} />
          <Route path="/mobilehome" component={MobileHome} />
          <Route path="/mobilemenu" component={MobileMenu} />
          <Route path="/mobilemessages" component={MobileMessages} />
          <Route path="/mobilenotifications" component={MobileNotifications} />
          <Route path="/mobileprofile" component={MobileProfile} />
          <Route path="/mobilesearch" component={MobileSearch} />
          <Route path="/mobilesettings" component={MobileSettings} />
          <Route path="/mobileshop" component={MobileShop} />
          <Route path="/mobilestreaming" component={MobileStreaming} />
          <Route path="/mobiletrading" component={MobileTrading} />
          <Route path="/mobilewallet" component={MobileWallet} />
          <Route path="/moderationdashboard" component={ModerationDashboard} />
          <Route path="/moodtracker" component={MoodTracker} />
          <Route path="/mortgagecalculator" component={MortgageCalculator} />
          <Route path="/moviecatalog" component={MovieCatalog} />
          <Route path="/moviedetail" component={MovieDetail} />
          <Route path="/multimodelselector" component={MultiModelSelector} />
          <Route path="/multiselectform" component={MultiSelectForm} />
          <Route path="/multiplayerlobby" component={MultiplayerLobby} />
          <Route path="/multivariatetesting" component={MultivariateTesting} />
          <Route path="/musicgeneration" component={MusicGeneration} />
          <Route path="/mutualconnections" component={MutualConnections} />
          <Route path="/mylearning" component={MyLearning} />
          <Route path="/mytrips" component={MyTrips} />
          <Route path="/nftgallery" component={NFTGallery} />
          <Route path="/nftminting" component={NFTMinting} />
          <Route path="/nftwallet" component={NFTWallet} />
          <Route path="/nlptools" component={NLPTools} />
          <Route path="/nsfwfeed" component={NSFWFeed} />
          <Route path="/nsfwplatform" component={NSFWPlatform} />
          <Route path="/narrativeengine" component={NarrativeEngine} />
          <Route path="/networthtracker" component={NetWorthTracker} />
          <Route path="/networkgraph" component={NetworkGraph} />
          <Route path="/networkhealth" component={NetworkHealth} />
          <Route path="/networkstatistics" component={NetworkStatistics} />
          <Route path="/notesapp" component={NotesApp} />
          <Route path="/notificationcenter" component={NotificationCenter} />
          <Route path="/notificationhistory" component={NotificationHistory} />
          <Route path="/notificationintelligence" component={NotificationIntelligence} />
          <Route path="/notificationpreferences" component={NotificationPreferences} />
          <Route path="/notificationsettings" component={NotificationSettings} />
          <Route path="/notifications" component={Notifications} />
          <Route path="/notificationscenter" component={NotificationsCenter} />
          <Route path="/notificationshub" component={NotificationsHub} />
          <Route path="/numberinputform" component={NumberInputForm} />
          <Route path="/nutritiontracker" component={NutritionTracker} />
          <Route path="/oauthproviders" component={OAuthProviders} />
          <Route path="/offermanagement" component={OfferManagement} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/onboardingtutorial" component={OnboardingTutorial} />
          <Route path="/orderconfirmation" component={OrderConfirmation} />
          <Route path="/orderhistory" component={OrderHistory} />
          <Route path="/orderplacement" component={OrderPlacement} />
          <Route path="/ordertracking" component={OrderTracking} />
          <Route path="/ordertypes" component={OrderTypes} />
          <Route path="/organizationsettings" component={OrganizationSettings} />
          <Route path="/p2eshop" component={P2EShop} />
          <Route path="/pagination" component={Pagination} />
          <Route path="/passwordinputform" component={PasswordInputForm} />
          <Route path="/passwordreset" component={PasswordReset} />
          <Route path="/paypalintegration" component={PayPalIntegration} />
          <Route path="/paymentconfirmation" component={PaymentConfirmation} />
          <Route path="/paymentinfra" component={PaymentInfra} />
          <Route path="/paymentmethods" component={PaymentMethods} />
          <Route path="/paymentsetup" component={PaymentSetup} />
          <Route path="/payments" component={Payments} />
          <Route path="/payoutdashboard" component={PayoutDashboard} />
          <Route path="/payoutmanagement" component={PayoutManagement} />
          <Route path="/performancemetrics" component={PerformanceMetrics} />
          <Route path="/personabuilder" component={PersonaBuilder} />
          <Route path="/phase1dashboard" component={Phase1Dashboard} />
          <Route path="/phase2to4dashboard" component={Phase2to4Dashboard} />
          <Route path="/phoneverification" component={PhoneVerification} />
          <Route path="/platformmap" component={PlatformMap} />
          <Route path="/platformstatus" component={PlatformStatus} />
          <Route path="/playlistmanager" component={PlaylistManager} />
          <Route path="/podcaststudio" component={PodcastStudio} />
          <Route path="/policymanagement" component={PolicyManagement} />
          <Route path="/poolperformance" component={PoolPerformance} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/portfoliooptimization" component={PortfolioOptimization} />
          <Route path="/portfoliooverview" component={PortfolioOverview} />
          <Route path="/portfoliotracker" component={PortfolioTracker} />
          <Route path="/portfoliotracking" component={PortfolioTracking} />
          <Route path="/positionmanagement" component={PositionManagement} />
          <Route path="/powerusertools" component={PowerUserTools} />
          <Route path="/practicesessions" component={PracticeSessions} />
          <Route path="/predictiveanalytics" component={PredictiveAnalytics} />
          <Route path="/predictivemodels" component={PredictiveModels} />
          <Route path="/predictivesystems" component={PredictiveSystems} />
          <Route path="/preferencessetup" component={PreferencesSetup} />
          <Route path="/premiumfeatures" component={PremiumFeatures} />
          <Route path="/presentationwithchat" component={PresentationWithChat} />
          <Route path="/pricealerts" component={PriceAlerts} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/pricingengine" component={PricingEngine} />
          <Route path="/pricingmanagement" component={PricingManagement} />
          <Route path="/pricingrules" component={PricingRules} />
          <Route path="/prioritymatrix" component={PriorityMatrix} />
          <Route path="/privacypolicy" component={PrivacyPolicy} />
          <Route path="/privacysettings" component={PrivacySettings} />
          <Route path="/privacyvault" component={PrivacyVault} />
          <Route path="/productapproval" component={ProductApproval} />
          <Route path="/productbrain" component={ProductBrain} />
          <Route path="/productcatalog" component={ProductCatalog} />
          <Route path="/productcomparison" component={ProductComparison} />
          <Route path="/productdetail" component={ProductDetail} />
          <Route path="/productlisting" component={ProductListing} />
          <Route path="/productlistings" component={ProductListings} />
          <Route path="/productreviews" component={ProductReviews} />
          <Route path="/productionarchitecture" component={ProductionArchitecture} />
          <Route path="/profile" component={Profile} />
          <Route path="/profilecompletion" component={ProfileCompletion} />
          <Route path="/profilecreation" component={ProfileCreation} />
          <Route path="/profilecustomization" component={ProfileCustomization} />
          <Route path="/profiledashboard" component={ProfileDashboard} />
          <Route path="/profileedit" component={ProfileEdit} />
          <Route path="/profilepicture" component={ProfilePicture} />
          <Route path="/profilepreview" component={ProfilePreview} />
          <Route path="/profileview" component={ProfileView} />
          <Route path="/profilewallet" component={ProfileWallet} />
          <Route path="/profitability" component={Profitability} />
          <Route path="/progressbar" component={ProgressBar} />
          <Route path="/progresstracking" component={ProgressTracking} />
          <Route path="/projectboard" component={ProjectBoard} />
          <Route path="/projectlisting" component={ProjectListing} />
          <Route path="/promotionengine" component={PromotionEngine} />
          <Route path="/promptbuilder" component={PromptBuilder} />
          <Route path="/proofvault" component={ProofVault} />
          <Route path="/propertycomparison" component={PropertyComparison} />
          <Route path="/propertydetail" component={PropertyDetail} />
          <Route path="/propertylisting" component={PropertyListing} />
          <Route path="/propertytransfer" component={PropertyTransfer} />
          <Route path="/protocollayer" component={ProtocolLayer} />
          <Route path="/publishingschedule" component={PublishingSchedule} />
          <Route path="/pushnotifications" component={PushNotifications} />
          <Route path="/qrcodegenerator" component={QRCodeGenerator} />
          <Route path="/quickactions" component={QuickActions} />
          <Route path="/quickstats" component={QuickStats} />
          <Route path="/quizbuilder" component={QuizBuilder} />
          <Route path="/rfmanalysis" component={RFMAnalysis} />
          <Route path="/rfqsystem" component={RFQSystem} />
          <Route path="/radiobuttonform" component={RadioButtonForm} />
          <Route path="/ratelimitconfig" component={RateLimitConfig} />
          <Route path="/ratelimitdashboard" component={RateLimitDashboard} />
          <Route path="/ratelimiterror" component={RateLimitError} />
          <Route path="/ratelimiting" component={RateLimiting} />
          <Route path="/ratingsystem" component={RatingSystem} />
          <Route path="/readreceipts" component={ReadReceipts} />
          <Route path="/realtimegameengine" component={RealTimeGameEngine} />
          <Route path="/realtimemonitoring" component={RealTimeMonitoring} />
          <Route path="/realtimestreaming" component={RealTimeStreaming} />
          <Route path="/rebalancingtools" component={RebalancingTools} />
          <Route path="/receiptdownload" component={ReceiptDownload} />
          <Route path="/receivecrypto" component={ReceiveCrypto} />
          <Route path="/recentactivity" component={RecentActivity} />
          <Route path="/recommendations" component={Recommendations} />
          <Route path="/recommendationsfeed" component={RecommendationsFeed} />
          <Route path="/recommendedmatches" component={RecommendedMatches} />
          <Route path="/reels" component={Reels} />
          <Route path="/refactoringtools" component={RefactoringTools} />
          <Route path="/referrals" component={Referrals} />
          <Route path="/refundrequests" component={RefundRequests} />
          <Route path="/regionalsettings" component={RegionalSettings} />
          <Route path="/reminders" component={Reminders} />
          <Route path="/reportdialog" component={ReportDialog} />
          <Route path="/reportuser" component={ReportUser} />
          <Route path="/reportsdashboard" component={ReportsDashboard} />
          <Route path="/reputation" component={Reputation} />
          <Route path="/reputationsystem" component={ReputationSystem} />
          <Route path="/resourceallocation" component={ResourceAllocation} />
          <Route path="/resourcelibrary" component={ResourceLibrary} />
          <Route path="/responsetime" component={ResponseTime} />
          <Route path="/retention" component={Retention} />
          <Route path="/retentionanalytics" component={RetentionAnalytics} />
          <Route path="/retentionengine" component={RetentionEngine} />
          <Route path="/retirementplanner" component={RetirementPlanner} />
          <Route path="/returnmanagement" component={ReturnManagement} />
          <Route path="/returnsrefunds" component={ReturnsRefunds} />
          <Route path="/reviewmoderation" component={ReviewModeration} />
          <Route path="/reviews" component={Reviews} />
          <Route path="/reviewsratings" component={ReviewsRatings} />
          <Route path="/rewardsystem" component={RewardSystem} />
          <Route path="/rewardsmonitoring" component={RewardsMonitoring} />
          <Route path="/rewardstracking" component={RewardsTracking} />
          <Route path="/riskanalysis" component={RiskAnalysis} />
          <Route path="/roadmap" component={Roadmap} />
          <Route path="/roadmapview" component={RoadmapView} />
          <Route path="/rolebasedaccess" component={RoleBasedAccess} />
          <Route path="/rolemanagement" component={RoleManagement} />
          <Route path="/sdkdownload" component={SDKDownload} />
          <Route path="/sdkmanagement" component={SDKManagement} />
          <Route path="/seooptimizer" component={SEOOptimizer} />
          <Route path="/sky444centralbank" component={SKY444CentralBank} />
          <Route path="/smscampaigns" component={SMSCampaigns} />
          <Route path="/smsintegration" component={SMSIntegration} />
          <Route path="/smstemplates" component={SMSTemplates} />
          <Route path="/soc2" component={SOC2} />
          <Route path="/sso" component={SSO} />
          <Route path="/salesanalytics" component={SalesAnalytics} />
          <Route path="/salesforceintegration" component={SalesforceIntegration} />
          <Route path="/satisfactionsurvey" component={SatisfactionSurvey} />
          <Route path="/savedproperties" component={SavedProperties} />
          <Route path="/savedsearches" component={SavedSearches} />
          <Route path="/savingsgoals" component={SavingsGoals} />
          <Route path="/scheduledjobs" component={ScheduledJobs} />
          <Route path="/scheduledreports" component={ScheduledReports} />
          <Route path="/school" component={School} />
          <Route path="/schoolcertificate" component={SchoolCertificate} />
          <Route path="/schoolcourse" component={SchoolCourse} />
          <Route path="/schooldashboard" component={SchoolDashboard} />
          <Route path="/schoollesson" component={SchoolLesson} />
          <Route path="/schoolquiz" component={SchoolQuiz} />
          <Route path="/search" component={Search} />
          <Route path="/searchanalytics" component={SearchAnalytics} />
          <Route path="/searchhistory" component={SearchHistory} />
          <Route path="/searchresults" component={SearchResults} />
          <Route path="/searchsuggestions" component={SearchSuggestions} />
          <Route path="/seasonalevents" component={SeasonalEvents} />
          <Route path="/security" component={Security} />
          <Route path="/securityaudit" component={SecurityAudit} />
          <Route path="/securitycompliance" component={SecurityCompliance} />
          <Route path="/securitydashboard" component={SecurityDashboard} />
          <Route path="/securitysettings" component={SecuritySettings} />
          <Route path="/segmentationanalysis" component={SegmentationAnalysis} />
          <Route path="/selectdropdownform" component={SelectDropdownForm} />
          <Route path="/selfhealinginfra" component={SelfHealingInfra} />
          <Route path="/sellerdashboard" component={SellerDashboard} />
          <Route path="/sellerprofile" component={SellerProfile} />
          <Route path="/sendcrypto" component={SendCrypto} />
          <Route path="/sentimentpipeline" component={SentimentPipeline} />
          <Route path="/serverhealth" component={ServerHealth} />
          <Route path="/serverinstaller" component={ServerInstaller} />
          <Route path="/serverstatus" component={ServerStatus} />
          <Route path="/settings" component={Settings} />
          <Route path="/settingsdialog" component={SettingsDialog} />
          <Route path="/setupwizard" component={SetupWizard} />
          <Route path="/shadowidentity" component={ShadowIdentity} />
          <Route path="/shadowrelay" component={ShadowRelay} />
          <Route path="/sharedialog" component={ShareDialog} />
          <Route path="/sharing" component={Sharing} />
          <Route path="/shippingmanagement" component={ShippingManagement} />
          <Route path="/shoppingcart" component={ShoppingCart} />
          <Route path="/sidebarnavigation" component={SidebarNavigation} />
          <Route path="/signup" component={SignUp} />
          <Route path="/signupflow" component={SignUpFlow} />
          <Route path="/signup_old" component={SignUp_old} />
          <Route path="/signin" component={Signin} />
          <Route path="/situationroom" component={SituationRoom} />
          <Route path="/skillbadges" component={SkillBadges} />
          <Route path="/skyschool" component={SkySchool} />
          <Route path="/skyschoolai" component={SkySchoolAI} />
          <Route path="/skyschoolquiz" component={SkySchoolQuiz} />
          <Route path="/skystore" component={SkyStore} />
          <Route path="/slackintegration" component={SlackIntegration} />
          <Route path="/sleeptracking" component={SleepTracking} />
          <Route path="/slippageprotection" component={SlippageProtection} />
          <Route path="/smartcontractaudit" component={SmartContractAudit} />
          <Route path="/smartcontractviewer" component={SmartContractViewer} />
          <Route path="/smartcontracts" component={SmartContracts} />
          <Route path="/socialfeedv2" component={SocialFeedV2} />
          <Route path="/socialgraph" component={SocialGraph} />
          <Route path="/socialmedia" component={SocialMedia} />
          <Route path="/socialmediacampaigns" component={SocialMediaCampaigns} />
          <Route path="/solanavalidatorsetup" component={SolanaValidatorSetup} />
          <Route path="/sortoptions" component={SortOptions} />
          <Route path="/speechtotext" component={SpeechToText} />
          <Route path="/spinwheel" component={SpinWheel} />
          <Route path="/stakedelegation" component={StakeDelegation} />
          <Route path="/stakingdashboard" component={StakingDashboard} />
          <Route path="/stakingoptions" component={StakingOptions} />
          <Route path="/stakingportal" component={StakingPortal} />
          <Route path="/statisticspanel" component={StatisticsPanel} />
          <Route path="/status" component={Status} />
          <Route path="/stepperwizard" component={StepperWizard} />
          <Route path="/stockchart" component={StockChart} />
          <Route path="/stocksearch" component={StockSearch} />
          <Route path="/stories" component={Stories} />
          <Route path="/streamanalytics" component={StreamAnalytics} />
          <Route path="/streamclip" component={StreamClip} />
          <Route path="/streamgifting" component={StreamGifting} />
          <Route path="/stripecheckout" component={StripeCheckout} />
          <Route path="/stripeintegration" component={StripeIntegration} />
          <Route path="/studentprogress" component={StudentProgress} />
          <Route path="/styleselector" component={StyleSelector} />
          <Route path="/subscriptionmanagement" component={SubscriptionManagement} />
          <Route path="/subscriptionplans" component={SubscriptionPlans} />
          <Route path="/subscriptionsetup" component={SubscriptionSetup} />
          <Route path="/subscriptions" component={Subscriptions} />
          <Route path="/successdialog" component={SuccessDialog} />
          <Route path="/successscreen" component={SuccessScreen} />
          <Route path="/supportmetrics" component={SupportMetrics} />
          <Route path="/supportticket" component={SupportTicket} />
          <Route path="/swapinterface" component={SwapInterface} />
          <Route path="/swipeinterface" component={SwipeInterface} />
          <Route path="/systemarchitecture" component={SystemArchitecture} />
          <Route path="/systemlogs" component={SystemLogs} />
          <Route path="/systemobservability" component={SystemObservability} />
          <Route path="/systemstatus" component={SystemStatus} />
          <Route path="/tabsnavigation" component={TabsNavigation} />
          <Route path="/taskautomation" component={TaskAutomation} />
          <Route path="/taskdetail" component={TaskDetail} />
          <Route path="/tasklist" component={TaskList} />
          <Route path="/taxdocumentation" component={TaxDocumentation} />
          <Route path="/taxplanning" component={TaxPlanning} />
          <Route path="/taxreports" component={TaxReports} />
          <Route path="/teachingopportunities" component={TeachingOpportunities} />
          <Route path="/teammanagement" component={TeamManagement} />
          <Route path="/teamworkspace" component={TeamWorkspace} />
          <Route path="/technicalindicators" component={TechnicalIndicators} />
          <Route path="/telegramintegration" component={TelegramIntegration} />
          <Route path="/templatelibrary" component={TemplateLibrary} />
          <Route path="/termsacceptance" component={TermsAcceptance} />
          <Route path="/termsofservice" component={TermsOfService} />
          <Route path="/testingframework" component={TestingFramework} />
          <Route path="/textinputform" component={TextInputForm} />
          <Route path="/texttospeech" component={TextToSpeech} />
          <Route path="/texttools" component={TextTools} />
          <Route path="/themesettings" component={ThemeSettings} />
          <Route path="/threadmanagement" component={ThreadManagement} />
          <Route path="/ticketassignment" component={TicketAssignment} />
          <Route path="/ticketdetail" component={TicketDetail} />
          <Route path="/ticketqueue" component={TicketQueue} />
          <Route path="/tiercomparison" component={TierComparison} />
          <Route path="/timeinputform" component={TimeInputForm} />
          <Route path="/timepickerdialog" component={TimePickerDialog} />
          <Route path="/timetracking" component={TimeTracking} />
          <Route path="/timelineview" component={TimelineView} />
          <Route path="/timeouterror" component={TimeoutError} />
          <Route path="/tipjar" component={TipJar} />
          <Route path="/toastnotifications" component={ToastNotifications} />
          <Route path="/todolist" component={TodoList} />
          <Route path="/toggleswitchform" component={ToggleSwitchForm} />
          <Route path="/tokendashboard" component={TokenDashboard} />
          <Route path="/tokengovernance" component={TokenGovernance} />
          <Route path="/tokeninformation" component={TokenInformation} />
          <Route path="/tokenmetrics" component={TokenMetrics} />
          <Route path="/tokenomicscalculator" component={TokenomicsCalculator} />
          <Route path="/torbridge" component={TorBridge} />
          <Route path="/tournamentbracket" component={TournamentBracket} />
          <Route path="/tournamentbrackets" component={TournamentBrackets} />
          <Route path="/tournaments" component={Tournaments} />
          <Route path="/tradehistory" component={TradeHistory} />
          <Route path="/trading" component={Trading} />
          <Route path="/tradingterminal" component={TradingTerminal} />
          <Route path="/transactionexplorer" component={TransactionExplorer} />
          <Route path="/transactionhistory" component={TransactionHistory} />
          <Route path="/transactionviewer" component={TransactionViewer} />
          <Route path="/transcriptionmanager" component={TranscriptionManager} />
          <Route path="/translationenabledcommunity" component={TranslationEnabledCommunity} />
          <Route path="/translationenabledsocialfeed" component={TranslationEnabledSocialFeed} />
          <Route path="/transparencyreports" component={TransparencyReports} />
          <Route path="/travelblog" component={TravelBlog} />
          <Route path="/travelbudget" component={TravelBudget} />
          <Route path="/traveldocuments" component={TravelDocuments} />
          <Route path="/travelphotos" component={TravelPhotos} />
          <Route path="/travelreviews" component={TravelReviews} />
          <Route path="/traveltips" component={TravelTips} />
          <Route path="/treasurymanagement" component={TreasuryManagement} />
          <Route path="/trendanalysis" component={TrendAnalysis} />
          <Route path="/trending" component={Trending} />
          <Route path="/trendingitems" component={TrendingItems} />
          <Route path="/trendingtopics" component={TrendingTopics} />
          <Route path="/triggersactions" component={TriggersActions} />
          <Route path="/tripplanner" component={TripPlanner} />
          <Route path="/trumpmining" component={TrumpMining} />
          <Route path="/trustsafetydashboard" component={TrustSafetyDashboard} />
          <Route path="/trustsystem" component={TrustSystem} />
          <Route path="/twofactorauth" component={TwoFactorAuth} />
          <Route path="/twofactorsetup" component={TwoFactorSetup} />
          <Route path="/typingindicators" component={TypingIndicators} />
          <Route path="/unhiddeninterface" component={UnhiddenInterface} />
          <Route path="/unhiddenmode" component={UnhiddenMode} />
          <Route path="/unifiedfeed" component={UnifiedFeed} />
          <Route path="/unifiedidentity" component={UnifiedIdentity} />
          <Route path="/unifiedmessaging" component={UnifiedMessaging} />
          <Route path="/unifiedpaymentledger" component={UnifiedPaymentLedger} />
          <Route path="/unifiedplatformdashboard" component={UnifiedPlatformDashboard} />
          <Route path="/universalsearch" component={UniversalSearch} />
          <Route path="/updatedlandingpage" component={UpdatedLandingPage} />
          <Route path="/upgradedowngradeplan" component={UpgradeDowngradePlan} />
          <Route path="/upscaling" component={Upscaling} />
          <Route path="/userbehavior" component={UserBehavior} />
          <Route path="/userbio" component={UserBio} />
          <Route path="/userdirectory" component={UserDirectory} />
          <Route path="/userdiscovery" component={UserDiscovery} />
          <Route path="/usermanagement" component={UserManagement} />
          <Route path="/usermentions" component={UserMentions} />
          <Route path="/useronboarding" component={UserOnboarding} />
          <Route path="/userpermissions" component={UserPermissions} />
          <Route path="/userprofile" component={UserProfile} />
          <Route path="/userprofiles" component={UserProfiles} />
          <Route path="/userstats" component={UserStats} />
          <Route path="/usersuggestions" component={UserSuggestions} />
          <Route path="/vodarchive" component={VODArchive} />
          <Route path="/validatorperformance" component={ValidatorPerformance} />
          <Route path="/validatorsetup" component={ValidatorSetup} />
          <Route path="/vendoranalytics" component={VendorAnalytics} />
          <Route path="/vendordirectory" component={VendorDirectory} />
          <Route path="/vendoronboarding" component={VendorOnboarding} />
          <Route path="/vendorperformance" component={VendorPerformance} />
          <Route path="/vendorverification" component={VendorVerification} />
          <Route path="/venuemanagement" component={VenueManagement} />
          <Route path="/verification" component={Verification} />
          <Route path="/verificationsteps" component={VerificationSteps} />
          <Route path="/verificationsystem" component={VerificationSystem} />
          <Route path="/versionmanagement" component={VersionManagement} />
          <Route path="/vestingschedule" component={VestingSchedule} />
          <Route path="/videoarea" component={VideoArea} />
          <Route path="/videocall" component={VideoCall} />
          <Route path="/videochat" component={VideoChat} />
          <Route path="/videoeditor" component={VideoEditor} />
          <Route path="/videoplayer" component={VideoPlayer} />
          <Route path="/videotools" component={VideoTools} />
          <Route path="/videotutorials" component={VideoTutorials} />
          <Route path="/videouploader" component={VideoUploader} />
          <Route path="/virtualtour" component={VirtualTour} />
          <Route path="/voicecloning" component={VoiceCloning} />
          <Route path="/voicecommands" component={VoiceCommands} />
          <Route path="/voicecommandsregistry" component={VoiceCommandsRegistry} />
          <Route path="/voicemessages" component={VoiceMessages} />
          <Route path="/walkthroughpage" component={WalkthroughPage} />
          <Route path="/wallet" component={Wallet} />
          <Route path="/walletconnect" component={WalletConnect} />
          <Route path="/walletintegration" component={WalletIntegration} />
          <Route path="/walletoverview" component={WalletOverview} />
          <Route path="/warningdialog" component={WarningDialog} />
          <Route path="/watchearn" component={WatchEarn} />
          <Route path="/watchlist" component={WatchList} />
          <Route path="/web3auth" component={Web3Auth} />
          <Route path="/webhookmanager" component={WebhookManager} />
          <Route path="/webhooks" component={Webhooks} />
          <Route path="/welcomescreen" component={WelcomeScreen} />
          <Route path="/whalemonitor" component={WhaleMonitor} />
          <Route path="/whitelistmanagement" component={WhitelistManagement} />
          <Route path="/wishlistmanagement" component={WishlistManagement} />
          <Route path="/workflowautomation" component={WorkflowAutomation} />
          <Route path="/workflowbuilder" component={WorkflowBuilder} />
          <Route path="/worldbrain" component={WorldBrain} />
          <Route path="/worldsimulationcontrol" component={WorldSimulationControl} />
          <Route path="/yieldfarming" component={YieldFarming} />
          <Route path="/zapierintegration" component={ZapierIntegration} />
          {/* Default route */}
          <Route path="/" component={Home} />
                  {/* 404 */}
                  <Route component={NotFound} />
                </Switch>
              </Suspense>
            </main>
            {/* Bottom Navigation */}
            <MobileBottomNav />
            <BottomTabBar />
            {/* Toast Notifications */}
            <Toaster />
          </div>
        </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
