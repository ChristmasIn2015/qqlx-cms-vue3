<template>
    <div class="q-pt-md q-pl-sm q-pb-lg q-mt-lg text-white">
        <div class="text-h4 text-weight-bold row items-center">
            <span>收集箱</span>
        </div>
        <div class="q-mt-md">
            <div>
                您当前正在
                <span class="text-weight-bold">@{{ CorpStore.corpPicked?.name }}</span>
                中， 您可以
                <q-btn
                    push
                    square
                    color="negative"
                    class="q-mx-sm"
                    @click="
                        () => {
                            BoxStore.setSchema();
                            dialogBox = true;
                        }
                    "
                >
                    添加新收集箱
                </q-btn>
            </div>
        </div>
    </div>

    <div class="row">
        <q-card v-for="box in BoxStore.list.filter((e) => e.isDisabled === false)" class="w-300 q-mr-md q-mb-md shadow-15">
            <q-card-section>
                <div class="text-h6 ellipsis">
                    {{ box.title }}
                </div>
                <div class="text-grey ellipsis">{{ box.desc || "-" }}</div>
                <div class="text-grey ellipsis">
                    <span>创建时间：</span>
                    <span>{{ box.timeCreateString || "-" }}</span>
                </div>
            </q-card-section>
            <q-card-actions>
                <q-space></q-space>
                <q-btn icon="more_horiz" flat>
                    <q-menu>
                        <q-list>
                            <q-item clickable v-close-popup @click="checking(box)">
                                <q-item-section>开始打卡</q-item-section>
                            </q-item>
                            <q-item
                                clickable
                                v-close-popup
                                @click="
                                    () => {
                                        BoxStore.setSchema(box);
                                        $router.push('/oa/box/check');
                                    }
                                "
                            >
                                <q-item-section>查看记录</q-item-section>
                            </q-item>
                            <q-item
                                clickable
                                v-close-popup
                                @click="
                                    () => {
                                        BoxStore.setSchema(box);
                                        dialogBox = true;
                                    }
                                "
                            >
                                <q-item-section>修改</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup>
                                <q-item-section class="text-negative" @click="BoxStore.delete(box)">
                                    {{ box.isDisabled ? "恢复" : "删除" }}
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            </q-card-actions>
        </q-card>
    </div>

    <div class="q-pt-md q-pl-sm q-pb-lg q-mt-lg">
        <div class="text-h5 text-weight-bold row items-center">
            <span>最近删除</span>
        </div>
    </div>

    <div class="row">
        <q-card v-for="box in BoxStore.list.filter((e) => e.isDisabled === true)" class="w-300 q-mr-md q-mb-md shadow-15">
            <q-card-section class="text-grey">
                <div class="text-h6 ellipsis">
                    {{ box.title }}
                </div>
                <div class="text-grey ellipsis">{{ box.desc || "-" }}</div>
                <div class="text-grey ellipsis">{{ box.timeCreateString || "-" }}</div>
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
                                        BoxStore.setSchema(box);
                                        dialogBox = true;
                                    }
                                "
                            >
                                <q-item-section>修改</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup>
                                <q-item-section class="text-negative" @click="BoxStore.delete(box)">
                                    {{ box.isDisabled ? "恢复" : "删除" }}
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            </q-card-actions>
        </q-card>
    </div>

    <q-dialog v-model="dialogBox" persistent>
        <q-card class="w-400">
            <q-toolbar>
                <q-toolbar-title>收集箱</q-toolbar-title>
                <q-btn dense flat icon="close" v-close-popup></q-btn>
            </q-toolbar>
            <q-separator />

            <q-card-section>
                <q-input filled label="名称" class="q-mb-sm" v-model="BoxStore.editor.title">
                    <template v-slot:before>
                        <q-icon name="person" />
                    </template>
                </q-input>

                <q-input filled label="描述" class="q-mb-sm" v-model="BoxStore.editor.desc">
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
                            if (BoxStore.editor._id) await BoxStore.patch();
                            else await BoxStore.post();
                            dialogBox = false;
                        }
                    "
                >
                    {{ BoxStore.editor._id ? "保存" : "新增" }}
                </q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>

    <q-dialog v-model="dialogCheck" persistent>
        <q-card class="w-500">
            <q-toolbar>
                <q-toolbar-title>正在打卡 </q-toolbar-title>
                <q-btn dense flat icon="close" v-close-popup @click="BoxStore.setSchema()"></q-btn>
            </q-toolbar>
            <q-separator />
            <q-card-section>
                <q-input
                    filled
                    class="checking-only q-mb-sm"
                    :label="checkFocusing ? '打开 @清泉流响APP 微信小程序，放在扫码盒上方' : '请保持光标在输入框内'"
                    v-model="CheckStore.editor.userId"
                    @focus="checkFocusing = true"
                    @blur="checkFocusing = false"
                >
                    <template v-slot:before>
                        <q-spinner v-if="checkFocusing" style="margin-bottom: 4px" color="primary" size="1em" :thickness="10" />
                    </template>
                </q-input>
                <div class="row">
                    <div v-if="!!CheckStore.error" class="text-negative"><q-icon name="priority_high"></q-icon> {{ CheckStore.error }}</div>
                    <div v-else-if="!!CheckStore.success" class="text-positive"><q-icon name="check"></q-icon> {{ CheckStore.success }}</div>
                    <q-space></q-space>
                </div>
            </q-card-section>
            <q-separator />
            <div class="q-pa-md text-grey" style="padding-left: 14px">
                <div>
                    1.点击输入框，将光标保持在输入框内
                    <span class="text-negative">（重要）</span>
                </div>
                <div>
                    2.切换至英文输入法，避免输入法影响打卡结果
                    <span class="text-negative">（重要）</span>
                </div>
                <div>3.打开 @清泉流响APP 微信小程序，放在扫码盒上方</div>
                <div>
                    4.至此，打卡人员已可以向
                    <span class="text-dark text-weight-bold">@{{ BoxStore.editor.title }}</span>
                    打卡
                </div>
            </div>
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

const dialogBox = ref(false);
const checkFocusing = ref(false);
const dialogCheck = ref(false);

const checking = (box: Box) => {
    BoxStore.setSchema(box);
    CheckStore.setSchema();
    CheckStore.success = "";
    CheckStore.error = "";

    dialogCheck.value = true;
    nextTick(() => {
        setTimeout(() => {
            const html: any = document.getElementsByClassName("checking-only")[0];
            html?.focus();
        }, 500);
    });
};
const postCheck = async (userId: string) => {
    CheckStore.editor.boxId = BoxStore.editor._id;
    CheckStore.editor.userId = String(userId);
    await CheckStore.post(); // catch
    CheckStore.setSchema();
};

// action
const listener = ($event: KeyboardEvent) => {
    if ($event.code === "Enter") {
        postCheck(($event.target as HTMLInputElement)?.value);
    }
};
onMounted(() => {
    BoxStore.get();
    document.addEventListener("keyup", listener);
});
onUnmounted(() => {
    document.removeEventListener("keyup", listener);
});
</script>
