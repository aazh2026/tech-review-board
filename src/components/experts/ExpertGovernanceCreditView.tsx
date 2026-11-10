import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import {
  Award,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  UserCheck,
  Star,
  Zap,
} from 'lucide-react';

export const ExpertGovernanceCreditView: React.FC = () => {
  const { expertCredits, currentPersona } = useGovernance();
  const [selectedExpertId, setSelectedExpertId] = useState<string>(expertCredits[0].expertId);

  const selectedExpert =
    expertCredits.find((e) => e.expertId === selectedExpertId) || expertCredits[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>演进优化建议 4 · 专家评审履职贡献与质量评价激励模型</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            专家评审履职信用评级与负荷健康大盘
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            打破“专家出勤不出声、评审走过场”与“明星架构师过度负荷”，构建有效质询率、独立验证履约与防疲劳熔断机制。
          </p>
        </div>

        {/* Global Statistics */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-right shadow-xs">
            <div className="text-[10px] text-slate-400">平均评审履职信用分</div>
            <div className="text-base font-bold text-emerald-600 font-mono">94.8 分</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-right shadow-xs">
            <div className="text-[10px] text-slate-400">负荷过载预警专家</div>
            <div className="text-base font-bold text-rose-600 font-mono">1 位 (李晨)</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Expert Profiles List + Detailed Credit Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Expert Roster with Credit Badges */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>核心专家评级总览 ({expertCredits.length})</span>
            <span className="text-[11px] text-slate-400">技术委员会评定</span>
          </div>

          <div className="space-y-2.5">
            {expertCredits.map((exp) => {
              const isSelected = exp.expertId === selectedExpertId;
              const isOverload = exp.loadStatus === 'OVERLOAD';

              return (
                <button
                  key={exp.expertId}
                  type="button"
                  onClick={() => setSelectedExpertId(exp.expertId)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md ring-2 ring-amber-400/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">{exp.name}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        信用 {exp.creditScore}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        isOverload
                          ? 'bg-rose-500 text-white'
                          : exp.loadStatus === 'MODERATE'
                          ? isSelected
                            ? 'bg-amber-500 text-white'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : isSelected
                          ? 'bg-emerald-500 text-white'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {isOverload ? '⚡ 负荷过载' : exp.loadStatus === 'MODERATE' ? '适中' : '健康'}
                    </span>
                  </div>

                  <div
                    className={`mt-1 text-[11px] truncate ${
                      isSelected ? 'text-slate-300 dark:text-slate-700' : 'text-slate-500'
                    }`}
                  >
                    {exp.title}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/40 dark:border-slate-700/40 flex items-center justify-between text-[11px]">
                    <span className={isSelected ? 'text-slate-300 dark:text-slate-700' : 'text-slate-400'}>
                      采纳意见：{exp.totalCommentsAdoptedCount} 项
                    </span>
                    <span className="font-mono font-medium">
                      周工时：{exp.weeklyReviewHours}h / 12h
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Governance Principle Card */}
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
            <span className="font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>智能防疲劳熔断保护机制</span>
            </span>
            <p className="text-[11px] leading-relaxed">
              当单周评审工时超过 12 小时阀值时，系统智能推荐引擎将自动对该专家进行降权分流，防止核心架构师因会议过度透支导致技术判断力下降。
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Deep Credit Radar & Badges Wall */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header Expert Profile Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-lg border border-amber-500/20">
                  {selectedExpert.name.substring(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {selectedExpert.name}
                    </h2>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {selectedExpert.department}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedExpert.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">履职综合信用分</div>
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">
                    {selectedExpert.creditScore} / 100
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Dimension Operational Credit KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">有效质询率 (入ADR比例)</span>
                <div className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {selectedExpert.criticalCatchRate}%
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">高价值发声</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">独立验证核签 SLA 达成率</span>
                <div className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {selectedExpert.verificationSlaRate}%
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">零延期滞后</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">法定会议出席率</span>
                <div className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {selectedExpert.attendanceRate}%
                </div>
                <div className="text-[10px] text-slate-500 font-medium">达标 (≥2/3)</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">采纳为正式约束意见</span>
                <div className="text-base font-bold text-indigo-600 font-mono">
                  {selectedExpert.totalCommentsAdoptedCount} 项
                </div>
                <div className="text-[10px] text-slate-500 font-medium">硬约束条文</div>
              </div>
            </div>

            {/* Weekly Load Health Meter with Anti-Burnout Warning */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  <span>当前周评审工时与负荷水位</span>
                </span>
                <span className="font-mono text-slate-500">
                  {selectedExpert.weeklyReviewHours} / {selectedExpert.maxWeeklyHours} 小时
                </span>
              </div>

              <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                <div
                  style={{
                    width: `${Math.min(
                      (selectedExpert.weeklyReviewHours / selectedExpert.maxWeeklyHours) * 100,
                      100
                    )}%`,
                  }}
                  className={`transition-all ${
                    selectedExpert.loadStatus === 'OVERLOAD'
                      ? 'bg-rose-500'
                      : selectedExpert.loadStatus === 'MODERATE'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
              </div>

              {selectedExpert.loadStatus === 'OVERLOAD' && (
                <div className="p-2.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>已触发防疲劳熔断阈值：建议由 DRB 秘书分流指派其他同领域架构师接单。</span>
                  </span>
                  <button
                    onClick={() => alert('已执行智能减压：后续新建议题自动对该专家降权。')}
                    className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold shrink-0 ml-2"
                  >
                    立即分流减压
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Badges Wall & Career Recommendation */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  集团技术委员会荣誉勋章与职级认证
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">荣誉终身留痕</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {selectedExpert.badges.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-amber-950 dark:text-amber-200">{b.name}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-200/80 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                      {b.level === 'GOLD' ? '金牌荣誉' : '银牌荣誉'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {b.description}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono pt-1">授予时间：{b.dateGranted}</div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px]">
                  技术职级委员会认证评价：
                </span>
                <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                  {selectedExpert.careerRecommendation}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono text-[11px] font-bold">
                T序列晋升优选专家
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
