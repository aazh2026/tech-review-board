import React, { useState, useMemo } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { ReviewType, ImpactScope, RiskLevel, DRBLevel } from '../../types';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle, FileText, Upload } from 'lucide-react';

interface NewTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTopicModal: React.FC<NewTopicModalProps> = ({ isOpen, onClose }) => {
  const { addNewTopic, currentPersona, drbOrgs } = useGovernance();

  const [step, setStep] = useState<number>(1);

  // Form fields
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ReviewType>('总体架构评审');
  const [productFamily, setProductFamily] = useState('营销服务产品族');
  const [productName, setProductName] = useState('智能营销平台');
  const [moduleName, setModuleName] = useState('');
  const [background, setBackground] = useState('');
  const [objective, setObjective] = useState('');
  const [reviewAppeals, setReviewAppeals] = useState('');
  const [impactScope, setImpactScope] = useState<ImpactScope>('跨产品族');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('R1');
  const [expectedDate, setExpectedDate] = useState('2026-11-25');
  const [materialTitle, setMaterialTitle] = useState('架构设计说明书_初稿.pdf');

  // Automated Routing Calculation based on PRD Section 2.3
  const routingRecommendation = useMemo(() => {
    let recommendedLevel: DRBLevel = 'L3';
    let targetDrbId = 'drb_l3_mkt_core';
    let reason = '单产品/单模块常规设计方案，建议由L3产品级评审组承接。';

    if (impactScope === '跨产品族' || impactScope === '企业级' || riskLevel === 'R1' || type === '技术例外审批') {
      recommendedLevel = 'L1';
      targetDrbId = 'drb_l1_corp';
      reason = '触发企业级规则：涉及跨产品族影响、R1重大风险或规范例外审批，自动推荐至L1企业级技术DRB (EDRB)。';
    } else if (impactScope === '单产品族' || riskLevel === 'R2' || type === '产品架构评审') {
      recommendedLevel = 'L2';
      targetDrbId = 'drb_l2_mkt';
      reason = '涉及产品族总体架构演进与中台服务依赖，建议由L2产品族DRB承接。';
    }

    const matchedDrb = drbOrgs.find((d) => d.id === targetDrbId);

    return {
      recommendedLevel,
      targetDrbId,
      targetDrbName: matchedDrb?.name || '企业级技术DRB (EDRB)',
      reason,
    };
  }, [impactScope, riskLevel, type, drbOrgs]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNewTopic({
      title: title || '跨域技术治理新建议题',
      type,
      productFamily,
      productName,
      moduleName,
      background,
      objective,
      reviewAppeals,
      impactScope,
      riskLevel,
      level: routingRecommendation.recommendedLevel,
      currentDrbId: routingRecommendation.targetDrbId,
      currentDrbName: routingRecommendation.targetDrbName,
      expectedDate,
      routingReason: routingRecommendation.reason,
      materials: [
        {
          id: `mat_${Date.now()}`,
          title: materialTitle || '技术设计方案_v1.0.pdf',
          version: 'v1.0-draft',
          hash: 'sha256:0d9f48...pending_freeze',
          size: '3.2 MB',
          frozenAt: '申报中 (正式评审前冻结)',
          uploader: currentPersona.name,
          url: '#',
        },
      ],
      tags: [type, impactScope, riskLevel],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              新建技术评审议题 (Wizard 向导式填报)
            </h2>
            <p className="text-xs text-slate-500">
              模式 C：分级授权治理 · 系统将依据业务影响范围与风险等级自动计算推荐DRB
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          {[
            { num: 1, label: '01 基础信息' },
            { num: 2, label: '02 技术背景与诉求' },
            { num: 3, label: '03 影响评估与智能路由' },
            { num: 4, label: '04 评审申报材料' },
          ].map((item) => {
            const isDone = step > item.num;
            const isCurrent = step === item.num;
            return (
              <div
                key={item.num}
                className={`flex items-center gap-2 font-medium ${
                  isCurrent
                    ? 'text-slate-950 dark:text-white font-bold'
                    : isDone
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono ${
                    isCurrent
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3" /> : item.num}
                </span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Step Body */}
        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  议题名称 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：跨产品族Agent身份与任务级授权体系架构评审"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    评审类型 *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ReviewType)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="总体架构评审">总体架构评审</option>
                    <option value="产品架构评审">产品架构评审</option>
                    <option value="技术方案评审">技术方案评审</option>
                    <option value="技术选型评审">技术选型评审</option>
                    <option value="安全架构评审">安全架构评审</option>
                    <option value="性能与可靠性评审">性能与可靠性评审</option>
                    <option value="数据架构评审">数据架构评审</option>
                    <option value="AI应用工程评审">AI应用工程评审</option>
                    <option value="技术例外审批">技术例外审批</option>
                    <option value="技术风险专项评审">技术风险专项评审</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    所属产品族 *
                  </label>
                  <select
                    value={productFamily}
                    onChange={(e) => setProductFamily(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="营销服务产品族">营销服务产品族</option>
                    <option value="客户管理与交易产品族">客户管理与交易产品族</option>
                    <option value="跨产品族 (营销+交易)">跨产品族 (多产品族协同)</option>
                    <option value="基础技术底座">全集团基础技术底座</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    涉及产品名称
                  </label>
                  <input
                    type="text"
                    placeholder="例如：营销中台 / 统一Agent平台"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    关联子模块
                  </label>
                  <input
                    type="text"
                    placeholder="例如：Delegated Auth Token Gateway"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  技术背景与现状问题 *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="详细说明背景、现有痛点、为何需要发起此技术评审..."
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  建设目标与方案综述 *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="拟解决的核心指标、核心技术路线、方案预期效果..."
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  评审诉求 (希望DRB达成的明确结论) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="例如：1. 确认采用短效委托Token机制；2. 获得安全红线审查授权；3. 签署企业级ADR。"
                  value={reviewAppeals}
                  onChange={(e) => setReviewAppeals(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    影响范围评估 *
                  </label>
                  <select
                    value={impactScope}
                    onChange={(e) => setImpactScope(e.target.value as ImpactScope)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="单模块">单模块内部</option>
                    <option value="单产品">单产品跨模块</option>
                    <option value="单产品族">单产品族内跨产品</option>
                    <option value="跨产品族">跨产品族协同 (多业务线)</option>
                    <option value="企业级">企业级公共技术基线 / 全局底座</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    初始风险等级 *
                  </label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="R1">R1 - 重大风险 (涉及安全红线/资金/跨域主数据)</option>
                    <option value="R2">R2 - 较重风险 (中台重构/大规模高并发容量)</option>
                    <option value="R3">R3 - 一般风险 (常规技术选型与微服务改造)</option>
                    <option value="R4">R4 - 低风险 (局部模块非核心逻辑调整)</option>
                  </select>
                </div>
              </div>

              {/* Automated Routing Recommendation Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span>系统分级路由智能推荐 (规则引擎 BR-013)</span>
                  </div>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-950">
                    推荐级别：{routingRecommendation.recommendedLevel}
                  </span>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300">
                  受理DRB：<span className="font-semibold">{routingRecommendation.targetDrbName}</span>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  {routingRecommendation.reason}
                </div>
                <div className="text-[10px] text-slate-400">
                  注：最终评审组织经DRB秘书受理审查与主席核准后正式生效，若评审中发现影响范围扩大支持跨级升级。
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  期望评审完成日期
                </label>
                <input
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  主评审材料文件名称 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：Agent身份与任务级委托技术架构方案_v1.0.pdf"
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center space-y-2">
                <Upload className="w-8 h-8 mx-auto text-slate-400" />
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  点击上传架构方案、威胁建模表或性能压测基准文档
                </div>
                <div className="text-[11px] text-slate-400">
                  支持 PDF, DOCX, Markdown, Draw.io 格式（评审启动时系统将自动生成 SHA-256 不可篡改快照哈希）
                </div>
              </div>

              {/* Compliance & Redline acknowledgment */}
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>技术治理申报承诺</span>
                </div>
                <p>
                  申报人保证材料真实、无隐瞒高危安全和稳定性隐患。正式开会前材料将予以版本冻结，会议现场提出正式P0/P1意见必须逐一完成闭环。
                </p>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>上一步</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <span>下一步</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>正式提交立项申请</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
