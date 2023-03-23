<template>
    <div class="q-pt-md q-pl-sm q-pb-lg q-mt-lg text-white">
        <div class="text-h4 text-weight-bold row items-center">
            <q-btn fab icon="arrow_back" class="" style="margin-left: -16px" @click="$router.back()"></q-btn>
            <span>场景白名单</span>
        </div>
        <div class="q-mt-md">
            <div>在 @{{ LineStore.picked?.title }} 中，仅允许以下成员进行打卡</div>
        </div>
    </div>

    <q-card>
        <q-table
            dense
            row-key="_id"
            separator="cell"
            :columns="[
                { name: 'nickname', field: 'joinUserInfo', label: '昵称', align: 'left', style: 'font-size: 16px; width: 188px;' },
                { name: 'phone', field: 'phone', label: '手机号', align: 'left', style: 'font-size: 16px; width: 188px;' },
                { name: 'timeCreateString', field: 'timeCreateString', label: '添加时间', align: 'left', style: 'font-size: 16px; width: 188px;' },
                { name: '_id', field: '_id', label: '操作', align: 'left', style: 'font-size: 16px;' },
            ]"
            :rows="LineAccessStore.list.filter((e) => (AccessStore.search.phone ? new RegExp(AccessStore.search.phone).test(e.joinAccess?.phone) : true))"
            :rows-per-page-options="[LineAccessStore.list.length * 2]"
        >
            <template v-slot:top="props">
                <div class="col-4">
                    <q-input
                        style="transform: translateX(-4px)"
                        dense
                        filled
                        clearable
                        color="primary"
                        clear-icon="close"
                        placeholder="请输入手机号"
                        v-model="AccessStore.search.phone"
                        :loading="AccessStore.loadding"
                    >
                    </q-input>
                </div>
                <div class="col-8 text-right q-pb-md q-pt-sm">
                    <q-btn class="text-body1 q-ml-sm" color="primary" @click="dialogPickAccess = true">继续添加</q-btn>
                </div>
            </template>
            <template v-slot:body="props">
                <q-tr>
                    <q-td key="nickname" :props="props" :class="{ 'text-negative': !props.row.joinAccess?.joinUserInfo }">
                        {{ props.row.joinAccess?.joinUserInfo?.nickname || "尚未登陆" }}
                    </q-td>
                    <q-td key="phone" :props="props"> {{ props.row.joinAccess?.phone }} </q-td>
                    <q-td key="timeCreateString" :props="props"> {{ props.row.timeCreateString }} </q-td>
                    <q-td key="_id" :props="props">
                        <a
                            class="cursor-pointer text-underline text-negative"
                            @click="
                                async () => {
                                    await LineAccessStore.delete(props.row);
                                    await LineAccessStore.get(LineStore.picked?._id);
                                }
                            "
                        >
                            删除
                        </a>
                    </q-td>
                </q-tr>
            </template>
        </q-table>

        <q-inner-loading :showing="AccessStore.loadding">
            <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
    </q-card>

    <q-dialog v-model="dialogPickAccess" persistent>
        <q-card class="w-500">
            <picker-access
                @pick="
                    async (accessPicking: Access[]) => {
                        await LineAccessStore.post(LineStore.picked?._id, accessPicking);
                        await LineAccessStore.get(LineStore.picked?._id);
                    }
                "
            >
            </picker-access>
        </q-card>
    </q-dialog>
</template>

<script lang="ts" setup>
import pickerAccess from "@/components/picker-access.vue";
import { onMounted, ref, nextTick, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { Notify, useQuasar } from "quasar";
import { ENUM_ROLE_WMSS, ENUM_LAYOUT_CABINET } from "qqlx-core";
import type { RoleOAJoined } from "qqlx-core/dto/oa/role";
import type { Box } from "qqlx-core/schema/oa/box";
import type { Access } from "qqlx-core/schema/oa/access";

import { useNotifyStore } from "@/stores/notify";
import { useUserStore } from "@/stores/user";
import { useCorpStore } from "@/stores/corp";
import { useAccessStore } from "@/stores/access";
import { useBoxStore } from "@/stores/box";
import { useLineStore } from "@/stores/line";
import { useLineAccessStore } from "@/stores/lineAccess";

const router = useRouter();
const NotifyStore = useNotifyStore();
const CorpStore = useCorpStore();
const AccessStore = useAccessStore();
const BoxStore = useBoxStore();
const LineStore = useLineStore();
const LineAccessStore = useLineAccessStore();

const dialogPickAccess = ref(false);

// action
onMounted(() => {
    LineAccessStore.get(LineStore.picked?._id);
});
onUnmounted(() => {});
</script>
