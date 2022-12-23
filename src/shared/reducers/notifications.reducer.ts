import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import NotificationsService from "../services/notifications.service";
import {ReadNotificationsInputDto} from "../models/notifications/read-notifications-input.dto";

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
                return response.data;
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
            console.log("notification error", action)
            // @ts-ignore
            state.errorMessage = action.payload.error.message;
            state.loading = false;
        });
        builder.addCase(markNotificationsAsRead.rejected, (state, action) => {
            // @ts-ignore
            state.errorMessage = action.payload.error.message
            state.loading = true;
        })
        builder.addCase(getUnreadNotifications.fulfilled, (state, action) => {
            state.unreadNotifications = action.payload;
            state.loading = false
        });
        builder.addCase(markNotificationsAsRead.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(getUnreadNotifications.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(markNotificationsAsRead.pending, (state) => {
            state.loading = true;
        });
    }
});

export default NotificationState.reducer;

// eslint-disable-next-line no-empty-pattern
export const {
    resetUnread,
} = NotificationState.actions;
