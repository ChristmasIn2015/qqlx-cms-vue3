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
                name: "行为日志",
                component: () => import("@/views/box/index.vue"),
                children: [
                    {
                        path: "home",
                        name: "收集箱",
                        component: () => import("@/views/box/box.vue"),
                        meta: { icon: "how_to_vote", color: "indigo-14", backColorClass: "color-back-box", show: true },
                    },
                    {
                        path: "line",
                        name: "规则列表",
                        component: () => import("@/views/box/line.vue"),
                        meta: { icon: "rule_folder", color: "indigo-14", backColorClass: "color-back-box", show: true },
                    },
                    {
                        path: "check",
                        name: "打卡记录",
                        component: () => import("@/views/box/check.vue"),
                        meta: { icon: "mobile_friendly", color: "indigo-14", backColorClass: "color-back-box", show: false },
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
