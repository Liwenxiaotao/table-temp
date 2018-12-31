<template>
  <div>
    <el-row>
      <el-col>
        <el-form :inline="true" :model="searchform">
          <el-form-item label="查询条件">
            <el-input v-model="searchform.search" size='mini' placeholder="查询条件"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table
      :data="tableList"
      border
      stripe
      size='mini'
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        align="center"
        label="id">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="price"
        align="center"
        label="价格">
      </el-table-column>
    </el-table>
    <el-row style="margin-top:10px">
      <el-col>
        <el-pagination
          background
          style="text-align: center"
          layout="total, prev, pager, next"
          @current-change="handleCurrentChange"
          :page-size="this.searchform.limit"
          :total="tatalPage">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      searchform: {
        search: '',
        order: 'asc',
        offset: 0,
        limit: 10,
        currPage: 1
      },
      tableList: [],
      tatalPage: 0
    }
  },
  created () {
    this.search()
  },
  methods: {
    search () {
      axios.get('http://wenzhixin.net.cn/examples/bootstrap_table/data', {
        params: this.searchform
      }).then(res => {
        this.tableList = res.data.rows
        this.tatalPage = res.data.total
      }).catch(error => {
        console.log(error)
      })
    },
    handleCurrentChange (val) {
      this.searchform.currPage = val
      this.searchform.offset = (val - 1) * 10
      this.search()
    }
  }
}
</script>
