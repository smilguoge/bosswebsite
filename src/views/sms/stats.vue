<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.record_at"
        :picker-options="pickerOptions"
        :default-time="['12:00:00', '12:00:00']"
        value-format="yyyy-MM-dd HH:mm:ss"
        class="filter-item-date separator"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="data"
      border
      fit
      highlight-current-row>
      <el-table-column prop="notice_count" label="短信通知用量（条）" align="center" />
      <el-table-column prop="notice_money" label="短信通知费用（元）" align="center" />
      <el-table-column prop="market_count" label="营销短信用量（条）" align="center" />
      <el-table-column prop="market_money" label="营销短信费用（元）" align="center" />
    </el-table>
  </div>
</template>

<script>
import { getSmsStats } from '@/api/sms'
import moment from 'moment'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'SmsStats',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      data: [],
      total: 0,
      listLoading: true,
      listQuery: {
        record_at: [moment().subtract(1, 'months').format('YYYY-MM-DD 12:00:00'), moment().format('YYYY-MM-DD 12:00:00')]
      },
      pickerOptions: {
        disabledDate: this.disabledDate
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getSmsStats(this.listQuery).then(response => {
        this.data = []
        this.data.push(response.data)
        console.log(this.data)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    disabledDate(time) {
      return time.getTime() > Date.now() - 8.64e7
    }
  }
}
</script>
