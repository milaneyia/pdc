<template>
    <div class="container text-center">
        <page-header
            title="Users"
        >
            <p>You can't add/edit staff users</p>
            <b>Basic</b> = whoever, <b>Restricted</b> = kill him, <b>Judge</b> = god bless him
        </page-header>

        <div class="row">
            <div class="col-sm">
                <div class="card card-body mb-2">
                    <label for="query">Search an user:</label>

                    <div class="input-group">
                        <input
                            v-model="query"
                            type="text"
                            class="form-control"
                            placeholder="User id or username"
                            @keydown.enter="search"
                        >

                        <div class="input-group-append">
                            <button class="btn btn-primary" @click="search($event)">
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card card-body">
                    <div v-for="user in users" :key="user.id">
                        <div class="form-group">
                            <div>
                                <a :href="`https://osu.ppy.sh/users/${user.osuId}`" target="__blank">
                                    {{ user.username }}
                                </a>
                            </div>

                            <div class="input-group">
                                <select v-model="user.roleId" class="form-control">
                                    <option
                                        v-for="role in roles"
                                        :key="role.id"
                                        :value="role.id"
                                    >
                                        {{ role.name }}
                                    </option>
                                </select>

                                <div class="input-group-append">
                                    <button class="btn btn-success" @click="save(user, $event)">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>

                        <hr>
                    </div>

                    <span v-if="!users.length">
                        None
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../../components/PageHeader.vue';
import DataTable from '../../components/admin/DataTable.vue';
import { User } from '../../interfaces';

@Component({
    components: {
        PageHeader,
        DataTable,
    },
})
export default class ManageUser extends Vue {

    roles = [];
    users: User[] = [];
    query = '';

    async created (): Promise<void> {
        const data = await this.initialRequest<{ roles: [] }>('/api/admin/users/roles');
        if (data?.roles) this.roles = data.roles;
    }

    async search (e: Event): Promise<void> {
        const data = await this.getRequest<{ users: User[] }>(`/api/admin/users/query?u=${this.query}`, e);
        if (data?.users) this.users = data.users;
    }

    async save (user: User, e: Event): Promise<void> {
        await this.postRequest(`/api/admin/users/${user.id}/updateRole`, {
            roleId: user.roleId,
        }, e);
    }

}
</script>
