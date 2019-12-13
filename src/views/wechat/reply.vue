<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px">
      <el-form-item label="自定义回复:" prop="content">
        <el-input :autosize="{ minRows:6, maxRows: 10}" v-model="temp.content" type="textarea" placeholder="请输自定义回复内容"/>
      </el-form-item>
      <el-form-item label="" prop="">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getWechatreply, postWechatreply } from '@/api/wechat'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
export default {
  name: 'WechatReply',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      siteLoading: false,
      tableKey: 0,
      list: null,
      listLoading: true,
      temp: {
        content: '',
        type: 1,
        newid: ''
      },
      dialogDetailVisible: false,
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      rules: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getWechatreply(this.listQuery).then(response => {
        this.temp = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.getMapMlist()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        content: '',
        type: 1,
        newid: ''
      }
    },
    handleUpdate(row) {
      this.resetTemp()
      this.getMapMlist()
      this.temp = Object.assign({}, row) // copy obj
      row.fmodulid = row.fmodulid === '0' ? '' : row.fmodulid
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          postWechatreply(tempData).then(response => {
            this.temp = response.data
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
  .el-tagbox.el-tag{margin-left:10px}
  .dialog-footer{
    margin-left: 680px;
  }
</style>
