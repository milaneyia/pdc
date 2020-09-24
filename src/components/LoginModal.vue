<template>
    <div>
        <div
            id="loginModal"
            class="modal fade"
            tabindex="-1"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content bg-dark">
                    <div class="modal-header justify-content-center">
                        <div class="modal-title">
                            {{ $t('login') }}
                        </div>
                    </div>
                    <div class="modal-body">
                        <form
                            action="/login"
                            method="get"
                            class="form-inline my-2 my-lg-0 ml-3"
                        >
                            <button class="btn btn-primary btn-block" type="submit">
                                Verify your osu! account
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class LoginModal extends Vue {

}
</script>
