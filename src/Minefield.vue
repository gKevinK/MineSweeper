<template>
<div class="root">
    <div v-for="(row, x) in board" :key="row.id" class="row">
        <div v-for="(cell, y) in row" :key="cell.id" class="square"
             :class="{ cover: cell[0] === ' ' }" @click="onClick(x, y)">
            {{ cell }}
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
    background: white;
}

</style>
