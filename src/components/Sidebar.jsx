import React from 'react';
import { 
  SquaresFour, 
  NavigationArrow, 
  Hamburger, 
  Buildings, 
  User,
  Sparkle,
  Warning,
  ShieldCheck,
  Crown,
  IdentificationCard
} from '@phosphor-icons/react';

const Sidebar = ({ activeView, setActiveView, isEmergency, toggleEmergency, userProfile, toggleUserType }) => {
  const navItems = [
    { id: 'view-home', label: 'Dashboard', icon: SquaresFour },
    { id: 'view-nav', label: 'Navigation', icon: NavigationArrow },
    { id: 'view-food', label: 'Food Services', icon: Hamburger },
    { id: 'view-facilities', label: 'Facilities', icon: Buildings },
  ];

  const isVIP = userProfile.type === 'VIP';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Sparkle weight="fill" />
        </div>
        <h2>Saarthi AI</h2>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-group">
          {navItems.map((item) => (
            <a 
              key={item.id}
              href="#" 
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveView(item.id);
              }}
            >
              <item.icon weight={activeView === item.id ? 'fill' : 'regular'} />
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        <div className="sidebar-system-actions">
          <button 
            className={`sos-btn ${isEmergency ? 'active' : ''}`}
            onClick={toggleEmergency}
          >
            <Warning weight="fill" size={20} />
            <span>{isEmergency ? 'STOP SOS' : 'EMERGENCY SOS'}</span>
          </button>

          <a 
            href="#" 
            className={`nav-item ${activeView === 'view-admin' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveView('view-admin');
            }}
          >
            <ShieldCheck weight={activeView === 'view-admin' ? 'fill' : 'regular'} />
            <span>Admin Console</span>
          </a>
        </div>
      </nav>
      
      <div className="sidebar-footer" style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
        <div 
          className="user-profile-card" 
          onClick={toggleUserType}
          style={{ 
            cursor: 'pointer',
            padding: '1rem',
            borderRadius: '12px',
            background: isVIP ? 'linear-gradient(145deg, #1a1a1a, #252525)' : 'transparent',
            border: isVIP ? '1px solid var(--accent-yellow)' : '1px solid transparent',
            boxShadow: isVIP ? '0 0 15px rgba(255, 215, 64, 0.1)' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="avatar" style={{ 
              background: isVIP ? 'var(--accent-yellow)' : 'var(--bg-surface-hover)',
              color: isVIP ? '#000' : 'var(--text-muted)',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isVIP ? <Crown weight="fill" size={24} /> : <User size={24} />}
            </div>
            <div className="user-info" style={{ flex: 1 }}>
              <span className="user-name" style={{ fontWeight: 'bold', fontSize: '0.9rem', display: 'block' }}>{userProfile.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span className="user-id" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{userProfile.id}</span>
                <span 
                  className={`badge ${isVIP ? 'text-yellow' : 'text-muted'}`} 
                  style={{ 
                    fontSize: '0.6rem', 
                    padding: '1px 5px', 
                    background: isVIP ? 'rgba(255, 215, 64, 0.1)' : 'rgba(255,255,255,0.05)',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}
                >
                  {userProfile.type}
                </span>
              </div>
            </div>
          </div>
          {isVIP && (
            <div style={{ marginTop: '0.75rem', fontSize: '0.65rem', color: 'var(--accent-yellow)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 'bold' }}>
              <Sparkle weight="fill" size={12} />
              <span>PREMIUM ACCESS ACTIVE</span>
            </div>
          )}
        </div>
        <p style={{ fontSize: '0.6rem', color: '#444', textAlign: 'center', marginTop: '0.75rem' }}>Click to toggle Guest/VIP</p>
      </div>
    </aside>
  );
};

export default Sidebar;
