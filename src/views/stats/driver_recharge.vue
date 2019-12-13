<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable style="width: 200px;" class="filter-item" placeholder="用户名/手机/姓名" @keyup.enter.native="handleFilter"/>
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
      :default-sort="{prop: 'recharge', order: 'descending'}"
      border
      show-summary
      highlight-current-row
      style="width: 100%;">
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
      <el-table-column
        prop="back_recharge"
        sortable
        align="center"
        label="后台充值(元)"/>
      <el-table-column
        prop="wx_recharge"
        sortable
        align="center"
        label="微信充值(元)"/>
      <el-table-column
        prop="al_recharge"
        sortable
        align="center"
        label="支付宝充值(元)"/>
      <el-table-column
        prop="recharge"
        sortable
        align="center"
        label="充值金额(元)"/>
    </el-table>
  </div>
</template>

<script>
import { getDriverRecharge } from '@/api/stats'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import moment from 'moment'

export default {
  name: 'StatsDriver',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: '',
        created_at: [moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getDriverRecharge(this.listQuery).then(response => {
        this.list = response.data

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>
