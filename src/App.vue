<template>
    <div id="app" >
        <div class="menu">
            <button @click="clear" class="btn">Clear</button>
        </div>
        <Minefield style="position: absolute; top: 80px; bottom: 20px; left: 20px; right:20px; "
                   ref="ui" :board="field" @click="onClick" @rclick="onRClick"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Minefield from './Minefield.vue';

@Component({
    components: {
        Minefield,
    },
})
export default class App extends Vue {

    status: number = 0;
    private field: Array<Array<string>> = [];
    private x: number = 9;
    private y: number = 9;
    private mine: number = 10;

    constructor () {
        super();
        this.field = [...Array(this.x)].map(r => [...Array(this.y)].fill(" "));
    }

    clear () {
        this.status = 0;
        this.field = [...Array(this.x)].map(r => [...Array(this.y)].fill(" "));
    }

    onClick (e: { x: number, y: number }) {
        if (this.status == 0) {
            this.generate(e);
            console.log(this.field);
            this.status = 1;
        }
        if (this.status == 2) return;
        if (this.field[e.x][e.y] == "  B") {
            this.field[e.x].splice(e.y, 1, "B");
            this.status = 2;
            return;
        }
        let queue = [e];
        while (queue.length) {
            let c = queue.shift()!;
            if (this.field[c.x][c.y] != " ")
                continue;
            let adj = this.adjacency(c);
            this.field[c.x].splice(c.y, 1, adj.toString());
            if (adj == 0) {
                for (let x2 = c.x - 1; x2 <= c.x + 1; x2++)
                    for (let y2 = c.y - 1; y2 <= c.y + 1; y2++) {
                        if (!this.valid(x2, y2) || (x2 == c.x && y2 == c.y))
                            continue;
                        if (this.field[x2][y2] == " ")
                            queue.push({ x: x2, y: y2 });
                }
            }
        }
    }

    onRClick (e: { x: number, y: number }) {
        if (this.status != 1) return;
        let cell = this.field[e.x][e.y];
        if (cell[0] != " ") return;
        if (cell == " ") cell += " ";
        const list = [ " ", "F", "M" ];
        cell = cell[0] + list[(list.indexOf(cell[1]) + 1) % 3] + cell.substr(2);
        this.field[e.x].splice(e.y, 1, cell);
    }

    private generate(e: { x: number, y: number }) {
        const total = this.x * this.y - 1, mine = this.mine;
        let field = [...Array(this.x)].map(r => [...Array(this.y)].fill(" "));
        let res: number[] = [];
        for (let i = 0; i < total; i++) {
            if (res.length < mine)
                res.push(i);
            else if (Math.random() < mine / (i + 1))
                res[Math.floor(Math.random() * res.length)] = i;
        }
        for (let i of res) {
            const x = Math.floor(i / this.y), y = i % this.y;
            field[x][y] = "  B";
        }
        field[this.x - 1][this.y - 1] = field[e.x][e.y];
        field[e.x][e.y] = " ";
        this.field = field;
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
                if (this.valid(i, j) && this.field[i][j].includes("B"))
                    res++;
            }
        }
        return res;
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
    justify-content: center;
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

</style>
