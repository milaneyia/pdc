import Vue from 'vue';
import Axios from 'axios';
import { Store } from 'vuex';

async function executeRequest<T>(store: Store<any>, request: () => any, onEnd: () => void): Promise<T | undefined> {
    try {
        const res = await request();

        if (res.data.error) {
            store.commit('addToast', {
                message: res.data.error,
                type: 'danger',
            });
        } else if (res.data.success) {
            store.commit('addToast', {
                message: res.data.success,
                type: 'success',
            });
        }

        return res.data;
    } catch (error) {
        store.commit('addToast', {
            message: 'Something went wrong!',
            type: 'danger',
        });
    } finally {
        onEnd();
    }
}

export default Vue.extend({
    methods: {
        initialRequest<T>(url: string): Promise<T | undefined> {
            this.$store.commit('updateLoadingState');

            return executeRequest<T>(
                this.$store,
                () => Axios.get(url),
                () => this.$store.commit('updateLoadingState')
            );
        },
        getRequest<T>(url: string, e?: Event | null): Promise<T | undefined> {
            if (e?.target) (e.target as HTMLInputElement).disabled = true;

            return executeRequest<T>(
                this.$store,
                () => Axios.get(url),
                () => {
                    if (e?.target) (e.target as HTMLInputElement).disabled = false;
                }
            );
        },
        postRequest<T>(url: string, data?: {}, e?: Event | null): Promise<T | undefined> {
            if (e?.target) (e.target as HTMLInputElement).disabled = true;

            return executeRequest<T>(
                this.$store,
                () => Axios.post(url, data),
                () => {
                    if (e?.target) (e.target as HTMLInputElement).disabled = false;
                }
            );
        },
        async fileRequest<T>(url: string, data?: { oszFile: File | null; [key: string]: any }, e?: Event | null): Promise<T | undefined> {
            if (!data?.oszFile) {
                this.$store.commit('addToast', {
                    message: 'Select an .osz',
                    type: 'danger',
                });

                return;
            }

            if (e?.target) (e.target as HTMLInputElement).disabled = true;
            const formData = new FormData();

            for (const key in data) {
                formData.append(key, data[key]);
            }

            try {
                const res = await Axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (res.data.error) {
                    this.$store.commit('addToast', {
                        message: res.data.error,
                        type: 'danger',
                    });
                } else if (res.data.success) {
                    this.$store.commit('addToast', {
                        message: res.data.success,
                        type: 'success',
                    });
                }

                return res.data;
            } catch (error) {
                this.$store.commit('addToast', {
                    message: 'Something went wrong!',
                    type: 'danger',
                });
            } finally {
                if (e?.target) (e.target as HTMLInputElement).disabled = false;
            }
        },
    },
});
