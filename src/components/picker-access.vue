<template>
    <q-card>
        <q-table
            style="height: 500px"
            dense
            row-key="_id"
            separator="cell"
            selection="multiple"
            :columns="[
                { name: 'nickname', field: 'joinUserInfo', label: '昵称', align: 'left', style: 'font-size: 16px; width: 188px;' },
                { name: 'phone', field: 'phone', label: '手机号', align: 'left', style: 'font-size: 16px; width: 188px;' },
                { name: 'timeCreateString', field: 'timeCreateString', label: '添加时间', align: 'left', style: 'font-size: 16px; width: 188px;' },
            ]"
            :rows="AccessStore.list.filter((e) => (AccessStore.search.phone ? new RegExp(AccessStore.search.phone).test(e.phone) : true))"
            :rows-per-page-options="[AccessStore.list.length]"
            v-model:selected="accessPicking"
        >
            <template v-slot:top="props">
                <div class="col">
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
            </template>
        </q-table>

        <q-card-actions>
            <q-space></q-space>
            <q-btn color="" flat v-close-popup>关闭</q-btn>
            <q-btn v-close-popup color="primary" @click="$emit('pick', accessPicking)"> 确定 </q-btn>
        </q-card-actions>

        <q-inner-loading :showing="AccessStore.loadding">
            <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
    </q-card>
</template>

<script lang="ts" setup>
import * as XLSX from "xlsx";
import { onMounted, ref, nextTick, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { Notify, useQuasar } from "quasar";
import { ENUM_ROLE_WMSS, ENUM_LAYOUT_CABINET } from "qqlx-core";
import type { RoleOAJoined } from "qqlx-core/dto/oa/role";
import type { Access } from "qqlx-core/schema/oa/access";
import type { Box } from "qqlx-core/schema/oa/box";
import type { AccessJoined } from "qqlx-core/dto/oa/access";

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
const BoxStore = useBoxStore();
const AccessStore = useAccessStore();
const LineStore = useLineStore();
const LineAccessStore = useLineAccessStore();

const accessPicking = ref([] as AccessJoined[]);

// action
onMounted(() => {
    AccessStore.get();
    accessPicking.value = [];
});
onUnmounted(() => {});
</script>
