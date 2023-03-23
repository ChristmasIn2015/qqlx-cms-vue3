<template>
    <q-layout container view="lHh Lpr lff">
        <q-drawer side="left" :width="180" show-if-above class="select-none hide-scrollbar bg-blue-grey-1">
            <div class="q-pt-sm q-pl-md text-weight-bold text-h5" :class="`text-${route.meta?.color}`">
                <div>办公平台</div>
            </div>

            <!-- 导航 -->
            <!-- 导航 -->
            <q-list v-for="(container, index) in routes">
                <div class="text-grey-13 q-px-md q-pt-md q-pb-sm">{{ container.name }}</div>
                <router-link v-for="route in container.children?.filter((e) => e.meta?.show)" :to="`/oa/${container.path}/${route.path}`" v-slot="{ isActive }">
                    <q-item clickable :active="isActive" class="text-grey" :class.text-primary="isActive">
                        <q-item-section side class="q-pr-sm">
                            <q-icon :name="(route.meta?.icon as string)" :class="isActive ? `text-${route.meta?.color}` : 'text-grey'"> </q-icon>
                        </q-item-section>
                        <q-item-section class="text-weight-bold text-body1" :class="isActive ? `text-${route.meta?.color}` : 'text-grey'">
                            <q-item-label style="position: relative">
                                <span>
                                    {{ route.name }}
                                </span>
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                </router-link>
            </q-list>

            <!-- 个人中心 -->
            <!-- 个人中心 -->
            <div style="height: 200px"></div>
            <q-list class="absolute-bottom bg-white">
                <q-item clickable @click="userDialog = true" class="q-pr-xs">
                    <q-item-section avatar>
                        <q-avatar rounded>
                            <img :src="UserStore.userEditor?.avator || UserStore.wxAvatorDefault" />
                        </q-avatar>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label class="text-weight-bold ellipsis">{{ UserStore.userEditor?.nickname }}</q-item-label>
                        <q-item-label caption class="ellipsis">{{ nowCorpName }}</q-item-label>
                    </q-item-section>
                    <q-item-section side style="padding-left: 4px">
                        <q-icon name="unfold_more" />
                    </q-item-section>
                </q-item>
            </q-list>

            <q-dialog v-model="userDialog" persistent>
                <q-card class="w-400">
                    <q-toolbar>
                        <q-toolbar-title>个人信息</q-toolbar-title>

                        <q-btn flat dense icon="close" v-close-popup />
                    </q-toolbar>

                    <q-separator />

                    <q-card-section>
                        <q-input filled label="用户昵称" class="q-mb-sm" v-model="UserStore.userEditor.nickname">
                            <template v-slot:before>
                                <q-icon name="person" />
                            </template>
                        </q-input>

                        <q-input readonly label="创建日期" class="q-mb-sm" v-model="UserStore.userEditor.timeCreateString">
                            <template v-slot:before>
                                <q-icon name="" />
                            </template>
                        </q-input>

                        <q-input readonly label="当前公司" class="q-mb-sm" v-model="nowCorpName">
                            <template v-slot:before>
                                <q-icon name="" />
                            </template>
                            <template v-slot:append>
                                <q-btn fab flat v-close-popup icon="chevron_right" style="margin-right: -8px" @click="router.push('/oa/system/corp')"></q-btn>
                            </template>
                        </q-input>
                    </q-card-section>

                    <q-card-actions>
                        <q-btn color="negative" flat v-close-popup @click="router.push('/oa/login')">
                            <q-icon name="logout"></q-icon>
                            <span class="q-ml-xs">切换用户</span>
                        </q-btn>
                        <q-space></q-space>
                        <q-btn color="primary" v-close-popup @click="UserStore.patch()"> 应用 </q-btn>
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </q-drawer>

        <q-page-container>
            <q-page class="bg-blue-grey-1">
                <div class="app-background bg-dark">
                    <q-img
                        style="width: 200px; float: right; top: 20px; right: 20px"
                        class="cursor-pointer select-none"
                        src="@/assets/index.png"
                        fit="cover"
                        @click="openWebTab()"
                    ></q-img>
                </div>
                <div class="q-px-lg q-py-md" style="margin-top: -210px">
                    <router-view />
                </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

import { getTimeGap } from "@/utils";
import { useNotifyStore } from "@/stores/notify";
import { useUserStore } from "@/stores/user";
import { useCorpStore } from "@/stores/corp";

const route = useRoute();
const router = useRouter();
const routes = router.options.routes[0].children;

const NotifyStore = useNotifyStore();
const UserStore = useUserStore();
const CorpStore = useCorpStore();

const swiperIndex = ref(0);
const userDialog = ref(false);
const openWebTab = () => window.open("https://qqlx.tech");

// vue
const nowCorpName = computed({
    get() {
        return CorpStore.corpPicked?.name || "-";
    },
    set() {},
});
onMounted(async () => {
    try {
        await UserStore.setNowUser();
        await CorpStore.get();

        const corpIdPicked = localStorage.getItem("qqlx-corp-id");
        const match = CorpStore.corpList.find((e) => e._id === corpIdPicked);
        const first = CorpStore.corpList.find((e) => e.isDisabled === false);
        CorpStore.pick(match || first);
    } catch (error) {
        NotifyStore.fail((error as Error).message);
    }
});
</script>

<style scoped lang="scss"></style>
