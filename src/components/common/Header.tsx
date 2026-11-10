import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { UserPersona } from '../../types';
import { ChevronDown, Plus, UserCog, ArrowRight } from 'lucide-react';

interface HeaderProps {
  onOpenNewTopic: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewTopic }) => {
  const { currentPersona, users, switchPersonaByUser, setActiveNav } = useGovernance();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="w-full px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, single line */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-base shadow-sm">
            DRB
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight whitespace-nowrap">
                技术评审与决策管理平台
              </span>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                模式 C · 分级授权
              </span>
            </div>
          </div>
        </div>

        {/* Zone 3: Primary Action & Interactive Persona Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenNewTopic}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 rounded-lg hover:bg-slate-800 dark:hover:bg-white transition-all whitespace-nowrap shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建议题</span>
          </button>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
              title="切换演示角色以体验不同权责视图"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                {currentPersona.avatarText}
              </div>
              <div className="flex flex-col text-xs leading-tight">
                <span className="font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                  {currentPersona.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap max-w-[120px] truncate">
                  {currentPersona.roleLabel}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showPersonaMenu && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <span>切换法定角色 (系统实时用户)</span>
                  <span className="font-mono text-[10px]">{users.length} 位在册</span>
                </div>

                <div className="space-y-1 mt-1 max-h-80 overflow-y-auto">
                  {users.map((u) => {
                    const isSelected = u.id === currentPersona.id;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          switchPersonaByUser(u);
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors ${
                          isSelected
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white font-medium ring-1 ring-slate-300 dark:ring-slate-700'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {u.avatarText}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">{u.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {u.employeeNo}
                            </span>
                          </div>
                          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate">
                            {u.roleLabels.join(' · ')}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {u.technicalLevel} · {u.department}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNav('users');
                      setShowPersonaMenu(false);
                    }}
                    className="w-full py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <UserCog className="w-3.5 h-3.5 text-indigo-500" />
                      <span>配置用户档案与DRB权限矩阵</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
