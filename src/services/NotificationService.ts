import { NotificationType } from '../types';

export interface AppNotification {
  type: NotificationType;
  message: string;
  buttonText: string;
}

export type NotificationListener = (notification: AppNotification) => void;

export class NotificationService {
  private listeners: NotificationListener[] = [];

  subscribe(listener: NotificationListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((item) => item !== listener);
    };
  }

  info(message: string, buttonText = 'Зрозуміло!'): void {
    this.emit({ type: NotificationType.Info, message, buttonText });
  }

  success(message: string, buttonText = 'Зрозуміло!'): void {
    this.emit({ type: NotificationType.Success, message, buttonText });
  }

  error(message: string, buttonText = 'Закрити'): void {
    this.emit({ type: NotificationType.Error, message, buttonText });
  }

  private emit(notification: AppNotification): void {
    this.listeners.forEach((listener) => listener(notification));
  }
}
