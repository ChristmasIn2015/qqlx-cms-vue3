import { defineStore } from "pinia";
import { cloneDeep } from "lodash";

import { PATH_OA_LINEACCESS } from "qqlx-core";
import type {
    postLineAccessDto,
    postLineAccessRes,
    getLineAccessDto,
    getLineAccessRes,
    deleteLineAccessDto,
    deleteLineAccessRes,
} from "qqlx-core/dto/oa/lineAccess";
import type { Access } from "qqlx-core/schema/oa/access";
import type { AccessJoined } from "qqlx-core/dto/oa/access";
import type { LineAccess } from "qqlx-core/schema/oa/lineAccess";
import type { LineAccessJoined } from "qqlx-core/dto/oa/lineAccess";

import { getMongodbBase, request } from "@/utils";
import { useNotifyStore } from "@/stores/notify";

const NotifyStore = useNotifyStore();

function getSchema(): LineAccess {
    return {
        corpId: "",
        lineId: "",
        accessId: "",
        ...getMongodbBase(),
    };
}

export const useLineAccessStore = defineStore("LineAccess", {
    state: () => ({
        picked: getSchema() as LineAccess,
        editor: getSchema() as LineAccess,
        search: getSchema() as LineAccess,
        list: [] as LineAccessJoined[],
    }),
    actions: {
        async get(lineId: string) {
            try {
                if (!lineId) throw new Error(`参数异常，请重新试试`);
                const dto: getLineAccessDto = { lineId };
                const res: getLineAccessRes = await request.get(PATH_OA_LINEACCESS, { dto });

                this.list = res;
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        async post(lineId: string, accesses: Access[]) {
            try {
                const dto: postLineAccessDto = { lineId, accesses };
                const res: postLineAccessRes = await request.post(PATH_OA_LINEACCESS, { dto });
                NotifyStore.success("添加成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        async delete(lineAccess: LineAccess) {
            try {
                const dto: deleteLineAccessDto = { entityId: lineAccess._id };
                const res: deleteLineAccessRes = await request.delete(PATH_OA_LINEACCESS, { dto });
                NotifyStore.success("操作成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        getSchema() {
            const schema: LineAccess = getSchema();
            return schema;
        },
        setSchema(target?: LineAccess) {
            const schema = target ? cloneDeep(target) : this.getSchema();
            this.editor = schema;
        },
    },
});
