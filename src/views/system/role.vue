<template>
    <div class="q-pt-xl q-pb-md">
        <div class="text-h4 text-white text-weight-bold">公司成员</div>
        <div class="text-white q-pt-sm">
            <span>@{{ CorpStore.corpPicked?.name }}</span>
        </div>
    </div>

    <div class="row">
        <q-card class="q-mr-sm q-mb-sm" v-for="base in RoleOAStore.RoleOAList.filter((e) => e.role === ENUM_ROLE_OA.BASE)">
            <q-item>
                <q-item-section avatar>
                    <q-avatar rounded>
                        <img :src="base.joinWeChat?.avator || UserStore.wxAvatorDefault" />
                    </q-avatar>
                </q-item-section>
                <q-item-section>
                    <q-item-label class="text-weight-bold"> {{ base.joinWeChat?.nickname }} </q-item-label>
                    <q-item-label caption> {{ base.joinWeChat?.timeCreateString }} </q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-item-label>
                        <q-btn dense icon="more_horiz" flat>
                            <q-menu>
                                <q-list class="w-100">
                                    <q-item clickable v-close-popup @click="RoleOAStore.delete(base._id)">
                                        <q-item-section class="text-negative">删除成员</q-item-section>
                                    </q-item>
                                </q-list>
                            </q-menu>
                        </q-btn>
                    </q-item-label>
                    <q-item-label caption> </q-item-label>
                </q-item-section>
            </q-item>
        </q-card>

        <q-card class="q-mr-sm q-mb-sm">
            <q-item v-if="roleRoot">
                <q-item-section avatar>
                    <q-avatar rounded>
                        <img :src="roleRoot?.joinWeChat?.avator || UserStore.wxAvatorDefault" />
                        <q-badge floating>管理员</q-badge>
                    </q-avatar>
                </q-item-section>
                <q-item-section>
                    <q-item-label class="text-weight-bold">
                        {{ roleRoot.joinWeChat?.nickname }}
                    </q-item-label>
                    <q-item-label caption> {{ roleRoot.joinWeChat?.timeCreateString }} </q-item-label>
                </q-item-section>
            </q-item>
        </q-card>
    </div>

    <div class="q-pt-lg q-pb-lg">
        <div class="text-h5 text-weight-bold">权限管理</div>
    </div>

    <q-card class="q-mb-sm">
        <q-card-section class="q-pb-none">
            <div class="text-h6 q-mb-xs">
                <q-icon name="person"></q-icon> 主管权限
                <span class="q-mx-sm text-underline text-negative cursor-pointer text-weight-bold" @click="openRoleOA(ENUM_ROLE_OA.BASE)">添加</span>
            </div>
            <div class="text-body1 text-grey">
                <div>1.添加/删除/修改收集箱的基础信息</div>
                <div>2.查看/下载收集箱中的打卡记录</div>
                <div>3.添加/删除/修改打卡规则</div>
            </div>
        </q-card-section>
        <q-card-section class="row">
            <q-btn
                v-for="roleBase in RoleOAStore.RoleOAList.filter((e) => e.role === ENUM_ROLE_OA.BASE)"
                unelevated
                push
                square
                color="grey-11"
                class="q-mr-md q-mb-sm q-py-sm q-px-sm"
                @click="toggleRoleOA(roleBase, ENUM_ROLE_OA.BASE)"
            >
                <q-avatar rounded>
                    <img :src="roleBase.joinWeChat?.avator || UserStore.wxAvatorDefault" />
                </q-avatar>
                <div class="text-left text-black q-ml-md">
                    <div>{{ roleBase.joinWeChat?.nickname }}</div>
                    <div>{{ roleBase.timeCreateString }}</div>
                </div>
                <q-badge v-if="!!RoleOAStore.RoleOAList.find((e) => e.role === ENUM_ROLE_OA.BASE && e.userId === roleBase.userId)" color="indigo-14" floating>
                    已开启
                </q-badge>
                <q-badge v-else color="grey" floating> 未开启 </q-badge>
            </q-btn>

            <q-btn v-if="roleRoot" unelevated push square color="grey-11" class="q-mr-md q-mb-sm q-py-sm q-px-sm" disable>
                <q-avatar rounded>
                    <img :src="roleRoot.joinWeChat?.avator || UserStore.wxAvatorDefault" />
                </q-avatar>
                <div class="text-left text-black q-ml-md">
                    <div>{{ roleRoot.joinWeChat?.nickname }}</div>
                    <div>{{ roleRoot.timeCreateString }}</div>
                </div>
                <q-badge color="indigo-14" floating> 已开启</q-badge>
            </q-btn>
        </q-card-section>
    </q-card>

    <q-card class="q-mb-sm">
        <q-card-section class="q-pb-none">
            <div class="text-h6 q-mb-xs">
                <q-icon name="visibility" style="margin-top: -4px"></q-icon> 访客权限
                <span class="q-mx-sm text-underline text-negative cursor-pointer text-weight-bold" @click="openRoleOA(ENUM_ROLE_OA.VISITOR)">添加</span>
            </div>
            <div class="text-body1 text-grey">
                <div>1.访客仅可以查看/下载收集箱中的打卡记录</div>
            </div>
        </q-card-section>
        <q-card-section class="row">
            <q-btn
                v-for="roleBase in RoleOAStore.RoleOAList.filter((e) => e.role === ENUM_ROLE_OA.VISITOR)"
                unelevated
                push
                square
                color="grey-11"
                class="q-mr-md q-mb-sm q-py-sm q-px-sm"
                @click="toggleRoleOA(roleBase, ENUM_ROLE_OA.VISITOR)"
            >
                <q-avatar rounded>
                    <img :src="roleBase.joinWeChat?.avator || UserStore.wxAvatorDefault" />
                </q-avatar>
                <div class="text-left text-black q-ml-md">
                    <div>{{ roleBase.joinWeChat?.nickname }}</div>
                    <div>{{ roleBase.timeCreateString }}</div>
                </div>
                <q-badge v-if="!!RoleOAStore.RoleOAList.find((e) => e.role === ENUM_ROLE_OA.VISITOR && e.userId === roleBase.userId)" color="primary" floating>
                    已开启
                </q-badge>
                <q-badge v-else color="grey" floating> 未开启 </q-badge>
            </q-btn>

            <q-btn v-if="roleRoot" unelevated push square color="grey-11" class="q-mr-md q-mb-sm q-py-sm q-px-sm" disable>
                <q-avatar rounded>
                    <img :src="roleRoot.joinWeChat?.avator || UserStore.wxAvatorDefault" />
                </q-avatar>
                <div class="text-left text-black q-ml-md">
                    <div>{{ roleRoot.joinWeChat?.nickname }}</div>
                    <div>{{ roleRoot.timeCreateString }}</div>
                </div>
                <q-badge color="primary" floating> 已开启</q-badge>
            </q-btn>
        </q-card-section>
    </q-card>

    <q-dialog v-model="dialogRoleOA">
        <div class="text-center">
            <q-card class="q-mt-xl q-pt-lg w-500">
                <div id="wx-login-join"></div>
            </q-card>
        </div>
    </q-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { ENUM_ROLE_OA } from "qqlx-core";
import type { RoleOA } from "qqlx-core/schema/oa/role";

import { useNotifyStore } from "@/stores/notify";
import { useUserStore } from "@/stores/user";
import { useCorpStore } from "@/stores/corp";
import { useRoleOAStore } from "@/stores/role";

const route = useRoute();
const NotifyStore = useNotifyStore();
const UserStore = useUserStore();
const CorpStore = useCorpStore();
const RoleOAStore = useRoleOAStore();

const roleRoot = computed({
    get: () => RoleOAStore.RoleOAList.find((e) => e.role === ENUM_ROLE_OA.ROOT),
    set: () => {},
});
const dialogRoleOA = ref(false);
const openRoleOA = (role: ENUM_ROLE_OA) => {
    dialogRoleOA.value = true;

    setTimeout(() => {
        const WxLogin = window.WxLogin as any;
        WxLogin &&
            document.getElementById("wx-login-join") &&
            new WxLogin({
                id: "wx-login-join",
                appid: "wxd0e6ee13822ccb7f",
                scope: "snsapi_login",
                redirect_uri: "http://qqlx.tech/oa/login",
                state: `JOIN&enum=${role}`,
            });
    }, 500);
};
const toggleRoleOA = async (base: RoleOA, exist: ENUM_ROLE_OA) => {
    const all = RoleOAStore.RoleOAList;
    const match = all.find((e) => e.role === exist && e.userId === base.userId);
    if (match) await RoleOAStore.delete(match._id);
    else await RoleOAStore.post(base.userId, exist);
};

// action
onMounted(async () => {
    try {
        await RoleOAStore.get();
    } catch (error) {
        NotifyStore.fail((error as Error).message);
    }
});
</script>

<style scoped lang="scss"></style>
