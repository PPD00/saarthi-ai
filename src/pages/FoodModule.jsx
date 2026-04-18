import React, { useState, useEffect, useRef } from 'react';
import { Clock, QrCode, Receipt, ShoppingBag, CheckCircle, Hourglass, Trash } from '@phosphor-icons/react';
import { foodMenu } from '../data/foodMenu';

const FoodModule = ({ simulationData, isEmergency }) => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'orders'
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const timerRefs = useRef({});

  const getStallWaitTime = (stallId) => {
    const stall = simulationData.foodStalls[stallId];
    return stall ? Math.ceil(stall.queueSize * stall.serviceRate) : 5;
  };

  const handleOrder = (item) => {
    if (isEmergency) return;
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      const waitTime = getStallWaitTime(item.id);
      const newOrder = {
        id: Date.now(),
        item: item.name,
        price: item.price,
        token: 'T-' + Math.floor(100 + Math.random() * 900),
        status: 'waiting',
        timeLeft: waitTime * 60,
        waitTime: waitTime,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setOrders(prev => [newOrder, ...prev]);
      setNotification(`Ordered ${item.name} successfully!`);
      setTimeout(() => setNotification(null), 3000);
      setActiveTab('orders');
    }, 1000);
  };

  const handleCancel = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    setNotification('Order Cancelled Successfully');
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev => prev.map(order => {
        if (order.status === 'waiting' && order.timeLeft > 0) {
          const nextTime = order.timeLeft - 1;
          return { 
            ...order, 
            timeLeft: nextTime, 
            status: nextTime <= 0 ? 'received' : 'waiting' 
          };
        }
        return order;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="view active">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Food Services</h1>
          <p className="subtitle">Mobile ordering & queue management.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', background: '#111', padding: '0.25rem', borderRadius: '8px' }}>
          <button 
            className={`btn ${activeTab === 'menu' ? 'btn-primary' : 'btn-outline'}`} 
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
            onClick={() => setActiveTab('menu')}
          >
            <ShoppingBag size={16} style={{ marginRight: '0.4rem' }} /> Menu
          </button>
          <button 
            className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`} 
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', position: 'relative' }}
            onClick={() => setActiveTab('orders')}
          >
            <Receipt size={16} style={{ marginRight: '0.4rem' }} /> My Orders
            {orders.filter(o => o.status === 'waiting').length > 0 && (
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--accent-red)', color: '#fff', fontSize: '0.6rem', padding: '2px 5px', borderRadius: '10px' }}>
                {orders.filter(o => o.status === 'waiting').length}
              </span>
            )}
          </button>
        </div>
      </header>

      {notification && (
        <div className="alert-banner mb-4" style={{ backgroundColor: notification.includes('Cancelled') ? 'var(--bg-red-dim)' : 'var(--bg-cyan-dim)', borderColor: notification.includes('Cancelled') ? 'var(--accent-red)' : 'var(--accent-cyan)', color: notification.includes('Cancelled') ? 'var(--accent-red)' : 'var(--accent-cyan)' }}>
          <p>{notification}</p>
        </div>
      )}

      {activeTab === 'menu' ? (
        <div className="dashboard-grid">
          {foodMenu.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3>{item.name}</h3>
                  <span style={{ fontSize: '0.7rem', color: '#888' }}>{item.id}</span>
                </div>
                <p className="text-muted mt-2" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={14} /> ~{getStallWaitTime(item.id)} mins wait
                </p>
                <h4 className="mt-4 text-cyan">{item.price}</h4>
              </div>
              <button 
                className="btn btn-primary mt-4 w-full" 
                disabled={isEmergency || loading} 
                onClick={() => handleOrder(item)}
              >
                {loading ? 'Processing...' : 'Order Now'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="orders-container">
          {orders.length === 0 ? (
            <div className="card text-center" style={{ padding: '4rem 2rem' }}>
              <Receipt size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
              <p className="text-muted">You haven't placed any orders yet.</p>
              <button className="btn btn-outline mt-4" onClick={() => setActiveTab('menu')}>Go to Menu</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map(order => (
                <div key={order.id} className="card" style={{ borderLeft: `4px solid ${order.status === 'received' ? 'var(--accent-green)' : 'var(--accent-cyan)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <h3 style={{ fontSize: '1.2rem' }}>{order.item}</h3>
                        <span className={`badge ${order.status === 'received' ? 'bg-green-dim text-green' : 'bg-cyan-dim text-cyan'}`} style={{ fontSize: '0.6rem', padding: '2px 8px' }}>
                          {order.status === 'received' ? <CheckCircle size={12} style={{ marginRight: '3px' }} /> : <Hourglass size={12} className="animate-spin" style={{ marginRight: '3px' }} />}
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-muted text-sm mt-1">Ordered at {order.timestamp} • Token: <strong>{order.token}</strong></p>
                    </div>
                    <div className="text-right">
                      <h4 className="text-cyan">{order.price}</h4>
                      {order.status === 'waiting' && (
                        <p className="text-xs text-muted mt-1">{Math.ceil(order.timeLeft / 60)}m left</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {order.status === 'waiting' ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <QrCode size={40} />
                          <p className="text-xs text-muted">Show token at counter {order.id.toString().slice(-1)}</p>
                        </div>
                        <button className="btn btn-outline" style={{ color: 'var(--accent-red)', borderColor: 'rgba(255,82,82,0.2)', fontSize: '0.8rem' }} onClick={() => handleCancel(order.id)}>
                          <Trash size={14} style={{ marginRight: '0.4rem' }} /> Cancel
                        </button>
                      </>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-green)' }}>
                        <CheckCircle weight="fill" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>This order has been picked up.</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default FoodModule;
