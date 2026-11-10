import React from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import {
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  ArrowRight,
  BookOpen,
  Zap,
  HelpCircle,
  ExternalLink,
  Flame,
} from 'lucide-react';

export const AIPreReviewScannerView: React.FC<{ isEmbedded?: boolean }> = ({ isEmbedded = false }) => {
  const { aiScanReport, importAIFindingToComments, setActiveDetailTab, currentPersona } =
    useGovernance();

  return (
    <div className="space-y-6">
      {/* Top Banner (only if not embedded) */}
      {!isEmbedded && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>演进优化建议 3 · 申报材料合规初审与红线静态度量</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              AI 架构合规自检与前置质询雷达
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              基于企业四大架构红线库，在材料快照冻结后对设计文档执行静态度量，自动暴露单点雪崩、压测盲区与质询话术。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-right shadow-xs">
              <div className="text-[10px] text-slate-400">综合架构合规得分</div>
              <div className="text-base font-bold text-indigo-600 font-mono">
                {aiScanReport.overallScore} / 100
              </div>
            </div>
            <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-right shadow-xs">
              <div className="text-[10px] text-slate-400">识别高危阻断隐患</div>
              <div className="text-base font-bold text-rose-600 font-mono">
                {aiScanReport.findings.filter((f) => f.severity === 'P0' || f.severity === 'P1').length} 项
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overview Score Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/20 font-mono">
              {aiScanReport.overallScore}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  申报材料全域架构体检单
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                  扫描时间：{aiScanReport.scanTimestamp}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {aiScanReport.riskSummary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              存在 P0/P1 待裁决项 · 需专家重点质询
            </span>
          </div>
        </div>

        {/* 5-Dimensional Radar Score Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {aiScanReport.radarScores.map((scoreItem, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px] truncate">{scoreItem.domain}</span>
                <span
                  className={`font-mono font-bold text-[11px] ${
                    scoreItem.status === 'WARN'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {scoreItem.score}分
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  style={{ width: `${scoreItem.score}%` }}
                  className={`h-full ${
                    scoreItem.status === 'WARN' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Positive Architecture Highlights */}
        <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1.5 text-xs">
          <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>符合企业技术选型基准的良好实践：</span>
          </span>
          <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
            {aiScanReport.positiveHighlights.map((hi, i) => (
              <li key={i}>{hi}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Identified Critical Findings List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-rose-500" />
            <span>AI 识别的高危缺陷与前置反方质询清单 ({aiScanReport.findings.length})</span>
          </h3>
          <span className="text-xs text-slate-400">
            专家可直接采纳一键导入至「正式评审意见与问题分级库」
          </span>
        </div>

        <div className="space-y-3">
          {aiScanReport.findings.map((f) => {
            const isP0 = f.severity === 'P0';
            const isP1 = f.severity === 'P1';

            return (
              <div
                key={f.id}
                className={`p-5 rounded-2xl border transition-all space-y-3.5 ${
                  isP0
                    ? 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900/60 shadow-xs'
                    : isP1
                    ? 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/60 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isP0
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : isP1
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {f.severity} 级缺陷
                      </span>
                      <span className="text-xs font-semibold text-slate-500">领域：{f.category}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">
                        {f.documentSection}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 pt-0.5">
                      {f.title}
                    </h4>
                  </div>

                  <div className="shrink-0">
                    {f.isImportedAsOfficialComment ? (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>已采纳为正式整改项</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => importAIFindingToComments(f.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>以 {currentPersona.name} 身份一键导入正式意见</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Detail & Rule Reference */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {f.detail}
                  </p>
                  <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    触碰规范：{f.ruleReference}
                  </div>
                </div>

                {/* Suggested In-Meeting Question Box */}
                <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60 text-xs space-y-1">
                  <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1 text-[11px]">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                    <span>推荐现场质询话术（专家反向提问）：</span>
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 italic leading-relaxed text-[11px]">
                    “{f.suggestedQuestion}”
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
