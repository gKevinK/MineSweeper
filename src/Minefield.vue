<template>
<div class="root">
    <div v-for="(row, x) in board" :key="row.id" class="row">
        <div v-for="(cell, y) in row" :key="cell.id" class="square"
             :class="[cell[0] === ' ' ? 'cover ' + 'd_' + cell[1] : 'd_' + cell]" @click="onClick(x, y)">
            {{ content(cell) }}
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component({})
export default class MineSweeper extends Vue {
    @Prop({ default: [] }) board!: Array<Array<string>>;

    @Emit('click')
    onClick (x: number, y: number) {
        return { x: x, y: y };
    }

    content (c: string) {
        if (c[0] === '0') return '';
        let char = c[0] === ' ' ? c[1] : c[0];
        if (char === 'B') return '*';
        if (char === 'F') return 'P';
        return char;
    }
}
</script>

<style scoped>
.root {
    position: absolute;
    cursor: default;
}

.row {
    display: flex;
    justify-content: center;
}

.square {
    border: solid 1px darkgray;
    /* position: relative; */
    /* display: inline-block; */
    width: 20px;
    height: 20px;
    background: lightgray;
}

.cover {
    background: #EEE;
}

.d_B {
    background: red;
}

/* .d_0 {
} */

.d_1 {
    color: blue;
}

.d_2 {
    color: darkgreen;
}

.d_3 {
    color: crimson;
}

.d_4 {
    color: darkblue;
}

.d_5 {
    color: brown;
}

.d_6 {
    color: green;
}

.d_7 {
    color: brown;
}

.d_8 {
    color: black;
}

.d_F {
    color: red;
}

.d_M {
    color: darkblue;
}

</style>
