<template>
  <div class="createPost-container">
    <sticky :class-name="'sub-navbar back'">
      <el-button v-loading="loading" plain icon="el-icon-back" @click="back">返回列表</el-button>
    </sticky>
    <div class="app-container">
      <div class="filter-container">
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
        <el-table-column label="推广商户" align="center" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.shop_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单号" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.order_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.type_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变动金额(元)" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.royalty_money }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.pay_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间 " align="center" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注 ">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
          <template v-if="scope.row.is_pay == '0'" slot-scope="scope" >
            <el-dropdown split-button type="primary" size="mini">
              <span class="el-dropdown-link">
                操作
              </span>
              <el-dropdown-menu slot="dropdown">
                <span @click="handleOffwork(scope.row)">
                  <el-dropdown-item>线下支付</el-dropdown-item>
                </span>
                <span @click="handleDelete(scope.row)">
                  <el-dropdown-item>退回</el-dropdown-item>
                </span>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    </div>
  </div>
</template>

<script>
import { getShoplog, postRecover, postOffline } from '@/api/extend'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import PanThumb from '@/components/PanThumb'
import Sticky from '@/components/Sticky' // 粘性header组件

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
        created_at: ''
      },
      dialogFormVisible: false,
      dialogChangePass: false,
      dialogEsc: false,
      dialogStatus: '',
      driver_id: ''
    }
  },
  created() {
    this.shop_id = this.$route.params && this.$route.params.shop_id
    if (this.shop_id === '') {
      this.$notify.error({
        title: '错误',
        message: '参数错误'
      })
    }
    this.getList()
  },
  methods: {
    back() {
      this.$router.push({ name: 'ExtendShop' })
    },
    getList() {
      this.listLoading = true
      this.listQuery.shop_id = this.shop_id
      getShoplog(this.listQuery).then(response => {
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
    handleDelete(row) {
      postRecover(row).then(response => {
        if (response.code === 200) {
          this.listQuery.page = 1
          this.getList()
        }
      })
    },
    handleOffwork(row) {
      postOffline(row).then(response => {
        if (response.code === 200) {
          this.listQuery.page = 1
          this.getList()
        }
      })
    }
  }
}
</script>
