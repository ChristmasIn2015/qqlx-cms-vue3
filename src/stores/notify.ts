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

			const Sheet0 = XLSX.utils.aoa_to_sheet([
				["@产地", "@材质", "@序号", "@品名", "@规格", "@重量/吨", "@数量", "@单位", "@单价/元", "@备注", "@日期", "@@请勿更改标题头部@@"],
				["武汉青山", "DC51D+Z", "", "热镀锌板卷", "1.0*1250*C", "8.5", "1", "个", "5700", "", "2023/01/01"],
				["武汉青山", "DC51D+Z", "", "热镀锌板卷", "1.0*1000*C", "11", "1", "个", "5500", "", "2023/01/05"],
				["武汉青山", "DC51D+Z", "", "热镀锌板卷", "1.0*1500*C", "12", "1", "个", "5900", "", "2023/01/10"],
				["武汉青山", "DC51D+Z", "", "热镀锌板卷", "1.0*1750*C", "9.5", "1", "个", "6000", "", "2023/01/15"],
			]);
			XLSX.utils.book_append_sheet(workbook, Sheet0, "商品导入");

			const Sheet1 = XLSX.utils.aoa_to_sheet([
				["@客户名称", "@联系方式", "@备注", "@@请勿更改标题头部@@"],
				["中信泰富特钢集团股份有限公司", "0510-80673288", "tftg"],
				["中国建筑上海设计研究院有限公司", "021-62858180", "zgjz"],
				["鞍山钢铁集团有限公司", "0412-6734881", "asgt"],
				["宝钢集团有限公司", "021-58350000", "bg"],
			]);
			XLSX.utils.book_append_sheet(workbook, Sheet1, "客户导入");

			const Sheet2 = XLSX.utils.aoa_to_sheet([
				["@银行", "@客户名称", "@日期", "@金额", "@备注", "@编号", "@@请勿更改标题头部@@"],
				["中国银行", "中国建筑上海设计研究院有限公司", "2022-3-1", "200000", "", "41842145"],
				["农业银行", "中国建筑上海设计研究院有限公司", "2022-4-10", "14000", "备注", "41842145"],
				["建设银行", "中信泰富特钢集团股份有限公司", "2022-6-1", "1000", "", "41842145"],
				["招商银行", "中信泰富特钢集团股份有限公司", "2022-6-1", "2000", "备注", "41842145"],
			]);
			XLSX.utils.book_append_sheet(workbook, Sheet2, "资金导入");

			// let result = []
			// let TEMP1 = ['有花', '无花', '冷', '酸洗', '镀锌'].map((Name1) => {
			//     let TEMP2 = ['小板', '大板', '超大板'].map((Name2) => {
			//         let TEMP3 = ['1000', '1250', '1500'].map((Norm2) => {
			//             let Norm1 = 0.5
			//             let TEMP4 = Array(6)
			//                 .fill(null)
			//                 .map((Norm11) => {
			//                     result.push([Name1 + Name2, `${(Norm1 += 0.5).toFixed(1)}*${Norm2}*C`])
			//                 })
			//         })
			//     })
			// })
			// let Sheet2 = XLSX.utils.aoa_to_sheet([['品名', '规格', '<- 请勿更改标题头部']].concat(result))
			// XLSX.utils.book_append_sheet(workbook, Sheet2, '销售模板导入')

			XLSX.writeFile(workbook, "清泉流响-批量导入模板.xlsx");
		},
	},
});
