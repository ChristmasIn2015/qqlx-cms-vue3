import * as XLSX from "xlsx";
import { defineStore } from "pinia";
import { Notify, useQuasar } from "quasar";

export const useNotifyStore = defineStore("Notify", {
    state: () => ({}),
    actions: {
        success(message: string) {
            Notify.create({
                group: false,
                progress: true,
                // position: "top-left",
                type: "positive",
                message,
                timeout: 1000,
            });
        },
        fail(message: string, caption?: string) {
            Notify.create({
                group: false,
                progress: true,
                position: "top",
                type: "negative",
                message,
                caption,
            });
        },
        getQuasarStore() {
            const $q = useQuasar();
            return $q;
        },

        download() {
            let workbook = XLSX.utils.book_new();

            const Sheet0 = XLSX.utils.aoa_to_sheet([["@手机号", "@@请勿更改标题头部@@"], ["13263911023"], ["13263911024"], ["13263911025"], ["13263911026"]]);
            XLSX.utils.book_append_sheet(workbook, Sheet0, "白名单导入");

            XLSX.writeFile(workbook, "清泉流响-批量导入模板.xlsx");
        },
    },
});
