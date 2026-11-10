export type DRBLevel = 'L1' | 'L2' | 'L3' | 'HORIZONTAL';

export type TopicStatus =
  | 'DRAFT'
  | 'PENDING_ACCEPTANCE'
  | 'PREPARING'
  | 'REVIEWING'
  | 'DECISION_PENDING'
  | 'CONDITIONAL_PASS'
  | 'PASSED'
  | 'REJECTED'
  | 'ESCALATED'
  | 'REMEDIATING'
  | 'VERIFYING'
  | 'CLOSED';

export type ReviewType =
  | '总体架构评审'
  | '产品架构评审'
  | '技术方案评审'
  | '详细技术设计评审'
  | '技术选型评审'
  | '安全架构评审'
  | '性能与可靠性评审'
  | '数据架构评审'
  | 'AI应用工程评审'
  | '技术例外审批'
  | '技术风险专项评审';

export type ImpactScope =
  | '单模块'
  | '单产品'
  | '单产品族'
  | '跨产品族'
  | '企业级';

export type RiskLevel = 'R1' | 'R2' | 'R3' | 'R4'; // R1: 重大, R2: 较重, R3: 一般, R4: 低
export type SeverityLevel = 'P0' | 'P1' | 'P2' | 'P3'; // P0: 阻断, P1: 严重, P2: 一般, P3: 建议

export type VoteOption = 'AGREE' | 'CONDITIONAL' | 'OPPOSE' | 'DEFER' | 'ABSTAIN';

export interface UserPersona {
  id: string;
  name: string;
  title: string;
  department: string;
  avatarText: string;
  role: 'L1_CHAIR' | 'L2_SECRETARY' | 'SECURITY_EXPERT' | 'TOPIC_OWNER' | 'COMMITTEE_MEMBER' | 'ADMIN';
  roleLabel: string;
  drbAffiliations: string[];
}

export interface SystemUser {
  id: string;
  employeeNo: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  avatarText: string;
  department: string;
  productFamily: string;
  jobTitle: string;
  technicalLevel: string; // T10, T9, T8, T7...
  roleCodes: string[];
  roleLabels: string[];
  drbAppointments: {
    drbId: string;
    drbName: string;
    drbRole: string;
    termPeriod: string;
    status: 'ACTIVE' | 'EXPIRED';
  }[];
  ssoSource: 'LDAP_AD' | 'FEISHU_SSO' | 'WECHAT_WORK' | 'LOCAL_ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  lastLoginAt: string;
}

export interface GovernancePermission {
  code: string;
  name: string;
  category: 'TOPIC_MANAGEMENT' | 'MEETING_VOTING' | 'DECISION_ADR' | 'REMEDIATION_VERIFICATION' | 'SYSTEM_AUTH';
  categoryLabel: string;
  description: string;
}

export type WorkspaceMode = 'BUSINESS' | 'ADMIN';

export type AdminNavKey =
  | 'admin-users'
  | 'admin-roles'
  | 'admin-drb'
  | 'admin-appointments'
  | 'admin-audit';

export interface AuditLogRecord {
  id: string;
  eventType: 'USER_SYNC' | 'USER_CREATE' | 'ROLE_ASSIGN' | 'PERM_UPDATE' | 'STATUS_TOGGLE' | 'APPOINTMENT_CHANGE' | 'DECISION_SIGN' | 'RULE_ENFORCE';
  eventTypeName: string;
  operatorId: string;
  operatorName: string;
  operatorRole: string;
  targetEntity: string;
  detail: string;
  clientIp: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'CRITICAL';
}

export interface GovernanceRole {
  id: string;
  code: string;
  name: string;
  scopeLevel: 'L1_CORP' | 'L2_FAMILY' | 'L3_PRODUCT' | 'HORIZONTAL' | 'SYSTEM';
  description: string;
  isPreset: boolean;
  userCount: number;
  permissions: string[];
}

export interface DRBOrg {
  id: string;
  code: string;
  name: string;
  level: DRBLevel;
  parentId?: string;
  parentName?: string;
  scope: string;
  productFamily?: string;
  chairPerson: string;
  viceChairPerson?: string;
  secretary: string;
  charterVersion: string;
  charterSummary: string;
  activeMemberCount: number;
  allowedReviewTypes: ReviewType[];
  decisionAuthority: string;
  escalationTriggers: string[];
}

export interface DRBMember {
  id: string;
  drbId: string;
  personId: string;
  name: string;
  department: string;
  drbRole: 'CHAIR' | 'VICE_CHAIR' | 'SECRETARY' | 'COMMITTEE_MEMBER' | 'SPECIAL_EXPERT';
  termStart: string;
  termEnd: string;
  voteRight: boolean;
  status: 'ACTIVE' | 'EXPIRED' | 'PAUSED';
}

export interface ExpertProfile {
  id: string;
  personId: string;
  name: string;
  department: string;
  title: string;
  domains: string[]; // 总体架构, 安全架构, AI工程, 性能高可用, 数据架构
  techTags: string[];
  capabilityLevel: 'L1_CHIEF' | 'L2_SENIOR' | 'L3_STAFF';
  qualification: string;
  validUntil: string;
  reviewCount: number;
  criticalRisksFound: number;
  status: 'ACTIVE' | 'BUSY' | 'ON_LEAVE';
  currentLoad: number; // e.g. 2 active reviews
}

export interface AuthorizationPolicy {
  id: string;
  drbId: string;
  drbName: string;
  allowedTopicScope: ImpactScope[];
  maxRiskLevel: RiskLevel;
  canReview: boolean;
  canVote: boolean;
  canFormalDecide: boolean;
  canApproveException: boolean;
  mandatoryEscalationRules: string[];
  effectiveDate: string;
  expiryDate: string;
  version: string;
}

export interface MaterialSnapshot {
  id: string;
  title: string;
  version: string;
  hash: string;
  size: string;
  frozenAt: string;
  uploader: string;
  url: string;
}

export interface ReviewSession {
  id: string;
  topicId: string;
  roundNo: number;
  drbId: string;
  drbName: string;
  scheduledTime: string;
  location: string;
  meetingLink: string;
  status: 'PREPARING' | 'PRE_REVIEW' | 'IN_SESSION' | 'VOTING' | 'CONCLUDED';
  chairPerson: string;
  secretary: string;
  presenter: string;
  materialSnapshot: MaterialSnapshot[];
  agendas: { time: string; title: string; speaker: string }[];
  attendeesCount: number;
  quorumMet: boolean;
}

export interface ReviewBallot {
  id: string;
  sessionId: string;
  topicId: string;
  roundNo: number;
  mode: 'ANONYMOUS' | 'PUBLIC';
  quorumRequired: string; // e.g. "2/3 (67%)"
  approvalThreshold: string; // e.g. "2/3 (67%)"
  status: 'OPEN' | 'CLOSED' | 'SEALED';
  totalEligibleVoters: number;
  votedCount: number;
  results: {
    agree: number;
    conditional: number;
    oppose: number;
    defer: number;
    abstain: number;
  };
  passedQuorum: boolean;
  passedThreshold: boolean;
  calculatedOutcome: 'PASS' | 'CONDITIONAL_PASS' | 'REJECT' | 'PENDING';
}

export interface IndividualVote {
  id: string;
  ballotId: string;
  voterId: string;
  voterName: string;
  option: VoteOption;
  reason?: string;
  timestamp: string;
  isValid: boolean;
}

export interface ReviewComment {
  id: string;
  code: string;
  topicId: string;
  sessionId: string;
  authorId: string;
  authorName: string;
  authorDomain: string;
  severity: SeverityLevel;
  isFormalIssue: boolean; // 是否转为正式整改问题
  description: string;
  evidence: string;
  referenceDocSection: string;
  remediationRequirement?: string;
  acceptanceCriteria?: string;
  assigneeName?: string;
  verifierName?: string;
  dueDate?: string;
  status: 'OPEN' | 'ASSIGNED' | 'REMEDIATING' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'RISK_ACCEPTED' | 'CLOSED';
}

export interface ActionVerification {
  id: string;
  commentId: string;
  topicId: string;
  assigneeSolution: string;
  evidenceUrl: string;
  evidenceType: 'PR_LINK' | 'TEST_REPORT' | 'DOC_DIFF' | 'SECURITY_SCAN';
  submittedAt: string;
  verifierName: string;
  verificationResult?: 'PASSED' | 'REJECTED';
  verifierNotes?: string;
  verifiedAt?: string;
}

export interface RiskAcceptance {
  id: string;
  topicId: string;
  commentId: string;
  riskSummary: string;
  riskImpact: string;
  justification: string;
  mitigationMeasures: string;
  riskOwner: string;
  approverName: string;
  expiryDate: string;
  reEvaluationTrigger: string;
  status: 'APPROVED' | 'EXPIRED' | 'RE_EVALUATED';
}

export interface ReviewDecision {
  id: string;
  code: string;
  topicId: string;
  topicCode: string;
  sessionId: string;
  roundNo: number;
  decisionType: 'PASSED' | 'CONDITIONAL_PASS' | 'REJECTED' | 'DEFERRED' | 'EXCEPTION_APPROVED';
  conclusionText: string;
  basis: string;
  keyDisputes: string;
  mandatoryConditions: string[];
  acceptedRisks: RiskAcceptance[];
  signatoryName: string;
  signatoryTitle: string;
  authorityReference: string;
  version: string;
  publishedAt: string;
  adrId?: string;
}

export interface ADRRecord {
  id: string;
  code: string;
  title: string;
  status: 'ACCEPTED' | 'PROPOSED' | 'SUPERSEDED' | 'DEPRECATED';
  topicCode: string;
  author: string;
  date: string;
  context: string;
  consideredOptions: { name: string; pros: string; cons: string }[];
  decisionRationale: string;
  consequencesPositive: string[];
  consequencesNegative: string[];
  signOffDrb: string;
}

export interface ReviewTopic {
  id: string;
  code: string;
  title: string;
  type: ReviewType;
  productFamily: string;
  productName: string;
  moduleName?: string;
  creatorName: string;
  ownerName: string;
  level: DRBLevel;
  currentDrbId: string;
  currentDrbName: string;
  status: TopicStatus;
  riskLevel: RiskLevel;
  impactScope: ImpactScope;
  expectedDate: string;
  currentRound: number;
  background: string;
  objective: string;
  reviewAppeals: string;
  routingReason?: string;
  escalatedFromDrb?: string;
  escalationReason?: string;
  materials: MaterialSnapshot[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  historyTimeline: {
    time: string;
    operator: string;
    action: string;
    details: string;
  }[];
}

// ==========================================
// 4 大演进优化专属类型定义 (Optimizations)
// ==========================================

// 1. 生产故障与DRB决策双向倒查追踪模型
export interface IncidentRecord {
  id: string;
  code: string;
  title: string;
  severity: 'P1' | 'P2' | 'P3';
  incidentDate: string;
  durationMinutes: number;
  affectedServices: string[];
  impactDescription: string;
  rootCause: string;
  relatedTopicId: string;
  relatedTopicCode: string;
  relatedAdrCode: string;
  traceabilityResult: {
    wasIdentifiedInReview: boolean;
    reviewFindingCode?: string;
    warningExpert?: string;
    expertOriginalOpinion?: string;
    compromiseReason?: string;
    classification: 'PRE_WARNED_BUT_COMPROMISED' | 'REVIEW_BLIND_SPOT' | 'UNAUTHORIZED_DEVIATION';
    governanceFeedbackAction: string;
    ruleEvolutionCode: string;
    ruleEvolutionStatus: 'PROPOSED' | 'ENFORCED';
  };
}

// 2. 跨产品族 ADR 依赖拓扑图谱与变更推演模型
export type ADRRelationType = 'DEPENDS_ON' | 'SUPERSEDES' | 'CONSTRAINED_BY' | 'CONFLICTS_WITH';

export interface ADRDependencyLink {
  targetAdrCode: string;
  targetTitle: string;
  relationType: ADRRelationType;
  description: string;
}

export interface ADRDependencyNode {
  adrCode: string;
  title: string;
  status: 'ACCEPTED' | 'PROPOSED' | 'SUPERSEDED' | 'DEPRECATED';
  domain: string;
  level: DRBLevel;
  ownerProductFamily: string;
  dependencies: ADRDependencyLink[];
  downstreamCount: number;
  impactedServices: string[];
  riskWeight: number; // 1-10
}

// 3. AI 申报材料合规初审与红线静态度量模型
export interface AIPreReviewFinding {
  id: string;
  category: '安全合规' | '高可用容灾' | '数据一致性' | 'Agent与AI工程';
  severity: SeverityLevel;
  title: string;
  detail: string;
  ruleReference: string;
  documentSection: string;
  suggestedQuestion: string;
  isImportedAsOfficialComment: boolean;
}

export interface AIPreReviewReport {
  topicId: string;
  scanTimestamp: string;
  overallScore: number; // 0 - 100
  riskSummary: string;
  radarScores: {
    domain: string;
    score: number;
    maxScore: number;
    status: 'PASS' | 'WARN' | 'FAIL';
  }[];
  findings: AIPreReviewFinding[];
  positiveHighlights: string[];
}

// 4. 专家评审履职贡献与信用评级激励模型
export interface ExpertBadge {
  id: string;
  name: string;
  level: 'GOLD' | 'SILVER' | 'BRONZE';
  description: string;
  dateGranted: string;
}

export interface ExpertCreditProfile {
  expertId: string;
  name: string;
  title: string;
  department: string;
  creditScore: number; // 0 - 100
  attendanceRate: number; // %
  criticalCatchRate: number; // %
  verificationSlaRate: number; // %
  totalCommentsAdoptedCount: number;
  badges: ExpertBadge[];
  weeklyReviewHours: number;
  maxWeeklyHours: number;
  loadStatus: 'HEALTHY' | 'MODERATE' | 'OVERLOAD';
  careerRecommendation: string;
}

