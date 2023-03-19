import { defineStore } from "pinia";

import { PATH_USER } from "qqlx-core";
import type { postUserWeChatDto, postUserWeChatRes, getUserWeChatDto, getUserWeChatRes, patchUserWeChatDto, patchUserWeChatRes } from "qqlx-core/dto/user/user";
import type { User } from "qqlx-core/schema/user/user";
import type { UserWeChat } from "qqlx-core/schema/user/userWeChat";

import { getMongodbBase, request } from "@/utils";
import { useNotifyStore } from "@/stores/notify";
const NotifyStore = useNotifyStore();

function getSchema(): User & UserWeChat {
    return {
        phone: "",
        jwt: "",
        //
        userId: "",
        unionId: "",
        nickname: "",
        avator: "",
        ...getMongodbBase(),
    };
}
export const useUserStore = defineStore({
    id: "User",
    state: () => ({
        wxLoginModal: false,
        wxLoginQrCode: "",

        wxAvatorDefault: "https://pic4.zhimg.com/50/v2-6afa72220d29f045c15217aa6b275808_hd.jpg?source=1940ef5c",
        userEditor: getSchema() as UserWeChat,
    }),
    actions: {
        // 获取用户信息
        async setNowUser() {
            this.setSchema();
            const dto: getUserWeChatDto = null;
            const res: getUserWeChatRes = await request.get(PATH_USER, { dto });
            this.userEditor = res;
        },
        // 登录
        async post(wechatResponseCode: string): Promise<postUserWeChatRes> {
            const res = await this.get(wechatResponseCode);
            if (res.jwt) localStorage.setItem("qqlx-token", res.jwt);
            else localStorage.setItem("qqlx-token", "");

            return res;
        },
        async get(wechatResponseCode: string): Promise<postUserWeChatRes> {
            const dto: postUserWeChatDto = { wechatResponseCode };
            const res: postUserWeChatRes = await request.post(PATH_USER, { dto });

            return res;
        },
        // 修改用户信息
        async patch() {
            try {
                const dto: patchUserWeChatDto = this.userEditor;
                await request.patch(PATH_USER, { dto });
                await this.setNowUser();
                NotifyStore.success("修改成功");
            } catch (error) {
                NotifyStore.fail((error as Error).message);
            }
        },
        getSchema() {
            const schema: UserWeChat = getSchema();
            return schema;
        },
        setSchema() {
            this.userEditor = this.getSchema();
        },
    },
});
