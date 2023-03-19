import { defineStore } from "pinia";
import { cloneDeep } from "lodash";

import { PATH_OA_BOX } from "qqlx-core";
import type { postBoxDto, postBoxRes, getBoxDto, getBoxRes, patchBoxDto, patchBoxRes, deleteBoxDto, deleteBoxRes } from "qqlx-core/dto/oa/box";
import type { Box } from "qqlx-core/schema/oa/box";

import { getMongodbBase, request } from "@/utils";
import { useNotifyStore } from "@/stores/notify";

const NotifyStore = useNotifyStore();

function getSchema(): Box {
    return {
        corpId: "",
        title: "",
        desc: "",
        images: "",
        isDisabled: false,
        ...getMongodbBase(),
    };
}

export const useBoxStore = defineStore("Box", {
    state: () => ({
        editor: getSchema() as Box,
        search: getSchema() as Box,
        list: [] as Box[],
    }),
    actions: {
        async get() {
            const dto: getBoxDto = { search: this.search };
            const res: getBoxRes = await request.get(PATH_OA_BOX, { dto });
            this.list = res;
        },
        async post() {
            try {
                const dto: postBoxDto = this.editor;
                const res: postBoxRes = await request.post(PATH_OA_BOX, { dto });
                await this.get();
                NotifyStore.success("添加成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        async patch() {
            try {
                const dto: patchBoxDto = this.editor;
                const res: patchBoxRes = await request.patch(PATH_OA_BOX, { dto });
                await this.get();
                NotifyStore.success("修改成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        async delete(box: Box) {
            try {
                const dto: deleteBoxDto = { entityId: box._id };
                const res: deleteBoxRes = await request.delete(PATH_OA_BOX, { dto });
                await this.get();
                NotifyStore.success("操作成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        getSchema() {
            const schema: Box = getSchema();
            return schema;
        },
        setSchema(target?: Box) {
            const schema = target ? cloneDeep(target) : this.getSchema();
            this.editor = schema;
        },
    },
});
