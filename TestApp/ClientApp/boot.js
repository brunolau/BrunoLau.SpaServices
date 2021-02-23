import 'bootstrap';
import Vue from 'vue';
import VueRouter from 'vue-router';
window['Promise'] = require('es6-promise').Promise;
Vue.use(VueRouter);
var routes = [
    { path: '/', component: (function () { return import('./components/home'); }) },
    { path: '/counter', component: (function () { return import('./components/counter'); }) },
    { path: '/fetchdata', component: (function () { return import('./components/fetchdata'); }) },
];
new Vue({
    el: '#app-root',
    router: new VueRouter({ mode: 'history', routes: routes }),
    render: function (h) { return h(require('./components/app/app.vue')); }
});
//# sourceMappingURL=boot.js.map