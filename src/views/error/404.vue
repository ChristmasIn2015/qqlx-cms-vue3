<template>
    <div class="text-center q-pt-xl">
        <div class="text-h1 q-pt-xl q-my-xl">找不到对应路径</div>
        <q-btn color="primary" @click="router.push('/oa')">返回主页</q-btn>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>
