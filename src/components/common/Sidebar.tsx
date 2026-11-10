import React from 'react';
import { useGovernance, ActiveNavKey } from '../../context/GovernanceContext';
import {
  LayoutDashboard,
  FileText,
  Video,
  AlertCircle,
  Award,
  Network,
  ShieldAlert,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeNav, setActiveNav, stats, currentPersona } = useGovernance();

  // 精简易用的 5 大主流程阶段 + 组织与授权基线
  const coreFlowItems: {
    key: ActiveNavKey;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      key: 'workbench',
      label: '评审工作台',
      sublabel: '个人待办与流转大盘',
      icon: LayoutDashboard,
      badge: stats.pendingReview + stats.pendingRemediation,
    },
    {
      key: 'topics',
      label: '议题管理与申报',
      sublabel: '申报/受理/AI预审/全流程',
      icon: FileText,
      badge: stats.totalTopics,
    },
    {
      key: 'meeting',
      label: '评审会议与表决',
      sublabel: '议程讨论/各委员独立表决',
      icon: Video,
      badge: stats.pendingVote,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    },
    {
      key: 'comments',
      label: '意见与整改闭环',
      sublabel: 'P0-P3分级整改/证据核验',
      icon: AlertCircle,
      badge: stats.criticalIssuesCount,
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    },
    {
      key: 'decisions',
      label: '正式决策与ADR',
      sublabel: '授权裁决/版本化决策归档',
      icon: Award,
    },
    {
      key: 'drb',
      label: 'DRB组织与授权',
      sublabel: '三级治理层级与授权矩阵',
      icon: Network,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between select-none">
      <div className="p-4 space-y-4">
        {/* User Context Strip */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">当前代入角色</div>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
              {currentPersona.name}
            </span>
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {currentPersona.role.replace('_', ' ')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            {currentPersona.department}
          </p>
        </div>

        {/* Core Main Navigation */}
        <div className="space-y-1">
          <div className="px-2 pb-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            评审治理主流程
          </div>

          {coreFlowItems.map((item) => {
            const isActive = activeNav === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => setActiveNav(item.key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-medium shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-950 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white dark:text-slate-950' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate leading-tight">{item.label}</div>
                    <div
                      className={`text-[10px] truncate ${
                        isActive
                          ? 'text-slate-300 dark:text-slate-600'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                {item.badge !== undefined &&
                  (typeof item.badge === 'number' ? item.badge > 0 : Boolean(item.badge)) && (
                    <span
                      className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                          : item.badgeColor || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Core Governance Rule */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
          <span>三权分立与闭环基线</span>
        </div>
        <p className="text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
          专业评审权 ≠ 委员表决权 ≠ 授权决策权。P0/P1阻断项未经独立核验不得关闭。
        </p>
      </div>
    </aside>
  );
};
