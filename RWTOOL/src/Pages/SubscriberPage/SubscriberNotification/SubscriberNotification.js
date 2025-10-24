import React, { useState } from 'react';
import { Bell, X, CheckCircle, XCircle, FileText } from 'lucide-react';
import '../../AdminPage/AdminNotification/AdminNotification.css';
import './SubscriberNotification.css';
const SubscriberNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'accepted',
      icon: CheckCircle,
      title: 'Subscription Accepted',
      message: 'Your subscription request for Finance domain has been accepted',
      time: '5 mins ago',
      isNew: true
    },
    {
      id: 2,
      type: 'file',
      icon: FileText,
      title: 'New File Added',
      message: 'Q4_Financial_Report.pdf added to Finance domain',
      time: '15 mins ago',
      isNew: true
    },
    {
      id: 3,
      type: 'rejected',
      icon: XCircle,
      title: 'Subscription Rejected',
      message: 'Your subscription request for Operations domain has been rejected',
      time: '1 hour ago',
      isNew: false
    },
    {
      id: 4,
      type: 'file',
      icon: FileText,
      title: 'New Files Added',
      message: '3 new files added to Equities domain',
      time: '2 hours ago',
      isNew: false
    },
    {
      id: 5,
      type: 'accepted',
      icon: CheckCircle,
      title: 'Subscription Accepted',
      message: 'Your subscription request for Equities domain has been accepted',
      time: '3 hours ago',
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
      {/* Bell Icon with Badge */}
      <div className="admin-notif-trigger" onClick={() => setIsOpen(!isOpen)}>
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="admin-notif-badge">{unreadCount}</span>
        )}
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="admin-notif-dropdown">
          {/* Header */}
          <div className="admin-notif-header">
            <h5 className="admin-notif-title">Notifications</h5>
            {unreadCount > 0 && (
              <button className="admin-mark-all" onClick={markAllAsRead}>
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
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

          {/* Footer */}
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

export default SubscriberNotification;