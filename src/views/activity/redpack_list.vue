<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in status" :key="item.key" :label="item.value" :value="item.key"/>
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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-menu" @click="handleCheckpack">检测红包</el-button>
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
            {{ scope.row.mch_billno }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="领取的人" align="center" width="240">
        <template slot-scope="scope">
          <span>
            {{ scope.row.openid }}
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
      <el-table-column label="状态" align="center" >
        <template slot-scope="scope">
          <span>
            {{ scope.row.status_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" width="180">
        <template slot-scope="scope">
          <span>
            {{ scope.row.send_at }}
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
import { getRedpacklist } from '@/api/activity'
import { getParameterItem } from '@/api/parameter'
import { getRedpackCheck } from '@/api/wechat'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Redpacklist',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        created_at: '',
        status: ''
      },
      status: [],
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
      console.log(this.listQuery)
      getRedpacklist(this.listQuery).then(response => {
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
    getRechargeStatus() {
      getParameterItem('REDPACK_REPLY_TYPE').then(response => {
        this.status = response.data
      })
    }, tableRowClassName({ row }) {
      if (row.status === '0') {
        return 'warning-row'
      } else if (row.status === '1') {
        return 'success-row'
      } else if (row.status === '2') {
        return 'receive-row'
      } else if (row.status === '3') {
        return 'back-row'
      }
      return ''
    },
    handleCheckpack() {
      getRedpackCheck().then(response => {
        if (response) {
          this.$notify({
            title: '成功',
            message: '检查成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>
<style>
  .el-table .warning-row {
    background:#F56C6C;
  }
  .el-table .success-row {
    background: #409EFF;
  }
  .el-table .receive-row {
     background: #67C23A;
   }
  .el-table .back-row {
    background: #909399;
  }
</style>
