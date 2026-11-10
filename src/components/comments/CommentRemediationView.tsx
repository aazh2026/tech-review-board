import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Shield,
  FileCheck,
  ExternalLink,
  ChevronRight,
  Send,
  X,
  Plus,
} from 'lucide-react';

export const CommentRemediationView: React.FC = () => {
  const {
    comments,
    verification,
    topics,
    currentPersona,
    submitRemediation,
    verifyRemediation,
    approveRiskAcceptance,
    setSelectedTopicId,
    setActiveNav,
    setActiveDetailTab,
  } = useGovernance();

  const [sevFilter, setSevFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Remediation submission modal
  const [submittingCommentId, setSubmittingCommentId] = useState<string | null>(null);
  const [solutionInput, setSolutionInput] = useState('');
  const [evidenceUrlInput, setEvidenceUrlInput] = useState('');

  // Verification modal
  const [verifyingCommentId, setVerifyingCommentId] = useState<string | null>(null);
  const [verifierNotesInput, setVerifierNotesInput] = useState('经对代码提交及压测报告核对，已消除该架构隐患。');

  const filteredComments = comments.filter((c) => {
    if (sevFilter !== 'ALL' && c.severity !== sevFilter) return false;
    if (statusFilter === 'OPEN' && c.status !== 'OPEN' && c.status !== 'ASSIGNED') return false;
    if (statusFilter === 'PENDING_VERIFICATION' && c.status !== 'PENDING_VERIFICATION') return false;
    if (statusFilter === 'VERIFIED' && c.status !== 'VERIFIED' && c.status !== 'CLOSED' && c.status !== 'RISK_ACCEPTED') return false;
    return true;
  });

  const handleOpenRemediationModal = (cmtId: string) => {
    setSubmittingCommentId(cmtId);
    setSolutionInput('');
    setEvidenceUrlInput('https://git.internal/repo/pull/1042');
  };

  const handleSaveRemediation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingCommentId || !solutionInput.trim()) return;
    submitRemediation(submittingCommentId, solutionInput, evidenceUrlInput);
    setSubmittingCommentId(null);
    setSolutionInput('');
    alert('已成功提交整改方案与核验证据，状态已流转至待独立核验！');
  };

  const handleVerifySubmit = (passed: boolean) => {
    if (!verifyingCommentId) return;
    verifyRemediation(verifyingCommentId, passed, verifierNotesInput);
    setVerifyingCommentId(null);
    alert(passed ? '独立核验通过！该意见已闭环。' : '已驳回整改方案，请责任人重新修改。');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>技术评审与决策管理平台</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">意见与整改闭环</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <span>评审意见整改与独立核验看板</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            严格遵循闭环红线：整改人不得作为唯一核验人 (BR-033) · 未闭环阻断缺陷阻止关闭议题 (BR-037)
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
            {[
              { key: 'ALL', label: '全部状态' },
              { key: 'OPEN', label: '待提交整改' },
              { key: 'PENDING_VERIFICATION', label: '待独立核验' },
              { key: 'VERIFIED', label: '已完成闭环' },
            ].map((st) => (
              <button
                key={st.key}
                onClick={() => setStatusFilter(st.key)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === st.key
                    ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
            {['ALL', 'P0', 'P1', 'P2', 'P3'].map((s) => (
              <button
                key={s}
                onClick={() => setSevFilter(s)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  sevFilter === s
                    ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {s === 'ALL' ? '全部级别' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comment List */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs">
            当前筛选条件下暂无评审整改意见
          </div>
        ) : (
          filteredComments.map((cmt) => {
            const matchedTopic = topics.find((t) => t.id === cmt.topicId) || topics[0];

            return (
              <div
                key={cmt.id}
                className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{cmt.code}</span>
                      <span>·</span>
                      <span
                        className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                          cmt.severity === 'P0'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : cmt.severity === 'P1'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {cmt.severity} {cmt.severity === 'P0' ? '阻断' : cmt.severity === 'P1' ? '严重' : '一般'}
                      </span>
                      <span>·</span>
                      <span>提出专家：{cmt.authorName}</span>
                      <span>·</span>
                      <button
                        onClick={() => {
                          setSelectedTopicId(cmt.topicId);
                          setActiveNav('topics');
                          setActiveDetailTab('comments');
                        }}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium inline-flex items-center gap-1"
                      >
                        <span>所属议题：{matchedTopic.title}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1">
                      {cmt.description}
                    </h4>
                  </div>

                  <span
                    className={`text-xs font-mono font-semibold px-2.5 py-1 rounded shrink-0 ${
                      cmt.status === 'VERIFIED' || cmt.status === 'CLOSED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : cmt.status === 'PENDING_VERIFICATION'
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        : cmt.status === 'RISK_ACCEPTED'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {cmt.status === 'VERIFIED'
                      ? '已验证通过'
                      : cmt.status === 'PENDING_VERIFICATION'
                      ? '待独立核验'
                      : cmt.status === 'RISK_ACCEPTED'
                      ? '已接受残余风险'
                      : '整改推进中'}
                  </span>
                </div>

                {/* Requirement & Criteria */}
                {cmt.remediationRequirement && (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300 space-y-1 border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">整改要求：</span>
                      {cmt.remediationRequirement}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">验收标准：</span>
                      {cmt.acceptanceCriteria}
                    </div>
                  </div>
                )}

                {/* Solution & Verification Evidence */}
                {verification.commentId === cmt.id && verification.assigneeSolution && (
                  <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 text-xs border border-indigo-100 dark:border-indigo-900/40 space-y-1">
                    <div className="font-semibold text-indigo-900 dark:text-indigo-300">
                      已提交修复方案：{verification.assigneeSolution}
                    </div>
                    {verification.evidenceUrl && (
                      <div className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                        <span>验证证据/PR：</span>
                        <a href="#" className="text-indigo-600 hover:underline">{verification.evidenceUrl}</a>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Action Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="text-slate-500 text-[11px]">
                    整改责任人：<span className="font-semibold text-slate-800 dark:text-slate-200">{cmt.assigneeName || '李晨'}</span> · 
                    独立核验人：<span className="font-semibold text-slate-800 dark:text-slate-200">{cmt.verifierName || '陆天恒'}</span> · 
                    整改截止：<span className="font-mono text-slate-600 dark:text-slate-400">{cmt.dueDate || '2026-11-20'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Action 1: Submit remediation if open */}
                    {(cmt.status === 'OPEN' || cmt.status === 'ASSIGNED') && (
                      <button
                        type="button"
                        onClick={() => handleOpenRemediationModal(cmt.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 rounded-lg hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>提交整改方案与证据</span>
                      </button>
                    )}

                    {/* Action 2: Verify if pending verification */}
                    {cmt.status === 'PENDING_VERIFICATION' && (
                      <button
                        type="button"
                        onClick={() => {
                          setVerifyingCommentId(cmt.id);
                          setVerifierNotesInput('经审查代码补丁及合规日志，确认满足验收标准。');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-xs flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>独立专家审核验证</span>
                      </button>
                    )}

                    {/* Action 3: Risk Acceptance if P0 */}
                    {cmt.severity === 'P0' && cmt.status !== 'RISK_ACCEPTED' && cmt.status !== 'VERIFIED' && (
                      <button
                        type="button"
                        onClick={() => {
                          approveRiskAcceptance(cmt.id, '符合企业级短期降级运行容忍条件，已由首席架构师备案。');
                          alert(`已正式签署对 ${cmt.code} 的残余风险接受审批！`);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100"
                      >
                        授权风险接受 (L1/CSO)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Submit Remediation */}
      {submittingCommentId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                提交缺陷整改方案与代码/文档证据
              </h3>
              <button onClick={() => setSubmittingCommentId(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRemediation} className="space-y-4">
              <div>
                <label className="text-slate-400 block mb-1">整改方案与修复描述 *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="详细说明架构优化或代码修复实现方式，如：已引入Redis分布式TTL黑名单机制..."
                  value={solutionInput}
                  onChange={(e) => setSolutionInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">证据链接 / 代码合并请求 (PR URL / 测试报告)</label>
                <input
                  type="text"
                  placeholder="如：https://git.internal/repo/pull/1042"
                  value={evidenceUrlInput}
                  onChange={(e) => setEvidenceUrlInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubmittingCommentId(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 hover:bg-slate-800 shadow-xs"
                >
                  确认提交整改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Verify Remediation */}
      {verifyingCommentId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                独立专家审核核验整改闭环
              </h3>
              <button onClick={() => setVerifyingCommentId(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">核验结论与评语 *</label>
              <textarea
                rows={3}
                value={verifierNotesInput}
                onChange={(e) => setVerifierNotesInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleVerifySubmit(false)}
                className="px-3.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
              >
                驳回重改
              </button>
              <button
                type="button"
                onClick={() => handleVerifySubmit(true)}
                className="px-4 py-1.5 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xs"
              >
                核验通过并闭环
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
