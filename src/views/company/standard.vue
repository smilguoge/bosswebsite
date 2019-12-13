<template>
  <div class="app-container">
    <div class="filter-container">
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
      <el-table-column label="方案名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create }}</span>
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

    <el-dialog :visible.sync="dialogFormVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" title="收费设置" width="800px">
      <el-form ref="dataForm" :rules="rules" :model="temp" size="small" label-position="right" label-width="100px" style="width:700px; margin-left:50px;">
        <el-form-item label="收费名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入收费名称"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remark" type="textarea"/>
        </el-form-item>
        <el-form-item label=" ">
          <el-button class="filter-item" size="small" type="primary" icon="el-icon-plus" @click="addStandard">新增收费</el-button>
        </el-form-item>
        <el-card v-for="(standard,index) in temp.standards" :key="index" class="box-card" style="margin-top: 10px;width:700px;">
          <el-form-item label="服务时间">
            <el-time-picker
              v-model="standard.servicetime"
              is-range
              style="width:200px;"
              value-format="HH:mm"
              format="HH:mm"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"/>
            <el-button type="danger" icon="el-icon-delete" style="float: right" @click="deleteItem(index)"/>
          </el-form-item>
          <el-form-item label="起步价">
            <el-input v-model="standard.startprice" class="smallbox" placeholder="起步价" />元
            (包含 <el-input v-model="standard.startkilometre" class="smallbox" placeholder="公里"/>  km
            ,包含
            <el-input v-model="standard.startminute" class="smallbox" placeholder="分钟" /> 分钟
          </el-form-item>
          <el-form-item label="里程计价">
            超过<el-input v-model="standard.overkilometre" class="smallbox" placeholder="超过" /> km
            以后每
            <el-input v-model="standard.nextkilometre" class="smallbox" placeholder="公里数" /> km
            <br>
            (不足<el-input v-model="standard.insufficientkilometre" class="smallbox" placeholder="公里数" /> km
            不计费）
            加收
            <el-input v-model="standard.nextprice" class="smallbox" placeholder="金额"/> 元
          </el-form-item>
          <el-form-item label="时间计价">
            起步后
            <el-input v-model="standard.starttime" class="smallbox" placeholder="超过" /> 分钟
            不计费
            以后每
            <el-input v-model="standard.nextstarttime" class="smallbox" placeholder="分钟" /> 分钟
            <br>(不足<el-input v-model="standard.insufficientstarttime" class="smallbox" placeholder="分钟" /> 分钟
            不计费）
            加收
            <el-input v-model="standard.addstarttime" class="smallbox" placeholder="金额" /> 元
          </el-form-item>
          <el-form-item label="等候计价">
            免费等待
            <el-input v-model="standard.waittime" class="smallbox" placeholder="分钟" /> 分钟
            到达则立即加收
            <el-input v-model="standard.waittimeprice" class="smallbox" placeholder="金额" /> 元
            以后每
            <el-input v-model="standard.nextwaittime" class="smallbox" placeholder="分钟" /> 分钟
            <br>(超过
            <el-input v-model="standard.insufficientwaittime" class="smallbox" placeholder="分钟" /> 分钟
            计费）
            加收
            <el-input v-model="standard.addwaittime" class="smallbox" placeholder="金额" /> 元
          </el-form-item>
          <el-form-item label="远途费">
            超过
            <el-input v-model="standard.rangeover" class="smallbox" placeholder="公里" /> km
            以后每
            <el-input v-model="standard.rangepercent" class="smallbox" placeholder="公里" /> km
            <br>(超过
            <el-input v-model="standard.overrange" class="smallbox" placeholder="公里" /> km
            收费）
            加收
            <el-input v-model="standard.addrange" class="smallbox" placeholder="金额" /> 元
          </el-form-item>
          <el-form-item label="最低消费">
            <el-input v-model="standard.minprice" class="smallbox" placeholder="金额" /> 元
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
import { getCompanyStandard, postCompanyStandard, deleteCompanyStandard } from '@/api/company'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import PanThumb from '@/components/PanThumb'

export default {
  name: 'Standard',
  components: { PanThumb, Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      driverLoading: false,
      listQuery: {
        page: 1,
        limit: 20
      },
      temp: {
        id: undefined,
        name: '',
        standards: [],
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
        name: [{ required: true, message: '状态不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getCompanyStandard(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    addStandard() {
      var data = {}
      data.startprice = '0'
      data.startkilometre = '0'
      data.startminute = '0'
      data.servicetime = '0'
      data.overkilometre = '0'
      data.nextkilometre = '0'
      data.nextprice = '0'
      data.insufficientkilometre = '0'
      data.addstarttime = '0'
      data.starttime = '0'
      data.insufficientstarttime = '0'
      data.nextstarttime = '0'
      data.addwaittime = '0'
      data.waittime = '0'
      data.insufficientwaittime = '0'
      data.nextwaittime = '0'
      data.waittimeprice = '0'
      data.rangeover = '0'
      data.rangepercent = '0'
      data.overrange = '0'
      data.addrange = '0'
      data.minprice = '0'
      this.temp.standards.push(data)
    },
    deleteItem(index) {
      this.temp.standards.splice(index, 1)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        remark: '',
        standards: []
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
          postCompanyStandard(this.temp).then(response => {
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
          postCompanyStandard(tempData).then(response => {
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
        deleteCompanyStandard(row).then(() => {
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
    }
  }
}
</script>
<style>
  .smallbox{
    width: 80px;
  }
</style>
