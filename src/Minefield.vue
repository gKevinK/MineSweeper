<template>
<div class="root">
    <div v-for="(row, x) in board" :key="row.id" class="row">
        <div v-for="(cell, y) in row" :key="cell.id" class="square"
             :class="[ [' ', 'C', 'F', 'M'].indexOf(cell.content) != -1 ? 'cover' : '',
                       cell.content !== ' ' ? 'd_' + cell.content : '' ]"
             @click="onClick(x, y)" @contextmenu.prevent="onRClick(x, y)">
            {{ content(cell.content) }}
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { Content } from './Utils';

@Component({})
export default class MineSweeper extends Vue {
    @Prop({ default: [] }) board!: Array<Array<{ content: Content }>>;

    @Emit('click')
    onClick (x: number, y: number) {
        return { x: x, y: y };
    }

    @Emit('rclick')
    onRClick (x: number, y: number) {
        return { x: x, y: y };
    }

    content (c: Content) {
        if (["B", "C", "F", "0"].indexOf(c) != -1) return " ";
        if (c === 'M') return '?';
        return c;
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
    background-image: url('assets/mine.svg');
    background-position: center;
}

.d_C {
    background-image: url('assets/mine.svg');
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
    background-image: url('assets/flag.svg');
    background-position: center center;
}

.d_M {
    color: darkblue;
}

</style>
