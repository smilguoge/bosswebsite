<template>
  <div class="createPost-container">
    <sticky :class-name="'sub-navbar back'">
      <el-button type="primary" @click="createData">保存</el-button>
    </sticky>

    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;">
        <el-table-column label="来源" prop="id" align="center" width="200px">
          <template slot-scope="scope">
            <span>{{ scope.row.source_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收费方案" align="center" width="200px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.standard_id" placeholder="收费方案" clearable class="filter-item">
              <el-option v-for="item in standard_list" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="提成方案" align="center" width="200px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.royalty_id" placeholder="提成方案" clearable class="filter-item">
              <el-option v-for="item in royalty_list" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark"/>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>

<script>
import { getCompanyChargeStandard, postCompanyChargeStandard, getCompanyRoyaltyPlist, getCompanyStandardPlist } from '@/api/company'
import waves from '@/directive/waves' // Waves directive
import Sticky from '@/components/Sticky' // 粘性header组件

export default {
  name: 'Businessstandard',
  components: { Sticky },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      driverLoading: false,
      royalty_list: [],
      standard_list: [],
      ordersource: [],
      listQuery: {
        page: 1,
        limit: 20,
        royalty_id: '',
        standard_id: ''
      },
      temp: {
        id: undefined,
        royalty_id: '',
        name: '',
        standard_id: '',
        remark: ''
      },
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        name: [{ required: true, message: '状态不能为空', trigger: 'change' }],
        royalty_id: [{ required: true, message: '请选择提成方式', trigger: 'change' }],
        standard_id: [{ required: true, message: '请选择收费方式', trigger: 'change' }],
        order_source: [{ required: true, message: '请选择适用订单', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    this.getRoyaltyList()
    this.getStandardList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getCompanyChargeStandard(this.listQuery).then(response => {
        this.list = response.data
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
        id: undefined,
        royalty_id: '',
        name: '',
        standard_id: '',
        remark: ''
      }
    },
    createData() {
      postCompanyChargeStandard({ list: this.list }).then(response => {
        if (response) {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    getRoyaltyList() {
      getCompanyRoyaltyPlist().then(response => {
        this.royalty_list = response.data
      })
    },
    getStandardList() {
      getCompanyStandardPlist().then(response => {
        this.standard_list = response.data
      })
    }
  }
}
</script>
