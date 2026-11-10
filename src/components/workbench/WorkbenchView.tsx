import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Shield,
  FileCheck,
  Calendar,
  Vote,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const WorkbenchView: React.FC = () => {
  const {
    currentPersona,
    stats,
    setActiveNav,
    setSelectedTopicId,
    setActiveDetailTab,
    topics,
    comments,
    ballot,
    session,
  } = useGovernance();

  const [workbenchTab, setWorkbenchTab] = useState<'personal' | 'org'>('personal');

  const handleOpenTopic = (topicId: string, targetTab: string = 'overview') => {
    setSelectedTopicId(topicId);
    setActiveDetailTab(targetTab);
    setActiveNav('topics');
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>技术评审与决策管理平台</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">评审工作台</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            个人与组织评审工作台
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            当前身份：<span className="font-semibold text-slate-800 dark:text-slate-200">{currentPersona.name}</span> · {currentPersona.roleLabel}（可随时在顶栏切换演示角色）
          </p>
        </div>

        {/* View Filter Switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
          <button
            onClick={() => setWorkbenchTab('personal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              workbenchTab === 'personal'
                ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            个人待办任务
          </button>
          <button
            onClick={() => setWorkbenchTab('org')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              workbenchTab === 'org'
                ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            DRB组织大盘
          </button>
        </div>
      </div>

      {/* KPI Stats Strip (PRD Prototype P01 Match) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>待评审议题</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 font-mono tabular-nums">
            {stats.pendingReview}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">需在会前完成材料预审与风险标识</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>待表决投票</span>
            <Vote className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2 font-mono tabular-nums">
            {stats.pendingVote}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">法定2/3出席门槛与赞成率核算中</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>待闭环整改</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2 font-mono tabular-nums">
            {stats.pendingRemediation}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">P0/P1阻断性缺陷须独立验证</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>待审批决策</span>
            <Shield className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 font-mono tabular-nums">
            {stats.pendingDecision}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">需授权决策人签发正式结论并归档ADR</div>
        </div>
      </div>

      {workbenchTab === 'personal' ? (
        /* Personal Action Items Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Action Queue (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>待办优先任务</span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 font-normal">
                  实时同步
                </span>
              </h2>
              <span className="text-xs text-slate-500">按截止时间智能排序</span>
            </div>

            {/* Task Card 1: Flagship Agent Case */}
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                      TR-CORP-2026-0001
                    </span>
                    <span>·</span>
                    <span className="text-rose-600 dark:text-rose-400 font-medium">R1 重大风险</span>
                    <span>·</span>
                    <span>L1 企业级DRB</span>
                    <span>·</span>
                    <span>跨产品族</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1 hover:text-indigo-600 transition-colors">
                    跨产品族Agent身份与任务级授权体系架构评审
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">
                  整改验证中 (P0安全项待确认)
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                当前李晨已提交网关短效Token实时黑名单吊销PR代码与5万QPS压测数据。待首席安全官陆天恒执行独立验证测试，决定是否解除阻断并关闭强制条件。
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>整改截止日期：2026-11-15</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenTopic('topic_flagship_agent', 'comments')}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    查看整改证据
                  </button>
                  <button
                    onClick={() => handleOpenTopic('topic_flagship_agent', 'overview')}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <span>查看议题详情</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Task Card 2: Marketing Reach Engine */}
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                      TR-MKT-2026-0032
                    </span>
                    <span>·</span>
                    <span className="text-amber-600 dark:text-amber-400 font-medium">R2 较重风险</span>
                    <span>·</span>
                    <span>L2 营销服务DRB</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    营销服务产品族全域触达引擎高并发升级方案
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shrink-0">
                  评审中 · 待会前预审
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Netty自研连接池与Kafka百万级消息积压消费架构方案申报。需要营销产品族评审委员在会前完成材料阅读与预审意见登记。
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>会议拟定时间：2026-11-18 10:00</span>
                </div>
                <button
                  onClick={() => handleOpenTopic('topic_2', 'session')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <span>会前预审材料</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Task Card 3: POS Gateway mTLS Exception */}
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                      TR-SEC-2026-0008
                    </span>
                    <span>·</span>
                    <span className="text-rose-600 dark:text-rose-400 font-medium">R1 企业基线例外</span>
                    <span>·</span>
                    <span>L1 企业级DRB</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    混合云网关mTLS双向认证规范例外申请
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shrink-0">
                  待授权决策人最终审批
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                无记名投票表决已完成（通过率85.7%），但因触及企业级安全基线豁免，必须经首席架构师张建国与首席安全官陆天恒联合签发6个月限期豁免许可。
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <Shield className="w-3.5 h-3.5 text-purple-500" />
                  <span>审批期限：今日 18:00 前</span>
                </div>
                <button
                  onClick={() => handleOpenTopic('topic_4', 'decision')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <span>处理决策审批</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Upcoming Sessions & Governance Alerts */}
          <div className="space-y-6">
            {/* Recent Meetings Card */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>近期评审会议日程</span>
                </h3>
                <span className="text-[11px] text-slate-400">已排期 2 场</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      第1轮 跨产品族Agent架构表决复盘
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      已圆满完成
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    时间：2026-11-06 14:00 · 801决策厅 / 视频
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    实到 8/9 人，表决达成法定多数，形成ADR-2026-001。
                  </div>
                  <button
                    onClick={() => setActiveNav('meeting')}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 pt-1"
                  >
                    <span>进入会议工作台查看纪要</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      全域触达引擎高并发升级预审会
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300">
                      待召开
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    时间：2026-11-18 10:00 · 营销服务线上会议室
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    主讲人：王凯 · 受邀专家：王海平、赵晴、冯志高
                  </div>
                </div>
              </div>
            </div>

            {/* Redline Boundary Governance Card */}
            <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-slate-800/90 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold tracking-tight">企业治理基线守则 (模式C)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                本平台受DRB章程硬约束：评审权属于专家专业判断；表决权须满足出席及法定门槛；正式决策权不可越权。未完成整改验证前禁止软着陆关闭。
              </p>
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">规则版本：v3.2 全局冻结</span>
                <button
                  onClick={() => setActiveNav('drb')}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <span>查阅授权矩阵</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Organization Health & DRB Overview Tab */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-500">L1 企业级DRB运行情况</span>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                本月评审 4 项 / 跨域仲裁 1 项
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                平均评审耗时 6.2 天，重大风险拦截率 100%，无越权决策事件。
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-500">L2 营销服务DRB运行情况</span>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                本月评审 8 项 / 升级L1 1 项
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                整改闭环率 88.5%，专家资源利用率良好，安全专家参与度 92%。
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-500">L2 客户管理与交易DRB</span>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                本月评审 6 项 / 已归档 5 项
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                完成Lakehouse选型落地与交易限流基线加固，整改逾期率为 0%。
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              全集团重大技术风险与整改态势
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="pb-3 font-semibold">意见编号</th>
                    <th className="pb-3 font-semibold">关联议题</th>
                    <th className="pb-3 font-semibold">严重等级</th>
                    <th className="pb-3 font-semibold">整改责任人</th>
                    <th className="pb-3 font-semibold">独立验证人</th>
                    <th className="pb-3 font-semibold">截止日期</th>
                    <th className="pb-3 font-semibold">当前状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {comments.map((cmt) => (
                    <tr key={cmt.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-mono font-medium">{cmt.code}</td>
                      <td className="py-3 font-medium text-slate-900 dark:text-slate-100 max-w-xs truncate">
                        {cmt.description}
                      </td>
                      <td className="py-3">
                        <span
                          className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                            cmt.severity === 'P0'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              : cmt.severity === 'P1'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {cmt.severity}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">{cmt.assigneeName || '-'}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">{cmt.verifierName || '-'}</td>
                      <td className="py-3 font-mono text-slate-500">{cmt.dueDate || '-'}</td>
                      <td className="py-3">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {cmt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
