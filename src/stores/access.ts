import { defineStore } from "pinia";
import { cloneDeep } from "lodash";

import { PATH_OA_ACCESS } from "qqlx-core";
import type { postAccessDto, postAccessRes, getAccessDto, getAccessRes, deleteAccessDto, deleteAccessRes } from "qqlx-core/dto/oa/access";
import type { AccessJoined } from "qqlx-core/dto/oa/access";
import type { Access } from "qqlx-core/schema/oa/access";

import { getMongodbBase, request } from "@/utils";
import { useNotifyStore } from "@/stores/notify";

const NotifyStore = useNotifyStore();

function getSchema(): Access {
    return {
        corpId: "",
        phone: "",
        ...getMongodbBase(),
    };
}

export const useAccessStore = defineStore("Access", {
    state: () => ({
        picked: getSchema() as Access,
        editor: getSchema() as Access,
        search: getSchema() as Access,
        list: [] as AccessJoined[],
        listPicked: [] as AccessJoined[],
        listExcel: [] as Access[],
        loadding: false,
    }),
    actions: {
        async get() {
            try {
                this.loadding = true;
                const dto: getAccessDto = { search: this.search };
                const res: getAccessRes = await request.get(PATH_OA_ACCESS, { dto });
                this.list = res;
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            } finally {
                this.loadding = false;
            }
        },
        async post() {
            try {
                this.loadding = true;
                const dto: postAccessDto = this.listExcel;
                const res: postAccessRes = await request.post(PATH_OA_ACCESS, { dto });

                await this.get();
                NotifyStore.success("添加成功");
                this.listExcel = [];
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            } finally {
                this.loadding = false;
            }
        },
        async delete(access: Access) {
            try {
                this.loadding = true;
                const dto: deleteAccessDto = { entityId: access._id };
                const res: deleteAccessRes = await request.delete(PATH_OA_ACCESS, { dto });

                await this.get();
                NotifyStore.success("操作成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            } finally {
                this.loadding = false;
            }
        },
        getSchema() {
            const schema: Access = getSchema();
            return schema;
        },
        setSchema(target?: Access) {
            const schema = target ? cloneDeep(target) : this.getSchema();
            this.editor = schema;
        },
    },
});
