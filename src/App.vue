<template>
    <div id="app" >
        <div>Hello world!</div>
        <Minefield style="position: absolute; top: 20px; bottom: 20px; left: 20px; right:20px; "
                   ref="ui" :board="field"/>
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

    field: Array<Array<string>> = [['x', 'x'], ['x', 'y']];

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
