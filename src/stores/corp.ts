import { defineStore } from "pinia";
import { cloneDeep } from "lodash";

import { ENUM_CORP, PATH_CORP } from "qqlx-core";
import type { postCorpDto, postCorpRes, getCorpDto, getCorpRes, patchCorpDto, patchCorpRes, deleteCorpDto, deleteCorpRes } from "qqlx-core/dto/brand/corp";
import type { Corp } from "qqlx-core/schema/brand/corp";
import type { RoleWMSS } from "qqlx-core/schema/wmss/role";
import type { RoleOA } from "qqlx-core/schema/oa/role";

import { getMongodbBase, request } from "@/utils";
import { useNotifyStore } from "@/stores/notify";
import { useRoleOAStore } from "@/stores/role";

const NotifyStore = useNotifyStore();

function getSchema(): Corp {
    return {
        userId: "",
        type: ENUM_CORP.COMPANY,
        name: "",
        address: "",
        contact: "",
        isDisabled: false,
        ...getMongodbBase(),
    };
}

export const useCorpStore = defineStore("Corp", {
    state: () => ({
        corpPicked: getSchema() as Corp,
        corpEditor: getSchema() as Corp,
        corpList: [] as (Corp & { joinRole: RoleWMSS })[],
    }),
    actions: {
        async get() {
            const dto: getCorpDto = null;
            const res: getCorpRes = await request.get(PATH_CORP);
            this.corpList = res;
        },
        async post() {
            try {
                const dto: postCorpDto = this.corpEditor;
                const res: postCorpRes = await request.post(PATH_CORP, { dto });
                await this.get();
                NotifyStore.success("添加成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        async patch() {
            try {
                const dto: patchCorpDto = this.corpEditor;
                const res: patchCorpRes = await request.patch(PATH_CORP, { dto });
                await this.get();
                NotifyStore.success("修改成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        async delete(corp: Corp) {
            try {
                const dto: deleteCorpDto = { corpId: corp._id };
                const res: deleteCorpRes = await request.delete(PATH_CORP, { dto });
                await this.get();
                NotifyStore.success("操作成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        async pick(corp?: Corp) {
            try {
                if (!corp) return;
                this.corpPicked = corp;
                localStorage.setItem("qqlx-corp-id", this.corpPicked._id);
                NotifyStore.success(`切换 @${this.corpPicked.name} 成功`);
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        getSchema() {
            const schema: Corp = getSchema();
            return schema;
        },
        setSchema(target?: Corp) {
            const schema = target ? cloneDeep(target) : this.getSchema();
            this.corpEditor = schema;
        },
    },
});
