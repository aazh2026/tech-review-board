import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import {
  ArrowLeft,
  FileText,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Users,
  Video,
  Vote,
  Award,
  Layers,
  History,
  ExternalLink,
  ChevronRight,
  Plus,
  Lock,
  Share2,
  Sparkles,
} from 'lucide-react';
import { AIPreReviewScannerView } from '../scanner/AIPreReviewScannerView';

export const TopicDetailView: React.FC = () => {
  const {
    topics,
    selectedTopicId,
    setSelectedTopicId,
    activeDetailTab,
    setActiveDetailTab,
    currentPersona,
    drbOrgs,
    ballot,
    votes,
    comments,
    verification,
    decision,
    adr,
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
    getClosureDiagnostic,
  } = useGovernance();

  const topic = topics.find((t) => t.id === selectedTopicId) || topics[0];

  // Routing modal state
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [targetRouteDrb, setTargetRouteDrb] = useState(drbOrgs[0].id);
  const [routeReason, setRouteReason] = useState('');

  // Escalation modal state
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');

  // Return revision modal state
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');

  // Decision signing modal state
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionTypeInput, setDecisionTypeInput] = useState<'PASSED' | 'CONDITIONAL_PASS' | 'REJECTED'>('CONDITIONAL_PASS');
  const [decisionConclusionInput, setDecisionConclusionInput] = useState(
    '根据评审委员会表决结果与各专业组质询，原则同意该架构方案。附带完成P0/P1严重缺陷独立闭环验证后方可上线灰度。'
  );

  // Diagnostic modal state
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);

  // Comment submission form inside tab
  const [newCmtDesc, setNewCmtDesc] = useState('');
  const [newCmtEvidence, setNewCmtEvidence] = useState('');
  const [newCmtSection, setNewCmtSection] = useState('第4章 核心设计');
  const [newCmtSeverity, setNewCmtSeverity] = useState<'P0' | 'P1' | 'P2' | 'P3'>('P1');
  const [newCmtIsFormal, setNewCmtIsFormal] = useState(true);

  // Remediation submission state
  const [solutionInput, setSolutionInput] = useState('');
  const [prUrlInput, setPrUrlInput] = useState('');

  // Verification review state
  const [verifierNotesInput, setVerifierNotesInput] = useState('');

  // Risk acceptance state
  const [riskJustificationInput, setRiskJustificationInput] = useState('');

  // Voting state inside tab
  const [voteChoice, setVoteChoice] = useState<'AGREE' | 'CONDITIONAL' | 'OPPOSE' | 'ABSTAIN'>('CONDITIONAL');
  const [voteReason, setVoteReason] = useState('');

  const tabs = [
    { key: 'overview', label: '议题概览' },
    { key: 'materials', label: '材料快照' },
    { key: 'ai-scanner', label: 'AI初审体检 (建议3)' },
    { key: 'organization', label: '评审组织' },
    { key: 'session', label: '评审活动' },
    { key: 'voting', label: '投票表决' },
    { key: 'comments', label: '意见与分级' },
    { key: 'decision', label: '正式决策与ADR' },
    { key: 'remediation', label: '整改闭环' },
    { key: 'timeline', label: '审计时间线' },
  ];

  const handleRouteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeReason.trim()) return;
    adjustTopicRouting(topic.id, targetRouteDrb, routeReason);
    setShowRouteModal(false);
    setRouteReason('');
  };

  const handleEscalateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalateReason.trim()) return;
    escalateTopic(topic.id, escalateReason);
    setShowEscalateModal(false);
    setEscalateReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedTopicId(null)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-900"
            title="返回议题列表"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{topic.code}</span>
              <span>·</span>
              <span>{topic.productFamily}</span>
              <span>·</span>
              <span className="text-rose-600 dark:text-rose-400 font-semibold">{topic.riskLevel} 风险</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {topic.title}
            </h1>
          </div>
        </div>

        {/* Governance Lifecycle Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {topic.status === 'PENDING_ACCEPTANCE' && (
            <>
              <button
                onClick={() => acceptTopic(topic.id)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
              >
                受理立项 (秘书动作)
              </button>
              <button
                onClick={() => setShowReturnModal(true)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                退回补充材料
              </button>
            </>
          )}

          {topic.status === 'PREPARING' && (
            <button
              onClick={() => {
                startReviewSessionAndFreeze(topic.id);
                alert('已成功冻结申报材料快照 (SHA-256)，并正式开启专家预审与会议！');
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>冻结材料并启动评审 (BR-017)</span>
            </button>
          )}

          {(topic.status === 'REVIEWING' || topic.status === 'DECISION_PENDING') && (
            <button
              onClick={() => setShowDecisionModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5" />
              <span>签署正式决策书 (主席授权)</span>
            </button>
          )}

          <button
            onClick={() => setShowRouteModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
          >
            调整路由
          </button>

          {topic.level !== 'L1' && (
            <button
              onClick={() => setShowEscalateModal(true)}
              className="px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 rounded-lg transition-colors"
            >
              申请跨级升级 (L1)
            </button>
          )}

          <button
            onClick={() => setShowDiagnosticModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            <span>闭环检查诊断</span>
          </button>

          {topic.status !== 'CLOSED' && (
            <button
              onClick={() => {
                const ok = closeTopic(topic.id);
                if (!ok) {
                  setShowDiagnosticModal(true);
                }
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-xs"
            >
              正式关闭议题 (决策人)
            </button>
          )}
        </div>
      </div>

      {/* Topic Status Ribbon (PRD P04 Header Spec) */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-2 md:grid-cols-6 gap-4 text-xs">
        <div>
          <span className="text-slate-400">当前治理级别</span>
          <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 font-mono">
            {topic.level} {topic.level === 'L1' ? '企业级' : topic.level === 'L2' ? '产品族级' : '产品级'}
          </div>
        </div>

        <div>
          <span className="text-slate-400">受理DRB组织</span>
          <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
            {topic.currentDrbName}
          </div>
        </div>

        <div>
          <span className="text-slate-400">当前业务状态</span>
          <div className="font-bold mt-0.5 text-amber-600 dark:text-amber-400">
            {topic.status}
          </div>
        </div>

        <div>
          <span className="text-slate-400">评审轮次</span>
          <div className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            Round {topic.currentRound}
          </div>
        </div>

        <div>
          <span className="text-slate-400">议题负责人</span>
          <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
            {topic.ownerName}
          </div>
        </div>

        <div>
          <span className="text-slate-400">影响范围</span>
          <div className="font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
            {topic.impactScope}
          </div>
        </div>
      </div>

      {/* Governance Lifecycle Pipeline Stepper (End-to-End Workflow & Blocker Navigation) */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              端到端技术评审全流程状态机与卡点雷达 (模式 C)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            点击流程节点可直接跳转至对应交互工作区
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
          {[
            { step: 1, label: '01 申报登记', status: 'DONE', role: '李晨 (发起人)', tab: 'overview' },
            { step: 2, label: '02 准入受理', status: 'DONE', role: '赵晴/林峰 (秘书)', tab: 'overview' },
            { step: 3, label: '03 快照冻结', status: 'DONE', role: '系统自动锁版', tab: 'materials' },
            { step: 4, label: '04 会前预审', status: 'DONE', role: 'AI+受邀专家组', tab: 'ai-scanner' },
            { step: 5, label: '05 现场评审', status: 'DONE', role: '全体委员', tab: 'session' },
            { step: 6, label: '06 投票表决', status: 'DONE', role: '8位表决委员', tab: 'voting' },
            { step: 7, label: '07 正式决策', status: 'DONE', role: '张建国 (主席)', tab: 'decision' },
            {
              step: 8,
              label: '08 整改验证',
              status: comments.some((c) => c.status === 'PENDING_VERIFICATION') ? 'CURRENT' : comments.some((c) => c.severity === 'P0' && c.status !== 'VERIFIED') ? 'BLOCKER' : 'DONE',
              role: '陆天恒 (独立验证)',
              tab: 'remediation',
            },
          ].map((item) => {
            const isDone = item.status === 'DONE';
            const isCurrent = item.status === 'CURRENT';
            const isBlocker = item.status === 'BLOCKER';

            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setActiveDetailTab(item.tab)}
                className={`p-2 rounded-lg text-left border transition-all ${
                  isCurrent
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 ring-2 ring-amber-400/20'
                    : isBlocker
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] truncate">{item.label}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : isCurrent ? (
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-1">
                  {item.role}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Role-Aware Context Guidance Alert (Eliminating Breakpoints Between Stakeholders) */}
      <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700">
            {currentPersona.avatarText}
          </div>
          <div>
            <div className="font-semibold text-slate-100 flex items-center gap-2">
              <span>当前登录用户：{currentPersona.name} ({currentPersona.roleLabel})</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                法定权能指引
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              {currentPersona.role === 'SECURITY_EXPERT' &&
                '【独立验证人指引】：李晨已提交P0黑名单吊销代码与压测证据。请前往「整改闭环」Tab核验，并出具安全验证结论（严格落实 BR-033 整改验证独立原则）。'}
              {currentPersona.role === 'TOPIC_OWNER' &&
                '【整改责任人指引】：您已提交P0黑名单方案。根据规则 BR-033 您不得作为唯一验证人，正等待首席安全官陆天恒独立签发验证报告。'}
              {currentPersona.role === 'L1_CHAIR' &&
                '【企业级主席指引】：您已签发V1.0附条件通过决策书。在所有P0严重缺陷独立验证完成前，系统规则BR-037将硬阻断议题关闭；如确需临时灰度，您可审批风险接受。'}
              {currentPersona.role === 'L2_SECRETARY' &&
                '【DRB秘书指引】：您负责议题形式审查与规则路由分级。若发现影响范围扩大至跨产品族，可随时点击上方「申请跨级升级」提报L1。'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (currentPersona.role === 'SECURITY_EXPERT') {
              setActiveDetailTab('remediation');
            } else if (currentPersona.role === 'L1_CHAIR') {
              setShowDiagnosticModal(true);
            } else {
              setActiveDetailTab('remediation');
            }
          }}
          className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-100 text-slate-900 font-semibold text-xs whitespace-nowrap shrink-0 hover:bg-slate-100 transition-colors"
        >
          {currentPersona.role === 'SECURITY_EXPERT'
            ? '前往执行独立验证'
            : currentPersona.role === 'L1_CHAIR'
            ? '查看闭环诊断雷达'
            : '查看整改进度'}
        </button>
      </div>

      {/* 9 Tab Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto select-none">
        {tabs.map((tab) => {
          const isActive = activeDetailTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveDetailTab(tab.key)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors relative border-b-2 -mb-[1px] ${
                isActive
                  ? 'border-slate-900 dark:border-white text-slate-950 dark:text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
              {tab.key === 'comments' && (
                <span className="ml-1.5 font-mono text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
                  {comments.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeDetailTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Background */}
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-slate-400">
                  业务与技术背景
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {topic.background}
                </p>
              </div>

              {/* Objectives & Appeals */}
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-slate-400">
                    建设目标与方案综述
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
                    {topic.objective}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-slate-400">
                    评审诉求 (期望DRB正式结论)
                  </h3>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium leading-relaxed mt-1">
                    {topic.reviewAppeals}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Routing & Decision Rationale */}
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>分级路由决策链依据 (BR-013)</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {topic.routingReason}
                </div>
                {topic.escalationReason && (
                  <div className="p-2.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-[11px] text-rose-800 dark:text-rose-300">
                    <span className="font-semibold">升级记录：</span>原由 {topic.escalatedFromDrb} 承接，因“{topic.escalationReason}”升级至L1企业级。
                  </div>
                )}
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <span className="text-slate-400 font-semibold">议题元信息</span>
                <div className="space-y-1.5 text-slate-600 dark:text-slate-400 pt-1">
                  <div>创建人：{topic.creatorName}</div>
                  <div>创建时间：{topic.createdAt}</div>
                  <div>最近更新：{topic.updatedAt}</div>
                  <div>计划截止：{topic.expectedDate}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Materials Snapshot (Frozen versions) */}
      {activeDetailTab === 'materials' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>技术材料快照冻结机制 (规则 BR-017)</span>
            </div>
            <p className="text-[11px] text-slate-300">
              评审会议启动时，系统已自动对申报技术材料生成不可篡改 SHA-256 哈希快照，确保投票、表决与正式决策所依据的材料版本唯一可回溯。
            </p>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <th className="py-3 px-4">文档名称</th>
                  <th className="py-3 px-4">冻结版本</th>
                  <th className="py-3 px-4">不可篡改哈希 (SHA-256)</th>
                  <th className="py-3 px-4">大小</th>
                  <th className="py-3 px-4">冻结时间</th>
                  <th className="py-3 px-4">提交人</th>
                  <th className="py-3 px-4 text-right">调阅</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {topic.materials.map((mat) => (
                  <tr key={mat.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {mat.title}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {mat.version}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 max-w-xs truncate" title={mat.hash}>
                      {mat.hash}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{mat.size}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{mat.frozenAt}</td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{mat.uploader}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => alert(`已安全打开冻结材料快照：${mat.title}（版本 ${mat.version}）`)}
                        className="text-xs font-semibold text-slate-900 dark:text-white hover:underline flex items-center gap-1 justify-end"
                      >
                        <span>预览快照</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: AI Architecture Compliance Pre-review (Recommendation 3) */}
      {activeDetailTab === 'ai-scanner' && (
        <div className="space-y-4">
          <AIPreReviewScannerView isEmbedded={true} />
        </div>
      )}

      {/* Tab 3: Organization & Experts */}
      {activeDetailTab === 'organization' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  当前受理组织：{topic.currentDrbName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  章程依据：v3.2 全局基准 · 主席：张建国 · 秘书：林峰
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                法定决策授权生效中
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              管辖范围：统摄全集团技术架构原则、企业级公共能力选型、跨域重大分歧仲裁及架构例外终局裁决。本议题由两个产品族架构师、首席安全官、AI工程专家联合审查。
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-slate-400">
              本次议题正式分配评审专家（三权分立：评审权 ≠ 表决权）
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: '张建国', role: 'L1 DRB主席', voteRight: true, domain: '总体架构 / 决策签发' },
                { name: '陆天恒', role: '首席安全官', voteRight: true, domain: '安全合规 / 红线一票否决' },
                { name: '许立', role: 'AI首席专家', voteRight: true, domain: 'AI工程 / Multi-Agent' },
                { name: '陈世明', role: '交易总架构师', voteRight: true, domain: '交易中台 / 跨域数据' },
                { name: '王海平', role: '营销总架构师', voteRight: true, domain: '营销服务 / 架构协同' },
                { name: '冯志高', role: '高可用专家', voteRight: true, domain: '性能容灾 / 降级兜底' },
                { name: '赵晴', role: '架构专家', voteRight: true, domain: '治理规范 / API协议' },
                { name: '李晨', role: '议题汇报人', voteRight: false, domain: '主讲汇报 / 整改承接' },
                { name: '林峰', role: 'DRB秘书', voteRight: false, domain: '会议记录 / 纪要发布' },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{m.name}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                        m.voteRight
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {m.voteRight ? '有正式表决权' : '仅评审咨询'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">{m.role}</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                    专业职责：{m.domain}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Session & Meeting */}
      {activeDetailTab === 'session' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono text-indigo-600 font-semibold">ROUND 1 正式评审会</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Agent身份与任务级授权架构第一轮线上线下评审会
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                会议圆满完成 · 表决通过
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400">会议时间</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  2026-11-06 14:00 ~ 17:00
                </div>
              </div>
              <div>
                <span className="text-slate-400">会议地点</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  科技大厦 801 架构决策厅
                </div>
              </div>
              <div>
                <span className="text-slate-400">出席情况</span>
                <div className="font-mono font-bold text-emerald-600 mt-0.5">
                  8 / 9 人 (出席率 88.9% ≥ 2/3 法定要求)
                </div>
              </div>
              <div>
                <span className="text-slate-400">视频会议接入</span>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('已进入加密视频会议通道');
                  }}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 mt-0.5"
                >
                  <span>线上会议室</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Agendas list */}
            <div className="pt-3 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-slate-400">
                会议正式议程与推进时间轴
              </h4>
              <div className="space-y-2">
                {[
                  { time: '14:00 - 14:15', title: '主席开场与跨域治理规则基线宣贯', speaker: '张建国', status: '完成' },
                  { time: '14:15 - 15:00', title: 'Agent身份与任务级委托令牌技术方案汇报', speaker: '李晨', status: '完成' },
                  { time: '15:00 - 15:45', title: '信息安全与合规红线审查及反方质询', speaker: '陆天恒', status: '完成' },
                  { time: '15:45 - 16:20', title: '跨产品族数据模型与高并发吞吐讨论', speaker: '陈世明 / 王海平', status: '完成' },
                  { time: '16:20 - 16:45', title: '正式评审意见确认与严重程度定级 (P0~P3)', speaker: '全体专家', status: '完成' },
                  { time: '16:45 - 17:00', title: '无记名电子投票表决与主席裁决总结', speaker: '张建国', status: '完成' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-400 w-24">{item.time}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500">
                      <span>发言人：{item.speaker}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{item.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Voting & Ballot */}
      {activeDetailTab === 'voting' && (
        <div className="space-y-6">
          {/* Ballot Outcome Header */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-slate-400">BALLOT ID: {ballot.id}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  第 1 轮正式表决核算结果
                </h3>
              </div>
              <span className="text-xs font-bold font-mono px-3 py-1 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                表决结论：{ballot.calculatedOutcome} (附条件通过)
              </span>
            </div>

            {/* Voting Threshold Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs">
              <div>
                <span className="text-slate-400">法定出席比例要求</span>
                <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  ≥ 2/3 (实到 8/9，达标)
                </div>
              </div>
              <div>
                <span className="text-slate-400">有效赞同门槛</span>
                <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  ≥ 2/3 (赞成 7/8 = 87.5%，达标)
                </div>
              </div>
              <div>
                <span className="text-slate-400">投票模式</span>
                <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  电子无记名 (审计留痕)
                </div>
              </div>
              <div>
                <span className="text-slate-400">投票状态</span>
                <div className="font-semibold text-emerald-600 mt-0.5">
                  已封存归档 (不可篡改)
                </div>
              </div>
            </div>

            {/* Voting Results Visual Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>票数分布 ({ballot.votedCount} 票有效)</span>
                <span className="text-slate-500">
                  同意 {ballot.results.agree} · 附条件通过 {ballot.results.conditional} · 反对 {ballot.results.oppose}
                </span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                <div
                  style={{ width: `${(ballot.results.agree / ballot.votedCount) * 100}%` }}
                  className="bg-emerald-500"
                  title="完全同意"
                />
                <div
                  style={{ width: `${(ballot.results.conditional / ballot.votedCount) * 100}%` }}
                  className="bg-amber-500"
                  title="附条件通过"
                />
                <div
                  style={{ width: `${(ballot.results.oppose / ballot.votedCount) * 100}%` }}
                  className="bg-rose-500"
                  title="反对"
                />
              </div>
            </div>
          </div>

          {/* Interactive Cast Vote Console for Testing Personas */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Vote className="w-4 h-4 text-indigo-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  当前身份投票模拟 (以 {currentPersona.name} · {currentPersona.roleLabel} 身份行使表决)
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">满足 BR-019 投票资格</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
              {[
                { key: 'AGREE', label: '通过 (完全赞成)' },
                { key: 'CONDITIONAL', label: '有条件通过 (附整改项)' },
                { key: 'OPPOSE', label: '不通过 (存在阻断缺陷)' },
                { key: 'ABSTAIN', label: '弃权' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setVoteChoice(opt.key as any)}
                  className={`p-2 rounded-lg text-xs font-semibold text-center transition-all ${
                    voteChoice === opt.key
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                投票附注与技术考量依据 (附条件或反对时必填)
              </label>
              <input
                type="text"
                placeholder="填写您的专业审查理由或附加要求..."
                value={voteReason}
                onChange={(e) => setVoteReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <button
              onClick={() => {
                castVote(voteChoice, voteReason || '同意技术方案');
                setVoteReason('');
                alert(`已成功以 ${currentPersona.name} 身份提交表决：${voteChoice}`);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              提交/更新我的正式表决票
            </button>
          </div>

          {/* Audit Votes List */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
              各委员表决明细留痕 (审计与追溯档案 BR-028)
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {votes.map((v) => (
                <div key={v.id} className="p-3.5 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{v.voterName}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                          v.option === 'AGREE'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : v.option === 'CONDITIONAL'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {v.option === 'AGREE'
                          ? '赞同'
                          : v.option === 'CONDITIONAL'
                          ? '附条件通过'
                          : v.option === 'OPPOSE'
                          ? '反对'
                          : '弃权'}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                      {v.reason || '无特殊附注说明'}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 shrink-0">{v.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Comments & Issues */}
      {activeDetailTab === 'comments' && (
        <div className="space-y-6">
          {/* Header Summary & Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                专家评审意见与问题分级清单
              </h3>
              <p className="text-xs text-slate-500">
                区分普通评审建议与正式整改问题 (P0 阻断 / P1 严重 / P2 一般 / P3 建议)
              </p>
            </div>
          </div>

          {/* Add New Comment Box */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-slate-100">
              <Plus className="w-4 h-4 text-indigo-500" />
              <span>以 {currentPersona.name} ({currentPersona.roleLabel}) 身份提交评审意见</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">严重程度</label>
                <select
                  value={newCmtSeverity}
                  onChange={(e) => setNewCmtSeverity(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="P0">P0 - 阻断性缺陷 (必须上线前闭环)</option>
                  <option value="P1">P1 - 严重架构问题 (需限期整改)</option>
                  <option value="P2">P2 - 一般优化项 (允许后续迭代)</option>
                  <option value="P3">P3 - 咨询与建议 (参考执行)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">是否作为正式整改问题</label>
                <select
                  value={newCmtIsFormal ? 'true' : 'false'}
                  onChange={(e) => setNewCmtIsFormal(e.target.value === 'true')}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="true">是 (纳入强制整改与闭环验收)</option>
                  <option value="false">否 (普通讨论建议)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">关联设计章节</label>
                <input
                  type="text"
                  value={newCmtSection}
                  onChange={(e) => setNewCmtSection(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">问题或建议详细描述 *</label>
              <textarea
                rows={2}
                placeholder="清晰描述技术风险、潜在后果..."
                value={newCmtDesc}
                onChange={(e) => setNewCmtDesc(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">证据或缺陷触发场景</label>
              <input
                type="text"
                placeholder="例如：参考材料第4.3节序列图或生产同类故障复盘..."
                value={newCmtEvidence}
                onChange={(e) => setNewCmtEvidence(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <button
              onClick={() => {
                if (!newCmtDesc.trim()) return;
                submitComment({
                  severity: newCmtSeverity,
                  isFormal: newCmtIsFormal,
                  description: newCmtDesc,
                  evidence: newCmtEvidence,
                  section: newCmtSection,
                });
                setNewCmtDesc('');
                setNewCmtEvidence('');
              }}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 rounded-lg hover:bg-slate-800 transition-colors"
            >
              提交评审意见
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((cmt) => (
              <div
                key={cmt.id}
                className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{cmt.code}</span>
                      <span>·</span>
                      <span
                        className={`font-mono font-bold text-xs px-1.5 py-0.2 rounded ${
                          cmt.severity === 'P0'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : cmt.severity === 'P1'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {cmt.severity}
                      </span>
                      <span>·</span>
                      <span>提出人：{cmt.authorName}</span>
                      <span>·</span>
                      <span>章节：{cmt.referenceDocSection}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-2 leading-relaxed">
                      {cmt.description}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                    {cmt.status}
                  </span>
                </div>

                {cmt.evidence && (
                  <div className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">问题证据：</span>
                    {cmt.evidence}
                  </div>
                )}

                {cmt.remediationRequirement && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400">整改要求：</span>
                      <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {cmt.remediationRequirement}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">验收标准：</span>
                      <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {cmt.acceptanceCriteria}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                  <div>
                    整改责任人：<span className="font-semibold text-slate-700 dark:text-slate-300">{cmt.assigneeName || '未指定'}</span> · 
                    独立验证人：<span className="font-semibold text-slate-700 dark:text-slate-300">{cmt.verifierName || '未指定'}</span> · 
                    截止：<span className="font-mono text-slate-600 dark:text-slate-400">{cmt.dueDate || '-'}</span>
                  </div>

                  <button
                    onClick={() => setActiveDetailTab('remediation')}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    前往整改验证看板 →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Formal Decision & ADR */}
      {activeDetailTab === 'decision' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{decision.code}</span>
                  <span>·</span>
                  <span>依据规则版本：{decision.version}</span>
                  <span>·</span>
                  <span>签署发布：{decision.publishedAt}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                  企业级技术DRB正式裁决书 (Decision Record)
                </h3>
              </div>
              <span className="text-xs font-bold font-mono px-3 py-1 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                裁决结论：{decision.decisionType}
              </span>
            </div>

            {/* Official Conclusion Prose */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {decision.conclusionText}
            </div>

            {/* Basis & Key Disputes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-slate-900 dark:text-slate-100">决策依据</span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{decision.basis}</p>
              </div>

              <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-slate-900 dark:text-slate-100">关键技术分歧留痕 (BR-028)</span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{decision.keyDisputes}</p>
              </div>
            </div>

            {/* Mandatory Conditions List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                生效强制性条件 (整改验收基线)
              </span>
              <div className="space-y-1.5">
                {decision.mandatoryConditions.map((cond, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{cond}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signatory Authority */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">授权签署人：</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 ml-1">{decision.signatoryName}</span>
                <span className="text-slate-500 ml-1">({decision.signatoryTitle})</span>
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                授权依据：{decision.authorityReference}
              </div>
            </div>
          </div>

          {/* ADR (Architecture Decision Record) Viewer */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  关联技术架构决策记录 ({adr.code})
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                状态：{adr.status} (正式入库)
              </span>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100 block">决策背景 (Context)</span>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{adr.context}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100 block">考量的候选方案 (Options)</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                  {adr.consideredOptions.map((opt, i) => (
                    <div key={i} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{opt.name}</div>
                      <div className="text-emerald-700 dark:text-emerald-400">优势：{opt.pros}</div>
                      <div className="text-rose-700 dark:text-rose-400">缺点：{opt.cons}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100 block">裁决结论与技术路线 (Rationale)</span>
                <p className="text-slate-800 dark:text-slate-200 mt-1 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 font-medium">
                  {adr.decisionRationale}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Remediation & Closed-loop */}
      {activeDetailTab === 'remediation' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>整改与闭环验证规则 (BR-033, BR-034, BR-037)</span>
            </div>
            <p>
              整改人提交代码及测试报告后，必须由提出意见的独立专家（如首席安全官陆天恒）进行验证。整改人不得作为唯一验证人；P0/P1严重问题未闭环前议题无法关闭。
            </p>
          </div>

          {/* Interactive Remediation Submission Panel (For Topic Owner / Assignee) */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>整改责任人操作台 (当前执行人：李晨)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300">
                针对 ISSUE-CORP-2026-001
              </span>
            </h4>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">整改方案与技术落实说明 *</label>
                <textarea
                  rows={2}
                  placeholder="说明代码修改、配置变更及自测情况..."
                  value={solutionInput}
                  onChange={(e) => setSolutionInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">代码PR或测试证据链接 *</label>
                <input
                  type="text"
                  placeholder="https://git.corp.internal/arch-gateway/pull/482"
                  value={prUrlInput}
                  onChange={(e) => setPrUrlInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <button
                onClick={() => {
                  if (!solutionInput.trim()) return;
                  submitRemediation('cmt_1', solutionInput, prUrlInput || 'https://git.corp.internal/arch/pr/482');
                  alert('已成功提交整改代码与证据，状态流转为 [待验证]，已通知独立验证人陆天恒！');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
              >
                提交整改证据并提请独立验证
              </button>
            </div>
          </div>

          {/* Independent Verification Console (For Verifier) */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>独立验证人工作台 (当前验证人：陆天恒 · 首席安全官)</span>
              </h4>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {verification.verificationResult ? `验证结论：${verification.verificationResult}` : '待验证审查'}
              </span>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs space-y-2 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  责任人提交的整改证据详情
                </span>
                <span className="font-mono text-slate-400 text-[11px]">{verification.submittedAt}</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {verification.assigneeSolution}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-slate-400">证据外链：</span>
                <a
                  href={verification.evidenceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 font-mono underline truncate"
                >
                  {verification.evidenceUrl}
                </a>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="text-slate-400 block">验证意见与核准说明</label>
              <input
                type="text"
                placeholder="填写渗透验收测试结论或退回整改理由..."
                value={verifierNotesInput}
                onChange={(e) => setVerifierNotesInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    verifyRemediation('cmt_1', true, verifierNotesInput || '安全渗透测试通过，黑名单38ms广播生效');
                    alert('【验证通过】：安全红线P0问题已正式验证通过，议题整改条件达成！');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-xs"
                >
                  验证通过并签署解除阻断
                </button>
                <button
                  onClick={() => {
                    verifyRemediation('cmt_1', false, verifierNotesInput || '压测数据不足，要求重测');
                    alert('【退回整改】：已退回整改责任人李晨继续补充证据！');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 rounded-lg transition-colors"
                >
                  退回整改
                </button>
              </div>
            </div>
          </div>

          {/* Risk Acceptance Section (BR-035) */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  企业级残余风险正式接受记录 (BR-035)
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">风险接受 ≠ 免责，需承担明确责任人与到期复审</span>
            </div>

            {decision.acceptedRisks.map((risk) => (
              <div
                key={risk.id}
                className="p-3.5 rounded-lg border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900 dark:text-purple-300">{risk.riskSummary}</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-200/80 text-purple-900 dark:bg-purple-900 dark:text-purple-200">
                    有效期至：{risk.expiryDate}
                  </span>
                </div>
                <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  接受理由：{risk.justification}
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
                  <span>风险责任人：{risk.riskOwner}</span>
                  <span>批准授权人：{risk.approverName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 9: Audit Timeline */}
      {activeDetailTab === 'timeline' && (
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              <span>全量不可篡改审计追踪时间线 (BR-039)</span>
            </h3>
            <span className="text-xs text-slate-400">记录每一次操作者、时间戳与变更细节</span>
          </div>

          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {topic.historyTimeline.map((item, idx) => (
              <div key={idx} className="relative text-xs space-y-1">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-white ring-4 ring-white dark:ring-slate-900" />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{item.action}</span>
                  <span className="font-mono text-[11px] text-slate-400">{item.time}</span>
                </div>
                <div className="text-[11px] text-slate-500">执行人：{item.operator}</div>
                <div className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  {item.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Adjust Routing (BR-014) */}
      {showRouteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              调整议题评审路由 (留痕记录 BR-014)
            </h3>
            <p className="text-xs text-slate-500">
              根据业务范围与风险重新分派受理DRB，操作将完整记录在审计历史中。
            </p>

            <form onSubmit={handleRouteSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">目标DRB组织</label>
                <select
                  value={targetRouteDrb}
                  onChange={(e) => setTargetRouteDrb(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  {drbOrgs.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.level} - {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">调整原因与依据 *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="例如：评估发现涉及跨产品族数据模型变更，超出单产品族DRB授权..."
                  value={routeReason}
                  onChange={(e) => setRouteReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRouteModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 hover:bg-slate-800"
                >
                  确认调整并留痕
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Escalate to L1 (BR-015) */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">
              申请跨级升级至 L1 企业级DRB (BR-015)
            </h3>
            <p className="text-xs text-slate-500">
              当议题超出本级DRB决策权限、触及企业级安全红线或涉及跨产品族重大利益冲突时必须升级。
            </p>

            <form onSubmit={handleEscalateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">升级理由与分歧焦点 *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="说明为何超出当前DRB授权范围，需L1企业级DRB裁决的核心分歧..."
                  value={escalateReason}
                  onChange={(e) => setEscalateReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEscalateModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-semibold text-white bg-rose-600 hover:bg-rose-500"
                >
                  确认升级立项
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Return for Revision (BR-012) */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">
              退回议题并要求补充材料 (规则 BR-012)
            </h3>
            <p className="text-xs text-slate-500">
              秘书处形式审查或专家初审发现材料缺失、架构图不完整、无压测基线时，退回整改。
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!returnReason.trim()) return;
                returnTopicForRevision(topic.id, returnReason);
                setShowReturnModal(false);
                setReturnReason('');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="text-slate-400 block mb-1">退回补充原因与明确指引 *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="列出缺失的材料清单（如：架构拓扑图缺失容灾链路、缺少压测报告）..."
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-semibold text-white bg-amber-600 hover:bg-amber-500"
                >
                  确认退回
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Sign Official Decision (BR-025 & BR-026) */}
      {showDecisionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Award className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                签署正式评审决策书 (主席法定授权 BR-026)
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
              <strong>权责说明：</strong>专家表决为重要裁决输入（BR-025），最终法定决策结论由授权主席签发生效。签发后将自动生成具有法律效力的架构决策记录 (ADR)。
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">决策结论类型 *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'PASSED', label: '无条件通过' },
                    { key: 'CONDITIONAL_PASS', label: '附条件通过 (默认)' },
                    { key: 'REJECTED', label: '不予通过 (否决方案)' },
                  ].map((d) => (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setDecisionTypeInput(d.key as any)}
                      className={`p-2.5 rounded-lg font-semibold text-center border transition-all ${
                        decisionTypeInput === d.key
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-transparent shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">正式决议陈述 (将写入ADR背景与裁决词) *</label>
                <textarea
                  rows={4}
                  required
                  value={decisionConclusionInput}
                  onChange={(e) => setDecisionConclusionInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold block text-slate-900 dark:text-slate-100 mb-1">决策附带强制要求：</span>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>必须完成所有 P0 级别安全合规整改项并在灰度前由首席安全官复核独立签认。</li>
                  <li>下阶段演进需满足无状态扩展设计，保留完整审计日志至少180天。</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDecisionModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    signOfficialDecision(topic.id, decisionTypeInput, decisionConclusionInput, [
                      'P0级凭证撤销机制需在下周前上线并经陆天恒核验',
                      '性能压测指标需达成2000 TPS并在监控系统中配置SLA告警',
                    ]);
                    setShowDecisionModal(false);
                    alert('正式决策书签署成功！已自动生成版本化 ADR 记录。');
                  }}
                  className="px-4 py-1.5 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-xs flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>正式签署并生效</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Closure Pre-Flight Diagnostic (BR-037) */}
      {showDiagnosticModal && (() => {
        const diag = getClosureDiagnostic(topic.id);
        return (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Shield className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold">
                  议题闭环检查诊断雷达 (规则 BR-037)
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                依据架构治理规范，议题正式归档关闭前必须通过以下各维度强制门禁检验。
              </p>

              {/* Status Banner */}
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
                  diag.isReady
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}
              >
                {diag.isReady ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {diag.isReady ? '准予正式归档关闭' : '存在阻断项，禁止关闭议题'}
                  </div>
                  <div className="text-[11px] mt-0.5 leading-relaxed opacity-90">
                    {diag.isReady
                      ? '所有决策签发、P0/P1整改验证与法定表决门槛已达标，可由DRB决策人执行终局归档。'
                      : '根据治理红线规则，未完成独立验证的P0缺陷或未满足的前置条件将硬阻断关闭操作。'}
                  </div>
                </div>
              </div>

              {/* Diagnostic Checklist */}
              <div className="space-y-2 text-xs">
                {diag.checks.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</div>
                      <div className="text-[11px] text-slate-500">{item.details}</div>
                    </div>
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                        item.passed
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {item.passed ? '达标' : '阻断中'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-[11px] text-slate-400">
                  如需处置阻断项，请切换至对应专家角色并在「整改闭环」中操作
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDiagnosticModal(false)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100"
                  >
                    关闭窗口
                  </button>
                  {diag.isReady && (
                    <button
                      type="button"
                      onClick={() => {
                        closeTopic(topic.id);
                        setShowDiagnosticModal(false);
                      }}
                      className="px-4 py-1.5 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-500"
                    >
                      执行终局关闭
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
