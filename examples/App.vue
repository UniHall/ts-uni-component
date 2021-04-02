<template>
  <div id="app">
    <div class="left-container">
      <el-menu router :default-openeds="openedMenu">
        <el-menu-item index="/ts-vue-component/describe">介绍</el-menu-item>
        <el-submenu index="/ts-vue-component/component">
          <template slot="title">
            <span slot="title">组件</span>
          </template>
          <el-menu-item-group>
            <span slot="title">数据展示类</span>
            <el-menu-item index="/ts-vue-component/component/ts-table">table 表格</el-menu-item>
            <el-menu-item index="/ts-vue-component/component/ts-anchor">anchor 锚点</el-menu-item>
            <el-menu-item index="/ts-vue-component/component/ts-drag">drag 拖拽组件</el-menu-item>
            <el-menu-item index="/ts-vue-component/component/ts-drag-group">dragGroup 拖拽组组件</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <div class="right-container">
      <router-view class="component-desc" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class App extends Vue {
  private openedMenu = ['/ts-vue-component/component'];
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  padding: 20px 2%;
}
body {
  margin: 0;
}
</style>
<style scoped>
#app {
  display: flex;
}
.left-container {
  width: 200px;
  flex-grow: 0;
  flex-shrink: 0;
}
.right-container {
  flex-grow: 1;
}
.component-desc {
  padding: 0 5%;
}
</style>
