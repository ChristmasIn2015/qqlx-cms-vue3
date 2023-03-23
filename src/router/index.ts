// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/oa",
        redirect: "/oa/system/setting",
        component: () => import("@/components/layout.vue"),
        children: [
            {
                path: "system",
                name: "设置",
                component: () => import("@/views/system/index.vue"),
                children: [
                    {
                        path: "setting",
                        name: "控制中心",
                        component: () => import("@/views/system/home.vue"),
                        meta: { icon: "insights", color: "primary", backColorClass: "color-back-system", show: true },
                    },
                    {
                        path: "role",
                        name: "公司成员",
                        component: () => import("@/views/system/role.vue"),
                        meta: { icon: "group", color: "primary", backColorClass: "color-back-system", show: true },
                    },
                    {
                        path: "corp",
                        name: "公司详情",
                        component: () => import("@/views/system/corp.vue"),
                        meta: { icon: "group", color: "primary", backColorClass: "color-back-system", show: false },
                    },
                ],
            },
            {
                path: "box",
                name: "打卡",
                component: () => import("@/views/box/index.vue"),
                children: [
                    {
                        path: "home",
                        name: "打卡箱",
                        component: () => import("@/views/box/box.vue"),
                        meta: { icon: "how_to_vote", color: "indigo-14", backColorClass: "color-back-box", show: true },
                    },
                    {
                        path: "access",
                        name: "白名单",
                        component: () => import("@/views/box/access.vue"),
                        meta: { icon: "how_to_reg", color: "indigo-14", backColorClass: "color-back-box", show: true },
                    },
                    {
                        path: "line",
                        name: "场景",
                        component: () => import("@/views/box/line.vue"),
                        meta: { icon: "checklist_rtl", color: "indigo-14", backColorClass: "color-back-box", show: true },
                    },
                    {
                        path: "check",
                        name: "打卡记录",
                        component: () => import("@/views/box/check.vue"),
                        meta: { icon: "mobile_friendly", color: "indigo-14", backColorClass: "color-back-box", show: false },
                    },
                    {
                        path: "lineAccess",
                        name: "场景白名单",
                        component: () => import("@/views/box/lineAccess.vue"),
                        meta: { icon: "checklist_rtl", color: "indigo-14", backColorClass: "color-back-box", show: false },
                    },
                ],
            },
        ],
    },
    {
        path: "/oa/login",
        component: () => import("@/views/login/index.vue"),
    },
    {
        path: "/:catchAll(.*)",
        component: () => import("@/views/error/404.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
