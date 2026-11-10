import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { Award, Shield, FileCheck, GitFork } from 'lucide-react';

export const DecisionADRView: React.FC = () => {
  const { decision, adr, publishDecisionRevision, setActiveNav } = useGovernance();
  const [revisionText, setRevisionText] = useState('');
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>技术评审与决策管理平台</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">决策管理与ADR</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            正式技术决策书与架构决策记录 (ADR)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            决策独立于投票 · 严禁越权无痕修改 · 必须通过版本化修订发布 (BR-027)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveNav('adr-graph')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <GitFork className="w-3.5 h-3.5 text-indigo-500" />
            <span>决策网络拓扑图谱 (建议 2)</span>
          </button>
          <button
            onClick={() => setShowRevisionModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            发布决策新版本 (修订)
          </button>
        </div>
      </div>

      {/* Decision Card */}
      <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{decision.code}</span>
              <span>·</span>
              <span>版本：{decision.version}</span>
              <span>·</span>
              <span>发布：{decision.publishedAt}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
              企业级技术DRB正式裁决结论
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            {decision.decisionType}
          </span>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/40 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
          {decision.conclusionText}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-semibold">决策依据</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{decision.basis}</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 font-semibold">关键分歧记录</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{decision.keyDisputes}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div>
            授权签署人：<span className="font-bold text-slate-900 dark:text-slate-100">{decision.signatoryName}</span> ({decision.signatoryTitle})
          </div>
          <div className="text-slate-400 font-mono text-[11px]">{decision.authorityReference}</div>
        </div>
      </div>

      {/* ADR Reader */}
      <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {adr.code}: {adr.title}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {adr.status}
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 block">背景 (Context)</span>
            <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{adr.context}</p>
          </div>

          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 block">考量的候选方案 (Considered Options)</span>
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
            <span className="font-bold text-slate-900 dark:text-slate-100 block">裁决结论 (Decision Rationale)</span>
            <p className="text-slate-800 dark:text-slate-200 mt-1 leading-relaxed p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
              {adr.decisionRationale}
            </p>
          </div>
        </div>
      </div>

      {showRevisionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              发布决策新版本 (版本化修订 BR-027)
            </h3>
            <p className="text-xs text-slate-500">
              根据治理制度，已发布决策不得无痕篡改，必须以新版本号发布并附带修订原因。
            </p>
            <textarea
              rows={4}
              placeholder="输入修订后的完整结论..."
              value={revisionText}
              onChange={(e) => setRevisionText(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (!revisionText.trim()) return;
                  publishDecisionRevision(revisionText);
                  setShowRevisionModal(false);
                  setRevisionText('');
                  alert('已成功发布决策新版本！');
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 rounded-lg"
              >
                签署发布
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
