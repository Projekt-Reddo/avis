interface NotifyFilter {
    page: number;
    size: number;
    filter?: {}
}

interface Notify {
    id: string,
    receiverId: string,
    message: string,
    createdAt: string,
    isRead: boolean,
    isReadAt: string,
}