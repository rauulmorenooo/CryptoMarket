import Vue from 'vue'
import App from './App.vue'
import router from './router'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

import Axios from 'axios'
Vue.prototype.$http = Axios;

const token = localStorage.getItem('token');
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token;
}

import VueCookies from 'vue-cookies'
Vue.use(VueCookies);
Vue.$cookies.config('30d'); // Set cookie to expire after 30 days

import VueSession from 'vue-session'
Vue.use(VueSession);

import VueApexCharts from 'vue-apexcharts';
Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

new Vue({
  router,
  data() {
    return {
      logged: false,
      user_id: ''
    };
  },
  created() {
  },
  mounted() {
    if (this.$cookies.isKey('logged')) {
      this.logged = this.$cookies.get('logged');
    } else {
      if (this.$session.exists() && this.$session.has('logged')) {
        this.logged = this.$session.get('logged');
      }
    }
  },
  render: h => h(App),
}).$mount('#app')
