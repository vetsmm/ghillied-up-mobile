import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import NotificationsService from "../services/notifications.service";
import {ReadNotificationsInputDto} from "../models/notifications/read-notifications-input.dto";
import notifee from "@notifee/react-native";

export const initialState = {
    loading: false,
    unreadNotifications: 0,
    errorMessage: "", // Errors returned from server side
};

export type NotificationState = Readonly<typeof initialState>;

export const getUnreadNotifications = createAsyncThunk(
    "notifications/getUnreadNotifications",
    async (_, thunkAPI) => {
        return await NotificationsService.getUserUnreadNotificationCount()
            .then(async (response) => {
                notifee.setBadgeCount(response.data.unreadCount)
                    .then(() => undefined);
                return response.data.unreadCount;
            });
    }
);

export const markNotificationsAsRead = createAsyncThunk(
    "notifications/markNotificationsAsRead",
    async (notificationIds: ReadNotificationsInputDto, thunkAPI) => {
        return await NotificationsService.markNotificationsAsRead(notificationIds)
            .then(async (response) => {
                thunkAPI.dispatch(getUnreadNotifications());
                notifee
                    .decrementBadgeCount(1)
                    .then(() => console.log("Badge decremented"));
                return response.data;
            });
    });

export const markNotificationAsRead = createAsyncThunk(
    "notifications/markNotificationAsRead",
    async (notificationid: string, thunkAPI) => {
        return await NotificationsService.markNotificationAsRead(notificationid)
            .then(async (response) => {
                thunkAPI.dispatch(getUnreadNotifications());
                notifee
                    .decrementBadgeCount(1)
                    .then(() => console.log("Badge decremented"));
                return response;
            });
    });


export const NotificationState = createSlice({
    name: "notifications",
    initialState: initialState as NotificationState,
    reducers: {
        resetUnread: (state) => {
            state.unreadNotifications = 0;
            state.errorMessage = "";
            state.loading = false;
        },
    },
    extraReducers(builder) {
        builder.addCase(getUnreadNotifications.rejected, (state, action) => {
            // @ts-ignore
            state.errorMessage = action?.error?.message || "Error getting unread notifications";
            state.loading = false;
        });
        builder.addCase(markNotificationsAsRead.rejected, (state, action) => {
            // @ts-ignore
            state.errorMessage = action?.payload?.error?.message || "Error marking notifications as read";
            state.loading = true;
        })
        builder.addCase(markNotificationAsRead.rejected, (state, action) => {
            // @ts-ignore
            state.errorMessage = action?.payload?.error?.message || "Error marking notification as read";
            state.loading = true;
        })
        builder.addCase(getUnreadNotifications.fulfilled, (state, action) => {
            state.unreadNotifications = action.payload;
            state.loading = false
        });
        builder.addCase(markNotificationsAsRead.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(markNotificationAsRead.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(getUnreadNotifications.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(markNotificationsAsRead.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(markNotificationAsRead.pending, (state) => {
            state.loading = true;
        });
    }
});

export default NotificationState.reducer;

// eslint-disable-next-line no-empty-pattern
export const {
    resetUnread,
} = NotificationState.actions;
