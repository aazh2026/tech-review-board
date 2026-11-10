import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  UserPersona,
  DRBOrg,
  ExpertProfile,
  AuthorizationPolicy,
  ReviewTopic,
  ReviewSession,
  ReviewBallot,
  IndividualVote,
  ReviewComment,
  ActionVerification,
  ReviewDecision,
  ADRRecord,
  VoteOption,
  SeverityLevel,
  IncidentRecord,
  ADRDependencyNode,
  AIPreReviewReport,
  ExpertCreditProfile,
  SystemUser,
  GovernanceRole,
  GovernancePermission,
  WorkspaceMode,
  AdminNavKey,
  AuditLogRecord,
} from '../types';
import {
  USER_PERSONAS,
  INITIAL_DRB_ORGS,
  INITIAL_AUTHORIZATION_POLICIES,
  INITIAL_EXPERTS,
  INITIAL_TOPICS,
  FLAGSHIP_TOPIC,
  FLAGSHIP_SESSION,
  FLAGSHIP_BALLOT,
  FLAGSHIP_VOTES,
  FLAGSHIP_COMMENTS,
  FLAGSHIP_VERIFICATION,
  FLAGSHIP_DECISION,
  FLAGSHIP_ADR,
  INITIAL_INCIDENTS,
  INITIAL_ADR_GRAPH,
  INITIAL_AI_SCAN_REPORT,
  INITIAL_EXPERT_CREDITS,
  INITIAL_SYSTEM_USERS,
  INITIAL_ROLES,
  INITIAL_PERMISSIONS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';

export type ActiveNavKey =
  | 'workbench'
  | 'topics'
  | 'incidents'
  | 'adr-graph'
  | 'decisions'
  | 'drb'
  | 'experts'
  | 'meeting'
  | 'comments'
  | 'analytics';

interface GovernanceContextType {
  workspaceMode: WorkspaceMode;
  setWorkspaceMode: (mode: WorkspaceMode) => void;
  adminNav: AdminNavKey;
  setAdminNav: (nav: AdminNavKey) => void;
  auditLogs: AuditLogRecord[];
  logAuditEvent: (event: {
    eventType: AuditLogRecord['eventType'];
    eventTypeName: string;
    targetEntity: string;
    detail: string;
    level: 'INFO' | 'WARN' | 'CRITICAL';
  }) => void;

  currentPersona: UserPersona;
  setCurrentPersona: (p: UserPersona) => void;
  activeNav: ActiveNavKey;
  setActiveNav: (nav: ActiveNavKey) => void;
  selectedTopicId: string | null;
  setSelectedTopicId: (id: string | null) => void;
  activeDetailTab: string;
  setActiveDetailTab: (tab: string) => void;

  // Domain state
  topics: ReviewTopic[];
  drbOrgs: DRBOrg[];
  experts: ExpertProfile[];
  policies: AuthorizationPolicy[];
  session: ReviewSession;
  ballot: ReviewBallot;
  votes: IndividualVote[];
  comments: ReviewComment[];
  verification: ActionVerification;
  decision: ReviewDecision;
  adr: ADRRecord;

  // 4 大演进优化新增状态 (Optimizations)
  incidents: IncidentRecord[];
  adrGraph: ADRDependencyNode[];
  aiScanReport: AIPreReviewReport;
  expertCredits: ExpertCreditProfile[];

  // 用户管理与角色配置 (RBAC & User Directory)
  users: SystemUser[];
  roles: GovernanceRole[];
  permissions: GovernancePermission[];
  addUser: (userData: Partial<SystemUser>) => void;
  updateUser: (userId: string, data: Partial<SystemUser>) => void;
  toggleUserStatus: (userId: string) => void;
  syncFromEnterpriseDirectory: () => void;
  updateRolePermissions: (roleId: string, permissionCodes: string[]) => void;
  assignUserRoles: (userId: string, roleCodes: string[]) => void;
  switchPersonaByUser: (user: SystemUser) => void;

  // Actions
  addNewTopic: (topic: Partial<ReviewTopic>) => void;
  acceptTopic: (topicId: string, remark?: string) => void;
  returnTopicForRevision: (topicId: string, reason: string) => void;
  startReviewSessionAndFreeze: (topicId: string) => void;
  adjustTopicRouting: (topicId: string, newDrbId: string, reason: string) => void;
  escalateTopic: (topicId: string, reason: string) => void;
  signOfficialDecision: (topicId: string, decisionType: 'PASSED' | 'CONDITIONAL_PASS' | 'REJECTED', conclusionText: string, mandatoryConditions: string[]) => void;
  closeTopic: (topicId: string) => boolean;
  castVote: (option: VoteOption, reason: string) => void;
  submitComment: (newComment: {
    severity: SeverityLevel;
    isFormal: boolean;
    description: string;
    evidence: string;
    section: string;
    assigneeName?: string;
    dueDate?: string;
  }) => void;
  submitRemediation: (commentId: string, solution: string, evidenceUrl: string) => void;
  verifyRemediation: (commentId: string, passed: boolean, verifierNotes: string) => void;
  approveRiskAcceptance: (commentId: string, justification: string) => void;
  publishDecisionRevision: (newConclusion: string) => void;
  getClosureDiagnostic: (topicId: string) => {
    isReady: boolean;
    checks: { label: string; passed: boolean; details: string }[];
  };

  // 4 大演进优化方法
  importAIFindingToComments: (findingId: string) => void;
  enforceRuleFromIncident: (incidentId: string) => void;

  // Metrics helpers
  stats: {
    totalTopics: number;
    pendingReview: number;
    pendingVote: number;
    pendingRemediation: number;
    pendingDecision: number;
    closedCount: number;
    criticalIssuesCount: number;
    closureRate: string;
    escalationRate: string;
  };
}

const GovernanceContext = createContext<GovernanceContextType | null>(null);

export const GovernanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPersona, setCurrentPersona] = useState<UserPersona>(USER_PERSONAS[0]); // Default 张建国 L1 Chair
  const [activeNav, setActiveNav] = useState<ActiveNavKey>('workbench');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(FLAGSHIP_TOPIC.id);
  const [activeDetailTab, setActiveDetailTab] = useState<string>('overview');

  const [topics, setTopics] = useState<ReviewTopic[]>(INITIAL_TOPICS);
  const [drbOrgs] = useState<DRBOrg[]>(INITIAL_DRB_ORGS);
  const [experts] = useState<ExpertProfile[]>(INITIAL_EXPERTS);
  const [policies] = useState<AuthorizationPolicy[]>(INITIAL_AUTHORIZATION_POLICIES);
  const [session, setSession] = useState<ReviewSession>(FLAGSHIP_SESSION);
  const [ballot, setBallot] = useState<ReviewBallot>(FLAGSHIP_BALLOT);
  const [votes, setVotes] = useState<IndividualVote[]>(FLAGSHIP_VOTES);
  const [comments, setComments] = useState<ReviewComment[]>(FLAGSHIP_COMMENTS);
  const [verification, setVerification] = useState<ActionVerification>(FLAGSHIP_VERIFICATION);
  const [decision, setDecision] = useState<ReviewDecision>(FLAGSHIP_DECISION);
  const [adr] = useState<ADRRecord>(FLAGSHIP_ADR);

  // 4 大演进优化专属状态
  const [incidents, setIncidents] = useState<IncidentRecord[]>(INITIAL_INCIDENTS);
  const [adrGraph] = useState<ADRDependencyNode[]>(INITIAL_ADR_GRAPH);
  const [aiScanReport, setAiScanReport] = useState<AIPreReviewReport>(INITIAL_AI_SCAN_REPORT);
  const [expertCredits] = useState<ExpertCreditProfile[]>(INITIAL_EXPERT_CREDITS);

  // 用户管理与法定角色状态
  const [users, setUsers] = useState<SystemUser[]>(INITIAL_SYSTEM_USERS);
  const [roles, setRoles] = useState<GovernanceRole[]>(INITIAL_ROLES);
  const [permissions] = useState<GovernancePermission[]>(INITIAL_PERMISSIONS);

  // 系统管理与业务空间隔离 (Workspace & Admin Mode Separation)
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>('BUSINESS');
  const [adminNav, setAdminNav] = useState<AdminNavKey>('admin-users');
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>(INITIAL_AUDIT_LOGS);

  const logAuditEvent = (event: {
    eventType: AuditLogRecord['eventType'];
    eventTypeName: string;
    targetEntity: string;
    detail: string;
    level: 'INFO' | 'WARN' | 'CRITICAL';
  }) => {
    const newRecord: AuditLogRecord = {
      id: `audit_${Date.now()}`,
      eventType: event.eventType,
      eventTypeName: event.eventTypeName,
      operatorId: currentPersona.id,
      operatorName: currentPersona.name,
      operatorRole: currentPersona.role,
      targetEntity: event.targetEntity,
      detail: event.detail,
      clientIp: '10.240.18.22',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level: event.level,
    };
    setAuditLogs((prev) => [newRecord, ...prev]);
  };

  // Computed metrics
  const stats = useMemo(() => {
    const totalTopics = topics.length;
    const pendingReview = topics.filter((t) => t.status === 'REVIEWING' || t.status === 'PREPARING').length;
    const pendingVote = topics.filter((t) => t.status === 'REVIEWING' && ballot.status === 'OPEN').length || 1;
    const pendingRemediation = comments.filter((c) => c.status === 'REMEDIATING' || c.status === 'ASSIGNED').length;
    const pendingDecision = topics.filter((t) => t.status === 'DECISION_PENDING').length;
    const closedCount = topics.filter((t) => t.status === 'CLOSED').length;
    const criticalIssuesCount = comments.filter((c) => (c.severity === 'P0' || c.severity === 'P1') && c.status !== 'CLOSED' && c.status !== 'VERIFIED').length;
    const closureRate = '82.5%';
    const escalationRate = '14.3%';

    return {
      totalTopics,
      pendingReview,
      pendingVote,
      pendingRemediation,
      pendingDecision,
      closedCount,
      criticalIssuesCount,
      closureRate,
      escalationRate,
    };
  }, [topics, comments, ballot]);

  // Action implementations
  const addNewTopic = (newTopicData: Partial<ReviewTopic>) => {
    const id = `topic_${Date.now()}`;
    const code = `TR-CORP-2026-${String(topics.length + 1).padStart(4, '0')}`;
    const newTopic: ReviewTopic = {
      id,
      code,
      title: newTopicData.title || '新建议题',
      type: newTopicData.type || '总体架构评审',
      productFamily: newTopicData.productFamily || '营销服务产品族',
      productName: newTopicData.productName || '核心产品',
      creatorName: currentPersona.name,
      ownerName: currentPersona.name,
      level: newTopicData.level || 'L2',
      currentDrbId: newTopicData.currentDrbId || 'drb_l2_mkt',
      currentDrbName: newTopicData.currentDrbName || '营销服务产品族DRB',
      status: 'PENDING_ACCEPTANCE',
      riskLevel: newTopicData.riskLevel || 'R2',
      impactScope: newTopicData.impactScope || '单产品族',
      expectedDate: newTopicData.expectedDate || '2026-11-30',
      currentRound: 1,
      background: newTopicData.background || '',
      objective: newTopicData.objective || '',
      reviewAppeals: newTopicData.reviewAppeals || '',
      routingReason: newTopicData.routingReason || '基于向导规则初判推荐',
      materials: newTopicData.materials || [
        {
          id: `mat_${Date.now()}`,
          title: `${newTopicData.title}_技术架构设计_草稿.pdf`,
          version: 'v0.9-draft',
          hash: 'sha256:tmp_initial_draft_hash',
          size: '2.4 MB',
          frozenAt: '未冻结 (草拟阶段)',
          uploader: currentPersona.name,
          url: '#',
        },
      ],
      tags: newTopicData.tags || ['新申报'],
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      historyTimeline: [
        {
          time: new Date().toISOString().replace('T', ' ').substring(0, 16),
          operator: `${currentPersona.name} (${currentPersona.roleLabel})`,
          action: '新建议题并提交受理',
          details: `提交议题 ${code}，申请受理与DRB初审。`,
        },
      ],
    };

    setTopics((prev) => [newTopic, ...prev]);
    setSelectedTopicId(id);
  };

  const acceptTopic = (topicId: string, remark?: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          return {
            ...t,
            status: 'PREPARING',
            historyTimeline: [
              {
                time: new Date().toISOString().replace('T', ' ').substring(0, 16),
                operator: `${currentPersona.name} (DRB秘书)`,
                action: '形式审查通过，正式受理立项',
                details: remark || '申报材料完整，符合准入基线，正式纳入评审排期。',
              },
              ...t.historyTimeline,
            ],
          };
        }
        return t;
      })
    );
  };

  const returnTopicForRevision = (topicId: string, reason: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          return {
            ...t,
            status: 'DRAFT',
            historyTimeline: [
              {
                time: new Date().toISOString().replace('T', ' ').substring(0, 16),
                operator: `${currentPersona.name} (DRB秘书)`,
                action: '形式审查退回，需补充技术材料',
                details: `退回原因：${reason}`,
              },
              ...t.historyTimeline,
            ],
          };
        }
        return t;
      })
    );
  };

  const startReviewSessionAndFreeze = (topicId: string) => {
    const frozenTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const mockHash = 'sha256:' + Math.random().toString(16).substring(2) + '...freeze';

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const updatedMaterials = t.materials.map((m) => ({
            ...m,
            version: `${m.version.split('-')[0]}-freeze`,
            hash: m.hash.includes('pending') ? mockHash : m.hash,
            frozenAt: frozenTimestamp,
          }));

          return {
            ...t,
            status: 'REVIEWING',
            materials: updatedMaterials,
            historyTimeline: [
              {
                time: frozenTimestamp,
                operator: `${currentPersona.name} (DRB组织者)`,
                action: '启动评审会议并冻结材料快照 (BR-017)',
                details: '申报文档版本已锁定并生成SHA-256防篡改哈希，正式开放专家会前预审与现场讨论。',
              },
              ...t.historyTimeline,
            ],
          };
        }
        return t;
      })
    );

    setSession((prev) => ({
      ...prev,
      status: 'IN_SESSION',
    }));
  };

  const adjustTopicRouting = (topicId: string, newDrbId: string, reason: string) => {
    const targetDrb = drbOrgs.find((d) => d.id === newDrbId);
    if (!targetDrb) return;

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          return {
            ...t,
            currentDrbId: targetDrb.id,
            currentDrbName: targetDrb.name,
            level: targetDrb.level,
            routingReason: `由 ${currentPersona.name} 调整路由：${reason}`,
            historyTimeline: [
              {
                time: new Date().toISOString().replace('T', ' ').substring(0, 16),
                operator: `${currentPersona.name} (DRB管理员)`,
                action: `调整评审路由至 ${targetDrb.name}`,
                details: `调整原因：${reason}`,
              },
              ...t.historyTimeline,
            ],
          };
        }
        return t;
      })
    );
  };

  const escalateTopic = (topicId: string, reason: string) => {
    const parentDrb = drbOrgs.find((d) => d.id === 'drb_l1_corp');
    if (!parentDrb) return;

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          return {
            ...t,
            level: 'L1',
            currentDrbId: parentDrb.id,
            currentDrbName: parentDrb.name,
            status: 'ESCALATED',
            escalatedFromDrb: t.currentDrbName,
            escalationReason: reason,
            historyTimeline: [
              {
                time: new Date().toISOString().replace('T', ' ').substring(0, 16),
                operator: `${currentPersona.name}`,
                action: '触发跨级升级 (Escalation to L1)',
                details: `原组织：${t.currentDrbName}，升级原因：${reason}`,
              },
              ...t.historyTimeline,
            ],
          };
        }
        return t;
      })
    );
  };

  const signOfficialDecision = (
    topicId: string,
    decisionType: 'PASSED' | 'CONDITIONAL_PASS' | 'REJECTED',
    conclusionText: string,
    mandatoryConditions: string[]
  ) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setDecision((prev) => ({
      ...prev,
      decisionType,
      conclusionText,
      mandatoryConditions,
      signatoryName: currentPersona.name,
      signatoryTitle: currentPersona.title,
      publishedAt: timestamp,
      version: 'V1.0 (正式生效)',
    }));

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const newStatus =
            decisionType === 'CONDITIONAL_PASS'
              ? 'CONDITIONAL_PASS'
              : decisionType === 'PASSED'
              ? 'PASSED'
              : 'REJECTED';
          return {
            ...t,
            status: newStatus,
            historyTimeline: [
              {
                time: timestamp,
                operator: `${currentPersona.name} (${currentPersona.roleLabel})`,
                action: `签署并发布正式决策书 (${decisionType})`,
                details: conclusionText,
              },
              ...t.historyTimeline,
            ],
          };
        }
        return t;
      })
    );
  };

  const getClosureDiagnostic = (topicId: string) => {
    const targetTopic = topics.find((t) => t.id === topicId) || topics[0];
    const targetComments = comments.filter((c) => c.topicId === topicId);

    const isIntakePassed = targetTopic.status !== 'DRAFT' && targetTopic.status !== 'PENDING_ACCEPTANCE';
    const areMaterialsFrozen = targetTopic.materials.every((m) => m.version.includes('freeze'));
    const isBallotPassed = ballot.passedQuorum && ballot.passedThreshold;
    const isDecisionSigned = Boolean(decision.signatoryName && decision.publishedAt);

    const unverifiedCritical = targetComments.filter(
      (c) =>
        (c.severity === 'P0' || c.severity === 'P1') &&
        c.status !== 'CLOSED' &&
        c.status !== 'VERIFIED' &&
        c.status !== 'RISK_ACCEPTED'
    );
    const areCriticalIssuesClosed = unverifiedCritical.length === 0;

    const checks = [
      {
        label: '议题受理与形式审查',
        passed: isIntakePassed,
        details: isIntakePassed ? '已通过准入形式审查并正式立项' : '待DRB秘书完成形式审查与立项',
      },
      {
        label: '申报材料不可篡改快照冻结 (BR-017)',
        passed: areMaterialsFrozen,
        details: areMaterialsFrozen ? '申报文档已生成SHA-256防篡改指纹' : '材料尚未冻结版本',
      },
      {
        label: '评审表决法定门槛 (BR-022)',
        passed: isBallotPassed,
        details: isBallotPassed ? '实到人数与赞同率均达到2/3法定门槛' : '表决尚未达成法定多数',
      },
      {
        label: '授权决策人签署正式决策 (BR-026)',
        passed: isDecisionSigned,
        details: isDecisionSigned ? `由 ${decision.signatoryName} 完成正式签署` : '待授权决策人完成裁决签署',
      },
      {
        label: '阻断性缺陷(P0/P1)独立验证闭环 (BR-037)',
        passed: areCriticalIssuesClosed,
        details: areCriticalIssuesClosed
          ? '所有阻断性意见已独立验证通过或完成风险接受'
          : `尚有 ${unverifiedCritical.length} 项严重缺陷待独立验证 (如: ${unverifiedCritical[0]?.code})`,
      },
    ];

    const isReady = checks.every((c) => c.passed);
    return { isReady, checks };
  };

  const closeTopic = (topicId: string) => {
    const diagnostic = getClosureDiagnostic(topicId);

    if (!diagnostic.isReady) {
      const blockers = diagnostic.checks.filter((c) => !c.passed).map((c) => c.details).join('；');
      alert(`【规则阻断 (BR-037)】无法关闭议题！存在未达标项：${blockers}`);
      return false;
    }

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          return {
            ...t,
            status: 'CLOSED',
            historyTimeline: [
              {
                time: new Date().toISOString().replace('T', ' ').substring(0, 16),
                operator: `${currentPersona.name} (授权决策人)`,
                action: '议题正式关闭并归档',
                details: '所有强制性前置/后置条件均已验证通过，形成ADR并入库。',
              },
              ...t.historyTimeline,
            ],
          };
        }
        return t;
      })
    );
    return true;
  };

  const castVote = (option: VoteOption, reason: string) => {
    const existingIndex = votes.findIndex((v) => v.voterId === currentPersona.id);
    const newVote: IndividualVote = {
      id: `vote_${Date.now()}`,
      ballotId: ballot.id,
      voterId: currentPersona.id,
      voterName: `${currentPersona.name} (${currentPersona.roleLabel})`,
      option,
      reason,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isValid: true,
    };

    let updatedVotes: IndividualVote[];
    if (existingIndex >= 0) {
      updatedVotes = [...votes];
      updatedVotes[existingIndex] = newVote;
    } else {
      updatedVotes = [...votes, newVote];
    }
    setVotes(updatedVotes);

    // Recompute results
    const results = {
      agree: updatedVotes.filter((v) => v.option === 'AGREE').length,
      conditional: updatedVotes.filter((v) => v.option === 'CONDITIONAL').length,
      oppose: updatedVotes.filter((v) => v.option === 'OPPOSE').length,
      defer: updatedVotes.filter((v) => v.option === 'DEFER').length,
      abstain: updatedVotes.filter((v) => v.option === 'ABSTAIN').length,
    };
    const validCount = results.agree + results.conditional + results.oppose;
    const approvalCount = results.agree + results.conditional;
    const passedQuorum = updatedVotes.length >= 6; // 9 * 2/3 = 6
    const passedThreshold = validCount > 0 && approvalCount / validCount >= 2 / 3;

    let calculatedOutcome: 'PASS' | 'CONDITIONAL_PASS' | 'REJECT' | 'PENDING' = 'PENDING';
    if (passedThreshold) {
      calculatedOutcome = results.conditional > 0 ? 'CONDITIONAL_PASS' : 'PASS';
    } else if (results.oppose > results.agree + results.conditional) {
      calculatedOutcome = 'REJECT';
    }

    setBallot((prev) => ({
      ...prev,
      votedCount: updatedVotes.length,
      results,
      passedQuorum,
      passedThreshold,
      calculatedOutcome,
    }));
  };

  const submitComment = (newComment: {
    severity: SeverityLevel;
    isFormal: boolean;
    description: string;
    evidence: string;
    section: string;
    assigneeName?: string;
    dueDate?: string;
  }) => {
    const code = `ISSUE-CORP-2026-${String(comments.length + 1).padStart(3, '0')}`;
    const commentObj: ReviewComment = {
      id: `cmt_${Date.now()}`,
      code,
      topicId: selectedTopicId || FLAGSHIP_TOPIC.id,
      sessionId: session.id,
      authorId: currentPersona.id,
      authorName: `${currentPersona.name} (${currentPersona.roleLabel})`,
      authorDomain: currentPersona.role === 'SECURITY_EXPERT' ? '安全与合规' : '总体架构',
      severity: newComment.severity,
      isFormalIssue: newComment.isFormal,
      description: newComment.description,
      evidence: newComment.evidence,
      referenceDocSection: newComment.section,
      remediationRequirement: newComment.isFormal ? '请提交整改方案及验证证据' : undefined,
      acceptanceCriteria: newComment.isFormal ? '须经提出人或指定验证人签字确认' : undefined,
      assigneeName: newComment.assigneeName || '李晨',
      verifierName: currentPersona.name,
      dueDate: newComment.dueDate || '2026-11-20',
      status: newComment.isFormal ? 'ASSIGNED' : 'OPEN',
    };

    setComments((prev) => [commentObj, ...prev]);
  };

  const submitRemediation = (commentId: string, solution: string, evidenceUrl: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            status: 'PENDING_VERIFICATION',
          };
        }
        return c;
      })
    );

    setVerification({
      id: `verif_${Date.now()}`,
      commentId,
      topicId: selectedTopicId || FLAGSHIP_TOPIC.id,
      assigneeSolution: solution,
      evidenceUrl,
      evidenceType: 'PR_LINK',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      verifierName: '陆天恒',
    });
  };

  const verifyRemediation = (commentId: string, passed: boolean, verifierNotes: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            status: passed ? 'VERIFIED' : 'REMEDIATING',
          };
        }
        return c;
      })
    );

    setVerification((prev) => ({
      ...prev,
      verificationResult: passed ? 'PASSED' : 'REJECTED',
      verifierNotes,
      verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    }));
  };

  const approveRiskAcceptance = (commentId: string, justification: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            status: 'RISK_ACCEPTED',
          };
        }
        return c;
      })
    );

    const newRisk = {
      id: `risk_${Date.now()}`,
      topicId: selectedTopicId || FLAGSHIP_TOPIC.id,
      commentId,
      riskSummary: `对意见 ${commentId} 的残余风险予以正式接受`,
      riskImpact: '允许在有限期及指定监控下灰度运行',
      justification,
      mitigationMeasures: '强化监控埋点与每周指标回溯',
      riskOwner: '李晨',
      approverName: `${currentPersona.name} (${currentPersona.roleLabel})`,
      expiryDate: '2027-05-31',
      reEvaluationTrigger: '指标异常或大促前复盘',
      status: 'APPROVED' as const,
    };

    setDecision((prev) => ({
      ...prev,
      acceptedRisks: [...prev.acceptedRisks, newRisk],
    }));
  };

  const publishDecisionRevision = (newConclusion: string) => {
    const versionNum = parseInt(decision.version.replace(/[^\d]/g, '') || '1') + 1;
    const newVersionStr = `V${versionNum}.0 (修订发布)`;

    setDecision((prev) => ({
      ...prev,
      version: newVersionStr,
      conclusionText: newConclusion,
      publishedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      signatoryName: currentPersona.name,
      signatoryTitle: currentPersona.title,
    }));
  };

  // 建议 3: AI 初审体检项一键导入为正式评审意见
  const importAIFindingToComments = (findingId: string) => {
    const finding = aiScanReport.findings.find((f) => f.id === findingId);
    if (!finding) return;

    const newComment: ReviewComment = {
      id: `cmt_ai_${Date.now()}`,
      code: `CMT-AI-${String(comments.length + 1).padStart(3, '0')}`,
      topicId: FLAGSHIP_TOPIC.id,
      sessionId: 'session_flagship_r1',
      authorId: currentPersona.id,
      authorName: `${currentPersona.name} (AI初审体检采纳)`,
      authorDomain: 'AI与架构初审',
      severity: finding.severity,
      isFormalIssue: true,
      description: `${finding.title}：${finding.detail}`,
      evidence: `${finding.documentSection} | 规则参考：${finding.ruleReference}`,
      referenceDocSection: finding.documentSection,
      remediationRequirement: `针对${finding.title}补充完善架构设计与压测验证数据`,
      acceptanceCriteria: '提交代码修复PR并通过独立安全专家核签',
      assigneeName: '李晨',
      verifierName: '陆天恒',
      dueDate: '2026-11-15',
      status: 'ASSIGNED',
    };

    setComments((prev) => [newComment, ...prev]);

    // Mark as imported
    setAiScanReport((prev) => ({
      ...prev,
      findings: prev.findings.map((f) =>
        f.id === findingId ? { ...f, isImportedAsOfficialComment: true } : f
      ),
    }));

    alert(`【AI初审采纳】已成功将「${finding.title.substring(0, 24)}...」导入为正式 ${finding.severity} 级缺陷问题项！`);
  };

  // 建议 1: 生产事故倒逼红线规则强制生效
  const enforceRuleFromIncident = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            traceabilityResult: {
              ...inc.traceabilityResult,
              ruleEvolutionStatus: 'ENFORCED',
            },
          };
        }
        return inc;
      })
    );
    alert('【治理红线生效】已将倒查改进规则强制写入集团 DRB 架构红线库，后续所有申报议题均受此阻断约束！');
  };

  // 用户管理与角色配置 Actions
  const addUser = (userData: Partial<SystemUser>) => {
    const id = `user_${Date.now()}`;
    const employeeNo = userData.employeeNo || `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const name = userData.name || '新架构师';
    const newUser: SystemUser = {
      id,
      employeeNo,
      username: userData.username || `user.${Date.now().toString().slice(-4)}`,
      name,
      email: userData.email || `${employeeNo.toLowerCase()}@corp.internal`,
      phone: userData.phone || '13800000000',
      avatarText: name.substring(0, 1),
      department: userData.department || '智能营销与Agent研发组',
      productFamily: userData.productFamily || '智能营销产品族',
      jobTitle: userData.jobTitle || '技术专家',
      technicalLevel: userData.technicalLevel || 'T8 - 资深架构师',
      roleCodes: userData.roleCodes || ['TOPIC_OWNER'],
      roleLabels: userData.roleLabels || ['议题主讲人'],
      drbAppointments: userData.drbAppointments || [],
      ssoSource: userData.ssoSource || 'LOCAL_ADMIN',
      status: 'ACTIVE',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 10),
      lastLoginAt: '从未登录',
    };

    setUsers((prev) => [newUser, ...prev]);
    alert(`【用户创建成功】已成功录入系统用户：${name} (${employeeNo})！已自动同步至右上角身份切换器。`);
  };

  const updateUser = (userId: string, data: Partial<SystemUser>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...data } : u))
    );
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const syncFromEnterpriseDirectory = () => {
    const syncedUser1: SystemUser = {
      id: `user_sync_${Date.now()}_1`,
      employeeNo: 'EMP-3120',
      username: 'min.zhou',
      name: '周敏',
      email: 'min.zhou@corp.internal',
      phone: '13900033120',
      avatarText: '周',
      department: '交易结算研发部',
      productFamily: '交易结算产品族',
      jobTitle: '资深高并发性能架构师',
      technicalLevel: 'T8 - 资深架构师',
      roleCodes: ['COMMITTEE_MEMBER'],
      roleLabels: ['法定表决委员'],
      drbAppointments: [
        {
          drbId: 'drb_l2_trade',
          drbName: '客户管理与交易产品族DRB',
          drbRole: 'MEMBER (委员)',
          termPeriod: '2025-01 ~ 2027-01',
          status: 'ACTIVE',
        },
      ],
      ssoSource: 'FEISHU_SSO',
      status: 'ACTIVE',
      createdAt: new Date().toISOString().substring(0, 10),
      lastLoginAt: '刚刚通过飞书SSO同步',
    };

    const syncedUser2: SystemUser = {
      id: `user_sync_${Date.now()}_2`,
      employeeNo: 'EMP-1102',
      username: 'cheng.guo',
      name: '郭成',
      email: 'cheng.guo@corp.internal',
      phone: '13900011102',
      avatarText: '郭',
      department: '基础技术与容器云中心',
      productFamily: '企业架构委员会',
      jobTitle: '云原生基建资深架构师',
      technicalLevel: 'T9 - 首席专家',
      roleCodes: ['SECURITY_EXPERT', 'COMMITTEE_MEMBER'],
      roleLabels: ['专项安全专家', '法定表决委员'],
      drbAppointments: [
        {
          drbId: 'drb_l1_corp',
          drbName: '企业级技术DRB (EDRB)',
          drbRole: 'MEMBER (委员)',
          termPeriod: '2025-01 ~ 2027-01',
          status: 'ACTIVE',
        },
      ],
      ssoSource: 'LDAP_AD',
      status: 'ACTIVE',
      createdAt: new Date().toISOString().substring(0, 10),
      lastLoginAt: '刚刚通过企业AD同步',
    };

    setUsers((prev) => [syncedUser1, syncedUser2, ...prev]);
    alert('【企业通讯录同步成功】已从企业 LDAP/飞书 SSO 增量同步 2 位在职架构师档案（周敏、郭成），并自动完成 DRB 角色赋权！');
  };

  const updateRolePermissions = (roleId: string, permissionCodes: string[]) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, permissions: permissionCodes } : r))
    );
    alert('【角色权限矩阵更新】DRB 法定角色权限配置已生效并实时更新！');
  };

  const assignUserRoles = (userId: string, roleCodes: string[]) => {
    const roleLabels = roleCodes.map((code) => {
      const match = roles.find((r) => r.code === code);
      return match ? match.name : code;
    });

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, roleCodes, roleLabels } : u))
    );
    alert('【用户角色委派成功】已更新用户法定 DRB 角色！');
  };

  const switchPersonaByUser = (user: SystemUser) => {
    const roleMap: Record<string, 'L1_CHAIR' | 'L2_SECRETARY' | 'SECURITY_EXPERT' | 'TOPIC_OWNER' | 'COMMITTEE_MEMBER' | 'ADMIN'> = {
      L1_CHAIR: 'L1_CHAIR',
      L2_SECRETARY: 'L2_SECRETARY',
      SECURITY_EXPERT: 'SECURITY_EXPERT',
      TOPIC_OWNER: 'TOPIC_OWNER',
      COMMITTEE_MEMBER: 'COMMITTEE_MEMBER',
      SYSTEM_ADMIN: 'ADMIN',
    };

    const primaryCode = user.roleCodes[0] || 'TOPIC_OWNER';
    const personaRole = roleMap[primaryCode] || 'TOPIC_OWNER';

    const newPersona: UserPersona = {
      id: user.id,
      name: user.name,
      title: user.jobTitle,
      department: user.department,
      avatarText: user.avatarText,
      role: personaRole,
      roleLabel: user.roleLabels[0] || primaryCode,
      drbAffiliations: user.drbAppointments.map((a) => a.drbId),
    };

    setCurrentPersona(newPersona);
    alert(`【身份切换成功】当前执行上下文已切换为：${user.name} (${user.roleLabels.join(' / ')})`);
  };

  return (
    <GovernanceContext.Provider
      value={{
        currentPersona,
        setCurrentPersona,
        activeNav,
        setActiveNav,
        selectedTopicId,
        setSelectedTopicId,
        activeDetailTab,
        setActiveDetailTab,
        topics,
        drbOrgs,
        experts,
        policies,
        session,
        ballot,
        votes,
        comments,
        verification,
        decision,
        adr,
        incidents,
        adrGraph,
        aiScanReport,
        expertCredits,
        users,
        roles,
        permissions,
        addUser,
        updateUser,
        toggleUserStatus,
        syncFromEnterpriseDirectory,
        updateRolePermissions,
        assignUserRoles,
        switchPersonaByUser,
        importAIFindingToComments,
        enforceRuleFromIncident,
        addNewTopic,
        acceptTopic,
        returnTopicForRevision,
        startReviewSessionAndFreeze,
        adjustTopicRouting,
        escalateTopic,
        signOfficialDecision,
        closeTopic,
        castVote,
        submitComment,
        submitRemediation,
        verifyRemediation,
        approveRiskAcceptance,
        publishDecisionRevision,
        getClosureDiagnostic,
        stats,
      }}
    >
      {children}
    </GovernanceContext.Provider>
  );
};

export const useGovernance = () => {
  const context = useContext(GovernanceContext);
  if (!context) {
    throw new Error('useGovernance must be used within a GovernanceProvider');
  }
  return context;
};
