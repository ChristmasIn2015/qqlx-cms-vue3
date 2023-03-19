<template>
	<router-view />
</template>

<script setup lang="ts"></script>

<style lang="scss">
.app-background {
	height: 255px;
	border-top-left-radius: 0;
	border-top-right-radius: 0;
	border-bottom-left-radius: 16px;
	border-bottom-right-radius: 16px;
}
.color-back-main {
	background: linear-gradient(to right bottom, $primary 30%, $pink-6 90%);
}
.color-back-system {
	background: linear-gradient(to top right, $primary 0%, $cyan 200%);
}
.color-back-warehouse {
	background: linear-gradient(to top right, $primary 0%, $indigo-14 100%);
}
</style>
