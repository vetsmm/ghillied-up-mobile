import {NotificationType} from "./notification-type";

export interface NotificationInputDto {
    cursor?: string;
    take?: number;
    type?: NotificationType;
    read?: boolean;
    trash?: boolean;
    orderBy?: 'asc' | 'desc';
}
