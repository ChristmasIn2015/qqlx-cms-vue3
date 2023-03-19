<template>
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
                <q-btn color="primary" flat @click="() => $emit('pick', cloneDeep(box))">选择</q-btn>
            </q-card-actions>
        </q-card>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { Notify, useQuasar } from "quasar";
import { cloneDeep } from "lodash";
import { ENUM_ROLE_WMSS, ENUM_LAYOUT_CABINET } from "qqlx-core";
import type { RoleOAJoined } from "qqlx-core/dto/oa/role";
import type { Box } from "qqlx-core/schema/oa/box";

import { useNotifyStore } from "@/stores/notify";
import { useUserStore } from "@/stores/user";
import { useCorpStore } from "@/stores/corp";
import { useBoxStore } from "@/stores/box";
import { useCheckStore } from "@/stores/check";
import { clone } from "lodash";

const router = useRouter();
const NotifyStore = useNotifyStore();
const CorpStore = useCorpStore();
const BoxStore = useBoxStore();
const CheckStore = useCheckStore();

const dialogBox = ref(false);
const checkFocusing = ref(false);
const dialogCheck = ref(false);

// action
onMounted(() => {
    BoxStore.get();
});
onUnmounted(() => {});
</script>
