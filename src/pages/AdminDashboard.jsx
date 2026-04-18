import React from 'react';
import { 
  Users, 
  Warning, 
  TrendUp, 
  ChartLineUp, 
  ArrowUp, 
  ArrowDown, 
  Lightning,
  GenderMale,
  GenderFemale,
  GenderNeuter,
  Briefcase,
  GraduationCap,
  IdentificationBadge,
  Globe
} from '@phosphor-icons/react';

const SimpleLineChart = ({ data }) => {
  if (!data || data.length < 2) return <div className="text-muted text-center py-8">Collecting data...</div>;
  const max = Math.max(...data, 1);
  const points = data.map((val, i) => `${(i / (data.length - 1)) * 400},${150 - (val / max) * 150}`).join(' ');

  return (
    <svg viewBox="0 0 400 150" className="w-full">
      <polyline fill="none" stroke="var(--accent-cyan)" strokeWidth="2" points={points} />
    </svg>
  );
};

const AdminDashboard = ({ simulationData, adjustCrowd, isPeakHour, setPeakHour }) => {
  const totalCrowd = simulationData.zones.reduce((sum, z) => sum + z.currentCount, 0);

  return (
    <section className="view active">
      <header className="page-header">
        <h1>Admin Console</h1>
        <p className="subtitle">Real-time venue intelligence and crowd analytics.</p>
      </header>

      <div className="dashboard-grid">
        {/* Main Analytics Enhancement */}
        <div className="card col-span-2">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="text-muted text-xs uppercase font-bold tracking-widest">Total Venue Crowd</p>
              <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--accent-cyan)' }}>{totalCrowd}</h1>
              <p className="text-sm text-muted mt-1 flex items-center gap-1">
                <TrendUp weight="bold" className="text-green" /> +8% from average
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div className="text-center">
                  <div className="p-2 bg-blue-dim text-blue rounded-lg mb-1"><GenderMale weight="bold" /></div>
                  <span className="text-xs font-bold">{simulationData.demographics.male}%</span>
                </div>
                <div className="text-center">
                  <div className="p-2 bg-purple-dim text-purple rounded-lg mb-1"><GenderFemale weight="bold" /></div>
                  <span className="text-xs font-bold">{simulationData.demographics.female}%</span>
                </div>
                <div className="text-center">
                  <div className="p-2 bg-surface-hover text-muted rounded-lg mb-1"><GenderNeuter weight="bold" /></div>
                  <span className="text-xs font-bold">{simulationData.demographics.other}%</span>
                </div>
              </div>
              <span className="badge bg-cyan-dim text-cyan uppercase font-bold" style={{ fontSize: '0.6rem' }}>Live Demographics</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-4 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { label: 'Students', icon: GraduationCap, val: simulationData.categories.students, color: 'blue' },
              { label: 'Pros', icon: Briefcase, val: simulationData.categories.professionals, color: 'purple' },
              { label: 'Staff', icon: IdentificationBadge, val: simulationData.categories.staff, color: 'yellow' },
              { label: 'Visitors', icon: Globe, val: simulationData.categories.visitors, color: 'cyan' }
            ].map(cat => (
              <div key={cat.label} style={{ background: '#111', padding: '1rem', borderRadius: '12px', border: '1px solid #222' }}>
                <cat.icon weight="fill" className={`text-${cat.color}`} style={{ color: `var(--accent-${cat.color})` }} />
                <p className="text-[10px] text-muted font-bold uppercase mt-2">{cat.label}</p>
                <p className="text-lg font-bold">{cat.val}%</p>
                <div className="progress-container mt-2" style={{ height: '3px' }}>
                  <div className="progress-bar" style={{ width: `${cat.val}%`, background: `var(--accent-${cat.color})` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card col-span-1">
          <h3>Simulation Controls</h3>
          <p className="text-xs text-muted mb-4">Adjust environmental parameters.</p>
          <button className="btn btn-primary w-full mt-4" onClick={() => setPeakHour(!isPeakHour)}>
            {isPeakHour ? 'Stop Peak Flow' : 'Simulate Peak Flow'}
          </button>
          
          <div className="mt-8">
            <h4 style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 'bold' }}>Active Congestion Hotspots</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {simulationData.zones.filter(z => (z.currentCount/z.maxCapacity) > 0.6).map(zone => (
                <div key={zone.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222', padding: '0.75rem', borderRadius: '8px' }}>
                  <span className="text-sm font-medium">{zone.name}</span>
                  <span className="badge bg-red-dim text-red" style={{ fontSize: '0.6rem' }}>{Math.round((zone.currentCount/zone.maxCapacity)*100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card col-span-3">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Detailed Zone Intelligence</h3>
            <div className="flex gap-2" style={{ display: 'flex', gap: '1rem' }}>
               <span className="text-xs text-muted flex items-center gap-1"><ChartLineUp /> Real-time Telemetry</span>
            </div>
          </div>
          <table style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <th>Venue Zone</th>
                <th>Occupancy</th>
                <th>Capacity</th>
                <th>Density Map</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {simulationData.zones.map(zone => {
                const density = (zone.currentCount/zone.maxCapacity);
                return (
                  <tr key={zone.id} style={{ height: '3.5rem', borderBottom: '1px solid #1a1a1a' }}>
                    <td className="font-bold">{zone.name}</td>
                    <td>{zone.currentCount}</td>
                    <td className="text-muted">{zone.maxCapacity}</td>
                    <td style={{ width: '200px' }}>
                      <div className="progress-container" style={{ width: '150px' }}>
                        <div className="progress-bar" style={{ 
                          width: `${density*100}%`, 
                          backgroundColor: density > 0.75 ? 'var(--accent-red)' : density > 0.4 ? 'var(--accent-yellow)' : 'var(--accent-green)' 
                        }}></div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${density > 0.75 ? 'bg-red-dim text-red' : density > 0.4 ? 'bg-yellow-dim text-yellow' : 'bg-green-dim text-green'}`}>
                        {density > 0.75 ? 'Critical' : density > 0.4 ? 'Moderate' : 'Optimal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
