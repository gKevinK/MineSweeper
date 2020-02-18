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
        <div class="menu" v-if="status == 0 && show_settings">
            <input class="input_num" v-model.number="input_x">
            <input class="input_num" v-model.number="input_y">
            <input class="input_num" v-model.number="input_mine">
        </div>
        <Minefield style="position: absolute; top: 80px; bottom: 0; left: 0; right: 0;"
                   ref="ui" :board="field" @click="onClick" @rclick="onRClick"/>
        <div class="win_rate">{{ num_win }} / {{ num_all }} = {{ num_all > 0 ? (num_win / num_all * 100).toFixed() : "-" }} %</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Minefield from './Minefield.vue';
import { Content } from './Utils';
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
    private input_x: number = 16;
    private input_y: number = 30;
    private input_mine: number = 99;
    private x: number = this.input_x;
    private y: number = this.input_y;
    private mine: number = this.input_mine;
    private start_time: number = Date.now();
    private time: number = 0;
    private rest: number = this.mine;
    private last_time: number = Date.now();
    private num_win = 0;
    private num_all = 0;

    private i_timer: number = -1;
    private i_ai: number = -1;

    RESTART = true;
    GUESS = true;
    RESTART_TIME = 5000;
    GUESS_TIME = 500;
    AI_TIME = 100;

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
        this.last_time = Date.now();
        if (this.i_timer != -1) clearInterval(this.i_timer);
        this.field = [...Array(this.x)].map(r => [...Array(this.y)].map(
                     c => ({ content: <Content>" ", mine: false }) ));
    }

    check () {
        let ok = !this.field.some(r => r.some(c => !c.mine && [ " ", "F", "M" ].indexOf(c.content) != -1));
        if (ok) {
            this.status = 3;
            this.rest = 0;
            this.field.forEach(r => r.forEach(c => { if (c.mine) c.content = "F"; }));
            this.num_win++;
            this.num_all++;
            clearInterval(this.i_timer);
        } else {
            this.updateRest();
        }
    }

    onClick (e: { x: number, y: number }) {
        if (this.status == 0) {
            this.generate(e);
            // console.log(this.field);
            this.status = 1;
            this.start_time = Date.now();
            this.time = 0;
            this.i_timer = setInterval(() => {
                this.time = Math.round((Date.now() - this.start_time) / 1000)
            }, 100);
        }
        if (this.status >= 2) return;
        this.last_time = Date.now();
        if (this.field[e.x][e.y].mine) {
            this.field.map(r => r.map(c => c.content = c.mine ? "C" : c.content));
            this.field[e.x][e.y].content = "B";
            this.status = 2;
            this.num_all++;
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
        this.last_time = Date.now();
        let cell = this.field[e.x][e.y];
        if ([ " ", "F", "M" ].indexOf(cell.content) == -1) return;
        const list: Content[] = [ " ", "F", "M" ];
        cell.content = list[(list.indexOf(cell.content) + 1) % 3];
        this.updateRest();
    }

    private generate(e: { x: number, y: number }) {
        const mine = this.mine;
        let res: { x: number, y: number }[] = [];
        let num = 0;
        for (let i = 0; i < this.x; i++) {
            for (let j = 0; j < this.y; j++) {
                if (Math.abs(i - e.x) <= 1 && Math.abs(j - e.y) <= 1) continue;
                ++num;
                if (res.length < mine)
                    res.push({ x: i, y: j });
                else if (Math.random() < mine / num)
                    res[Math.floor(Math.random() * res.length)] = { x: i, y: j };
            }
        }
        for (let r of res) {
            this.field[r.x][r.y].mine = true;
        }
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

    last_is_t = false;

    toggleAI() {
        if (this.i_ai == -1) {
            this.i_ai = setInterval(() => {
                if (this.status <= 1) {
                    if (this.last_is_t && Date.now() < this.last_time + this.GUESS_TIME) return;
                    
                    let t = AI.Pick(this.field.map(r => r.map(c => c.content)), this.rest);
                    if (t.op == "C")
                        this.onClick(t.p);
                    else if (t.op == "T") {
                        if (this.GUESS && Date.now() >= this.last_time + this.GUESS_TIME)  {
                            this.onClick(t.p);
                        } else {
                            this.last_is_t = true;
                            return;
                        }
                    } else
                        this.onRClick(t.p);
                    this.last_is_t = false;
                } else {
                    if (this.RESTART && Date.now() - this.last_time > this.RESTART_TIME) {
                        this.ok();
                    }
                }
            }, this.AI_TIME);
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
    font-family: Menlo, Consolas, "Source Code Pro", Inconsolata, Monaco, "Courier New"
}

.result {
    height: 24px;
    width: 24px;
    border: lightgray 1px solid;
    border-radius: 50%;
}

.win_rate {
    position: fixed;
    top: 4px;
    right: 4px;
}
</style>
