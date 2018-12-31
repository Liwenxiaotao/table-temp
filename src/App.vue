<template>
  <div id="app">
    <el-container style="height: 100%">
      <el-aside width="200px">
        <el-menu
          default-active="table1"
          background-color = "rgb(84, 92, 100)"
          text-color="rgb(255, 255, 255)"
          router
          style="height: 100%">
          <el-menu-item index="table1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>表格一</span>
            </template>
          </el-menu-item>
          <el-menu-item index="table2">
            <i class="el-icon-menu"></i>
            <span slot="title">表格二</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
html, body, #app{
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
