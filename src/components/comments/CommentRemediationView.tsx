import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Shield,
  FileCheck,
} from 'lucide-react';

export const CommentRemediationView: React.FC = () => {
  const { comments, verification, currentPersona, submitRemediation, verifyRemediation, approveRiskAcceptance } = useGovernance();
  const [sevFilter, setSevFilter] = useState('ALL');

  const filteredComments = comments.filter((c) => {
    if (sevFilter !== 'ALL' && c.severity !== sevFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>技术评审与决策管理平台</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">意见与整改闭环</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            评审意见整改与独立验证看板 (P10 & P11)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            严守规则：整改人不得作为唯一验证人 (BR-033) · 未解决阻断性缺陷阻止关闭 (BR-037)
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-xs">
          {['ALL', 'P0', 'P1', 'P2', 'P3'].map((s) => (
            <button
              key={s}
              onClick={() => setSevFilter(s)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                sevFilter === s
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {s === 'ALL' ? '全部意见' : s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredComments.map((cmt) => (
          <div
            key={cmt.id}
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{cmt.code}</span>
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
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1">
                  {cmt.description}
                </h4>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                {cmt.status}
              </span>
            </div>

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

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="text-slate-500">
                责任人：<span className="font-semibold text-slate-800 dark:text-slate-200">{cmt.assigneeName || '-'}</span> · 
                验证人：<span className="font-semibold text-slate-800 dark:text-slate-200">{cmt.verifierName || '-'}</span> · 
                截止：<span className="font-mono text-slate-600 dark:text-slate-400">{cmt.dueDate || '-'}</span>
              </div>

              <div className="flex items-center gap-2">
                {cmt.status === 'PENDING_VERIFICATION' && (
                  <button
                    onClick={() => {
                      verifyRemediation(cmt.id, true, '独立验证通过');
                      alert(`已完成对 ${cmt.code} 的独立验证通过！`);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-xs"
                  >
                    验证人审核通过
                  </button>
                )}

                {cmt.severity === 'P0' && cmt.status !== 'RISK_ACCEPTED' && (
                  <button
                    onClick={() => {
                      approveRiskAcceptance(cmt.id, '符合企业级短期降级运行容忍条件');
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
        ))}
      </div>
    </div>
  );
};
