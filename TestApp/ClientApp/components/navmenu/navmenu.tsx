import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import './navmenu.css';

@Component
export default class NavMenu extends Vue {
    render(h) {
        return (
            <header>
                <nav class="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                    <div class="container">
                        <a class="navbar-brand" href="/">TSX + Vue.js 2</a>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                            <ul class="navbar-nav flex-grow-1">
                                &nbsp;
                                <li class="nav-item">
                                    <router-link to="/">
                                        Home
                                    </router-link>
                                </li>
                                &nbsp;
                                &nbsp;
                                <li class="nav-item">
                                    <router-link to="/counter">
                                        Counter
                                    </router-link>
                                </li>
                                &nbsp;
                                &nbsp;
                                <li class="nav-item">
                                    <router-link to="/fetchdata">
                                        Fetch data
                                    </router-link>
                                </li>
                                &nbsp;
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

        )
    }
}