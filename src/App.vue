<template>
    <div id="app" >
        <div>Hello world!</div>
        <Minefield style="position: absolute; top: 20px; bottom: 20px; left: 20px; right:20px; "
                   ref="ui" :board="field" @click="onClick"/>
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

    private field: Array<Array<string>> = [['1', '2', 'B'], [' F', '1', '3']];


    onClick (e: { x: number, y: number }) {
        alert("Click event: " + e.x + ", " + e.y);
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
</style>
