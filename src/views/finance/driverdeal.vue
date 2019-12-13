<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable style="width: 200px;" class="filter-item" placeholder="服务人员姓名/手机" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.recharge_status" placeholder="资金来源" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in recharge_status" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>
      <el-date-picker
        :picker-options="pickerOptions"
        v-model="listQuery.created_at"
        value-format="yyyy-MM-dd"
        class="filter-item-date"
        type="daterange"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-view">总计金额:{{ totalmoney }}元</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      :row-class-name="tableRowClassName"
      border
      fit
      style="width: 100%;">
      <el-table-column label="订单号" align="center" width="180">
        <template slot-scope="scope">
          <span>
            {{ scope.row.ordersn }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="服务人员" align="center" width="180">
        <template slot-scope="scope">
          <span>
            {{ scope.row.driver_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="财务类型" align="center" width="180">
        <template slot-scope="scope">
          <span>
            {{ scope.row.recharge_status_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="流水金额（元）" align="center" width="120">
        <template slot-scope="scope">
          <span>
            {{ scope.row.money }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="余额（元）" align="center" width="120">
        <template slot-scope="scope">
          <span>
            {{ scope.row.after_money }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="50">
        <template slot-scope="scope">
          <span>
            {{ scope.row.status_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" width="180">
        <template slot-scope="scope">
          <span>
            {{ scope.row.created_at }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center" width="130">
        <template slot-scope="scope">
          <span>
            {{ scope.row.douser }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.remark }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getDriverFinanceList } from '@/api/finance'
import { getParameterItem } from '@/api/parameter'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const statusOptions = [
  { key: '0', display_name: '失败' },
  { key: '1', display_name: '成功' }
]

export default {
  name: 'DriverDeal',
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
      tableKey: 0,
      list: null,
      total: 0,
      totalmoney: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        created_at: '',
        status: '',
        keyword: '',
        recharge_status: ''
      },
      recharge_status: [],
      statusOptions,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    this.getList()
    this.getRechargeStatus()
  },
  methods: {
    getList() {
      this.listLoading = true
      getDriverFinanceList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.totalmoney = response.data.totalmoney
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getRechargeStatus() {
      getParameterItem('DRIVER_RECHARGE_STATUS').then(response => {
        this.recharge_status = response.data
      })
    }, tableRowClassName({ row }) {
      if (row.status === '0') {
        return 'warning-row'
      } else if (row.status === '1') {
        return 'success-row'
      }
      return ''
    }
  }
}
</script>
<style>
  .el-table .warning-row {
    background:oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
