/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GovernanceProvider, useGovernance } from './context/GovernanceContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { WorkbenchView } from './components/workbench/WorkbenchView';
import { TopicListView } from './components/topics/TopicListView';
import { TopicDetailView } from './components/topics/TopicDetailView';
import { NewTopicModal } from './components/topics/NewTopicModal';
import { DRBOrgView } from './components/drb/DRBOrgView';
import { ExpertPoolView } from './components/experts/ExpertPoolView';
import { ExpertGovernanceCreditView } from './components/experts/ExpertGovernanceCreditView';
import { MeetingConsoleView } from './components/meeting/MeetingConsoleView';
import { CommentRemediationView } from './components/comments/CommentRemediationView';
import { DecisionADRView } from './components/decisions/DecisionADRView';
import { GovernanceAnalyticsView } from './components/analytics/GovernanceAnalyticsView';
import { IncidentTraceabilityView } from './components/incidents/IncidentTraceabilityView';
import { ADRGraphView } from './components/decisions/ADRGraphView';
import { UserManagementView } from './components/users/UserManagementView';

const MainContent: React.FC = () => {
  const { activeNav, selectedTopicId } = useGovernance();
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [expertSubTab, setExpertSubTab] = useState<'credit' | 'pool'>('credit');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <Header onOpenNewTopic={() => setShowNewTopicModal(true)} />

      <div className="flex-1 flex w-full">
        <Sidebar />

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {activeNav === 'workbench' && <WorkbenchView />}
          {activeNav === 'topics' && (
            selectedTopicId ? (
              <TopicDetailView />
            ) : (
              <TopicListView onOpenNewTopic={() => setShowNewTopicModal(true)} />
            )
          )}
          {activeNav === 'incidents' && <IncidentTraceabilityView />}
          {activeNav === 'adr-graph' && <ADRGraphView />}
          {activeNav === 'decisions' && <DecisionADRView />}
          {activeNav === 'drb' && <DRBOrgView />}
          {activeNav === 'users' && <UserManagementView />}
          {activeNav === 'experts' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setExpertSubTab('credit')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    expertSubTab === 'credit'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  履职信用评级与负荷健康大盘 (建议 4)
                </button>
                <button
                  type="button"
                  onClick={() => setExpertSubTab('pool')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    expertSubTab === 'pool'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  专家档案库与智能推荐匹配 (P07)
                </button>
              </div>
              {expertSubTab === 'credit' ? <ExpertGovernanceCreditView /> : <ExpertPoolView />}
            </div>
          )}
          {activeNav === 'meeting' && <MeetingConsoleView />}
          {activeNav === 'comments' && <CommentRemediationView />}
          {activeNav === 'decisions' && <DecisionADRView />}
          {activeNav === 'analytics' && <GovernanceAnalyticsView />}
        </main>
      </div>

      <NewTopicModal
        isOpen={showNewTopicModal}
        onClose={() => setShowNewTopicModal(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <GovernanceProvider>
      <MainContent />
    </GovernanceProvider>
  );
}

