import { defineStore } from "pinia";
import { cloneDeep } from "lodash";
import * as XLSX from "xlsx";

import { PATH_OA_CHECK } from "qqlx-core";
import type { postCheckDto, postCheckRes, getCheckDto, getCheckRes, deleteCheckDto, deleteCheckRes } from "qqlx-core/dto/oa/check";
import type { CheckJoined } from "qqlx-core/dto/oa/check";
import type { Check } from "qqlx-core/schema/oa/check";

import { getMongodbBase, request, getPage } from "@/utils";
import { useNotifyStore } from "@/stores/notify";

const NotifyStore = useNotifyStore();

function getSchema(): Check {
    return {
        corpId: "",
        boxId: "",
        userId: "",
        count: 0,
        ...getMongodbBase(),
    };
}

export const useCheckStore = defineStore("Check", {
    state: () => ({
        picked: getSchema() as Check,
        editor: getSchema() as Check,
        search: getSchema() as Check,
        list: [] as CheckJoined[],

        success: "",
        error: "",

        timeQuasarPicked: "",
        keyword: "",
        page: getPage(20),
        total: 0,
        loadding: false,
    }),
    actions: {
        async get(pageNo: number = 1) {
            try {
                this.loadding = true;
                if (pageNo > 0) this.page.page = pageNo;

                const dto: getCheckDto = { page: this.page, search: this.search, keyword: this.keyword };
                const res: getCheckRes = await request.get(PATH_OA_CHECK, { dto });
                this.list = res.list;
                this.total = res.total;
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            } finally {
                this.loadding = false;
            }
        },
        async download() {
            const page = cloneDeep(this.page);
            page.page = 1;
            page.pageSize = this.total;
            const dto: getCheckDto = { page, search: this.search, keyword: this.keyword };
            const res: getCheckRes = await request.get(PATH_OA_CHECK, { dto });
            let workbook = XLSX.utils.book_new();

            const list = [["打卡箱", "打卡时间", "昵称", "今日累计打卡"]];
            res.list.map((e) => {
                list.push([e.joinBox?.title || "-", e.timeCreateString, e.joinUserInfo?.nickname || "-", String(e.count)]);
            });
            const Sheet0 = XLSX.utils.aoa_to_sheet(list);
            XLSX.utils.book_append_sheet(workbook, Sheet0, "打卡记录导出");

            XLSX.writeFile(workbook, `清泉流响-打卡记录导出-${new Date(page.startTime).toLocaleString().split(" ")[0]}.xlsx`);
        },
        timeChange($event: string) {
            this.page.startTime = new Date($event + " 00:00:00").getTime();
            this.page.endTime = new Date($event + " 23:59:59").getTime();
            this.get(1);
        },
        async post() {
            try {
                this.success = "";
                this.error = "正在处理...";
                const dto: postCheckDto = { schema: this.editor };
                const res: postCheckRes = await request.post(PATH_OA_CHECK, { dto });
                await this.get();
                NotifyStore.success("打卡成功");

                this.success = "打卡成功";
                this.error = "";

                // 朗读
                const sound = window.speechSynthesis;
                const read_text = new SpeechSynthesisUtterance(this.success);
                sound.speak(read_text);
            } catch (error) {
                NotifyStore.fail((error as Error).message);
                this.error = (error as Error).message;

                // 朗读
                const sound = window.speechSynthesis;
                const read_text = new SpeechSynthesisUtterance(this.error);
                sound.speak(read_text);
            }
        },
        async delete(check: Check) {
            try {
                const dto: deleteCheckDto = { entityId: check._id };
                const res: deleteCheckRes = await request.delete(PATH_OA_CHECK, { dto });
                await this.get();
                NotifyStore.success("操作成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        getSchema() {
            const schema: Check = getSchema();
            return schema;
        },
        setSchema(target?: Check) {
            const schema = target ? cloneDeep(target) : this.getSchema();
            this.editor = schema;
        },
    },
});
