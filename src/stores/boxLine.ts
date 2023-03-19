import { defineStore } from "pinia";
import { cloneDeep } from "lodash";

import { PATH_OA_BOXLINE } from "qqlx-core";
import type {
    postBoxLineDto,
    postBoxLineRes,
    getBoxLineDto,
    getBoxLineRes,
    patchBoxLineDto,
    patchBoxLineRes,
    deleteBoxLineDto,
    deleteBoxLineRes,
} from "qqlx-core/dto/oa/boxLine";
import type { BoxLineJoined } from "qqlx-core/dto/oa/boxLine";
import type { BoxLine } from "qqlx-core/schema/oa/boxLine";

import { getMongodbBase, request } from "@/utils";
import { useNotifyStore } from "@/stores/notify";

const NotifyStore = useNotifyStore();

function getSchema(): BoxLine {
    return {
        corpId: "",
        title: "",
        desc: "",
        ...getMongodbBase(),
    };
}

export const useBoxLineStore = defineStore("BoxLine", {
    state: () => ({
        picked: getSchema() as BoxLine,
        editor: getSchema() as BoxLine,
        search: getSchema() as BoxLine,
        list: [] as BoxLineJoined[],
    }),
    actions: {
        async get() {
            const dto: getBoxLineDto = null;
            const res: getBoxLineRes = await request.get(PATH_OA_BOXLINE, { dto });
            this.list = res;
        },
        async post() {
            try {
                const dto: postBoxLineDto = this.editor;
                const res: postBoxLineRes = await request.post(PATH_OA_BOXLINE, { dto });
                await this.get();
                NotifyStore.success("添加成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        async patch() {
            try {
                const dto: patchBoxLineDto = this.editor;
                const res: patchBoxLineRes = await request.patch(PATH_OA_BOXLINE, { dto });
                await this.get();
                NotifyStore.success("修改成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        async delete(boxLine: BoxLine) {
            try {
                const dto: deleteBoxLineDto = { entityId: boxLine._id };
                const res: deleteBoxLineRes = await request.delete(PATH_OA_BOXLINE, { dto });
                await this.get();
                NotifyStore.success("操作成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        getSchema() {
            const schema: BoxLine = getSchema();
            return schema;
        },
        setSchema(target?: BoxLine) {
            const schema = target ? cloneDeep(target) : this.getSchema();
            this.editor = schema;
        },
    },
});
