import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { DRBOrg } from '../../types';
import {
  Network,
  Shield,
  Layers,
  FileCheck,
  CheckCircle2,
  Users,
  ChevronRight,
  ArrowUpRight,
  Plus,
  Calendar,
} from 'lucide-react';

export const DRBOrgView: React.FC = () => {
  const { drbOrgs, policies } = useGovernance();
  const [selectedDrbId, setSelectedDrbId] = useState<string>(drbOrgs[0].id);

  const selectedDrb = drbOrgs.find((d) => d.id === selectedDrbId) || drbOrgs[0];
  const matchedPolicy = policies.find((p) => p.drbId === selectedDrb.id) || policies[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>技术评审与决策管理平台</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">DRB组织与授权配置</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            三级DRB组织架构与分级授权矩阵 (模式 C)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            L1 企业级治理 + L2 产品族自治 + L3 产品级评审组，横向设立专业专项委员会
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            章程基线：v3.2 冻结生效
          </span>
        </div>
      </div>

      {/* Main Grid: Left Tree / Hierarchy, Right Details & Policy Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 cols: DRB Org Tree */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-slate-400">
              治理层级组织树 (纵向决策层级)
            </h3>

            <div className="space-y-2">
              {drbOrgs
                .filter((d) => d.level !== 'HORIZONTAL')
                .map((drb) => {
                  const isSelected = drb.id === selectedDrb.id;
                  return (
                    <button
                      key={drb.id}
                      onClick={() => setSelectedDrbId(drb.id)}
                      className={`w-full p-3 rounded-lg text-left transition-all border ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 border-transparent shadow-xs'
                          : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs truncate">{drb.name}</span>
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            isSelected
                              ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {drb.level}
                        </span>
                      </div>
                      <div
                        className={`text-[11px] truncate mt-1 ${
                          isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500'
                        }`}
                      >
                        主席：{drb.chairPerson} · 委员：{drb.activeMemberCount} 人
                      </div>
                    </button>
                  );
                })}
            </div>

            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              横向专项专家组 (专业能力与红线把关)
            </h3>

            <div className="space-y-2">
              {drbOrgs
                .filter((d) => d.level === 'HORIZONTAL')
                .map((drb) => {
                  const isSelected = drb.id === selectedDrb.id;
                  return (
                    <button
                      key={drb.id}
                      onClick={() => setSelectedDrbId(drb.id)}
                      className={`w-full p-3 rounded-lg text-left transition-all border ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 border-transparent shadow-xs'
                          : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs truncate">{drb.name}</span>
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            isSelected
                              ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          横向专项
                        </span>
                      </div>
                      <div
                        className={`text-[11px] truncate mt-1 ${
                          isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500'
                        }`}
                      >
                        组长：{drb.chairPerson} · 专员：{drb.activeMemberCount} 人
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Right 8 cols: Selected DRB Profile & Authorization Matrix */}
        <div className="lg:col-span-8 space-y-6">
          {/* DRB Card Overview */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {selectedDrb.code}
                  </span>
                  <span>·</span>
                  <span>层级：{selectedDrb.level}</span>
                  {selectedDrb.parentName && (
                    <>
                      <span>·</span>
                      <span>上级：{selectedDrb.parentName}</span>
                    </>
                  )}
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {selectedDrb.name}
                </h2>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                章程：{selectedDrb.charterVersion}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400">现任主席 / 组长</span>
                <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {selectedDrb.chairPerson}
                </div>
              </div>
              <div>
                <span className="text-slate-400">副主席 / 协理</span>
                <div className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {selectedDrb.viceChairPerson || '未设'}
                </div>
              </div>
              <div>
                <span className="text-slate-400">DRB秘书</span>
                <div className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {selectedDrb.secretary}
                </div>
              </div>
              <div>
                <span className="text-slate-400">在册表决委员</span>
                <div className="font-mono font-bold text-indigo-600 mt-0.5">
                  {selectedDrb.activeMemberCount} 人
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-slate-400">治理管辖范围</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {selectedDrb.scope}
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-slate-400">章程职责纲要</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                {selectedDrb.charterSummary}
              </p>
            </div>
          </div>

          {/* Authorization Policy Matrix (P06 Match) */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>分级授权策略矩阵 (模式C核心：授权与边界控制)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  严防越权：组织 + 议题范围 + 影响等级 + 风险等级 + 决策类型 + 授权期限
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                策略版本：{matchedPolicy.version}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">授权维度</th>
                    <th className="py-2.5 px-3">当前组织授权基线</th>
                    <th className="py-2.5 px-3">越权约束与强制升级条件</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-600 dark:text-slate-400">允许议题影响范围</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">
                      {matchedPolicy.allowedTopicScope.join(' / ')}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      超出范围必须自动触发L1升级流程 (BR-008)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-600 dark:text-slate-400">最高可承受风险等级</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {matchedPolicy.maxRiskLevel} (
                      {matchedPolicy.maxRiskLevel === 'R1' ? '重大风险' : matchedPolicy.maxRiskLevel === 'R2' ? '较重风险' : '一般/低'})
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      下级组织不得受理超出授权等级的高危事项
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-600 dark:text-slate-400">权能配置 (评/投/决)</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">
                      评审权：{matchedPolicy.canReview ? '✓ 允许' : '✕ 禁止'} · 
                      表决权：{matchedPolicy.canVote ? '✓ 允许' : '✕ 禁止'} · 
                      正式决策权：{matchedPolicy.canFormalDecide ? '✓ 授权范围内' : '✕ 仅出具专业意见'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      专项组织仅具备专业审查与红线阻断权，无最终业务行政签发权
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-600 dark:text-slate-400">技术例外审批权限</td>
                    <td className="py-2.5 px-3 font-medium">
                      {matchedPolicy.canApproveException ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ 具备企业例外批准特权</span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-bold">✕ 无权批准规范例外 (必须报批L1)</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      企业级技术基线具有强制性，严禁下级DRB自行豁免 (BR-005)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-600 dark:text-slate-400">授权有效期限</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                      {matchedPolicy.effectiveDate} 至 {matchedPolicy.expiryDate}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      到期前30天由集团技术委员会组织履职评价并续期
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mandatory Escalation Triggers Box */}
            <div className="p-4 rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-1.5 text-xs text-rose-900 dark:text-rose-300">
              <div className="font-bold flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-rose-600" />
                <span>法定强制升级触发条件 (Hard Escalation Triggers)</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-800 dark:text-rose-300">
                {matchedPolicy.mandatoryEscalationRules.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
