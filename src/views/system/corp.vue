<template>
    <!-- 公司列表 -->
    <!-- 公司列表 -->
    <div class="q-pt-md q-pb-lg q-mt-lg text-white">
        <div class="text-h4 text-weight-bold row items-center">
            <span>公司</span>
        </div>
        <div class="q-mt-md">
            <div>
                您的使用数据，如打卡信息、打卡规则等，都将会保存在
                <span class="text-weight-bold">@{{ CorpStore.corpPicked?.name }}</span>
                中， 您也可以
                <q-btn
                    push
                    square
                    color="negative"
                    class="q-mx-sm"
                    @click="
                        () => {
                            CorpStore.setSchema();
                            dialogCorp = true;
                        }
                    "
                >
                    添加新公司
                </q-btn>
            </div>
        </div>
    </div>

    <div class="row">
        <q-card
            v-for="corp in CorpStore.corpList.filter((e) => e.isDisabled === false)"
            class="w-200 q-mr-md q-mb-md shadow-15"
            :class="corp._id === CorpStore.corpPicked?._id ? 'w-325' : ''"
        >
            <q-card-section>
                <div class="text-h6 ellipsis" :class="corp._id === CorpStore.corpPicked?._id ? 'text-weight-bold' : 'text-grey'">
                    {{ corp.name }}
                    <q-badge v-if="corp.joinRole?.role === ENUM_ROLE_WMSS.ROOT" floating>管理员</q-badge>
                    <q-badge v-else floating color="grey">成员</q-badge>
                </div>
                <div class="text-grey ellipsis">{{ corp.contact || "-" }}</div>
                <div class="text-grey ellipsis">{{ corp.address || "-" }}</div>
            </q-card-section>
            <q-card-actions>
                <q-space></q-space>
                <q-btn icon="more_horiz" flat>
                    <q-menu>
                        <q-list>
                            <q-item clickable v-close-popup @click="CorpStore.pick(corp)">
                                <q-item-section>切换到这家</q-item-section>
                            </q-item>
                            <q-separator />
                            <q-item
                                clickable
                                v-close-popup
                                @click="
                                    () => {
                                        CorpStore.setSchema(corp);
                                        dialogCorp = true;
                                    }
                                "
                            >
                                <q-item-section>修改</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup>
                                <q-item-section class="text-negative" @click="CorpStore.delete(corp)">
                                    {{ corp.isDisabled ? "恢复" : "删除" }}
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            </q-card-actions>
        </q-card>
    </div>

    <div class="q-pt-md q-pb-lg q-mt-lg">
        <div class="text-h5 text-weight-bold row items-center">
            <span>最近删除</span>
        </div>
    </div>

    <div class="row">
        <q-card
            v-for="corp in CorpStore.corpList.filter((e) => e.isDisabled === true)"
            class="w-200 q-mr-md q-mb-md shadow-15"
            :class="corp._id === CorpStore.corpPicked?._id ? 'w-325' : ''"
        >
            <q-card-section>
                <div class="text-h6 ellipsis" :class="corp._id === CorpStore.corpPicked?._id ? 'text-weight-bold' : 'text-grey'">
                    {{ corp.name }}
                    <q-badge v-if="corp.joinRole?.role === ENUM_ROLE_WMSS.ROOT" floating>管理员</q-badge>
                    <q-badge v-else floating color="grey">成员</q-badge>
                </div>
                <div class="text-grey ellipsis">{{ corp.contact || "-" }}</div>
                <div class="text-grey ellipsis">{{ corp.address || "-" }}</div>
            </q-card-section>
            <q-card-actions>
                <q-space></q-space>
                <q-btn icon="more_horiz" flat>
                    <q-menu>
                        <q-list>
                            <q-item clickable v-close-popup @click="CorpStore.pick(corp)">
                                <q-item-section>切换到这家</q-item-section>
                            </q-item>
                            <q-separator />
                            <q-item
                                clickable
                                v-close-popup
                                @click="
                                    () => {
                                        CorpStore.setSchema(corp);
                                        dialogCorp = true;
                                    }
                                "
                            >
                                <q-item-section>修改</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup>
                                <q-item-section class="text-negative" @click="CorpStore.delete(corp)">
                                    {{ corp.isDisabled ? "恢复" : "删除" }}
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            </q-card-actions>
        </q-card>
    </div>

    <q-dialog v-model="dialogCorp" persistent>
        <q-card class="w-400">
            <q-toolbar>
                <q-toolbar-title>公司</q-toolbar-title>
                <q-btn dense flat icon="close" v-close-popup></q-btn>
            </q-toolbar>
            <q-separator />

            <q-card-section>
                <q-input filled label="公司名称" class="q-mb-sm" v-model="CorpStore.corpEditor.name">
                    <template v-slot:before>
                        <q-icon name="person" />
                    </template>
                </q-input>

                <q-input filled label="联系方式" class="q-mb-sm" v-model="CorpStore.corpEditor.contact">
                    <template v-slot:before>
                        <q-icon name="phone" />
                    </template>
                </q-input>

                <q-input filled label="公司地址" class="q-mb-sm" v-model="CorpStore.corpEditor.address">
                    <template v-slot:before>
                        <q-icon name="event" />
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
                            if (CorpStore.corpEditor._id) await CorpStore.patch();
                            else await CorpStore.post();
                            dialogCorp = false;
                        }
                    "
                >
                    {{ CorpStore.corpEditor._id ? "保存" : "新增" }}
                </q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { onMounted, ref, computed } from "vue";
import { ENUM_ROLE_WMSS, MAP_ENUM_ROLE_WMSS } from "qqlx-core";

import { getTimeGap } from "@/utils";
import { useNotifyStore } from "@/stores/notify";
import { useUserStore } from "@/stores/user";
import { useCorpStore } from "@/stores/corp";
import { useRoleOAStore } from "@/stores/role";

const router = useRouter();
const CorpStore = useCorpStore();

const dialogCorp = ref(false);
</script>

<style scoped lang="scss"></style>
