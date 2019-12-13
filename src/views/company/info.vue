<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" >
      <el-form-item label="名称" prop="name">
        <el-input v-model="temp.name" placeholder="请输入名称"/>
      </el-form-item>
      <el-form-item label="简称" prop="shorthand">
        <el-input v-model="temp.shorthand" placeholder="请输入简称"/>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="temp.address_detail" placeholder="请输入地址"/>
      </el-form-item>
      <el-form-item label="公司电话" prop="tel">
        <el-input v-model="temp.tel" placeholder="请输入公司电话"/>
      </el-form-item>
      <el-form-item label="客服电话" prop="">
        <el-input v-model="temp.kf_tel" placeholder="请输入客服电话"/>
      </el-form-item>
      <el-form-item label="负责人" prop="leader">
        <el-input v-model="temp.leader" placeholder="请输入负责人"/>
      </el-form-item>
      <el-form-item label="负责人电话" prop="leader_mobile">
        <el-input v-model="temp.leader_mobile" placeholder="请输入负责人电话"/>
      </el-form-item>
      <el-form-item label="logo" prop="logo_id">
        <Upload
          v-model="temp.logo_url"
          @upload-success="logoSuccess"
          @upload-delete="logoDelete"/>
        <input v-model="temp.logo_id" type="hidden">
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark" type="textarea" placeholder="请输入备注"/>
      </el-form-item>
      <el-form-item label="" prop="">
        <el-button type="primary" @click="updateData">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCompanyInfo, postCompany } from '@/api/company'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import Upload from '@/components/Upload'

export default {
  name: 'CompanyInfo',
  components: { Pagination, Upload },
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
        name: '',
        shorthand: '',
        logo_id: '',
        logo_url: '',
        address_detail: '',
        tel: '',
        kf_tel: '',
        leader: '',
        leader_mobile: '',
        remark: '',
        status: '1'
      },
      dialogDetailVisible: false,
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      rules: {}
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.listLoading = true
      getCompanyInfo(this.listQuery).then(response => {
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          postCompany(tempData).then(response => {
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
    },
    logoSuccess(resData) {
      this.temp.logo_url = resData.url
      this.temp.logo_id = resData.id
    },
    logoDelete() {
      this.temp.logo_url = ''
      this.temp.logo_id = ''
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
