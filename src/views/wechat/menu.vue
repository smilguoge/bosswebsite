<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.label" style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-view" @click="handleTree">菜单预览</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-menu" @click="handleCreatewx">生成菜单</el-button>
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
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属父级" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pname }}</span>
        </template>

      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">

        <el-form-item label="名称" prop="label">
          <el-input v-model="temp.label" placeholder="请输入名称 如：用户列表"/>
        </el-form-item>
        <el-form-item label="所属分类" prop="pid">
          <el-select v-model="temp.pid" placeholder="父级分类" clearable class="filter-item">
            <el-option v-for="item in plist" :key="item.id" :label="item.label" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type_id">
          <el-select v-model="temp.type_id" placeholder="菜单类型" clearable class="filter-item">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转链接" prop="route">
          <el-input v-model="temp.url" placeholder="请输入链接 如：http://www.baidu.com"/>
        </el-form-item>
        <el-form-item label="关键字" prop="key">
          <el-input v-model="temp.key" placeholder="请输入关键字"/>
        </el-form-item>
        <el-form-item label="素材id" prop="media_id">
          <el-input v-model="temp.media_id" placeholder="请输入素材id"/>
        </el-form-item>
        <el-form-item label="appid" prop="appid">
          <el-input v-model="temp.appid" placeholder="请输入跳转小程序appid"/>
        </el-form-item>
        <el-form-item label="pagepath" prop="pagepath">
          <el-input v-model="temp.pagepath" placeholder="请输入跳转小程序链接地址"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort" placeholder="请输入排序 越大越靠前"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogTreeVisible" title="菜单预览" width="550px">
      <el-tree
        :data="menu"
        node-key="id"
        default-expand-all />
    </el-dialog>

  </div>
</template>

<script>
import { getWechatmenutree, getWechatmenuList, postWechatmenu, getWechatmenuPlist, deleteWechatmenu, createWechatmenu } from '@/api/wechat'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getParameterItem } from '@/api/parameter'
export default {
  name: 'WechatMenu',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      plist: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        label: ''
      },
      typeOptions: [],
      temp: {
        id: undefined,
        label: '',
        url: '',
        sort: '',
        type_id: '',
        key: '',
        media_id: '',
        appid: '',
        pagepath: '',
        pid: ''
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
        label: [{ required: true, message: '名称为必填项', trigger: 'blur' }],
        type_id: [{ required: true, message: '菜单类型必选项', trigger: 'blur' }]
      },
      menu: null
    }
  },
  created() {
    this.getList()
    this.getMenuType()
  },
  methods: {
    getList() {
      this.listLoading = true
      getWechatmenuList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getPlist() {
      getWechatmenuPlist().then(response => {
        this.plist = response.data
      })
    },
    getMenuType() {
      getParameterItem('WECHAT_MENU_TYPE').then(response => {
        this.typeOptions = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        label: '',
        url: '',
        sort: '',
        type_id: '',
        key: '',
        media_id: '',
        appid: '',
        pagepath: '',
        pid: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.getPlist()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postWechatmenu(this.temp).then(response => {
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
      this.getPlist()
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
          postWechatmenu(tempData).then(response => {
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
        deleteWechatmenu(row).then(() => {
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
    handleTree() {
      this.dialogTreeVisible = true
      getWechatmenutree().then(response => {
        this.menu = response.data
      })
    },
    handleCreatewx() {
      createWechatmenu().then(response => {
        if (response) {
          this.$notify({
            title: '成功',
            message: '生成成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>
