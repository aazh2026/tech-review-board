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
import { MeetingConsoleView } from './components/meeting/MeetingConsoleView';
import { CommentRemediationView } from './components/comments/CommentRemediationView';
import { DecisionADRView } from './components/decisions/DecisionADRView';
import { DRBOrgView } from './components/drb/DRBOrgView';

const MainContent: React.FC = () => {
  const { activeNav, selectedTopicId } = useGovernance();
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);

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
          {activeNav === 'meeting' && <MeetingConsoleView />}
          {activeNav === 'comments' && <CommentRemediationView />}
          {activeNav === 'decisions' && <DecisionADRView />}
          {activeNav === 'drb' && <DRBOrgView />}
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
