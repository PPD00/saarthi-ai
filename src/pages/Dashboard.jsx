import React from 'react';
import { 
  Bell, 
  Gear, 
  MagicWand, 
  Lightning, 
  Toilet, 
  FirstAid, 
  UsersThree,
  ArrowRight,
  Buildings
} from '@phosphor-icons/react';

const CrowdStatusGrid = ({ zones }) => {
  return (
    <div className="crowd-stats-grid">
      {zones.map(zone => {
        const percentage = (zone.currentCount / zone.maxCapacity) * 100;
        let color = 'var(--accent-green)';
        if (percentage > 75) color = 'var(--accent-red)';
        else if (percentage > 40) color = 'var(--accent-yellow)';
        
        return (
          <div key={zone.id} className="stat-box" style={{ borderLeft: `4px solid ${color}`, background: 'rgba(255,255,255,0.02)' }}>
            <div className="stat-header">
              <span style={{ fontWeight: 'bold', color: '#fff' }}>{zone.name}</span>
            </div>
            <div className="stat-value" style={{ color }}>{Math.round(percentage)}% Capacity</div>
            <div className="progress-container" style={{ background: '#222' }}>
              <div className="progress-bar" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Dashboard = ({ simulationData, insights, isEmergency, onAction }) => {
  return (
    <section className="view active">
      <header className="page-header">
        <h1>Dashboard Overview</h1>
        <p className="subtitle">Real-time venue intelligence and predictive analytics.</p>
      </header>

      <div className="dashboard-grid">
        <div className="card col-span-2">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <MagicWand weight="fill" className="text-purple" />
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', tracking: '0.1em' }}>AI Predictive Insights</h3>
          </div>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#eee' }}>{insights}</p>
        </div>

        <div className="card col-span-1">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Lightning weight="fill" className="text-yellow" />
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', tracking: '0.1em' }}>Quick Actions</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button 
              className="btn btn-outline" 
              style={{ height: '100px', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', border: '1px solid #333', background: '#1a1a1a' }} 
              disabled={isEmergency}
              onClick={() => onAction('Restrooms (L2)')}
            >
              <Toilet size={32} className="text-cyan" />
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>RESTROOM</span>
            </button>
            <button 
              className="btn btn-outline" 
              style={{ height: '100px', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', border: '1px solid #333', background: '#1a1a1a' }} 
              disabled={isEmergency}
              onClick={() => onAction('Medical')}
            >
              <FirstAid size={32} className="text-red" />
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>MEDICAL</span>
            </button>
            <button 
              className="btn btn-outline" 
              style={{ height: '100px', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', border: '1px solid #333', background: '#1a1a1a' }} 
              disabled={isEmergency}
              onClick={() => onAction('Food Court')}
            >
              <Buildings size={32} className="text-purple" />
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>FOOD COURT</span>
            </button>
            <button 
              className="btn btn-outline" 
              style={{ height: '100px', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', border: '1px solid #333', background: '#1a1a1a' }} 
              disabled={isEmergency}
              onClick={() => onAction('Gate B')}
            >
              <ArrowRight size={32} className="text-green" />
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>GATE B</span>
            </button>
          </div>
        </div>

        <div className="card col-span-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <UsersThree weight="fill" className="text-blue" />
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', tracking: '0.1em' }}>Real-time Zone Density Telemetry</h3>
          </div>
          <CrowdStatusGrid zones={simulationData.zones} />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
