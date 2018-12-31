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
            <el-button type="success" size="mini" @click="add">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table
      :data="tableList"
      border
      stripe
      size='mini'
      highlight-current-row
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
      <el-table-column
        prop=""
        align="center"
        label="操作">
        <template slot-scope="scope">
          <div>
            <el-button type="text" size="mini" @click="update(scope.row)">修改</el-button>
          </div>
        </template>
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
    <el-dialog
      title="增加"
      :visible.sync="addDialogVisible"
      width="400px">
      <el-form :model="searchform" label-position="right" label-width="40px">
        <el-form-item label="id">
          <el-input v-model="addEditForm.id" size='mini' placeholder="id" style="width: 300px"></el-input>
        </el-form-item>
         <el-form-item label="名字">
          <el-input v-model="addEditForm.name" size='mini' placeholder="名字" style="width: 300px"></el-input>
        </el-form-item>
         <el-form-item label="价格">
          <el-input v-model="addEditForm.price" size='mini' placeholder="价格" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
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
      tatalPage: 0,
      addDialogVisible: false,
      addEditForm: {},
      type: 'add'
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
    add () {
      this.type = 'add'
      this.addEditForm = {}
      this.addDialogVisible = true
    },
    update (row) {
      this.type = 'edit'
      this.addEditForm = row
      this.addDialogVisible = true
    },
    confirm () {
      const url = this.type === 'add' ? '/add' : '/update'
      axios.post(url, this.addEditForm).then(res => {
        console.log(res)
        this.addDialogVisible = false
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
