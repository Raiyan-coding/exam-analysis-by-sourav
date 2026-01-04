import React, { useState, useMemo } from 'react';
import { Home } from './components/Home';
import { PageLayout } from './components/PageLayout';
import { OverviewPage } from './components/OverviewPage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { SubjectsPage } from './components/SubjectsPage';
import { ComparisonPage } from './components/ComparisonPage';
import { SynergyPage } from './components/SynergyPage';
import { processData, calculateSynergy } from './utils/analytics';
import { SUBJECTS } from './constants';

type View = 'home' | 'overview' | 'leaderboard' | 'subjects' | 'comparison' | 'synergy';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');

  // Process data once at root level
  const { students, subjectStats, radarData } = useMemo(() => processData(), []);
  const synergyPairs = useMemo(() => calculateSynergy(students), [students]);

  // View routing handler
  const handleNavigate = (viewId: string) => {
    setCurrentView(viewId as View);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleDownloadCSV = () => {
    const headers = ['Student Name', 'Rank', 'Total Marks', 'Average %', 'Consistency', ...SUBJECTS];
    const rows = students.map(s => {
      const marks = s.marks.join(',');
      return `${s.name},${s.rank},${s.total},${s.average.toFixed(2)},${s.consistency},${marks}`;
    });

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_analytics_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewPage students={students} subjectStats={subjectStats} />;
      case 'leaderboard':
        return <LeaderboardPage students={students} subjectStats={subjectStats} />;
      case 'subjects':
        return <SubjectsPage students={students} subjectStats={subjectStats} />;
      case 'comparison':
        return <ComparisonPage students={students} radarData={radarData} />;
      case 'synergy':
        return <SynergyPage synergyPairs={synergyPairs} />;
      default:
        return null;
    }
  };

  // Get Title
  const getPageTitle = () => {
    switch (currentView) {
      case 'overview': return 'Class Overview';
      case 'leaderboard': return 'Leaderboard & Reports';
      case 'subjects': return 'Subject Analysis';
      case 'comparison': return 'Student Comparison';
      case 'synergy': return 'AI Synergy Insights';
      default: return '';
    }
  };

  if (currentView === 'home') {
    return <Home onNavigate={handleNavigate} />;
  }

  return (
    <PageLayout
      activePageId={currentView}
      title={getPageTitle()}
      onNavigate={handleNavigate}
      onBackToHome={handleBackToHome}
      onDownloadCSV={handleDownloadCSV}
    >
      {renderContent()}
    </PageLayout>
  );
};

export default App;