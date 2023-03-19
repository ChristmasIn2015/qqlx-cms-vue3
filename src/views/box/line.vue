<template>
    <div class="q-pt-md q-pl-sm q-pb-lg q-mt-lg text-white">
        <div class="text-h4 text-weight-bold row items-center">
            <span>规则列表</span>
        </div>
        <div class="q-mt-md">
            <div>
                收集箱的收集流程，会按照您配置的收集规则进行工作， 您可以
                <q-btn
                    push
                    square
                    color="negative"
                    class="q-mx-sm"
                    @click="
                        () => {
                            BoxLineStore.setSchema();
                            dialogBoxLine = true;
                        }
                    "
                >
                    添加新规则
                </q-btn>
            </div>
        </div>
    </div>

    <div class="row">
        <q-card v-for="boxLine in BoxLineStore.list" class="w-600 q-mr-md q-mb-md shadow-15">
            <q-card-section>
                <div class="text-h6 ellipsis">
                    {{ boxLine.title }}
                </div>
                <div class="text-grey ellipsis">
                    <span>创建时间：</span>
                    <span>{{ boxLine.timeCreateString || "-" }}</span>
                </div>
                <div class="text-grey ellipsis">{{ boxLine.desc || "-" }}</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
                <div class="row text-body1" v-for="(unit, index) in boxLine.joinUnits || []">
                    <div class="col-10">
                        【{{ unit.orderNo }}】每日 {{ unit.orderLimitTime }}:00 后，最多打卡 <span class="text-negative">{{ unit.orderLimit }}</span>
                        次

                        <q-icon name="how_to_vote" class="q-ml-md" style="margin-bottom: 4px"></q-icon>
                        {{ unit.joinBox?.title }}
                    </div>
                    <div class="col-2 text-right">
                        <a
                            class="text-negative text-underline cursor-pointer"
                            @click="
                                async () => {
                                    await BoxLineUnitStore.delete(unit);
                                    await BoxLineStore.get();
                                }
                            "
                            >删除</a
                        >
                    </div>
                </div>
            </q-card-section>
            <q-card-actions>
                <q-space></q-space>
                <q-btn icon="more_horiz" flat>
                    <q-menu>
                        <q-list>
                            <q-item
                                clickable
                                v-close-popup
                                @click="
                                    () => {
                                        BoxLineStore.setSchema(boxLine);
                                        stepper = 1;
                                        dialogPick = true;
                                    }
                                "
                            >
                                <q-item-section>添加收集箱</q-item-section>
                            </q-item>
                            <q-item
                                clickable
                                v-close-popup
                                @click="
                                    () => {
                                        BoxLineStore.setSchema(boxLine);
                                        dialogBoxLine = true;
                                    }
                                "
                            >
                                <q-item-section>修改</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup>
                                <q-item-section class="text-negative" @click="BoxLineStore.delete(boxLine)"> 删除 </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            </q-card-actions>
        </q-card>
    </div>

    <q-dialog v-model="dialogBoxLine" persistent>
        <q-card class="w-400">
            <q-toolbar>
                <q-toolbar-title>设置规则</q-toolbar-title>
                <q-btn dense flat icon="close" v-close-popup></q-btn>
            </q-toolbar>
            <q-separator />

            <q-card-section>
                <q-input filled label="名称" class="q-mb-sm" v-model="BoxLineStore.editor.title">
                    <template v-slot:before>
                        <q-icon name="person" />
                    </template>
                </q-input>

                <q-input filled label="描述" class="q-mb-sm" v-model="BoxLineStore.editor.desc">
                    <template v-slot:before>
                        <q-icon name="message" />
                    </template>
                </q-input>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn
                    color="primary"
                    push
                    square
                    @click="
                        async () => {
                            if (BoxLineStore.editor._id) await BoxLineStore.patch();
                            else await BoxLineStore.post();
                            dialogBoxLine = false;
                        }
                    "
                >
                    {{ BoxLineStore.editor._id ? "保存" : "新增" }}
                </q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>

    <q-dialog v-model="dialogPick">
        <q-card class="w-1200">
            <q-toolbar>
                <q-toolbar-title></q-toolbar-title>
                <q-btn dense flat icon="close" v-close-popup></q-btn>
            </q-toolbar>
            <q-card-section>
                <q-stepper v-model="stepper" color="primary" animated>
                    <q-step :name="1" title="选择一个收集箱" icon="settings" :done="stepper > 1">
                        <picker-box
                            @pick="
                                (box:Box) => {
                                    BoxStore.setSchema(box);
                                    stepper = 2;
                                }
                            "
                        />
                    </q-step>
                    <q-step :name="2" title="设置更多规则" icon="settings" :done="stepper > 2">
                        <q-input
                            filled
                            :label="`每日 ${
                                BoxLineUnitStore.editor.orderLimitTime < 9
                                    ? `0${BoxLineUnitStore.editor.orderLimitTime}`
                                    : BoxLineUnitStore.editor.orderLimitTime
                            }:00 后，最多打卡 ${BoxLineUnitStore.editor.orderLimit} 次`"
                            class="q-mb-sm"
                            type="number"
                            v-model="BoxLineUnitStore.editor.orderLimit"
                        >
                        </q-input>
                        <q-input
                            filled
                            :label="`每日 ${
                                BoxLineUnitStore.editor.orderLimitTime < 9
                                    ? `0${BoxLineUnitStore.editor.orderLimitTime}`
                                    : BoxLineUnitStore.editor.orderLimitTime
                            }:00 后，清零打卡限制`"
                            class="q-mb-sm"
                            type="number"
                            v-model="BoxLineUnitStore.editor.orderLimitTime"
                        >
                        </q-input>

                        <q-card-actions class="q-px-none">
                            <q-space></q-space>
                            <q-btn
                                color="primary"
                                v-close-popup
                                @click="
                                    async () => {
                                        BoxLineUnitStore.setSchema();
                                        BoxLineUnitStore.editor.lineId = BoxLineStore.editor._id;
                                        BoxLineUnitStore.editor.boxId = BoxStore.editor._id;
                                        await BoxLineUnitStore.post();
                                        await BoxLineStore.get();
                                    }
                                "
                            >
                                完成
                            </q-btn>
                        </q-card-actions>
                    </q-step>
                </q-stepper>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { Notify, useQuasar } from "quasar";
import { ENUM_ROLE_WMSS, ENUM_LAYOUT_CABINET } from "qqlx-core";
import type { RoleOAJoined } from "qqlx-core/dto/oa/role";
import type { Box } from "qqlx-core/schema/oa/box";

import pickerBox from "@/components/picker-box.vue";
import { useNotifyStore } from "@/stores/notify";
import { useUserStore } from "@/stores/user";
import { useCorpStore } from "@/stores/corp";
import { useBoxStore } from "@/stores/box";
import { useBoxLineStore } from "@/stores/boxLine";
import { useBoxLineUnitStore } from "@/stores/boxLineUnit";
import { useCheckStore } from "@/stores/check";

const router = useRouter();
const NotifyStore = useNotifyStore();
const CorpStore = useCorpStore();
const BoxStore = useBoxStore();
const BoxLineStore = useBoxLineStore();
const BoxLineUnitStore = useBoxLineUnitStore();
const CheckStore = useCheckStore();

const dialogBoxLine = ref(false);
const checkFocusing = ref(false);
const dialogPick = ref(false);
const stepper = ref(1);

// action
onMounted(() => {
    BoxLineStore.get();
});
onUnmounted(() => {});
</script>
