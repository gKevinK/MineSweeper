<template>
<div class="root">
    <div v-for="(row, x) in board" :key="row.id" class="row">
        <div v-for="(cell, y) in row" :key="cell.id" class="square"
             :class="[ cell[0] === ' ' ? 'cover' : '',
                       cell[0] === ' ' && cell[1] && cell[1] !== ' ' ? 'd_' + cell[1] : '',
                       cell[0] !== ' ' ? 'd_' + cell[0] : '' ]"
             @click="onClick(x, y)" @contextmenu.prevent="onRClick(x, y)">
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

    @Emit('rclick')
    onRClick (x: number, y: number) {
        return { x: x, y: y };
    }

    content (c: string) {
        let char = c[0] === ' ' ? c[1] : c[0];
        if (['B', 'F', '0'].indexOf(char) != -1) return ' ';
        if (char === 'M') return '?';
        return char;
    }
}
</script>

<style scoped>
.root {
    position: absolute;
    cursor: default;
    display: flex;
    flex-flow: column;
    justify-content: center;
    overflow: auto;
}

.row {
    display: flex;
    justify-content: center;
}

.square {
    border: solid 1px darkgray;
    box-sizing: border-box;
    position: relative;
    width: 20px;
    height: 20px;
    min-width: 20px;
    min-height: 20px;
    background: lightgray;
}

.cover {
    background: #EEE;
    border: outset 3px;
    border-color: #CCCCCC #EFEFEF;
}

.d_B {
    background: red;
    background-image: url('../public/mine.svg');
    background-position: center;
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
    background-image: url('../public/flag.svg');
    background-position: center center;
}

.d_M {
    color: darkblue;
}

</style>
