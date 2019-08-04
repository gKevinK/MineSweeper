<template>
    <div id="app">
        <div class="menu">
            <div class="indicator" @keyup="toggleAI" @dblclick="toggleAI" tabindex="0">{{ str(rest) }}</div>
            <div class="result" style="background: yellow; margin: 4px 16px" @click="ok">
                <div v-if="status == 2" class="result" style="background: red"></div>
                <div v-if="status == 3" class="result" style="background: green"></div>
            </div>
            <div class="indicator">{{ str(time) }}</div>
        </div>
        <div class="menu" v-if="show_settings">
            <input v-if="status == 0" class="input_num" v-model.number="input_x">
            <input v-if="status == 0" class="input_num" v-model.number="input_y">
            <input v-if="status == 0" class="input_num" v-model.number="input_mine">
        </div>
        <Minefield style="position: absolute; top: 80px; bottom: 20px; left: 20px; right:20px; "
                   ref="ui" :board="field" @click="onClick" @rclick="onRClick"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Minefield, { Content } from './Minefield.vue';
import * as AI from './AI';

@Component({
    components: {
        Minefield,
    },
})
export default class App extends Vue {

    private status: number = 0;
    private show_settings: boolean = false;
    private field: Array<Array<{ content: Content, mine: boolean }>> = [];
    private input_x: number = 9;
    private input_y: number = 9;
    private input_mine: number = 10;
    private x: number = 9;
    private y: number = 9;
    private mine: number = 10;
    private time: number = 0;
    private rest: number = 10;

    private i_timer: number = -1;
    private i_ai: number = -1;

    private updateRest() {
        this.rest = this.mine - this.field.reduce((t1, r) => t1 + r.reduce((t2, c) => t2 + (c.content == 'F' ? 1 : 0), 0), 0);
    }
    
    private str(i: number) {
        let s = i.toString();
        while (s.length < 3) s = "0" + s;
        return s;
    }

    mounted () {
        this.field = [...Array(this.x)].map(r => [...Array(this.y)].map(
                     c => ({ content: <Content>" ", mine: false }) ));
    }

    ok () {
        if (this.status == 0) {
            if (this.show_settings) {
                this.x = this.input_x;
                this.y = this.input_y;
                this.mine = this.input_mine;
            }
            this.show_settings = !this.show_settings;
        }
        this.status = 0;
        this.rest = this.mine;
        this.time = 0;
        this.field = [...Array(this.x)].map(r => [...Array(this.y)].map(
                     c => ({ content: <Content>" ", mine: false }) ));
    }

    check () {
        let ok = !this.field.some(r => r.some(c => !c.mine && [ " ", "F", "M" ].indexOf(c.content) != -1));
        if (ok) {
            this.status = 3;
            clearInterval(this.i_timer);
        }
        this.updateRest();
    }

    onClick (e: { x: number, y: number }) {
        if (this.status == 0) {
            this.generate(e);
            // console.log(this.field);
            this.status = 1;
            this.time = 0;
            this.i_timer = setInterval(() => { this.time += 1 }, 1000);
        }
        if (this.status >= 2) return;
        if (this.field[e.x][e.y].mine) {
            this.field.map(r => r.map(c => c.content = c.mine ? "C" : c.content));
            this.field[e.x][e.y].content = "B";
            this.status = 2;
            this.rest = 999;
            clearInterval(this.i_timer);
            return;
        }
        let queue = [e];
        while (queue.length) {
            let c = queue.shift()!;
            if (this.field[c.x][c.y].content != " ")
                continue;
            let adj = this.adjacency(c);
            this.field[c.x][c.y].content = <Content>adj.toString();
            if (adj == 0) {
                for (let x2 = c.x - 1; x2 <= c.x + 1; x2++)
                    for (let y2 = c.y - 1; y2 <= c.y + 1; y2++) {
                        if (!this.valid(x2, y2) || (x2 == c.x && y2 == c.y))
                            continue;
                        if (this.field[x2][y2].content == " ")
                            queue.push({ x: x2, y: y2 });
                }
            }
        }
        this.check();
    }

    onRClick (e: { x: number, y: number }) {
        if (this.status != 1) return;
        let cell = this.field[e.x][e.y];
        if ([ " ", "F", "M" ].indexOf(cell.content) == -1) return;
        const list: Content[] = [ " ", "F", "M" ];
        cell.content = list[(list.indexOf(cell.content) + 1) % 3];
        this.updateRest();
    }

    private generate(e: { x: number, y: number }) {
        const total = this.x * this.y - 1, mine = this.mine;
        let res: number[] = [];
        for (let i = 0; i < total; i++) {
            if (res.length < mine)
                res.push(i);
            else if (Math.random() < mine / (i + 1))
                res[Math.floor(Math.random() * res.length)] = i;
        }
        for (let i of res) {
            const x = Math.floor(i / this.y), y = i % this.y;
            this.field[x][y].mine = true;
        }
        this.field[this.x - 1][this.y - 1].mine = this.field[e.x][e.y].mine;
        this.field[e.x][e.y].mine = false;
    }

    private valid (x: number, y: number ) {
        return x >= 0 && x < this.x && y >= 0 && y < this.y;
    }

    private adjacency (pos: { x: number, y: number }) {
        const x = pos.x, y = pos.y;
        let res = 0;
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (i == x && j == y) continue;
                if (this.valid(i, j) && this.field[i][j].mine)
                    res++;
            }
        }
        return res;
    }

    toggleAI() {
        if (this.i_ai == -1) {
            this.i_ai = setInterval(() => {
                if (this.status <= 1) {
                    let t = AI.Pick(this.field.map(r => r.map(c => c.content)));
                    this.onClick(t);
                } else {
                    this.ok();
                }
            }, 1000);
        } else {
            clearInterval(this.i_ai);
            this.i_ai = -1;
        }
    }
}
</script>

<style scoped>
#app {
    font-family: Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
}

.menu {
    /* height: 48px; */
    padding: 8px;
    border: 1px solid lightgray;
    display: flex;
    align-items: center;
    justify-content: center;
}

.input_num {
    background: white;
    border: 1px solid lightgray;
    border-radius: 4px;
    margin: 0 4px;
    text-align: center;
    padding: 8px 0;
    width: 32px;
}

.btn {
    padding: 8px 16px;
    background: white;
    border: 1px solid lightgray;
    border-radius: 4px;
    outline: none;
}

.btn:hover {
    background: #ddeeff;
    border: 1px solid #bbddff;
}

.indicator {
    height: 24px;
    width: 80px;
    line-height: 24px;
    color: darkred;
    border: lightgray 1px solid;
    background: lightgray;
}

.result {
    height: 24px;
    width: 24px;
    border: lightgray 1px solid;
    border-radius: 50%;
}

</style>
