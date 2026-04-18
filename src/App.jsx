import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NavigationPanel from './pages/NavigationPanel';
import FoodModule from './pages/FoodModule';
import FacilityFinder from './pages/FacilityFinder';
import AdminDashboard from './pages/AdminDashboard';
import { useSimulation } from './utils/useSimulation';

function App() {
  const [activeView, setActiveView] = useState('view-home');
  const [navTarget, setNavTarget] = useState(''); // Shared navigation target

  const { 
    simulationData, 
    insights, 
    isEmergency, 
    toggleEmergency,
    adjustCrowd,
    isPeakHour,
    setPeakHour,
    userProfile,
    toggleUserType
  } = useSimulation();

  const handleQuickAction = (target) => {
    setNavTarget(target);
    setActiveView('view-nav');
  };

  const renderView = () => {
    switch (activeView) {
      case 'view-home':
        return (
          <Dashboard 
            simulationData={simulationData} 
            insights={insights} 
            isEmergency={isEmergency} 
            onAction={handleQuickAction}
          />
        );
      case 'view-nav':
        return (
          <NavigationPanel 
            simulationData={simulationData} 
            isEmergency={isEmergency} 
            initialTarget={navTarget}
            clearTarget={() => setNavTarget('')}
          />
        );
      case 'view-food':
        return <FoodModule simulationData={simulationData} isEmergency={isEmergency} />;
      case 'view-facilities':
        return (
          <FacilityFinder 
            isEmergency={isEmergency} 
            onAction={handleQuickAction} 
          />
        );
      case 'view-admin':
        return (
          <AdminDashboard 
            simulationData={simulationData} 
            adjustCrowd={adjustCrowd}
            isPeakHour={isPeakHour}
            setPeakHour={setPeakHour}
          />
        );
      default:
        return <Dashboard simulationData={simulationData} insights={insights} isEmergency={isEmergency} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isEmergency={isEmergency} 
        toggleEmergency={toggleEmergency} 
        userProfile={userProfile}
        toggleUserType={toggleUserType}
      />
      <main className="main-content">
        {isEmergency && (
          <div className="emergency-alert">
            <p><strong>Emergency Mode Activated:</strong> Please follow the safest routes to the nearest exit.</p>
          </div>
        )}
        {renderView()}
      </main>
    </div>
  );
}

export default App;
