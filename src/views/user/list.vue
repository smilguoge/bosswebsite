<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.mobile" placeholder="手机" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.is_black" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-date-picker
        v-model="listQuery.created_at"
        :default-time="['00:00:00', '23:59:59']"
        value-format="yyyy-MM-dd HH:mm:ss"
        class="filter-item-date"
        type="datetimerange"
        range-separator="至"
        start-placeholder="注册开始日期"
        end-placeholder="注册结束日期"
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
      <el-table-column fixed="left" label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary" size="mini">
            <span class="el-dropdown-link" >
              操作
            </span>
            <el-dropdown-menu slot="dropdown">
              <span @click="handleBlack(scope.row)">
                <el-dropdown-item >{{ scope.row.is_black=='0'?'移入黑名单':'移出黑名单' }}</el-dropdown-item>
              </span>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column label="称呼" align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.realname }}
            <el-tooltip v-if="scope.row.is_black == '1'" content="黑名单" placement="top">
              <svg-icon icon-class="is_black" style="font-size:20px;"/>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" align="center" >
        <template slot-scope="scope">
          <span>
            {{ scope.row.mobile }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.created_at }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="最近下单时间" align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.last_at }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="注册来源" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.is_driver == 0">
            {{ scope.row.source_name }}
          </span>
          <span v-if="scope.row.is_driver == 1">
            司机推荐
          </span>
          <span v-if="scope.row.is_driver == 2">
            商户推广
          </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getUserList, postBlack } from '@/api/user'
import { getParameterItem } from '@/api/parameter'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const statusOptions = [
  { key: '0', display_name: '正常用户' },
  { key: '1', display_name: '黑名单' }
]

export default {
  name: 'User',
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
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        mobile: '',
        created_at: '',
        is_black: ''
      },
      statusOptions,
      temp: {
        id: undefined,
        realname: '',
        is_black: '',
        is_driver: '',
        is_black_name: '',
        last_at: '',
        last_time: '',
        mobile: ''
      }
    }
  },
  created() {
    this.getList()
    this.getOrderSource()
  },
  methods: {
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
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
    getOrderSource() {
      getParameterItem('ORDER_SOURCE').then(response => {
        this.order_source = response.data
      })
    },
    handleBlack(row) {
      this.$confirm('此操作将客户电话列入黑名单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(row)
        postBlack(row).then((response) => {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
          row.is_black = response.data.is_black
          row.is_black_name = response.data.is_black_name
        })
      }).catch(() => {

      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .avatar {
    width: 250px;
    height: 100%;
  }
</style>
