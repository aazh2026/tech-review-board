import React, { useState, useMemo } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { ReviewType, DRBLevel, RiskLevel, TopicStatus } from '../../types';
import {
  Search,
  Filter,
  ArrowRight,
  Plus,
  Shield,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

interface TopicListViewProps {
  onOpenNewTopic: () => void;
}

export const TopicListView: React.FC<TopicListViewProps> = ({ onOpenNewTopic }) => {
  const { topics, setSelectedTopicId, setActiveDetailTab, currentPersona } = useGovernance();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedFamily, setSelectedFamily] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          t.title.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.ownerName.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Review Type
      if (selectedType !== 'ALL' && t.type !== selectedType) return false;

      // Level
      if (selectedLevel !== 'ALL' && t.level !== selectedLevel) return false;

      // Product Family
      if (selectedFamily !== 'ALL' && !t.productFamily.includes(selectedFamily)) return false;

      // Risk
      if (selectedRisk !== 'ALL' && t.riskLevel !== selectedRisk) return false;

      // Status
      if (statusFilter === 'MY') {
        return t.creatorName.includes(currentPersona.name) || t.ownerName.includes(currentPersona.name);
      }
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;

      return true;
    });
  }, [topics, searchQuery, selectedType, selectedLevel, selectedFamily, selectedRisk, statusFilter, currentPersona]);

  const handleRowClick = (topicId: string) => {
    setSelectedTopicId(topicId);
    setActiveDetailTab('overview');
  };

  const getStatusBadge = (status: TopicStatus) => {
    switch (status) {
      case 'PENDING_ACCEPTANCE':
        return (
          <span className="font-semibold text-xs text-amber-600 dark:text-amber-400">
            待受理立项
          </span>
        );
      case 'PREPARING':
        return (
          <span className="font-semibold text-xs text-sky-600 dark:text-sky-400">
            材料准备中
          </span>
        );
      case 'REVIEWING':
        return (
          <span className="font-semibold text-xs text-indigo-600 dark:text-indigo-400">
            正式评审中
          </span>
        );
      case 'DECISION_PENDING':
        return (
          <span className="font-semibold text-xs text-purple-600 dark:text-purple-400">
            待审批决策
          </span>
        );
      case 'CONDITIONAL_PASS':
        return (
          <span className="font-semibold text-xs text-amber-600 dark:text-amber-400">
            有条件通过 · 整改中
          </span>
        );
      case 'PASSED':
        return (
          <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">
            已正式通过
          </span>
        );
      case 'REJECTED':
        return (
          <span className="font-semibold text-xs text-rose-600 dark:text-rose-400">
            未通过 / 需重构
          </span>
        );
      case 'ESCALATED':
        return (
          <span className="font-semibold text-xs text-rose-600 dark:text-rose-400">
            已跨级升级至L1
          </span>
        );
      case 'CLOSED':
        return (
          <span className="font-semibold text-xs text-slate-500 dark:text-slate-400">
            已闭环归档
          </span>
        );
      default:
        return <span className="font-semibold text-xs text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>技术评审与决策管理平台</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">议题管理</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            全生命周期技术评审议题台账
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            涵盖申报登记、准入受理、智能路由分级、多轮评审、表决决策及整改闭环
          </p>
        </div>

        <button
          onClick={onOpenNewTopic}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 rounded-lg hover:bg-slate-800 transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>新建议题申报</span>
        </button>
      </div>

      {/* Segmented Quick Status Filter Buttons (Interactive controls) */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-xs">
        {[
          { key: 'ALL', label: '全部议题' },
          { key: 'MY', label: '与我有关' },
          { key: 'PENDING_ACCEPTANCE', label: '待受理' },
          { key: 'REVIEWING', label: '评审中' },
          { key: 'CONDITIONAL_PASS', label: '附条件整改中' },
          { key: 'DECISION_PENDING', label: '待决策' },
          { key: 'CLOSED', label: '已关闭' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setStatusFilter(item.key)}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              statusFilter === item.key
                ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索议题编号、标题或负责人..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="ALL">全部评审级别 (L1~L3)</option>
              <option value="L1">L1 企业级技术DRB</option>
              <option value="L2">L2 产品族DRB</option>
              <option value="L3">L3 产品级评审组</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="ALL">全部风险等级 (R1~R4)</option>
              <option value="R1">R1 重大风险</option>
              <option value="R2">R2 较重风险</option>
              <option value="R3">R3 一般风险</option>
              <option value="R4">R4 低风险</option>
            </select>
          </div>

          {/* Product Family */}
          <div>
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="ALL">全产品族组织</option>
              <option value="营销服务">营销服务产品族</option>
              <option value="客户管理">客户管理与交易产品族</option>
              <option value="跨产品族">跨产品族协同</option>
            </select>
          </div>
        </div>
      </div>

      {/* Topics Data Table */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <th className="py-3 px-4">议题编号</th>
                <th className="py-3 px-4 min-w-[280px]">议题名称</th>
                <th className="py-3 px-4">评审类型</th>
                <th className="py-3 px-4">归属产品族</th>
                <th className="py-3 px-4">级别 / DRB</th>
                <th className="py-3 px-4">风险</th>
                <th className="py-3 px-4">当前状态</th>
                <th className="py-3 px-4">负责人</th>
                <th className="py-3 px-4">计划时间</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTopics.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    暂无匹配的技术评审议题，可尝试重置过滤条件或新建申报
                  </td>
                </tr>
              ) : (
                filteredTopics.map((topic) => (
                  <tr
                    key={topic.id}
                    onClick={() => handleRowClick(topic.id)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {topic.code}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      <div className="max-w-md truncate">{topic.title}</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                        {topic.impactScope} · 涉及模块：{topic.moduleName || topic.productName}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {topic.type}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {topic.productFamily}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                          {topic.level}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate max-w-[120px]">
                          {topic.currentDrbName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold">
                      <span
                        className={
                          topic.riskLevel === 'R1'
                            ? 'text-rose-600 dark:text-rose-400'
                            : topic.riskLevel === 'R2'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-slate-600 dark:text-slate-400'
                        }
                      >
                        {topic.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(topic.status)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {topic.ownerName.split(' ')[0]}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {topic.expectedDate}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(topic.id);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="查看议题详情"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div>
            共检索到 <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{filteredTopics.length}</span> 项技术评审议题
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>L1重大决策数：{topics.filter((t) => t.level === 'L1').length}</span>
            <span>附条件整改中：{topics.filter((t) => t.status === 'CONDITIONAL_PASS').length}</span>
            <span>已闭环归档：{topics.filter((t) => t.status === 'CLOSED').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
