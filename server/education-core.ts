export type CourseLevel = "Beginner" | "Intermediate";

export interface CurriculumLesson {
  id: string;
  title: string;
  minutes: number;
  summary: string;
  objectives: string[];
  body: string[];
}

interface CurriculumQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface CurriculumCourse {
  id: string;
  title: string;
  category: string;
  level: CourseLevel;
  description: string;
  outcomes: string[];
  lessons: CurriculumLesson[];
  quiz: {
    passingScore: number;
    questions: CurriculumQuestion[];
  };
}

export interface PublicCurriculumCourse
  extends Omit<CurriculumCourse, "quiz"> {
  quiz: {
    passingScore: number;
    questions: Array<
      Pick<CurriculumQuestion, "id" | "prompt" | "options">
    >;
  };
}

export interface QuizAnswer {
  questionId: string;
  optionIndex: number;
}

export interface QuizGrade {
  courseId: string;
  score: number;
  passed: boolean;
  correct: number;
  total: number;
  results: Array<{
    questionId: string;
    selectedIndex: number | null;
    correctIndex: number;
    correct: boolean;
    explanation: string;
  }>;
}

const COURSES: CurriculumCourse[] = [
  {
    id: "blockchain-foundations",
    title: "Blockchain Foundations",
    category: "Web3",
    level: "Beginner",
    description:
      "Understand ledgers, consensus, keys, smart contracts, and the limits of blockchain systems without treating marketing claims as guarantees.",
    outcomes: [
      "Explain what a blockchain records and what it does not prove by itself.",
      "Compare proof-of-work and proof-of-stake at a high level.",
      "Recognize wallet, key, and smart-contract security boundaries.",
    ],
    lessons: [
      {
        id: "ledger-basics",
        title: "Ledgers, blocks, and hashes",
        minutes: 18,
        summary:
          "Learn how blocks link records together and why hashes are integrity signals rather than magic security guarantees.",
        objectives: [
          "Describe a distributed ledger.",
          "Explain hash-linked records.",
          "Separate integrity from correctness of the original input.",
        ],
        body: [
          "A blockchain is a replicated ledger whose participants follow rules for ordering and validating state changes.",
          "Hash functions make changes detectable: altering historical data changes the resulting digest and breaks the expected chain of references.",
          "Immutability does not mean every recorded claim is true. A ledger can preserve bad input just as reliably as good input, so trustworthy applications still need validation and clear data provenance.",
        ],
      },
      {
        id: "consensus",
        title: "Consensus and finality",
        minutes: 20,
        summary:
          "Compare common consensus approaches and learn why finality, decentralization, and throughput involve tradeoffs.",
        objectives: [
          "Explain the purpose of consensus.",
          "Compare proof-of-work and proof-of-stake.",
          "Understand that confirmation and finality vary by network.",
        ],
        body: [
          "Consensus is the process a distributed network uses to agree on the valid ordering of state changes.",
          "Proof-of-work ties block production to computational work; proof-of-stake ties participation to protocol-defined stake and validator rules.",
          "Different systems make different tradeoffs. Confirmation counts, validator assumptions, network conditions, and protocol design all affect when an application should treat an event as final.",
        ],
      },
      {
        id: "wallet-security",
        title: "Wallets, keys, and contract risk",
        minutes: 22,
        summary:
          "Understand signing, custody, recovery, and why a wallet UI should never imply transaction execution that it cannot prove.",
        objectives: [
          "Distinguish public addresses from private signing keys.",
          "Explain custody and recovery responsibilities.",
          "Identify smart-contract and transaction approval risks.",
        ],
        body: [
          "A wallet address can be shared publicly; a private key or recovery secret controls signing authority and must be protected.",
          "Custodial systems hold signing authority for users, while self-custody systems place that responsibility on the user. Each model changes recovery, support, and security obligations.",
          "A transaction button is not proof that a blockchain transaction occurred. Production software should distinguish draft, signed, broadcast, confirmed, and failed states using evidence from the actual network/provider.",
        ],
      },
    ],
    quiz: {
      passingScore: 70,
      questions: [
        {
          id: "bf-q1",
          prompt: "What does a cryptographic hash primarily help an application detect?",
          options: [
            "Whether the original claim was truthful",
            "Whether data changed",
            "Whether a user owns cryptocurrency",
            "Whether a regulator approved a transaction",
          ],
          correctIndex: 1,
          explanation:
            "Hashes are useful integrity signals because changed input produces a different digest; they do not prove the original input was truthful.",
        },
        {
          id: "bf-q2",
          prompt: "What is the purpose of a consensus mechanism?",
          options: [
            "To guarantee investment returns",
            "To help distributed participants agree on valid ordered state",
            "To replace all application authentication",
            "To encrypt every public transaction",
          ],
          correctIndex: 1,
          explanation:
            "Consensus coordinates agreement about valid state and ordering across participants.",
        },
        {
          id: "bf-q3",
          prompt: "Which item should never be exposed as public profile data?",
          options: ["Wallet address", "Block height", "Private signing key", "Transaction hash"],
          correctIndex: 2,
          explanation:
            "Private signing keys authorize transactions and must remain secret.",
        },
        {
          id: "bf-q4",
          prompt: "Which statement is the most accurate about transaction status?",
          options: [
            "A clicked Send button proves settlement",
            "A locally generated ID proves broadcast",
            "Applications should distinguish draft, broadcast, confirmation, and failure states",
            "All networks have identical finality",
          ],
          correctIndex: 2,
          explanation:
            "A trustworthy product reports transaction lifecycle states based on real provider/network evidence.",
        },
        {
          id: "bf-q5",
          prompt: "What does blockchain immutability NOT guarantee?",
          options: [
            "Historical changes are easier to detect",
            "Every recorded input was correct",
            "Participants can verify linked records",
            "State history can be replicated",
          ],
          correctIndex: 1,
          explanation:
            "A ledger can preserve incorrect input, so validation and provenance still matter.",
        },
      ],
    },
  },
  {
    id: "hopeai-literacy",
    title: "Practical AI & HopeAI Literacy",
    category: "AI",
    level: "Beginner",
    description:
      "Learn how to work with AI assistants productively, verify uncertain answers, protect private information, and design useful prompts.",
    outcomes: [
      "Write task-focused prompts with useful context and constraints.",
      "Recognize hallucination, uncertainty, and tool/provider boundaries.",
      "Use AI as an assistant without treating it as hidden surveillance or an infallible authority.",
    ],
    lessons: [
      {
        id: "prompting",
        title: "Give context, goals, and constraints",
        minutes: 16,
        summary:
          "Turn vague requests into useful tasks by specifying the desired outcome, audience, source material, and constraints.",
        objectives: [
          "State a concrete goal.",
          "Provide relevant context.",
          "Ask for a format that matches the task.",
        ],
        body: [
          "Useful prompts describe what success looks like. Include the task, relevant background, constraints, and the desired output format.",
          "More context is not always better. Share only information that helps the task, especially when personal or confidential data is involved.",
          "For complex work, ask the assistant to identify assumptions and to separate verified facts from suggestions or inference.",
        ],
      },
      {
        id: "verification",
        title: "Verification and uncertainty",
        minutes: 18,
        summary:
          "Learn when an AI answer needs source checking, testing, or human review.",
        objectives: [
          "Identify claims that need current sources.",
          "Treat generated code as untrusted until tested.",
          "Recognize confident language is not proof.",
        ],
        body: [
          "AI systems can generate plausible but incorrect details. Confidence of wording is not evidence of correctness.",
          "Current facts, legal requirements, prices, security guidance, and production code deserve verification against authoritative sources or tests.",
          "A good workflow asks what evidence supports the answer and what remains uncertain before taking consequential action.",
        ],
      },
      {
        id: "privacy",
        title: "Privacy and healthy AI boundaries",
        minutes: 15,
        summary:
          "Understand what an assistant can infer from the conversation and why it should not claim access to thoughts, devices, or hidden signals without evidence.",
        objectives: [
          "Avoid sharing unnecessary secrets.",
          "Separate conversational context from hidden access claims.",
          "Know when a human specialist is needed.",
        ],
        body: [
          "An assistant can reason from information you provide and from tools it is explicitly allowed to use. It should not claim secret access to your thoughts, device, private accounts, or surroundings.",
          "Do not paste passwords, recovery phrases, private keys, or unrelated confidential records into an AI prompt.",
          "For medical, legal, financial, or safety-critical decisions, AI can help organize questions and information, but qualified human review may still be important.",
        ],
      },
    ],
    quiz: {
      passingScore: 70,
      questions: [
        {
          id: "ai-q1",
          prompt: "Which prompt usually gives an assistant the clearest task?",
          options: [
            "Do stuff",
            "Make it better somehow",
            "Summarize these notes for a project update in five bullets and flag uncertain claims",
            "Guess what I want",
          ],
          correctIndex: 2,
          explanation:
            "A useful prompt states the task, source/context, format, and an uncertainty requirement.",
        },
        {
          id: "ai-q2",
          prompt: "What should you do with generated production code?",
          options: [
            "Deploy it immediately",
            "Treat it as correct if it sounds confident",
            "Review and test it before relying on it",
            "Disable all tests to save time",
          ],
          correctIndex: 2,
          explanation:
            "Generated code should be reviewed and tested like other untrusted changes.",
        },
        {
          id: "ai-q3",
          prompt: "Which information should not be pasted into an AI chat?",
          options: [
            "A public documentation link",
            "A recovery phrase or private key",
            "A generic code example",
            "A course topic",
          ],
          correctIndex: 1,
          explanation:
            "Recovery phrases and private keys are secrets that can control assets or accounts.",
        },
        {
          id: "ai-q4",
          prompt: "What does confident wording from an AI prove?",
          options: [
            "The answer is definitely true",
            "The answer was legally reviewed",
            "Nothing by itself; evidence still matters",
            "The model accessed hidden private data",
          ],
          correctIndex: 2,
          explanation:
            "Style and confidence are not substitutes for sources, tests, or other evidence.",
        },
        {
          id: "ai-q5",
          prompt: "Which boundary is appropriate for an AI assistant?",
          options: [
            "Claiming it can read thoughts from typing pauses",
            "Claiming secret access to devices",
            "Using only shared context and explicitly available tools",
            "Inventing private facts to sound helpful",
          ],
          correctIndex: 2,
          explanation:
            "The assistant should ground its help in supplied context and authorized tools, not hidden-access claims.",
        },
      ],
    },
  },
  {
    id: "software-engineering-beta",
    title: "Building a Dependable Software Beta",
    category: "Software Engineering",
    level: "Intermediate",
    description:
      "Move from feature-heavy prototypes to dependable beta software using contracts, tests, observability, failure handling, and release evidence.",
    outcomes: [
      "Separate UI claims from verified backend capability.",
      "Design deterministic tests around critical state changes.",
      "Use CI, staging, rollback, and observability as release evidence.",
    ],
    lessons: [
      {
        id: "contracts",
        title: "Capability contracts before UI claims",
        minutes: 20,
        summary:
          "Define what a feature actually guarantees before presenting it as finished.",
        objectives: [
          "Identify fake-success paths.",
          "Define fail-closed behavior.",
          "Keep beta limitations visible.",
        ],
        body: [
          "A feature is not complete because a screen exists. The server contract, persistence model, authorization rules, failure behavior, and evidence should match the UI language.",
          "When a provider or persistence layer is missing, fail-closed responses are safer than fabricated success.",
          "Product copy should distinguish preview, demo, engineering beta, and verified live capability so users know what the system actually does.",
        ],
      },
      {
        id: "tests",
        title: "Test state, ownership, and idempotency",
        minutes: 22,
        summary:
          "Focus tests on business invariants rather than only rendering or happy-path responses.",
        objectives: [
          "Test authorization boundaries.",
          "Verify persistence across restart.",
          "Protect duplicate-sensitive actions.",
        ],
        body: [
          "Critical tests should verify who owns state, what survives process restarts, and how duplicate requests are handled.",
          "Idempotency prevents retries or double-clicks from creating duplicate financial, social, or provisioning state.",
          "A green test should prove a meaningful invariant, not simply confirm that a mocked function returned success.",
        ],
      },
      {
        id: "release",
        title: "CI, staging, rollback, and observability",
        minutes: 24,
        summary:
          "Build a release process where the exact code being shipped has measurable evidence.",
        objectives: [
          "Require exact-head CI.",
          "Verify the deployed release identity.",
          "Practice rollback and monitor failures.",
        ],
        body: [
          "Exact-head CI prevents a passing run from an older commit from being reused as evidence for newer untested code.",
          "Staging should prove health, readiness, persistence, external-provider failure behavior, and release identity in an environment close to production.",
          "Observability and rollback matter because some failures only appear after deployment. A dependable beta needs a way to detect problems and recover safely.",
        ],
      },
    ],
    quiz: {
      passingScore: 70,
      questions: [
        {
          id: "se-q1",
          prompt: "What is an example of a fake-success path?",
          options: [
            "Returning not_configured when a provider is missing",
            "Returning success even though no state was persisted",
            "Rejecting an unauthorized mutation",
            "Testing a database restart",
          ],
          correctIndex: 1,
          explanation:
            "Success should mean the promised state change actually happened.",
        },
        {
          id: "se-q2",
          prompt: "Why is idempotency important?",
          options: [
            "It makes fonts load faster",
            "It prevents duplicate-sensitive retries from applying the same action twice",
            "It removes the need for authentication",
            "It guarantees zero bugs",
          ],
          correctIndex: 1,
          explanation:
            "Idempotency protects state when clients retry or users repeat an action.",
        },
        {
          id: "se-q3",
          prompt: "What does exact-head CI prove?",
          options: [
            "An older commit passed",
            "The exact tested commit passed the configured gates",
            "Production will never fail",
            "Every external provider is available",
          ],
          correctIndex: 1,
          explanation:
            "Exact-head evidence ties CI results to the precise commit under review.",
        },
        {
          id: "se-q4",
          prompt: "What should happen when a required external provider is not configured?",
          options: [
            "Invent a successful response",
            "Silently credit the user anyway",
            "Fail closed or report not_configured",
            "Disable logging",
          ],
          correctIndex: 2,
          explanation:
            "Fail-closed behavior avoids telling users an action happened when it did not.",
        },
        {
          id: "se-q5",
          prompt: "Why practice rollback before release?",
          options: [
            "To avoid version control",
            "To prove the team can recover from a bad deployment",
            "To skip monitoring",
            "To remove the need for backups",
          ],
          correctIndex: 1,
          explanation:
            "Rollback evidence proves there is a tested recovery path when a release causes problems.",
        },
      ],
    },
  },
  {
    id: "community-and-charity-safety",
    title: "Community & Charity Product Safety",
    category: "Community",
    level: "Beginner",
    description:
      "Design social and charitable-product experiences that distinguish community engagement from verified donations, governance, identity, and settlement.",
    outcomes: [
      "Recognize when donation and governance claims require external evidence.",
      "Design safer social interactions with clear reporting and identity boundaries.",
      "Avoid presenting previews, rankings, or sample impact data as verified history.",
    ],
    lessons: [
      {
        id: "charity-truth",
        title: "Donation and impact claims",
        minutes: 17,
        summary:
          "Learn why donation settlement, recipient identity, fees, tax status, and impact reporting must be verified separately.",
        objectives: [
          "Separate donation intent from settlement.",
          "Avoid unsupported 100% or on-chain verification claims.",
          "Label preview impact data clearly.",
        ],
        body: [
          "A donation form can collect intent, but a real charitable contribution also requires a verified payment path, recipient, accounting record, and applicable disclosures.",
          "Claims such as '100% goes to the cause' or 'on-chain verified' need evidence about fees, custody, settlement, and the destination organization.",
          "Sample campaigns, leaderboards, and impact statistics should be labeled as examples until backed by verified records.",
        ],
      },
      {
        id: "social-integrity",
        title: "Social identity and engagement integrity",
        minutes: 18,
        summary:
          "Build feeds where likes, follows, trends, and profiles come from persisted state rather than invented popularity.",
        objectives: [
          "Derive engagement counts from persisted records.",
          "Avoid fake followers and trending metrics.",
          "Respect ownership and authorization boundaries.",
        ],
        body: [
          "Popularity signals influence user trust. Follower counts, likes, and trending tags should come from real persisted actions or be clearly labeled as preview data.",
          "Authorization matters for editing, deleting, and private interactions. The server—not only the UI—should enforce ownership.",
          "Social products should handle empty communities honestly instead of filling the screen with invented users or engagement.",
        ],
      },
      {
        id: "moderation",
        title: "Moderation and reporting boundaries",
        minutes: 18,
        summary:
          "Understand reporting, moderation queues, and why automated moderation should not pretend to be a final adjudicator.",
        objectives: [
          "Separate user reports from confirmed violations.",
          "Keep moderation actions auditable.",
          "Use automation as decision support when appropriate.",
        ],
        body: [
          "A report is an allegation or signal, not proof by itself. Systems should preserve status and reviewer context rather than automatically labeling a user guilty.",
          "High-impact moderation actions benefit from audit logs, clear reasons, and consistent authorization.",
          "Automated classifiers can help prioritize review, but their uncertainty and error rates should be considered before irreversible actions.",
        ],
      },
    ],
    quiz: {
      passingScore: 70,
      questions: [
        {
          id: "cc-q1",
          prompt: "What does a submitted donation form prove by itself?",
          options: [
            "The charity received funds",
            "A user expressed donation intent",
            "The donation is tax deductible",
            "No fees were charged",
          ],
          correctIndex: 1,
          explanation:
            "Submission records intent; settlement, recipient status, fees, and tax treatment require separate evidence.",
        },
        {
          id: "cc-q2",
          prompt: "Where should social follower counts come from?",
          options: [
            "Hard-coded marketing numbers",
            "Random values",
            "Persisted follow relationships",
            "A design mock",
          ],
          correctIndex: 2,
          explanation:
            "Engagement metrics should reflect actual persisted actions.",
        },
        {
          id: "cc-q3",
          prompt: "What is a user report?",
          options: [
            "Automatic proof of wrongdoing",
            "A signal or allegation that may require review",
            "A final legal judgment",
            "A verified identity document",
          ],
          correctIndex: 1,
          explanation:
            "Reports are inputs to a review process, not proof on their own.",
        },
        {
          id: "cc-q4",
          prompt: "When is '100% goes directly to the cause' a safe claim?",
          options: [
            "Whenever the UI says so",
            "Only when fees, settlement, recipient, and accounting evidence support it",
            "Whenever crypto is involved",
            "Whenever a campaign is popular",
          ],
          correctIndex: 1,
          explanation:
            "That claim requires evidence about the full money flow and fees.",
        },
        {
          id: "cc-q5",
          prompt: "What is the safest way to show sample campaign rankings?",
          options: [
            "Label them as verified live results",
            "Hide where the numbers came from",
            "Label them as preview/example data",
            "Add more decimal places",
          ],
          correctIndex: 2,
          explanation:
            "Preview labeling prevents example data from being mistaken for verified history.",
        },
      ],
    },
  },
];

const byId = new Map(COURSES.map(course => [course.id, course]));

export function listCourseSummaries() {
  return COURSES.map(course => ({
    id: course.id,
    title: course.title,
    category: course.category,
    level: course.level,
    description: course.description,
    outcomes: course.outcomes,
    lessonCount: course.lessons.length,
    totalMinutes: course.lessons.reduce(
      (total, lesson) => total + lesson.minutes,
      0
    ),
    quizQuestions: course.quiz.questions.length,
    passingScore: course.quiz.passingScore,
  }));
}

export function getPublicCourse(
  courseId: string
): PublicCurriculumCourse | null {
  const course = byId.get(courseId);
  if (!course) return null;

  return {
    id: course.id,
    title: course.title,
    category: course.category,
    level: course.level,
    description: course.description,
    outcomes: [...course.outcomes],
    lessons: course.lessons.map(lesson => ({
      ...lesson,
      objectives: [...lesson.objectives],
      body: [...lesson.body],
    })),
    quiz: {
      passingScore: course.quiz.passingScore,
      questions: course.quiz.questions.map(question => ({
        id: question.id,
        prompt: question.prompt,
        options: [...question.options],
      })),
    },
  };
}

export function gradeCourseQuiz(
  courseId: string,
  answers: QuizAnswer[]
): QuizGrade | null {
  const course = byId.get(courseId);
  if (!course) return null;

  const answerMap = new Map(
    answers.map(answer => [answer.questionId, answer.optionIndex])
  );
  const results = course.quiz.questions.map(question => {
    const selectedIndex = answerMap.has(question.id)
      ? answerMap.get(question.id)!
      : null;
    const correct =
      selectedIndex !== null && selectedIndex === question.correctIndex;

    return {
      questionId: question.id,
      selectedIndex,
      correctIndex: question.correctIndex,
      correct,
      explanation: question.explanation,
    };
  });

  const correct = results.filter(result => result.correct).length;
  const total = results.length;
  const score = total === 0 ? 0 : Math.round((correct / total) * 100);

  return {
    courseId,
    score,
    passed: score >= course.quiz.passingScore,
    correct,
    total,
    results,
  };
}
