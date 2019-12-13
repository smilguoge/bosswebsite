<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.order_at"
        :default-time="['12:00:00', '12:00:00']"
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
      highlight-current-row
      style="width: 100%;">
      <el-table-column fixed="left" label="项目" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="本公司创建订单" align="center">
        <el-table-column
          prop="name"
          label="本公司服务人员服务订单"
          align="center"
          width="100">
          <el-table-column
            label="完工"
            align="center"
            width="120">
            <template slot-scope="scope">
              {{ scope.row.company_completed }}
            </template>
          </el-table-column>
          <el-table-column
            prop="province"
            label="销单"
            align="center"
            width="120">
            <template slot-scope="scope">
              {{ scope.row.company_cancel !=='' ? scope.row.company_cancel : '-' }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="平台其它公司服务人员服务订单（外派）" align="center">
          <el-table-column
            prop="province"
            label="完工"
            align="center"
            width="120">
            <template slot-scope="scope">
              {{ scope.row.company_share_completed }}
            </template>
          </el-table-column>
          <el-table-column
            prop="province"
            label="销单"
            align="center"
            width="120">
            <template slot-scope="scope">
              {{ scope.row.company_share_cancel !=='' ? scope.row.company_share_cancel : '-' }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本公司合计" align="center">
          <el-table-column
            prop="province"
            label="完工"
            align="center"
            width="120">
            <template slot-scope="scope">
              {{ scope.row.company_total_completed }}
            </template>
          </el-table-column>
          <el-table-column
            prop="province"
            label="销单"
            align="center"
            width="120">
            <template slot-scope="scope">
              {{ scope.row.company_total_cancel !=='' ? scope.row.company_total_cancel : '-' }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="调入订单" align="center">
        <el-table-column
          prop="name"
          label="其他公司订单本公司服务人员订单"
          align="center">
          <el-table-column
            prop="province"
            label="完工"
            align="center"
            width="120">
            <template slot-scope="scope">
              {{ scope.row.other_share_completed }}
            </template>
          </el-table-column>
          <el-table-column
            prop="province"
            label="销单"
            align="center"
            width="120">
            <template slot-scope="scope">
              {{ scope.row.other_share_cancel !=='' ? scope.row.other_share_cancel : '-' }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="合计" align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.total }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-loading="union_listLoading"
      v-if="union_list.length > 1"
      :data="union_list"
      border
      highlight-current-row
      style="width: 100%;margin-top: 20px;">
      <el-table-column label="调度统计" align="center">
        <el-table-column fixed="left" label="合作公司" align="center" width="150" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="外派"
          align="center"
          width="100">
          <el-table-column
            label="完工"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.company_share_completed }}
            </template>
          </el-table-column>
          <el-table-column
            prop="province"
            label="销单"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.company_share_cancel }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="name"
          label="调入"
          align="center">
          <el-table-column
            label="完工"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.other_share_completed }}
            </template>
          </el-table-column>
          <el-table-column
            prop="province"
            label="销单"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.other_share_cancel }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getOrder, getOrderUnion } from '@/api/stats'
import waves from '@/directive/waves' // Waves directive
import moment from 'moment'

export default {
  name: 'StatsOrder',
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      union_list: [],
      listLoading: true,
      union_listLoading: true,
      listQuery: {
        order_at: [moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')]
      }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    handleFilter() {
      this.getOrder()
      this.getOrderUnion()
    },
    getOrder() {
      this.listLoading = true
      getOrder(this.listQuery).then(response => {
        this.list = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getOrderUnion() {
      this.union_listLoading = true
      getOrderUnion(this.listQuery).then(response => {
        this.union_list = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.union_listLoading = false
        }, 0.5 * 1000)
      })
    }
  }
}
</script>
