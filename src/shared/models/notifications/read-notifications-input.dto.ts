export interface NotificationIdsDto {
    activityId: string;
    id: string;
}

export interface ReadNotificationsInputDto {
    ids: NotificationIdsDto[];
}
