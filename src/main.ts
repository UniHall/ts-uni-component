import Vue from "vue";
import App from "./App.vue";
import ElementUi from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./styles/common.scss";

Vue.config.productionTip = false;
Vue.use(ElementUi);

new Vue({
  render: h => h(App)
}).$mount("#app");
