<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.royalty_type" placeholder="提成方式" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in royalty_type" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.royalty_time" placeholder="提成时间点" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in royalty_time" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提成名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提成方式 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.royalty_type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提成时间点 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.royalty_time_name }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogFormVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" title="提成设置" width="700px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width:600px; margin-left:50px;">
        <el-form-item label="提成方式" prop="royalty_type">
          <el-select v-model="temp.royalty_type" placeholder="提成方式" clearable class="filter-item">
            <el-option v-for="item in royalty_type" :key="item.key" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="提成名称" prop="name">
          <el-input v-model="temp.name" style="width:200px;" placeholder="请输入提成名称"/>
        </el-form-item>
        <el-form-item label="提成时间点" prop="royalty_time">
          <el-select v-model="temp.royalty_time" placeholder="提成时间点" clearable class="filter-item">
            <el-option v-for="item in royalty_time" :key="item.key" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remark" type="textarea"/>
        </el-form-item>
        <el-alert
          :closable="false"
          title="提成设置提示"
          type="warning"
          description="注：固定提成 / 提成比例为公司所得提成，不使用固定提成或比例提成请设置为0；若工单实收金额小于填写的最低金额，则公司提成填写的固定金额，不使用请设置为0或不填。垫付费用不提成。"
          show-icon/>
        <p><el-button type="primary" class="filter-item" size="small" icon="el-icon-plus" @click="addRoyalty">新增提成</el-button></p>

        <el-card v-for="(royalty,index) in temp.royaltys" :key="index" class="box-card" style="margin-top: 10px;width:600px;">
          <el-form-item label="时间" size="small">
            <el-time-picker
              v-model="royalty.start"
              is-range
              style="width:200px;"
              class="filter-item-date"
              value-format="HH:mm"
              format="HH:mm"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"/>
            <el-button type="danger" icon="el-icon-delete" style="float: right" @click="deleteItem(index)"/>
          </el-form-item>
          <el-form-item label="提成类型" size="small">
            <el-radio-group v-model="royalty.type">
              <el-radio v-model="royalty.type" label="1">固定提成</el-radio>
              <el-radio v-model="royalty.type" label="2">比例提成</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="royalty.type === '1'" label="提成(固定)" size="small">
            <el-input v-model="royalty.fixedmoney" style="width:120px;" placeholder="金额">
              <template slot="append">元</template>
            </el-input>
            低于
            <el-input v-model="royalty.minmoney" style="width:120px;" placeholder="金额">
              <template slot="append">元</template>
            </el-input>
            提成
            <el-input v-model="royalty.minroyaltymoney" style="width:120px;" placeholder="金额">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="royalty.type === '2'" label="提成(比例)" size="small">
            <el-input v-model="royalty.fixedpercent" style="width:120px;" placeholder="金额">
              <template slot="append">%</template>
            </el-input>
            低于
            <el-input v-model="royalty.minpercentmoney" style="width:120px;" placeholder="金额">
              <template slot="append">元</template>
            </el-input>
            提成
            <el-input v-model="royalty.minroyaltypercentmoney" style="width:120px;" placeholder="金额">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getCompanyRoyalty, postCompanyRoyalty, deleteCompanyRoyalty } from '@/api/company'
import { getParameterItem } from '@/api/parameter'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import PanThumb from '@/components/PanThumb'

export default {
  name: 'Royalty',
  components: { PanThumb, Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      driverLoading: false,
      royalty_time: [],
      royalty_type: [],
      listQuery: {
        page: 1,
        limit: 20,
        royalty_type: '',
        royalty_time: ''
      },
      temp: {
        id: undefined,
        royalty_type: '',
        royalty_time: '',
        royaltys: [],
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
        royalty_type: [{ required: true, message: '请选择提成方式', trigger: 'change' }],
        royalty_time: [{ required: true, message: '请选择提成时间点', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    this.getRoyaltyType()
    this.getRoyaltyTime()
  },
  methods: {
    getList() {
      this.listLoading = true
      getCompanyRoyalty(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    addRoyalty() {
      var data = {}
      data.type = '1'
      data.start = ''
      data.fixedmoney = '0'
      data.minmoney = '0'
      data.minroyaltymoney = '0'
      data.fixedpercent = '0'
      data.minpercentmoney = '0'
      data.minroyaltypercentmoney = '0'
      this.temp.royaltys.push(data)
    },
    deleteItem(index) {
      this.temp.royaltys.splice(index, 1)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        royalty_type: '',
        royalty_time: '',
        remark: '',
        royaltys: []
      }
      this.driverOptions = []
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postCompanyRoyalty(this.temp).then(response => {
            this.list.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.username_disabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          postCompanyRoyalty(tempData).then(response => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, response.data)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCompanyRoyalty(row).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
      }).catch(() => {

      })
    },
    getRoyaltyType() {
      getParameterItem('ROYALTY_TYPE').then(response => {
        this.royalty_type = response.data
      })
    },
    getRoyaltyTime() {
      getParameterItem('ROYALTY_TIME').then(response => {
        this.royalty_time = response.data
      })
    }
  }
}
</script>
