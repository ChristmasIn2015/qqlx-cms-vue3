<template>
    <div class="row q-pt-xl q-mt-xl items-stretch">
        <!-- 基础信息 -->
        <!-- 基础信息 -->
        <div class="w-350">
            <q-card class="w-325 q-mr-md q-mb-md text-body1 full-height bg-grey-11">
                <q-card-section class="text-h5 text-weight-bold">
                    <span>基础信息</span>
                </q-card-section>
                <q-separator />
                <q-card-section>
                    <div class="row">
                        <span class="col">公司</span>
                        <span class="col-10 text-primary text-right text-underline cursor-pointer" @click="router.push('/oa/system/corp')">
                            <span>{{ CorpStore.corpPicked?.name }}</span>
                        </span>
                    </div>
                    <div class="row text-grey">
                        <span class="col">您的使用数据，如打卡信息、打卡规则等，都将会保存在其中</span>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { onMounted, ref, computed } from "vue";
import { ENUM_ROLE_WMSS, MAP_ENUM_ROLE_WMSS } from "qqlx-core";

import { getTimeGap } from "@/utils";
import { useNotifyStore } from "@/stores/notify";
import { useUserStore } from "@/stores/user";
import { useCorpStore } from "@/stores/corp";

const router = useRouter();
const CorpStore = useCorpStore();

// vue
onMounted(() => {});
</script>

<style scoped lang="scss"></style>
