// Vue
import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);

// Store
import { createPinia } from "pinia";
app.use(createPinia());

// Router
import router from "./router";
app.use(router);

// Material Icon
import "material-icons/iconfont/material-icons.css";

// Quasar UI
import { Quasar, Notify, Dialog } from "quasar";
import quasarLang from "quasar/lang/zh-CN";
import "quasar/src/css/index.sass";
app.use(Quasar, {
	plugins: { Notify, Dialog },
	lang: quasarLang,
});

app.mount("#app");
