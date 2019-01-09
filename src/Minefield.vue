<template>
<div>
    <div id="field">Minefield</div>
    <div v-for="(row, x) in board" :key="row.id">
        <div v-for="(cell, y) in row" :key="cell.id" @click="onClick(x, y)">
            {{ cell }}
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class MineSweeper extends Vue {
    @Prop({ default: [] }) board!: Array<Array<string>>;

    onClick (x: number, y: number) {
        
    }
}
</script>

<style scoped>
#field {
    background: gray;
}
</style>
