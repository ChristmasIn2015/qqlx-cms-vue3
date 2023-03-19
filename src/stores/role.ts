import { defineStore } from "pinia";

import { PATH_OA_ROLE, ENUM_ROLE_OA } from "qqlx-core";
import type { getRoleOADto, getRoleOARes, postRoleOADto, postRoleOARes, deleteRoleOADto, deleteRoleOARes } from "qqlx-core/dto/oa/role";
import type { User } from "qqlx-core/schema/user/user";
import type { RoleOA } from "qqlx-core/schema/oa/role";
import type { RoleOAJoined } from "qqlx-core/dto/oa/role";

import { getMongodbBase, request } from "@/utils";
import { useNotifyStore } from "@/stores/notify";
const NotifyStore = useNotifyStore();

function getSchema(): RoleOA {
    return {
        corpId: "",
        userId: "",
        role: ENUM_ROLE_OA.BASE,
        ...getMongodbBase(),
    };
}

export const useRoleOAStore = defineStore("RoleOA", {
    state: () => ({
        //
        RoleEditor: getSchema(),
        RoleOAList: [] as RoleOAJoined[],
    }),
    actions: {
        // 获取店铺角色
        async get() {
            const dto: getRoleOADto = null;
            const res: getRoleOARes = await request.get(PATH_OA_ROLE);
            this.RoleOAList = res?.reverse();
        },
        // 创建角色
        async post(askerId: string, role?: ENUM_ROLE_OA) {
            try {
                const schema = this.getSchema();
                schema.userId = askerId;
                if (role) schema.role = role;
                const dto: postRoleOADto = schema;
                const res: postRoleOARes = await request.post(PATH_OA_ROLE, { dto });
                await this.get();
                NotifyStore.success("创建成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        // 删除角色
        async delete(roleId: string) {
            try {
                const dto: deleteRoleOADto = { roleId };
                const res: deleteRoleOARes = await request.delete(PATH_OA_ROLE, { dto });
                await this.get();
                NotifyStore.success("删除成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        getSchema() {
            const schema: RoleOA = getSchema();
            return schema;
        },
        setSchema(entity?: RoleOA) {
            const schema: RoleOA = entity || getSchema();
            this.RoleEditor = JSON.parse(JSON.stringify(schema));
        },
    },
});
