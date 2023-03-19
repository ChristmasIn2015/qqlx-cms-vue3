import { defineStore } from "pinia";
import { cloneDeep } from "lodash";

import { PATH_OA_BOXLINE_UNIT } from "qqlx-core";
import type { postBoxLineUnitDto, postBoxLineUnitRes, deleteBoxLineUnitDto, deleteBoxLineUnitRes } from "qqlx-core/dto/oa/boxLineUnit";
import type { BoxLineUnitJoined } from "qqlx-core/dto/oa/boxLineUnit";
import type { BoxLineUnit } from "qqlx-core/schema/oa/boxLineUnit";

import { getMongodbBase, request } from "@/utils";
import { useNotifyStore } from "@/stores/notify";

const NotifyStore = useNotifyStore();

function getSchema(): BoxLineUnit {
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

export const useBoxLineUnitStore = defineStore("BoxLineUnit", {
    state: () => ({
        picked: getSchema() as BoxLineUnit,
        editor: getSchema() as BoxLineUnit,
        search: getSchema() as BoxLineUnit,
        list: [] as BoxLineUnitJoined[],
    }),
    actions: {
        async post() {
            try {
                const dto: postBoxLineUnitDto = this.editor;
                const res: postBoxLineUnitRes = await request.post(PATH_OA_BOXLINE_UNIT, { dto });
                NotifyStore.success("添加成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        async delete(boxLineUnit: BoxLineUnit) {
            try {
                const dto: deleteBoxLineUnitDto = { entityId: boxLineUnit._id };
                const res: deleteBoxLineUnitRes = await request.delete(PATH_OA_BOXLINE_UNIT, { dto });
                NotifyStore.success("操作成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        getSchema() {
            const schema: BoxLineUnit = getSchema();
            return schema;
        },
        setSchema(target?: BoxLineUnit) {
            const schema = target ? cloneDeep(target) : this.getSchema();
            this.editor = schema;
        },
    },
});
