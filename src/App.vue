<template>
  <div id="app">
    <my-table
      :data="[{ id: '111', name: '用户1', gender: '女', age: 23 }]"
      :column-list="[
        { prop: 'id', label: '序号' },
        { prop: 'name', label: '姓名' },
        { prop: 'gender', label: '性别' }
      ]"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MyTable from "./components/MyTable.vue";

@Component({
  components: {
    MyTable
  }
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
