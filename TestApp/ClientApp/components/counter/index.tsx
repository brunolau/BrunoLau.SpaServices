import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class CounterComponent extends Vue {
    currentcount: number = 5;

    incrementCounter() {
        this.currentcount++;
    }

    render(h) {
        return (
            <div>
                <h1>Counter TSX</h1>
                <p>Counter done the TSX + Vue.js 2 way</p>
                <p>Current count: <strong>{this.currentcount}</strong></p>
                <button onClick={() => { this.incrementCounter() }}>Increment</button>
            </div>
        )
    }
}