import { defineStore } from "pinia";
import { cloneDeep } from "lodash";

import { PATH_OA_LINE } from "qqlx-core";
import type { postLineDto, postLineRes, getLineDto, getLineRes, patchLineDto, patchLineRes, deleteLineDto, deleteLineRes } from "qqlx-core/dto/oa/line";
import type { LineJoined } from "qqlx-core/dto/oa/line";
import type { Line } from "qqlx-core/schema/oa/line";

import { getMongodbBase, request } from "@/utils";
import { useNotifyStore } from "@/stores/notify";

const NotifyStore = useNotifyStore();

function getSchema(): Line {
    return {
        corpId: "",
        title: "",
        desc: "",
        ...getMongodbBase(),
    };
}

export const useLineStore = defineStore("Line", {
    state: () => ({
        picked: getSchema() as Line,
        editor: getSchema() as Line,
        search: getSchema() as Line,
        list: [] as LineJoined[],
    }),
    actions: {
        async get() {
            const dto: getLineDto = null;
            const res: getLineRes = await request.get(PATH_OA_LINE, { dto });
            this.list = res;
        },
        async post() {
            try {
                const dto: postLineDto = this.editor;
                const res: postLineRes = await request.post(PATH_OA_LINE, { dto });
                await this.get();
                NotifyStore.success("添加成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        async patch() {
            try {
                const dto: patchLineDto = this.editor;
                const res: patchLineRes = await request.patch(PATH_OA_LINE, { dto });
                await this.get();
                NotifyStore.success("修改成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        async delete(line: Line) {
            try {
                const dto: deleteLineDto = { entityId: line._id };
                const res: deleteLineRes = await request.delete(PATH_OA_LINE, { dto });
                await this.get();
                NotifyStore.success("操作成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        getSchema() {
            const schema: Line = getSchema();
            return schema;
        },
        setSchema(target?: Line) {
            const schema = target ? cloneDeep(target) : this.getSchema();
            this.editor = schema;
        },
    },
});
