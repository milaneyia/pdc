import Vue from 'vue';
import dayjs from 'dayjs';

declare module 'vue/types/vue' {
    interface Vue {
        $dayjs: typeof dayjs;
        initialRequest<T>(path: string): Promise<T | undefined>;
        getRequest<T>(path: string, e?: Event | null): Promise<T | undefined>;
        postRequest<T>(path: string, data?: {}, e?: Event | null): Promise<T | undefined>;
        fileRequest<T>(path: string, data?: { oszFile: File | null; [key: string]: any }, e?: Event | null): Promise<T | undefined>;
    }
}
