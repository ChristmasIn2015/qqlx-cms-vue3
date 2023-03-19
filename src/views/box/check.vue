<template>
    <div class="q-pt-md q-pl-sm q-pb-lg q-mt-lg text-white">
        <div class="text-h4 text-weight-bold row items-center">
            <q-btn fab icon="arrow_back" class="q-mr-sm" style="margin-left: -16px" @click="$router.back()"></q-btn>
            <span>打卡记录</span>
        </div>
        <div class="q-mt-md">
            <div>
                您当前正在查看
                <span class="text-weight-bold text-negative">@{{ BoxStore.editor?.title }}</span>
                的打卡记录
            </div>
        </div>
    </div>

    <q-card>
        <q-table
            dense
            row-key="_id"
            :columns="[
                { name: 'joinBox', field: 'joinBox', label: '收集箱', align: 'left', style: 'font-size: 16px; width: 188px;' },
                { name: 'timeCreateString', field: 'timeCreateString', label: '打卡时间', align: 'left', style: 'font-size: 16px; width: 255px;' },
                { name: 'nickname', field: 'joinWeChat', label: '昵称', align: 'left', style: 'font-size: 16px; width: 188px;' },
                { name: 'count', field: 'count', label: '今日已累计打卡', align: 'left', style: 'font-size: 16px;' },
                // { name: '_id', field: '_id', label: '操作', style: 'font-size: 16px; ' },
            ]"
            :rows="CheckStore.list"
            :rows-per-page-options="[CheckStore.page.pageSize]"
        >
            <template v-slot:top="props">
                <div class="col-4 q-py-md">
                    <q-input
                        dense
                        filled
                        clearable
                        color="primary"
                        clear-icon="close"
                        placeholder="请输入名称，点击空白区域开始搜索"
                        v-model="CheckStore.keyword"
                        :loading="CheckStore.loadding"
                        @blur="CheckStore.get(1)"
                    >
                        <template v-slot:prepend>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </div>
                <div class="col-8 text-right">
                    <q-btn class="text-body1" @click="CheckStore.download()">导出</q-btn>
                    <q-btn color="white" text-color="black" class="text-body1 q-ml-sm">
                        <span v-if="CheckStore.timeQuasarPicked">
                            <q-icon name="date_range" class="q-mr-xs" size="20px" style="margin-bottom: 4px"></q-icon>
                            {{ CheckStore.timeQuasarPicked }}
                        </span>
                        <span v-else>请选择日期</span>
                        <q-menu>
                            <q-date
                                minimal
                                no-unset
                                color="pink-6"
                                first-day-of-week="1"
                                v-model="CheckStore.timeQuasarPicked"
                                @update:model-value="CheckStore.timeChange"
                            />
                        </q-menu>
                    </q-btn>
                </div>
            </template>
            <template v-slot:body="props">
                <q-tr>
                    <q-td key="joinBox" :props="props"> {{ props.row.joinBox?.title }} </q-td>
                    <q-td key="timeCreateString" :props="props"> {{ props.row.timeCreateString }} </q-td>
                    <q-td key="nickname" :props="props"> {{ props.row.joinWeChat?.nickname }} </q-td>
                    <q-td key="count" :props="props"> {{ props.row.count }} 次</q-td>
                    <q-td key="_id" :props="props">
                        <!-- <a class="cursor-pointer text-underline text-negative" @click="CheckStore.delete(props.row)">删除</a> -->
                    </q-td>
                </q-tr>
            </template>
            <template v-slot:bottom="props">
                <q-pagination
                    size="17px"
                    class="q-my-sm"
                    color="white"
                    text-color="black"
                    active-text-color="white"
                    active-color="primary"
                    v-model="CheckStore.page.page"
                    :max-pages="10"
                    :max="Math.ceil(CheckStore.total / CheckStore.page.pageSize)"
                    @update:model-value="(value) => CheckStore.get(value)"
                />
                <q-space></q-space>
                <span>共 {{ CheckStore.total }} 项</span>
            </template>
        </q-table>

        <q-inner-loading :showing="CheckStore.loadding">
            <q-spinner-gears size="50px" color="pink-6" />
        </q-inner-loading>
    </q-card>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { Notify, useQuasar } from "quasar";
import { ENUM_ROLE_WMSS, ENUM_LAYOUT_CABINET } from "qqlx-core";
import type { RoleOAJoined } from "qqlx-core/dto/oa/role";
import type { Box } from "qqlx-core/schema/oa/box";

import { useNotifyStore } from "@/stores/notify";
import { useUserStore } from "@/stores/user";
import { useCorpStore } from "@/stores/corp";
import { useBoxStore } from "@/stores/box";
import { useCheckStore } from "@/stores/check";

const router = useRouter();
const NotifyStore = useNotifyStore();
const CorpStore = useCorpStore();
const BoxStore = useBoxStore();
const CheckStore = useCheckStore();

// action
onMounted(() => {
    CheckStore.search.boxId = BoxStore.editor._id;
    CheckStore.get();
});
onUnmounted(() => {});
</script>
