import 'bootstrap';
import Vue from 'vue';
import VueRouter from 'vue-router';
import AppEntryComponent from './components/app/app';
import CounterComponent from './components/counter';
import HomeComponent from './components/home';
import FetchDataComponent from './components/fetchdata';

if (!window['Promise']) {
    window['Promise'] = require('es6-promise').Promise;
}

Vue.use(VueRouter);


const routes = [
    { path: '/', component: HomeComponent },
    { path: '/counter', component: CounterComponent },
    { path: '/fetchdata', component: FetchDataComponent },

];

new Vue({
    el: '#app-root',
    router: new VueRouter({ mode: 'history', routes: routes }),
    render: h => h(AppEntryComponent)
});
