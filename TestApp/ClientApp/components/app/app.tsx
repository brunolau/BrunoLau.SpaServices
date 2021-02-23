import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import NavMenu from '../navmenu/navmenu'

@Component
export default class AppEntryComponent extends Vue {
    render(h) {
        return (
            <div id='app-root' class="container-fluid">
                <NavMenu />

                <router-view></router-view>
            </div>
        )
    }
}