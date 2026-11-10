import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import {
  Network,
  GitFork,
  ArrowRight,
  AlertTriangle,
  Layers,
  Shield,
  Zap,
  CheckCircle2,
  FileText,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const ADRGraphView: React.FC = () => {
  const { adrGraph, setActiveNav, setSelectedTopicId } = useGovernance();
  const [selectedAdrCode, setSelectedAdrCode] = useState<string>('ADR-2026-001');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationType, setSimulationType] = useState<'DEPRECATE' | 'BREAKING_CHANGE'>('BREAKING_CHANGE');

  const selectedNode = adrGraph.find((n) => n.adrCode === selectedAdrCode) || adrGraph[0];

  // Upstream dependencies of selected ADR
  const upstreamDeps = selectedNode.dependencies;

  // Downstream ADRs that depend on selected ADR
  const downstreamAdrs = adrGraph.filter((n) =>
    n.dependencies.some((d) => d.targetAdrCode === selectedAdrCode)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
            <Network className="w-4 h-4" />
            <span>演进优化建议 2 · 跨产品族架构决策网络与变更推演</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            跨产品族 ADR 依赖拓扑图谱与失效推演
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            将孤立卡片式 ADR 升级为企业级决策有向无环图 (DAG)，在线推演基础架构变更对下游业务的级联影响。
          </p>
        </div>

        {/* Global Topology Metrics */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-right shadow-xs">
            <div className="text-[10px] text-slate-400">已入库架构决策节点</div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">
              {adrGraph.length} 个
            </div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-right shadow-xs">
            <div className="text-[10px] text-slate-400">跨产品族依赖关联</div>
            <div className="text-base font-bold text-indigo-600 font-mono">
              {adrGraph.reduce((acc, curr) => acc + curr.dependencies.length, 0)} 条
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: ADR Network Browser + Impact Simulation Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual ADR Network Nodes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>决策网络节点 ({adrGraph.length})</span>
            <span className="text-[11px] text-slate-400">点击切换审查焦点</span>
          </div>

          <div className="space-y-2.5">
            {adrGraph.map((node) => {
              const isSelected = node.adrCode === selectedAdrCode;

              return (
                <button
                  key={node.adrCode}
                  type="button"
                  onClick={() => {
                    setSelectedAdrCode(node.adrCode);
                    setIsSimulating(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold">{node.adrCode}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        node.status === 'ACCEPTED'
                          ? isSelected
                            ? 'bg-emerald-500 text-white'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : node.status === 'PROPOSED'
                          ? isSelected
                            ? 'bg-amber-500 text-white'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold mt-2 line-clamp-1">{node.title}</h3>

                  <div
                    className={`mt-2 flex items-center justify-between text-[11px] ${
                      isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400'
                    }`}
                  >
                    <span>{node.domain}</span>
                    <span>级联下游：{node.downstreamCount} 服务</span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/40 dark:border-slate-700/40 flex items-center gap-2 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {node.level} {node.level === 'L1' ? '企业级' : '产品族级'}
                    </span>
                    <span className="truncate">{node.ownerProductFamily}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Node Details & Dynamic Impact Simulator */}
        <div className="lg:col-span-2 space-y-5">
          {/* Target ADR Node Profile */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedNode.adrCode}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {selectedNode.ownerProductFamily}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {selectedNode.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs ${
                    isSimulating
                      ? 'bg-rose-600 text-white hover:bg-rose-500'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSimulating ? '退出影响推演' : '发起变更失效推演'}</span>
                </button>
              </div>
            </div>

            {/* Direct Topology Dependencies (Upstream & Downstream) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Upstream Dependencies */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-500" />
                    <span>上游依赖规范 ({upstreamDeps.length})</span>
                  </span>
                  <span className="text-[10px] text-slate-400">当前方案必须遵守</span>
                </div>

                {upstreamDeps.length > 0 ? (
                  <div className="space-y-2">
                    {upstreamDeps.map((dep, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                            {dep.targetAdrCode}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                              dep.relationType === 'DEPENDS_ON'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                : dep.relationType === 'SUPERSEDES'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            }`}
                          >
                            {dep.relationType}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                          {dep.targetTitle}
                        </div>
                        <div className="text-[10px] text-slate-500">{dep.description}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 py-4 text-center">
                    该决策为基础顶层规范，无上游依赖。
                  </div>
                )}
              </div>

              {/* Downstream Impacted Decisions */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <GitFork className="w-4 h-4 text-emerald-500" />
                    <span>级联依赖本规范的决策 ({downstreamAdrs.length})</span>
                  </span>
                  <span className="text-[10px] text-slate-400">下游受控范围</span>
                </div>

                {downstreamAdrs.length > 0 ? (
                  <div className="space-y-2">
                    {downstreamAdrs.map((dNode) => (
                      <div
                        key={dNode.adrCode}
                        className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                            {dNode.adrCode}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {dNode.level} 级
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                          {dNode.title}
                        </div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          所属：{dNode.ownerProductFamily}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 py-4 text-center">
                    暂无下游 ADR 显式依赖本规范。
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Simulation Sandbox */}
          {isSimulating ? (
            <div className="p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/20 border-2 border-rose-300 dark:border-rose-800 space-y-4 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200 font-bold">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span className="text-sm">变更失效推演模拟沙盒（假设对 {selectedNode.adrCode} 作出调整）</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSimulationType('BREAKING_CHANGE')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                      simulationType === 'BREAKING_CHANGE'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    破坏性协议升级
                  </button>
                  <button
                    onClick={() => setSimulationType('DEPRECATE')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                      simulationType === 'DEPRECATE'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    废弃/退役该决策
                  </button>
                </div>
              </div>

              {/* Simulation Results Breakdown */}
              <div className="p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-rose-200 dark:border-rose-900/80 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50">
                    <span className="text-[10px] text-slate-500">波及微服务数量</span>
                    <div className="text-base font-bold text-rose-600 font-mono mt-0.5">
                      {selectedNode.impactedServices.length} 个核心系统
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50">
                    <span className="text-[10px] text-slate-500">直接冲击下游ADR</span>
                    <div className="text-base font-bold text-rose-600 font-mono mt-0.5">
                      {downstreamAdrs.length} 份
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50">
                    <span className="text-[10px] text-slate-500">架构冲突阻断级别</span>
                    <div className="text-base font-bold text-rose-600 font-mono mt-0.5">
                      P0 强制阻断
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50">
                    <span className="text-[10px] text-slate-500">推演裁决要求</span>
                    <div className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">
                      需 L1 主席重新召开听证会
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    受影响系统明细与迁移代价分析：
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedNode.impactedServices.map((svc, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-medium text-slate-800 dark:text-slate-200"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    根据《模式 C 分级授权规范》，由于 {selectedNode.adrCode} 属于 {selectedNode.level} 级基线，任何重大破损性变更均禁止产品团队单方面发布，必须在企业级 DRB 重新提报架构例外审批或立项升级议题。
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>当前拓扑网络健康，无冲突违规依赖。点击上方「发起变更失效推演」可模拟破坏性变更。</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
