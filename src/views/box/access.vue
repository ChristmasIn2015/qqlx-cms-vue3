<template>
    <div class="q-pt-md q-pl-sm q-pb-lg q-mt-lg text-white">
        <div class="text-h4 text-weight-bold row items-center">
            <span>白名单</span>
        </div>
        <div class="q-mt-md">
            <div>1.在场景中，您可以仅允许白名单中的成员进行打卡</div>
            <div>2.每种不同的场景，可以选择不同的白名单成员</div>
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
            :rows="AccessStore.list"
            :rows-per-page-options="[AccessStore.list.length]"
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
                        <template v-slot:after>
                            <q-btn icon="search" color="primary" @click="AccessStore.get()"></q-btn>
                        </template>
                    </q-input>
                </div>
                <div class="col-8 text-right q-pb-md q-pt-sm">
                    <q-btn class="q-ml-sm" square push label="批量导入">
                        <q-menu>
                            <q-list>
                                <q-item clickable @click="NotifyStore.download()">
                                    <q-item-section>下载模板</q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section>
                                        <q-file
                                            dense
                                            borderless
                                            accept=".xlsx, .xls"
                                            v-model="filePicking"
                                            label="选择文件"
                                            @update:model-value="filePickNext"
                                        />
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                    <q-btn class="q-ml-sm" color="negative" flat v-if="AccessStore.listExcel.length > 0" @click="AccessStore.listExcel = []"> 清空 </q-btn>
                    <q-btn square push class="q-ml-sm" color="positive" v-if="AccessStore.listExcel.length > 0" @click="AccessStore.post()">
                        保存 {{ AccessStore.listExcel.length }} 项
                    </q-btn>
                    <q-btn square push class="q-ml-sm" color="primary" @click="AccessStore.listExcel.push(AccessStore.getSchema())">继续添加</q-btn>
                </div>
            </template>
            <template v-slot:top-row>
                <q-tr v-for="(item, index) in AccessStore.listExcel">
                    <q-td key="nickname" style="width: 188px">自动获取</q-td>
                    <q-td key="phone" style="width: 255px">
                        <q-input dense filled clearable color="primary" clear-icon="close" placeholder="请输入手机号" v-model="item.phone"></q-input>
                    </q-td>
                    <q-td key="timeCreateString" style="width: 188px"> - </q-td>
                    <q-td key="_id">
                        <a class="cursor-pointer text-negative" @click="AccessStore.listExcel.splice(index, 1)">删除</a>
                    </q-td>
                </q-tr>
            </template>
            <template v-slot:body="props">
                <q-tr>
                    <q-td key="nickname" :props="props" :class="{ 'text-negative': !props.row.joinUserInfo }">
                        {{ props.row.joinUserInfo?.nickname || "尚未登陆" }}
                    </q-td>
                    <q-td key="phone" :props="props"> {{ props.row.phone }} </q-td>
                    <q-td key="timeCreateString" :props="props"> {{ props.row.timeCreateString }} </q-td>
                    <q-td key="_id" :props="props">
                        <a class="cursor-pointer text-underline text-negative" @click="AccessStore.delete(props.row)">删除</a>
                    </q-td>
                </q-tr>
            </template>
        </q-table>

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
import type { Box } from "qqlx-core/schema/oa/box";

import { useNotifyStore } from "@/stores/notify";
import { useUserStore } from "@/stores/user";
import { useCorpStore } from "@/stores/corp";
import { useAccessStore } from "@/stores/access";
import { useBoxStore } from "@/stores/box";
import type { Access } from "qqlx-core/schema/oa/access";

const router = useRouter();
const NotifyStore = useNotifyStore();
const CorpStore = useCorpStore();
const BoxStore = useBoxStore();
const AccessStore = useAccessStore();

const filePicking = ref(null);
const filePickNext = async (file: File) => {
    try {
        if (!file) return;
        const reader = new FileReader(); // WebAPI
        reader.onload = async () => {
            const workbook = XLSX.read(reader.result, { type: "binary" });
            const sheet = workbook.Sheets["白名单导入"];
            if (!sheet) throw new Error(`找不到表格 [白名单导入] !`);
            const rowJsonList: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet);

            // 1.批量上传客户
            const uploading = [];
            for (let i in rowJsonList) {
                const row = rowJsonList[i];
                const schema = AccessStore.getSchema() as Access;
                schema.phone = String(row["@手机号"] || "");
                uploading.push(schema);
            }
            AccessStore.listExcel = uploading;
        };
        reader.readAsBinaryString(file);
    } catch (error) {
        NotifyStore.fail((error as Error).message);
    }
};

// action
onMounted(() => {
    AccessStore.get();
});
onUnmounted(() => {});
</script>
