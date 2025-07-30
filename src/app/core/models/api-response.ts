import { NotificationType } from "../enums/notification-type.enum";

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  notificationType: NotificationType;
}
