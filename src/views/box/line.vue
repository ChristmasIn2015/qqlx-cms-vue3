<template>
    <div class="q-pt-md q-pl-sm q-pb-lg q-mt-lg text-white">
        <div class="text-h4 text-weight-bold row items-center">
            <span>打卡场景</span>
        </div>
        <div class="q-mt-md">
            <div>1.在场景中的打卡箱，会根据您配置的场景规则进行打卡工作</div>
            <div>2.在场景中的打卡次数限制：如“考勤”打卡箱，可以设置每天仅可以打卡一次</div>
            <div>3.在场景中的打卡顺序：如“取餐”打卡箱，可以设置必须在“考勤”打卡后，才能进行“取餐”打卡</div>
            <div>4.在场景中的打卡白名单：如“取餐”打卡箱，您可以设置仅允许某些工作人员进行打卡</div>
            <div class="q-mt-sm text-dark">
                5.您可以
                <q-btn
                    push
                    square
                    color="negative"
                    class="q-mx-sm"
                    @click="
                        () => {
                            LineStore.setSchema();
                            dialogLine = true;
                        }
                    "
                >
                    添加
                </q-btn>
                新场景
            </div>
        </div>
    </div>

    <div>
        <q-card v-for="line in LineStore.list" class="q-mr-md q-mb-md shadow-15">
            <q-card-section>
                <div class="text-h6 ellipsis">
                    {{ line.title }}
                </div>
                <div class="text-grey ellipsis">{{ line.desc || "-" }}</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
                <div class="row text-body1 q-pb-sm" v-for="(unit, index) in line.joinBoxes || []">
                    <div class="col">
                        <q-btn icon="how_to_vote">
                            <span class="q-ml-sm text-body1">{{ unit.joinBox?.title }}</span>
                        </q-btn>
                        <span class="q-ml-sm">每日 {{ unit.orderLimitTime }}:00 后，</span>
                        <span>
                            最多打卡 <span class="text-primary text-weight-bold">{{ unit.orderLimit }}</span> 次
                        </span>
                        <a
                            class="text-negative text-underline cursor-pointer q-ml-md"
                            @click="
                                async () => {
                                    await LineBoxStore.delete(unit);
                                    await LineStore.get();
                                }
                            "
                        >
                            取消
                        </a>
                    </div>
                </div>
            </q-card-section>
            <q-separator />

            <q-card-section>
                <div class="row text-body1">
                    <div class="col">
                        可打卡人群：
                        <a
                            class="cursor-pointer text-underline text-primary text-weight-bold"
                            @click="
                                () => {
                                    LineStore.picked = cloneDeep(line);
                                    AccessStore.listPicked = cloneDeep(line.joinAccesses.filter((e) => e.joinAccess).map((e) => e.joinAccess));
                                    $router.push('/oa/box/lineAccess');
                                }
                            "
                        >
                            {{ line.joinAccesses?.length }} 人
                        </a>
                    </div>
                </div>
            </q-card-section>
            <q-separator />
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
                                        LineStore.setSchema(line);
                                        dialogLine = true;
                                    }
                                "
                            >
                                <q-item-section>修改</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup>
                                <q-item-section class="text-negative" @click="LineStore.delete(line)"> 删除 </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
                <q-btn
                    icon="add"
                    color="primary"
                    @click="
                        () => {
                            LineStore.setSchema(line);
                            stepper = 1;
                            dialogPick = true;
                        }
                    "
                >
                    <q-tooltip class="text-body1">选择打卡箱，加入此场景</q-tooltip>
                </q-btn>
            </q-card-actions>
        </q-card>
    </div>

    <q-dialog v-model="dialogLine" persistent>
        <q-card class="w-400">
            <q-toolbar>
                <q-toolbar-title>设置场景</q-toolbar-title>
                <q-btn dense flat icon="close" v-close-popup></q-btn>
            </q-toolbar>
            <q-separator />

            <q-card-section>
                <q-input filled label="名称" class="q-mb-sm" v-model="LineStore.editor.title">
                    <template v-slot:before>
                        <q-icon name="person" />
                    </template>
                </q-input>

                <q-input filled label="描述" class="q-mb-sm" v-model="LineStore.editor.desc">
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
                            if (LineStore.editor._id) await LineStore.patch();
                            else await LineStore.post();
                            dialogLine = false;
                        }
                    "
                >
                    {{ LineStore.editor._id ? "保存" : "新增" }}
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
            <q-card-section class="q-pa-none">
                <q-stepper v-model="stepper" color="primary" animated class="">
                    <q-step :name="1" title="选择一个打卡箱" icon="settings" :done="stepper > 1">
                        <picker-box
                            @pick="
                                (box:Box) => {
                                    BoxStore.setSchema(box);
                                    stepper = 2;
                                }
                            "
                        />
                    </q-step>
                    <q-step :name="2" title="设置更多场景" icon="settings" :done="stepper > 2">
                        <q-input
                            filled
                            :label="`每日 ${
                                LineBoxStore.editor.orderLimitTime < 9 ? `0${LineBoxStore.editor.orderLimitTime}` : LineBoxStore.editor.orderLimitTime
                            }:00 后，最多打卡 ${LineBoxStore.editor.orderLimit} 次`"
                            class="q-mb-sm"
                            type="number"
                            v-model="LineBoxStore.editor.orderLimit"
                        >
                        </q-input>
                        <q-input
                            filled
                            :label="`每日 ${
                                LineBoxStore.editor.orderLimitTime < 9 ? `0${LineBoxStore.editor.orderLimitTime}` : LineBoxStore.editor.orderLimitTime
                            }:00 后，清零打卡限制`"
                            class="q-mb-sm"
                            type="number"
                            v-model="LineBoxStore.editor.orderLimitTime"
                        >
                        </q-input>

                        <q-card-actions class="q-pa-none">
                            <q-space></q-space>
                            <q-btn
                                color="primary"
                                v-close-popup
                                @click="
                                    async () => {
                                        LineBoxStore.editor.lineId = LineStore.editor._id;
                                        LineBoxStore.editor.boxId = BoxStore.editor._id;
                                        await LineBoxStore.post();
                                        await LineStore.get();
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
import { useAccessStore } from "@/stores/access";
import { useBoxStore } from "@/stores/box";
import { useLineStore } from "@/stores/line";
import { useLineBoxStore } from "@/stores/lineBox";
import { useCheckStore } from "@/stores/check";
import { cloneDeep } from "lodash";

const router = useRouter();
const NotifyStore = useNotifyStore();
const CorpStore = useCorpStore();
const AccessStore = useAccessStore();
const BoxStore = useBoxStore();
const LineStore = useLineStore();
const LineBoxStore = useLineBoxStore();
const CheckStore = useCheckStore();

const dialogLine = ref(false);
const checkFocusing = ref(false);
const dialogPick = ref(false);
const stepper = ref(1);

// action
onMounted(() => {
    LineStore.get();
});
onUnmounted(() => {});
</script>
