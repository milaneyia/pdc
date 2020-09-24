<template>
    <div class="locale-changer">
        <div class="dropdown">
            <button
                id="dropdownMenuButton"
                class="btn btn-secondary btn-sm"
                type="button"
                data-toggle="dropdown"
            >
                <img
                    class="rounded"
                    style="width: 30px; height: 20px"
                    :src="`https://osu.ppy.sh//images/flags/${currentLang.flag}.png`"
                >
            </button>
            <div class="dropdown-menu dropdown-menu-left dropdown-menu-md-right">
                <a
                    v-for="lang in langs"
                    :key="lang.id"
                    class="dropdown-item small"
                    href="#"
                    @click="setLang(lang.id)"
                >
                    <img
                        class="rounded"
                        style="width: 25px; height: 16px"
                        :src="`https://osu.ppy.sh//images/flags/${lang.flag}.png`"
                    >
                    {{ lang.text }}
                </a>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

interface Lang {
    id: string;
    flag: string;
    text: string;
}

@Component
export default class LangSwitcher extends Vue {

    langs: Lang[] = [
        { id: 'en', flag: 'GB', text: 'English' },
        { id: 'zh', flag: 'CN', text: '简体中文' },
    ];

    get currentLang (): Lang {
        return this.langs.find(l => l.id === this.$i18n.locale) || this.langs[0];
    }

    setLang (lang: string): void {
        this.$i18n.locale = lang;
        localStorage.lang = lang;
    }

}
</script>
