import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead, deleteNotification } from '../../redux/slices/notificationSlice';
import { X, Bell, AlertTriangle, Info, CheckCircle, Trash2, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const NotificationDrawer = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { notifications, loading } = useSelector((state) => state.notifications);
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchNotifications());
        }
    }, [isOpen, dispatch]);

    const handleMarkAsRead = (id) => {
        dispatch(markAsRead(id));
    };

    const handleDelete = (id) => {
        dispatch(deleteNotification(id));
    };

    const confirmDelete = (id) => {
        toast(
            ({ closeToast }) => (
                <div>
                    <p className="font-semibold text-gray-800 mb-3">Delete this notification?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                handleDelete(id);
                                closeToast();
                            }}
                            className="px-3 py-1.5 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={closeToast}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ),
            {
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                position: 'top-center',
            }
        );
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            await handleMarkAsRead(notification._id);
        }

        if (notification.zoneId) {
            navigate(`/marine-zones?focus=${notification.zoneId}`);
            onClose();
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'emergency': return <AlertTriangle className="text-red-500" size={20} />;
            case 'warning': return <AlertTriangle className="text-amber-500" size={20} />;
            case 'info': return <Info className="text-blue-500" size={20} />;
            default: return <Info className="text-gray-500" size={20} />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-white shadow-xl flex flex-col">
                <div className="px-4 py-6 bg-ocean-600 text-white flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Bell size={24} />
                        <h2 className="text-xl font-bold">Notifications</h2>
                    </div>
                    <button onClick={onClose} className="rounded-md hover:bg-ocean-700 p-1">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-600"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <Bell size={48} className="mx-auto mb-3 opacity-20" />
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-4 rounded-lg border flex flex-col space-y-2 transition-all cursor-pointer hover:shadow-md ${notification.isRead ? 'bg-gray-50 border-gray-100' : 'bg-white border-ocean-100 shadow-sm'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-2">
                                        {getIcon(notification.type)}
                                        <h3 className={`font-semibold ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                                            {notification.title}
                                        </h3>
                                    </div>
                                    <div className="flex space-x-1">
                                        {!notification.isRead && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMarkAsRead(notification._id);
                                                }}
                                                className="p-1 text-ocean-600 hover:bg-ocean-50 rounded"
                                                title="Mark as read"
                                            >
                                                <CheckCircle size={16} />
                                            </button>
                                        )}
                                        {isAdmin && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    confirmDelete(notification._id);
                                                }}
                                                className="p-1 text-gray-400 hover:text-red-500 rounded"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className={`text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                                    {notification.message}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-gray-400">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </span>
                                    {notification.zoneId && (
                                        <span className="text-[10px] font-bold text-ocean-600 flex items-center bg-ocean-50 px-1.5 py-0.5 rounded">
                                            <MapPin size={10} className="mr-1" />
                                            View on Map
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationDrawer;
