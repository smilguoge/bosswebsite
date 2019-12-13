<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable style="width: 200px;" class="filter-item" placeholder="用户名/手机/姓名" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.enable" placeholder="是否禁用" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.job_type" placeholder="职位类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in job_type" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>
      <el-date-picker
        v-model="listQuery.order_at"
        :default-time="['00:00:00', '23:59:59']"
        value-format="yyyy-MM-dd HH:mm:ss"
        class="filter-item-date"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="ID" prop="id" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工号" align="center" >
        <template slot-scope="scope">
          <span>
            {{ scope.row.username }}
            <el-tooltip :content="scope.row.enable == '1'?'启用':'禁用'" placement="top">
              <svg-icon :icon-class="scope.row.enable == '1'?'enabled':'disabled'"/>
            </el-tooltip>
            <el-tooltip v-if="scope.row.commission == '1'" content="提成" placement="top">
              <svg-icon icon-class="commission"/>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.realname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职位类型 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.job_type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成单量 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.completed_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单金额 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.completed_money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提成 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.completed_percentage_fee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推荐司机 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reder_recharge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推荐客户 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.recus_recharge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="110" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleOrderFilter(scope.row)">订单报表</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :visible.sync="dialogFormVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" title="已完成订单" width="800px">
      <el-table
        v-loading="order_listLoading"
        :key="order_tableKey"
        :data="order_list"
        border
        highlight-current-row
        style="width: 100%;">
        <el-table-column label="ID" prop="id" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.order_at }}</span>
          </template>
        </el-table-column>
        <el-table-column label="完成时间 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.complete_at }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额(元) " width="80" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.money }}</span>
          </template>
        </el-table-column>
        <el-table-column label="提成(元) " width="80" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.percentage_fee }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="order_total>0" :total="order_total" :page.sync="order_listQuery.page" :limit.sync="order_listQuery.limit" @pagination="getOrderList(temp)" />
    </el-dialog>

  </div>
</template>

<script>
import { getDriver } from '@/api/stats'
import { getOrderList } from '@/api/order'
import { getParameterItem } from '@/api/parameter'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import moment from 'moment'

const statusOptions = [
  { key: '0', display_name: '禁用' },
  { key: '1', display_name: '启用' }
]

export default {
  name: 'StatsDriver',
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
      order_tableKey: 0,
      list: null,
      order_list: null,
      total: 0,
      order_total: 0,
      listLoading: true,
      order_listLoading: true,
      job_type: [],
      listQuery: {
        page: 1,
        limit: 20,
        keyword: '',
        enable: '',
        job_type: '',
        order_at: [moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')]
      },
      order_listQuery: {
        page: 1,
        limit: 10,
        status: '60',
        driver_id: '',
        order_at: []
      },
      temp: null,
      statusOptions,
      dialogFormVisible: false,
      dialogChangePass: false,
      dialogEsc: false,
      dialogStatus: ''
    }
  },
  created() {
    this.getList()
    this.getJobType()
  },
  methods: {
    getList() {
      this.listLoading = true
      getDriver(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getOrderList(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
      this.order_listLoading = true
      this.order_listQuery.driver_id = row.id
      this.order_listQuery.order_at = this.listQuery.order_at

      getOrderList(this.order_listQuery).then(response => {
        this.order_list = response.data.list
        this.order_total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.order_listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleOrderFilter(row) {
      this.order_listQuery.page = 1
      this.getOrderList(row)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getJobType() {
      getParameterItem('JOB_TYPE').then(response => {
        this.job_type = response.data
      })
    }
  }
}
</script>
