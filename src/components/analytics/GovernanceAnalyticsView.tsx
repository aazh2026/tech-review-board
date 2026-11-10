import React from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { BarChart3, Shield, Flame, GitFork, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export const GovernanceAnalyticsView: React.FC = () => {
  const { setActiveNav } = useGovernance();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>技术评审与决策管理平台</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">度量与质量分析</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            组织运行效能、质量倒查与专家贡献度量 (P13)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            组织效能指标 · 生产事故双向倒查溯源 · 架构决策依赖健康度 · 专家多维履职信用评级
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveNav('incidents')}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-xs font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1.5 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>事故倒查看板</span>
          </button>
          <button
            onClick={() => setActiveNav('adr-graph')}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-xs font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5 transition-colors"
          >
            <GitFork className="w-3.5 h-3.5 text-indigo-500" />
            <span>决策拓扑图谱</span>
          </button>
        </div>
      </div>

      {/* Metrics Row 1: Org Operation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400">议题受理及时率</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">96.8%</div>
          <div className="text-[11px] text-slate-400 mt-1">24小时内形式审查完成率</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400">首轮直接通过率</span>
          <div className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-200 mt-1">32.4%</div>
          <div className="text-[11px] text-slate-400 mt-1">体现严把关、附条件整改常态化</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400">重大问题闭环率</span>
          <div className="text-2xl font-bold font-mono text-indigo-600 mt-1">88.5%</div>
          <div className="text-[11px] text-slate-400 mt-1">P0/P1严重缺陷验证通过率</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400">生产故障评审预警率</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">66.7%</div>
          <div className="text-[11px] text-slate-400 mt-1">事故前历史评审已提前预警</div>
        </div>
      </div>

      {/* Quality & Multi-dimensional Expert Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <span>各产品族DRB运行效能分布</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span>营销服务产品族DRB</span>
                <span className="font-mono font-bold">8 项评审 · 闭环率 88.5%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '88.5%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>客户管理与交易DRB</span>
                <span className="font-mono font-bold">6 项评审 · 闭环率 94.2%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>L1 企业级DRB (跨产品族)</span>
                <span className="font-mono font-bold">4 项重大评审 · 闭环率 100%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>专家履职贡献信用榜 (建议 4)</span>
            </h3>
            <button
              onClick={() => setActiveNav('experts')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>查看负荷健康详情</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { name: '陆天恒', role: '首席安全官', score: 98, highlight: '识别35+项P0级致命安全缺陷，独立验证零延期' },
              { name: '张建国', role: '集团首席架构师', score: 96, highlight: '主持解决跨产品族分歧20+次，签发40+份权威ADR' },
              { name: '许立', role: 'AI应用工程专家', score: 94, highlight: '指导落地规范多智能体权限委托协议与防幻觉护栏' },
              { name: '李晨', role: '智能营销总架构师', score: 91, highlight: '缺陷修复平均耗时<48h (⚠️ 当前周评审工时13.5h过载)' },
            ].map((exp, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{exp.name}</span>
                    <span className="text-[10px] text-slate-500">{exp.role}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{exp.highlight}</div>
                </div>
                <div className="font-mono font-bold text-sm text-amber-600 shrink-0 ml-3">
                  {exp.score} 分
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
