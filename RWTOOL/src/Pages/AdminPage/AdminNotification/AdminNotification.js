import React, { useState } from 'react';
import { Bell, X, UserPlus, FileText } from 'lucide-react';
import './AdminNotification.css';

const AdminNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'subscription',
      icon: UserPlus,
      title: 'New Subscription Request',
      message: 'john.doe@example.com requested access to Finance domain',
      time: '5 mins ago',
      isNew: true
    },
    {
      id: 2,
      type: 'file',
      icon: FileText,
      title: 'New File Added',
      message: 'Q4_Financial_Report.pdf added to Finance folder',
      time: '15 mins ago',
      isNew: true
    },
    {
      id: 3,
      type: 'subscription',
      icon: UserPlus,
      title: 'Subscription Request',
      message: 'alice.brown@example.com requested access to Operations domain',
      time: '1 hour ago',
      isNew: false
    },
    {
      id: 4,
      type: 'file',
      icon: FileText,
      title: 'New File Added',
      message: 'Employee_Data.xlsx added to HR folder',
      time: '2 hours ago',
      isNew: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.isNew).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isNew: false } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isNew: false })));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="admin-notif-container">
      <div className="admin-notif-trigger" onClick={() => setIsOpen(!isOpen)}>
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="admin-notif-badge">{unreadCount}</span>
        )}
      </div>

      {isOpen && (
        <div className="admin-notif-dropdown">
          <div className="admin-notif-header">
            <h5 className="admin-notif-title">Notifications</h5>
            {unreadCount > 0 && (
              <button className="admin-mark-all" onClick={markAllAsRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className="admin-notif-list">
            {notifications.length === 0 ? (
              <div className="admin-no-notif">
                <Bell size={40} />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => {
                const Icon = notification.icon;
                return (
                  <div 
                    key={notification.id} 
                    className={`admin-notif-item ${notification.isNew ? 'unread' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className={`admin-notif-icon ${notification.type}`}>
                      <Icon size={18} />
                    </div>
                    <div className="admin-notif-content">
                      <h6>{notification.title}</h6>
                      <p>{notification.message}</p>
                      <span className="admin-notif-time">{notification.time}</span>
                    </div>
                    <button 
                      className="admin-notif-close"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="admin-notif-footer">
              <a href="#" className="admin-view-all">View All Activity</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminNotification;