<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.code" clearable style="width: 150px;" class="filter-item" placeholder="优惠码" @keyup.enter.native="handleCouponFilter"/>
      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in coupon_status" :key="item.key" :label="item.value" :value="item.key"/>
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
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center" fixed="left" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠码" align="center" width="120" fixed="left">
        <template slot-scope="scope">
          <span>
            {{ scope.row.code }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态 " align="center" width="100" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.status_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="抵扣(元)" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣(%)" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.discount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效时间" align="center" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.start_at }} {{ scope.row.end_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接收手机号码 " align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用手机号码 " align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.user_mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用时间 " align="center" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.used_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号 " align="center" width="145">
        <template slot-scope="scope">
          <span>{{ scope.row.order_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="失效时间 " align="center" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.invalid_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券名称" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.rule_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="适用来源 " align="center" width="200">
        <template slot-scope="scope">
          <el-tag
            v-for="tag in scope.row.source_name"
            :key="tag"
            class="el-tagbox">
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间 " align="center" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getCouponList } from '@/api/coupon'
import { getParameterItem } from '@/api/parameter'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Driver',
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
      submit_disabled: false,
      listLoading: true,
      coupon_status: [],
      sex: [],
      listQuery: {
        page: 1,
        limit: 20,
        rule_id: '',
        code: '',
        created_at: [],
        status: ''
      }
    }
  },
  created() {
    this.getList()
    this.getCouponStatus()
  },
  methods: {
    getList() {
      this.listLoading = true
      getCouponList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // searchDriver(query) {
    //   if (query !== '') {
    //     this.driverLoading = true
    //     getDriverSearch({ keyword: query }).then(response => {
    //       this.driverOptions = response.data
    //
    //       setTimeout(() => {
    //         this.driverLoading = false
    //       }, 0.5 * 1000)
    //     })
    //   } else {
    //     this.driverOptions = []
    //   }
    // },
    getCouponStatus() {
      getParameterItem('COUPON_STATUS').then(response => {
        this.coupon_status = response.data
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

  .el-tagbox.el-tag{margin-left:10px}
</style>
