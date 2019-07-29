<template>
  <div id="app">
    <el-container style="height: 100%">
      <el-aside width="200px">
        <el-menu
          default-active="input"
          background-color = "rgb(84, 92, 100)"
          text-color="rgb(255, 255, 255)"
          router
          style="height: 100%">
          <el-menu-item v-for="route in routerConfig" :index="route.name" :key="route.name">
            <i class="el-icon-location"></i>
            <span>{{route.name}}</span>
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
import routerConfig from './router/routerConfig.js'
export default {
  data() {
    return {
      routerConfig
    }
  },
  name: 'App',
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
.el-table th {
  background: #ebeef5
}
</style>
