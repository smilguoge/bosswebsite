<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in status" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">新增推广二维码</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      style="width: 100%;">
      <el-table-column label="绑定邀请码" align="center" width="180">
        <template slot-scope="scope">
          <span>
            {{ scope.row.bind_code }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="推广名称" align="center" width="180">
        <template slot-scope="scope">
          <span>
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" align="center" width="240">
        <template slot-scope="scope">
          <span>
            {{ scope.row.phone }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="推广二维码" align="center" width="120">
        <template slot-scope="scope">
          <el-image :src=" scope.row.qrcode_url" fit="fill" style="width: 20px; font-size: 20px">
            <div slot="error" class="image-slot">
              <svg-icon icon-class="img" />
            </div>
          </el-image>
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
            {{ scope.row.created_at }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="已获得奖励" align="center" >
        <template slot-scope="scope">
          <span>
            {{ scope.row.royalty_money }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary" size="mini">
            <span class="el-dropdown-link" @click="handleUpdate(scope.row)">
              编辑
            </span>
            <el-dropdown-menu slot="dropdown">
              <span @click="handleFrozen(scope.row)">
                <el-dropdown-item >{{ scope.row.status =='1'?'禁用':'启用' }}</el-dropdown-item>
              </span>
              <router-link :to="{name:'ShopLog', params:{shop_id: scope.row.id}}">
                <el-dropdown-item>查看明细</el-dropdown-item>
              </router-link>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item v-if="temp.bind_code.length > 0" label="绑定邀请码" prop="bind_code">
          <el-input v-model="temp.bind_code" :disabled="true" placeholder="绑定邀请码"/>
        </el-form-item>
        <el-form-item label="商户名称" prop="name">
          <el-input v-model="temp.name" placeholder="商户名称"/>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="temp.phone" placeholder="联系方式"/>
        </el-form-item>
        <el-form-item label="推广渠道:" prop="source_id">
          <el-select v-model="temp.source_id" multiple placeholder="请选择">
            <el-option
              v-for="item in ordersource"
              :key="item.key"
              :label="item.value"
              :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="首单奖励金额" prop="first_order">
          <el-input v-model="temp.first_order" placeholder="首单奖励金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="次单奖励金额" prop="next_order">
          <el-input v-model="temp.next_order" placeholder="次单奖励金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="老客户奖励" prop="old_order">
          <el-input v-model="temp.old_order" placeholder="老客户奖励">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="启用" prop="enable">
          <el-switch
            v-model="temp.status"
            active-value="1"
            inactive-value="0"/>
        </el-form-item>
        <el-form-item label="联盟可用" prop="enable">
          <el-switch
            v-model="temp.union_status"
            active-value="1"
            inactive-value="0"/>
        </el-form-item>
        <el-form-item v-if="temp.bind_code.length > 0" label="推广二维码" prop="qrcode_url">
          <el-image :src=" temp.qrcode_url" style="width: 200px; font-size: 200px" fit="fill">
            <div slot="error" class="image-slot">
              <svg-icon icon-class="img" />
            </div>
          </el-image>
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
import { getShoplist, postShopsave, postShopstatus } from '@/api/extend'
import { getParameterItem } from '@/api/parameter'
import waves from '@/directive/waves' // Waves directive, postShopstatus
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
      ordersource: [],
      listQuery: {
        page: 1,
        limit: 20,
        status: ''
      },
      status: [],
      temp: {
        id: undefined,
        name: '',
        phone: '',
        first_order: '0',
        next_order: '0',
        old_order: '0',
        remark: '',
        union_status: '',
        status: '',
        royalty_money: '',
        qrcode_url: '',
        bind_code: ''
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
        name: [{ required: true, message: '推广名称必须', trigger: 'blur' }],
        phone: [{ required: true, message: '联系方式必须填写', trigger: 'blur' }]
      },
      menu: null
    }
  },
  created() {
    this.getList()
    this.getOrderSource()
  },
  methods: {
    getList() {
      this.listLoading = true
      getShoplist(this.listQuery).then(response => {
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
        id: undefined,
        name: '',
        phone: '',
        first_order: '0',
        next_order: '0',
        old_order: '0',
        remark: '',
        union_status: '',
        status: '',
        royalty_money: '',
        qrcode_url: '',
        bind_code: ''
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
    handleFrozen(row) {
      this.$confirm('此操作将更改推广二维码状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postShopstatus(row).then(() => {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      }).catch(() => {
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postShopsave(this.temp).then(response => {
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
      this.getOrderSource()
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
          postShopsave(tempData).then(response => {
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
    getOrderSource() {
      getParameterItem('ORDER_SOURCE').then(response => {
        this.ordersource = response.data
      })
    }
  }
}
</script>
