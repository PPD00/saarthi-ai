import React from 'react';

const VenueMap = ({ zones, connections, destination, userLocationId, onZoneClick, isEmergency }) => {
  const getZoneColor = (zone) => {
    if (isEmergency && zone.isExit) return '#00e676';
    if (isEmergency && !zone.isExit) return '#333';
    
    const density = zone.currentCount / zone.maxCapacity;
    if (density > 0.75) return '#ff5252';
    if (density > 0.4) return '#ffd740';
    return '#00e5ff';
  };

  const userLocation = zones.find(z => z.id === userLocationId);
  const targetZone = zones.find(z => z.name.toLowerCase() === destination?.toLowerCase());

  return (
    <div className="venue-map-wrapper" style={{ height: '400px', position: 'relative' }}>
      <svg viewBox="0 0 800 450" className="w-full h-full">
        {/* Connection Paths */}
        {connections.map((conn, i) => {
          const from = zones.find(z => z.id === conn.from);
          const to = zones.find(z => z.id === conn.to);
          const isActive = targetZone && (
            (from.id === userLocationId && to.id === targetZone.id) ||
            (to.id === userLocationId && from.id === targetZone.id)
          );

          return (
            <line 
              key={i} 
              x1={from.x} y1={from.y} x2={to.x} y2={to.y} 
              stroke={isActive ? '#00e5ff' : '#222'} 
              strokeWidth={isActive ? '4' : '2'}
              strokeDasharray={isActive ? '8 4' : 'none'}
              className={isActive ? 'animated-path' : ''}
            />
          );
        })}

        {/* Zone Nodes */}
        {zones.map(zone => {
          const color = getZoneColor(zone);
          const isTarget = targetZone && targetZone.id === zone.id;
          const isUser = userLocationId === zone.id;

          return (
            <g key={zone.id} onClick={() => onZoneClick(zone.name)} style={{ cursor: 'pointer' }}>
              {/* Node Pulse for crowded areas */}
              {(zone.currentCount / zone.maxCapacity) > 0.75 && (
                <circle cx={zone.x} cy={zone.y} r="25" fill={color} opacity="0.2">
                  <animate attributeName="r" from="15" to="35" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
              
              <circle 
                cx={zone.x} cy={zone.y} r={isTarget || isUser ? "16" : "12"} 
                fill={color} 
                stroke={isTarget ? "#fff" : "none"}
                strokeWidth="3"
              />
              
              {isUser && (
                <circle cx={zone.x} cy={zone.y} r="20" fill="none" stroke="#00e5ff" strokeWidth="2" strokeDasharray="4 2">
                  <animateTransform attributeName="transform" type="rotate" from={`0 ${zone.x} ${zone.y}`} to={`360 ${zone.x} ${zone.y}`} dur="5s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Improved Labels with backgrounds */}
              <rect 
                x={zone.x - 40} y={zone.y + 20} width="80" height="20" 
                fill="rgba(0,0,0,0.8)" rx="4"
              />
              <text 
                x={zone.x} y={zone.y + 34} 
                textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold"
                style={{ pointerEvents: 'none', letterSpacing: '0.05em' }}
              >
                {zone.name}
              </text>
              {isUser && (
                <text x={zone.x} y={zone.y - 25} textAnchor="middle" fill="#00e5ff" fontSize="10" fontWeight="black">YOU</text>
              )}
            </g>
          );
        })}
      </svg>
      
      <div className="map-legend" style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.6)', padding: '0.5rem', borderRadius: '8px' }}>
        <div className="flex items-center gap-2"><span className="dot" style={{ background: '#00e5ff' }}></span> <span className="text-xs">Optimal</span></div>
        <div className="flex items-center gap-2"><span className="dot" style={{ background: '#ffd740' }}></span> <span className="text-xs">Moderate</span></div>
        <div className="flex items-center gap-2"><span className="dot" style={{ background: '#ff5252' }}></span> <span className="text-xs">Congested</span></div>
        <div className="flex items-center gap-2"><span className="dot" style={{ background: '#00e676' }}></span> <span className="text-xs">Safe Exit</span></div>
      </div>
    </div>
  );
};

export default VenueMap;
