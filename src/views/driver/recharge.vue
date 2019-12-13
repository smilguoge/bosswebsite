<template>
  <div class="createPost-container">
    <sticky :class-name="'sub-navbar back'">
      服务人员资金流水：{{ driverinfo.realname }}（工号： {{ driverinfo.username }}），帐号余额：{{ driverinfo.balance }}
      <el-button v-loading="loading" plain icon="el-icon-back" @click="back">返回列表</el-button>
    </sticky>
    <div class="app-container">
      <div class="filter-container">
        <el-select v-model="listQuery.status" placeholder="是否成功" clearable class="filter-item" style="width: 130px">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
        <el-select v-model="listQuery.recharge_status" placeholder="资金来源" clearable class="filter-item" style="width: 130px">
          <el-option v-for="item in recharge_status" :key="item.key" :label="item.value" :value="item.key"/>
        </el-select>
        <el-date-picker
          v-model="listQuery.created_at"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          class="filter-item-date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"/>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">资金变动</el-button>
      </div>

      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;">
        <el-table-column label="消费(元)" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.money }}</span>
          </template>
        </el-table-column>
        <el-table-column label="余额(元)" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.after_money }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作员 " align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.douser }}</span>
          </template>
        </el-table-column>
        <el-table-column label="明细 ">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="来源 " align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.recharge_status_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间 " align="center" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

      <el-dialog :visible.sync="dialogFormVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" title="资金变动" width="500px">
        <el-form ref="dataForm" :model="temp" :rules="rules" label-position="right" label-width="100px" style="width: 400px;">
          <el-form-item label="金额" prop="money">
            <el-input v-model="temp.money" placeholder="金额">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="temp.remark" type="textarea"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="createData">确定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { getDriverRecharge, postDriverRecharge, getDriverInfo } from '@/api/driver'
import { getParameterItem } from '@/api/parameter'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import PanThumb from '@/components/PanThumb'
import Sticky from '@/components/Sticky' // 粘性header组件

const statusOptions = [
  { key: '0', display_name: '失败' },
  { key: '1', display_name: '成功' }
]

export default {
  name: 'Driver',
  components: { PanThumb, Pagination, Sticky },
  directives: { waves },
  data() {
    return {
      loading: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      recharge_status: [],
      listQuery: {
        page: 1,
        status: '',
        created_at: '',
        recharge_status: ''
      },
      statusOptions,
      temp: {
        money: '',
        remark: ''
      },
      driverinfo: {
        realname: '',
        username: '',
        balance: ''
      },
      dialogFormVisible: false,
      dialogChangePass: false,
      dialogEsc: false,
      dialogStatus: '',
      rules: {
        money: [{ required: true, message: '金额不能为空', trigger: 'change' }]
      },
      driver_id: ''
    }
  },
  created() {
    this.driver_id = this.$route.params && this.$route.params.driver_id
    if (this.driver_id === '') {
      this.$notify.error({
        title: '错误',
        message: '参数错误'
      })
    }
    this.getList()
    this.getInfo()
    this.getDriverRechargestatus()
  },
  methods: {
    back() {
      this.$router.push({ name: 'DriverList' })
    },
    getInfo() {
      this.listQuery.driver_id = this.driver_id
      getDriverInfo(this.listQuery).then(response => {
        this.driverinfo = response.data
      })
    },
    getList() {
      this.listLoading = true
      this.listQuery.driver_id = this.driver_id
      getDriverRecharge(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.driver_id = this.driver_id
          postDriverRecharge(this.temp).then(response => {
            // this.list.unshift(response.data)
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    getDriverRechargestatus() {
      getParameterItem('DRIVER_RECHARGE_STATUS').then(response => {
        this.recharge_status = response.data
      })
    }
  }
}
</script>
