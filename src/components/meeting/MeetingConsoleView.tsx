import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import {
  Video,
  Vote,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const MeetingConsoleView: React.FC = () => {
  const { session, currentPersona, ballot, castVote, submitComment } = useGovernance();
  const [meetingMode, setMeetingMode] = useState<'PRE' | 'IN' | 'POST'>('IN');
  const [inMeetingDesc, setInMeetingDesc] = useState('');
  const [inMeetingSev, setInMeetingSev] = useState<'P0' | 'P1' | 'P2' | 'P3'>('P1');
  const [readConfirmed, setReadConfirmed] = useState(true);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>技术评审与决策管理平台</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">评审会议室工作台</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            评审会议工作台 (P08 三模式控制台)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            会前预审预警 · 会中议程跟踪与实时意见转正式问题 · 会后表决封存与纪要发布
          </p>
        </div>

        {/* 3 Modes Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-xs">
          {[
            { key: 'PRE', label: '会前预审模式' },
            { key: 'IN', label: '会中评审模式' },
            { key: 'POST', label: '会后决策模式' },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setMeetingMode(m.key as any)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                meetingMode === m.key
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode 1: Pre-Meeting Mode */}
      {meetingMode === 'PRE' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              会前预审与阅读状态登记 (当前专家：{currentPersona.name})
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              根据DRB治理规则，评审委员必须在正式会议前完成申报材料快照审阅，标记阅读状态并预填潜在红线风险，避免不备而审。
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setReadConfirmed(!readConfirmed)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
                  readConfirmed
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{readConfirmed ? '已完成会前材料阅读确认' : '点击标记已阅读申报材料'}</span>
              </button>
              <span className="text-xs text-slate-400 font-mono">
                已审阅快照版本：v1.2-freeze (SHA-256已验签)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: In-Meeting Mode */}
      {meetingMode === 'IN' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Agenda & Live Discussion Log (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Video className="w-4 h-4 text-emerald-500" />
                  <span>会议实时议程同步</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 font-bold">
                  ● 进行中 (议程 5/6)
                </span>
              </div>

              <div className="space-y-2">
                {session.agendas.map((item, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg text-xs flex items-center justify-between ${
                      i === 4
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800'
                        : 'bg-slate-50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 w-20">{item.time}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</span>
                    </div>
                    <span className="text-slate-500">{item.speaker}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick in-meeting comment capture to formal issue */}
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                <span>会中快速登记技术意见并转正式整改问题</span>
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">严重度定级</label>
                  <select
                    value={inMeetingSev}
                    onChange={(e) => setInMeetingSev(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="P0">P0 - 阻断性缺陷 (安全红线/资金)</option>
                    <option value="P1">P1 - 严重问题 (架构设计缺陷)</option>
                    <option value="P2">P2 - 一般优化</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">提出专家</label>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs truncate">
                    {currentPersona.name} ({currentPersona.roleLabel})
                  </div>
                </div>
              </div>

              <textarea
                rows={2}
                placeholder="会中专家提出的具体技术异议或缺陷..."
                value={inMeetingDesc}
                onChange={(e) => setInMeetingDesc(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />

              <button
                onClick={() => {
                  if (!inMeetingDesc.trim()) return;
                  submitComment({
                    severity: inMeetingSev,
                    isFormal: true,
                    description: inMeetingDesc,
                    evidence: '会中专家提问与现场辩论确认',
                    section: '第4章',
                  });
                  setInMeetingDesc('');
                  alert('已将该意见确认为正式整改问题，纳入整改闭环追踪！');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 rounded-lg hover:bg-slate-800 transition-colors"
              >
                确认录入正式评审意见
              </button>
            </div>
          </div>

          {/* Right: Real-time Quorum & Vote Trigger (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Vote className="w-4 h-4 text-amber-500" />
                  <span>实时表决状态与门槛判定</span>
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                  实到 8/9 人 · 法定人数达标
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs space-y-2 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">法定有效表决数：</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {ballot.votedCount} 票
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">赞同票占比 (含附条件)：</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {Math.round(
                      ((ballot.results.agree + ballot.results.conditional) / ballot.votedCount) * 100
                    )}% (门槛 ≥ 67%)
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">系统计算表决结果：</span>
                  <span className="font-mono font-bold text-amber-600">{ballot.calculatedOutcome}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    castVote('CONDITIONAL', '会中现场表决：同意技术架构，但必须限期完成安全黑名单验证');
                    alert(`以 ${currentPersona.name} 身份完成表决提交！`);
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
                >
                  以当前身份在会中提交表决票
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Post-Meeting Mode */}
      {meetingMode === 'POST' && (
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            会后工作流：纪要生成、表决封存与正式决策草拟
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            评审会议已闭幕。系统已自动汇总意见列表并关联整改任务责任人；表决票据已完成电子封存。DRB秘书可生成会议纪要，授权决策人可前往“正式决策与ADR”页面签发最终结论。
          </p>
          <div className="pt-2 flex gap-3">
            <button
              onClick={() => alert('已生成并发布正式会议纪要：[TR-CORP-2026-0001 会议纪要_Round1.pdf]')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 rounded-lg hover:bg-slate-800 transition-colors"
            >
              发布正式评审会议纪要
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
