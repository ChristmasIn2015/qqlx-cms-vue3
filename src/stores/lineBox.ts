import { defineStore } from "pinia";
import { cloneDeep } from "lodash";

import { PATH_OA_LINEBOX } from "qqlx-core";
import type { postLineBoxDto, postLineBoxRes, deleteLineBoxDto, deleteLineBoxRes } from "qqlx-core/dto/oa/lineBox";
import type { LineBoxJoined } from "qqlx-core/dto/oa/lineBox";
import type { LineBox } from "qqlx-core/schema/oa/lineBox";

import { getMongodbBase, request } from "@/utils";
import { useNotifyStore } from "@/stores/notify";

const NotifyStore = useNotifyStore();

function getSchema(): LineBox {
    return {
        corpId: "",
        lineId: "",
        boxId: "",
        orderNo: 1,
        orderLimit: 1,
        orderLimitTime: 0,
        ...getMongodbBase(),
    };
}

export const useLineBoxStore = defineStore("LineBox", {
    state: () => ({
        picked: getSchema() as LineBox,
        editor: getSchema() as LineBox,
        search: getSchema() as LineBox,
        list: [] as LineBoxJoined[],
    }),
    actions: {
        async post() {
            try {
                const dto: postLineBoxDto = this.editor;
                const res: postLineBoxRes = await request.post(PATH_OA_LINEBOX, { dto });
                NotifyStore.success("添加成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        async delete(lineBox: LineBox) {
            try {
                const dto: deleteLineBoxDto = { entityId: lineBox._id };
                const res: deleteLineBoxRes = await request.delete(PATH_OA_LINEBOX, { dto });
                NotifyStore.success("操作成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        getSchema() {
            const schema: LineBox = getSchema();
            return schema;
        },
        setSchema(target?: LineBox) {
            const schema = target ? cloneDeep(target) : this.getSchema();
            this.editor = schema;
        },
    },
});
