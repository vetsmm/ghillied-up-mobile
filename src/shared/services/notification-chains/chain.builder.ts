import {INotificationHandler} from "./notification-handler.interface";

export class ChainBuilder {
    // @ts-ignore
    private first: INotificationHandler = undefined;
    // @ts-ignore
    private current: INotificationHandler = undefined;

    add(handler: INotificationHandler) {
        if (this.first === undefined) {
            this.first = handler;
            this.current = handler;
        } else {
            this.current!.setNext(handler);
            this.current = handler;
        }

        return this;
    }

    build() {
        return this!.first;
    }
}

