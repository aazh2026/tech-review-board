import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import {
  AlertTriangle,
  Flame,
  Search,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  FileText,
  Clock,
  CheckCircle2,
  Lock,
  ExternalLink,
  ChevronRight,
  GitBranch,
  ShieldAlert,
} from 'lucide-react';

export const IncidentTraceabilityView: React.FC = () => {
  const { incidents, enforceRuleFromIncident, setSelectedTopicId, setActiveNav } = useGovernance();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0].id);

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>演进优化建议 1 · 生产事故与评审决策双向倒查链路</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            生产事故溯源与 DRB 决策复盘大盘
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            打破“评审只管上线前”的断点，打通生产故障 ↔ 历史评审争议 ↔ 折中原因 ↔ 红线规则库反向倒逼进化。
          </p>
        </div>

        {/* Traceability KPI Strip */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-right shadow-xs">
            <div className="text-[10px] text-slate-400">故障历史评审预警覆盖率</div>
            <div className="text-base font-bold text-emerald-600 font-mono">66.7%</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-right shadow-xs">
            <div className="text-[10px] text-slate-400">倒逼DRB红线规则演化</div>
            <div className="text-base font-bold text-indigo-600 font-mono">2 项生效</div>
          </div>
        </div>
      </div>

      {/* Main Layout: Incident List + In-depth Traceability Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Incidents List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>线上生产故障样本 ({incidents.length})</span>
            <span className="text-[11px] text-slate-400">APM / 监控联动</span>
          </div>

          <div className="space-y-2.5">
            {incidents.map((inc) => {
              const isSelected = inc.id === selectedIncidentId;
              const isP1 = inc.severity === 'P1';

              return (
                <button
                  key={inc.id}
                  type="button"
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-md ring-2 ring-slate-400/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isP1
                          ? isSelected
                            ? 'bg-rose-500 text-white'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : isSelected
                          ? 'bg-amber-500 text-white'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {inc.severity} 生产故障
                    </span>
                    <span className="text-[11px] font-mono opacity-80">{inc.incidentDate}</span>
                  </div>

                  <h3 className="text-xs font-bold mt-2 line-clamp-1">{inc.title}</h3>

                  <p
                    className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                      isSelected ? 'text-slate-300 dark:text-slate-700' : 'text-slate-500'
                    }`}
                  >
                    {inc.impactDescription}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/40 dark:border-slate-700/40 flex items-center justify-between text-[10px]">
                    <span className="font-mono opacity-80">关联 ADR: {inc.relatedAdrCode}</span>
                    <span className="font-semibold">
                      {inc.traceabilityResult.classification === 'PRE_WARNED_BUT_COMPROMISED'
                        ? '⚡ 已预警但折中放行'
                        : '🔍 评审盲区未识别'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              💡 双向倒查治理价值
            </span>
            <p className="text-[11px] leading-relaxed">
              当线上故障被复盘时，系统通过组件指纹反向提取当时的 DRB 会议录像、专家附注与裁决书。若当时专家已预警但被折中，自动触发决策追责与红线升级。
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Deep Traceability Comparison Matrix */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500">{selectedIncident.code}</span>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    影响时长 {selectedIncident.durationMinutes} 分钟
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {selectedIncident.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedTopicId(selectedIncident.relatedTopicId);
                    setActiveNav('topics');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>调阅当时评审议题 ({selectedIncident.relatedTopicCode})</span>
                </button>
              </div>
            </div>

            {/* Affected Services & Root Cause */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-slate-400 font-semibold text-[11px]">受波及核心服务链路</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedIncident.affectedServices.map((svc, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold text-[11px]">线上故障根因分析 (APM 定位)</span>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  {selectedIncident.rootCause}
                </p>
              </div>
            </div>
          </div>

          {/* Core Traceability Comparative Matrix */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-500" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  历史 DRB 评审质询与决策倒查对照表
                </h3>
              </div>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  selectedIncident.traceabilityResult.classification === 'PRE_WARNED_BUT_COMPROMISED'
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                    : 'bg-purple-100 text-purple-900 dark:bg-purple-950/60 dark:text-purple-200'
                }`}
              >
                {selectedIncident.traceabilityResult.classification === 'PRE_WARNED_BUT_COMPROMISED'
                  ? '分类：专家曾精准预警 · 决策折中放行'
                  : '分类：技术评审盲区 · 规范未收录'}
              </span>
            </div>

            {selectedIncident.traceabilityResult.wasIdentifiedInReview ? (
              <div className="space-y-4 text-xs">
                {/* Expert Warning Block */}
                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <span>预警专家及原始质询记录（意见编号：{selectedIncident.traceabilityResult.reviewFindingCode}）</span>
                    </span>
                    <span className="font-semibold text-amber-800 dark:text-amber-400">
                      {selectedIncident.traceabilityResult.warningExpert}
                    </span>
                  </div>
                  <blockquote className="p-3 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-100 dark:border-amber-900 text-slate-800 dark:text-slate-200 text-xs italic leading-relaxed">
                    “{selectedIncident.traceabilityResult.expertOriginalOpinion}”
                  </blockquote>
                </div>

                {/* Compromise Reason Block */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    当时为何折中通过？（历史决策背景调查）
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    {selectedIncident.traceabilityResult.compromiseReason}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 text-xs space-y-2">
                <span className="font-bold text-purple-900 dark:text-purple-300">
                  评审盲区分析：当时议题未覆盖该并发死锁场景
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  当时评审专家重点审查了字段映射与安全权限，未要求出具网络分区故障下的两阶段提交补偿演练报告，属于规则缺失。
                </p>
              </div>
            )}

            {/* Reverse Governance Action Feedback (The Evolution Loop) */}
            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-bold text-xs text-indigo-950 dark:text-indigo-200">
                    倒逼 DRB 架构治理规则库演化（红线升级）
                  </span>
                </div>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-200">
                  {selectedIncident.traceabilityResult.ruleEvolutionCode}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedIncident.traceabilityResult.governanceFeedbackAction}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-indigo-200/60 dark:border-indigo-900/60">
                <div className="text-[11px] text-slate-500">
                  状态：
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 ml-1">
                    {selectedIncident.traceabilityResult.ruleEvolutionStatus === 'ENFORCED'
                      ? '已正式生效并嵌入所有评审门禁'
                      : '已提报待批准'}
                  </span>
                </div>

                {selectedIncident.traceabilityResult.ruleEvolutionStatus !== 'ENFORCED' && (
                  <button
                    onClick={() => enforceRuleFromIncident(selectedIncident.id)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-xs"
                  >
                    批准规则强制生效写入红线库
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
