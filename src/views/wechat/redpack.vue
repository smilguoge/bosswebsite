<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">新增活动</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-menu" @click="handleCheckpack">检测红包</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="序号" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.company_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.total_money }}元</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.surplus_money }}元</span>
        </template>
      </el-table-column>
      <el-table-column label="红包个数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.packnums }}个</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余个数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.surplus_packs }}个</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary" size="mini">
            <span class="el-dropdown-link" @click="handleUpdate(scope.row)">
              编辑
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link :to="{name:'DriverRecharge', params:{driver_id: scope.row.id}}">
                  发放情况
                </router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="活动时间" prop="time">
          <el-date-picker
            v-model="temp.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </el-form-item>
        <el-form-item label="所属公司" prop="company_id">
          <el-select v-model="temp.company_id" placeholder="所属公司" clearable class="filter-item">
            <el-option v-for="item in companylist" :key="item.key" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="发送对象" prop="type">
          <el-radio v-model="temp.type" label="1">所有人</el-radio>
          <el-radio v-model="temp.type" label="2">新客户</el-radio>
        </el-form-item>
        <el-form-item label="发放总金额" prop="total_money">
          <el-input v-model="temp.total_money" placeholder="发放总金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="每天最多包数" prop="max_times">
          <el-input v-model="temp.max_times" placeholder="每天最多包数">
            <template slot="append">包</template>
          </el-input>
        </el-form-item>
        <el-form-item label="红包总个数" prop="packnums">
          <el-input v-model="temp.packnums" placeholder="红包总个数">
            <template slot="append">个</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最小金额" prop="minmoney">
          <el-input v-model="temp.minmoney" placeholder="发放最小金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="剩下的金额" prop="surplus_money">
          <el-input v-model="temp.surplus_money" placeholder="剩下的金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="剩下红包数" prop="surplus_packs">
          <el-input v-model="temp.surplus_packs" placeholder="剩下红包数">
            <template slot="append">个</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRedpackList, postRedpack, deleteRedpack, getRedpackCheck } from '@/api/wechat'
import { getWechatCompany } from '@/api/company'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'WechatMenu',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      companylist: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        label: ''
      },
      typeOptions: [],
      temp: {
        id: undefined,
        time: '',
        type: '',
        total_money: '',
        max_times: '',
        packnums: '',
        surplus_packs: '',
        minmoney: '',
        surplus_money: '',
        company_id: ''
      },
      dialogTreeVisible: false,
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        time: [{ required: true, message: '时间为必填项', trigger: 'blur' }],
        type: [{ required: true, message: '发送对象必选', trigger: 'blur' }],
        total_money: [{ required: true, message: '发送总金额为必填项', trigger: 'blur' }],
        packnums: [{ required: true, message: '红包个数为必填项', trigger: 'blur' }],
        surplus_packs: [{ required: true, message: '剩余红包个数必填项', trigger: 'blur' }],
        minmoney: [{ required: true, message: '剩余红包金额必填项', trigger: 'blur' }],
        surplus_money: [{ required: true, message: '剩余红包金额必填项', trigger: 'blur' }],
        company_id: [{ required: true, message: '活动公司必选项', trigger: 'blur' }]
      },
      menu: null
    }
  },
  created() {
    this.getList()
    this.getCompanyList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getRedpackList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getCompanyList() {
      getWechatCompany().then(response => {
        this.companylist = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        time: '',
        type: '',
        total_money: '',
        max_times: '',
        packnums: '',
        surplus_packs: '',
        minmoney: '',
        surplus_money: '',
        company_id: ''
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postRedpack(this.temp).then(response => {
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
      this.getCompanyList()
      row.pid = row.pid === '0' ? '' : row.pid
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          postRedpack(tempData).then(response => {
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
        deleteRedpack(row).then(() => {
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
