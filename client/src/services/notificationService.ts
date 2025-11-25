import axios from '../utils/axios';

export interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  relatedCourse?: {
    _id: string;
    title: string;
  };
  relatedAssignment?: {
    _id: string;
    title: string;
  };
  relatedUser?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

class NotificationService {
  async getNotifications(unreadOnly = false): Promise<NotificationsResponse> {
    const response = await axios.get('/api/notifications', {
      params: { unreadOnly }
    });
    return response.data;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await axios.put(`/api/notifications/${notificationId}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await axios.put('/api/notifications/read-all');
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await axios.delete(`/api/notifications/${notificationId}`);
  }
}

export default new NotificationService();
