import React, { useState, useMemo } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { Search, Sparkles } from 'lucide-react';

export const ExpertPoolView: React.FC = () => {
  const { experts } = useGovernance();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  const [simTopicDomain, setSimTopicDomain] = useState('安全架构');
  const [simTopicRisk, setSimTopicRisk] = useState('R1');
  const [simProductFamily, setSimProductFamily] = useState('跨产品族 (营销+交易)');

  const filteredExperts = useMemo(() => {
    return experts.filter((exp) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          exp.name.toLowerCase().includes(q) ||
          exp.department.toLowerCase().includes(q) ||
          exp.title.toLowerCase().includes(q) ||
          exp.techTags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (selectedDomain !== 'ALL' && !exp.domains.includes(selectedDomain)) return false;
      if (selectedLevel !== 'ALL' && exp.capabilityLevel !== selectedLevel) return false;
      return true;
    });
  }, [experts, searchQuery, selectedDomain, selectedLevel]);

  const recommendedExperts = useMemo(() => {
    return experts
      .map((exp) => {
        let score = 50;
        const reasons: string[] = [];

        if (exp.domains.includes(simTopicDomain)) {
          score += 30;
          reasons.push(`专业领域高度匹配 (${simTopicDomain})`);
        }
        if (simTopicRisk === 'R1' && exp.capabilityLevel === 'L1_CHIEF') {
          score += 15;
          reasons.push('具备重大风险审查资格 (L1 Chief)');
        }
        if (exp.currentLoad < 2) {
          score += 10;
          reasons.push('当前评审负载适中 (良好排期)');
        } else {
          score -= 10;
          reasons.push('当前承担较多在审议题');
        }

        let conflict = false;
        if (exp.name === '李晨' && simTopicDomain.includes('AI')) {
          conflict = true;
          reasons.push('利益冲突回避：为方案发起团队成员 (仅可列席答辩)');
          score = 10;
        }

        return { expert: exp, score, reasons, conflict };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [experts, simTopicDomain, simTopicRisk, simProductFamily]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>技术评审与决策管理平台</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">专家库管理</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            企业级统一专家资源池 (跨产品族共享)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            专业能力统一认证、跨层级任职、动态负载均衡与利益冲突回避 (FR-03)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            在库专家：{experts.length} 名
          </span>
        </div>
      </div>

      {/* Intelligent Expert Recommendation Simulator */}
      <div className="p-5 rounded-xl bg-slate-900 text-white dark:bg-slate-800/90 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                智能评审专家推荐匹配器 (规则驱动 + 利益回避)
              </h3>
              <p className="text-[11px] text-slate-300">
                综合专业领域、能力等级、当前工作负载与利益冲突状态，辅助DRB秘书选拔最佳专家组
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
            三权分立：系统推荐 ≠ 自动赋予表决权
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">拟匹配专业方向</label>
            <select
              value={simTopicDomain}
              onChange={(e) => setSimTopicDomain(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-white"
            >
              <option value="总体架构">总体架构与分布式系统</option>
              <option value="安全架构">安全合规与密码学 (红线)</option>
              <option value="AI工程">AI应用与Agent工程</option>
              <option value="性能高可用">性能容量与多活容灾</option>
              <option value="数据架构">数据架构与湖仓一体</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">拟匹配风险等级</label>
            <select
              value={simTopicRisk}
              onChange={(e) => setSimTopicRisk(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-white"
            >
              <option value="R1">R1 重大风险 (要求L1首席级别)</option>
              <option value="R2">R2 较重风险 (L2高级专家)</option>
              <option value="R3">R3 一般风险 (骨干专家)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">申报所属组织</label>
            <select
              value={simProductFamily}
              onChange={(e) => setSimProductFamily(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-white"
            >
              <option value="营销服务产品族">营销服务产品族</option>
              <option value="客户管理与交易产品族">客户管理与交易产品族</option>
              <option value="跨产品族 (营销+交易)">跨产品族 (多产品族协同)</option>
            </select>
          </div>
        </div>

        {/* Matched Recommendations Result Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {recommendedExperts.map((rec, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                rec.conflict
                  ? 'bg-rose-950/40 border-rose-800/80'
                  : 'bg-slate-800/60 border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{rec.expert.name}</span>
                <span className="font-mono text-[11px] font-bold text-indigo-400">
                  匹配度：{rec.score}%
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {rec.expert.title} · {rec.expert.department}
              </div>
              <div className="space-y-1 pt-1 border-t border-slate-700/60 text-[11px]">
                {rec.reasons.map((r, i) => (
                  <div key={i} className={rec.conflict ? 'text-rose-300' : 'text-slate-300'}>
                    · {r}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索专家姓名、专业标签或部门..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-64"
            />
          </div>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            <option value="ALL">全部专业领域</option>
            <option value="总体架构">总体架构</option>
            <option value="安全架构">安全架构</option>
            <option value="AI工程">AI工程</option>
            <option value="性能高可用">性能高可用</option>
            <option value="数据架构">数据架构</option>
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            <option value="ALL">全部能力层级</option>
            <option value="L1_CHIEF">L1 首席专家</option>
            <option value="L2_SENIOR">L2 高级专家</option>
            <option value="L3_STAFF">L3 骨干专家</option>
          </select>
        </div>

        <span className="text-xs text-slate-500">
          筛选出 <span className="font-bold text-slate-900 dark:text-slate-100">{filteredExperts.length}</span> 位在册专家
        </span>
      </div>

      {/* Expert Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExperts.map((exp) => (
          <div
            key={exp.id}
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{exp.name}</h3>
                <div className="text-xs text-slate-500 truncate mt-0.5">{exp.title}</div>
                <div className="text-[11px] text-slate-400 truncate">{exp.department}</div>
              </div>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {exp.capabilityLevel.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="text-[11px] text-slate-400">专业领域</div>
              <div className="flex flex-wrap gap-1">
                {exp.domains.map((dom, i) => (
                  <span
                    key={i}
                    className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {dom}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="text-[11px] text-slate-400">技术标签</div>
              <div className="flex flex-wrap gap-1">
                {exp.techTags.map((tag, i) => (
                  <span key={i} className="text-[10px] text-slate-600 dark:text-slate-400">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">历史评审 / 重大把关</span>
                <div className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {exp.reviewCount} 次 / {exp.criticalRisksFound} 处
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">当前在审负载</span>
                <div className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {exp.currentLoad} 个活跃议题
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
              <span>资格有效至：{exp.validUntil}</span>
              <span className="text-emerald-600 font-medium">● 状态正常</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
