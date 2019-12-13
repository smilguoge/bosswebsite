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
      <el-table-column label="ID" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="围栏名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="加收方式" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.typename }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogFormVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" :before-close="closeDialog" title="设置围栏" width="80%">
      <div class="amap-page-container">
        <el-amap ref="map" :center="center" :zoom="zoom" :events="events" vid="amapDemo" class="amap-demo">
          <el-amap-polygon
            v-if="temp.path!=''"
            ref="polygon"
            :path="temp.path"
            stroke-color="#80d8ff"
            stroke-weight="2"
            stroke-opacity="0.6"
            fill-opacity="0.4"
            fill-color="#00b0ff"/>

          <el-amap-polygon
            v-for="(item, index) in list"
            v-if="item.id !== temp.id"
            :key="index"
            :ref="`polygon_${index}`"
            :path="item.path"
            stroke-color="#606266"
            stroke-weight="2"
            stroke-opacity="0.6"
            fill-opacity="0.4"
            fill-color="#AAAAAA"/>
        </el-amap>

        <div class="fence_div">
          <el-form ref="dataForm" :model="temp" :rules="rules" size="mini" label-position="right" label-width="80px" style="width: 250px;">
            <el-form-item label="">
              <el-button type="warning" size="mini" @click="drawPolygon">{{ draw_polygon === false ? (temp.path.length > 0?'删除重新绘制':'点击开始绘制') : '双击结束绘制' }}</el-button>
              <el-button id="clearPolygon" ref="deleteFenceclick" type="danger" size="mini" style="display: none">删除</el-button>
            </el-form-item>
            <el-form-item label="围栏名称" prop="name">
              <el-input v-model="temp.name" style="width:200px;" placeholder="围栏名称"/>
            </el-form-item>
            <el-form-item label="超过里程" prop="overkmfixed">
              <el-input v-model="temp.overkmfixed" placeholder="公里">
                <template slot="append">km</template>
              </el-input>
            </el-form-item>
            <el-form-item label="加收类型" prop="type">
              <el-radio-group v-model="temp.type" size="mini">
                <el-radio-button v-for="item in statusOptions" :key="item.key" :label="item.key">{{ item.display_name }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="temp.type==='0' " label="加收" prop="addmoney">
              <el-input v-model="temp.addmoney" placeholder="金额">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="temp.type==='1'" label="加收" prop="commission">
              <el-input v-model="temp.commission" placeholder="比例">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="备注 ">
              <el-input v-model="temp.remark" type="textarea"/>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!--<div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>-->
    </el-dialog>
  </div>
</template>

<script>
import { getCompanyInfo, getFencelist, postFence, deleteFence } from '@/api/company'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import PanThumb from '@/components/PanThumb'
import AMap from 'AMap'
const statusOptions = [
  { key: '0', display_name: '固定加收' },
  { key: '1', display_name: '比例加收' }
]
// var gMap2, polygon02
export default {
  name: 'Fence',
  components: { PanThumb, Pagination },
  directives: { waves },
  data() {
    const self = this
    return {
      zoom: 13,
      mouseTool: '',
      map: '',
      flagBit: false, // 绘制围栏标志位
      polygonnew: null,
      renderFenceOk: false, // 绘制围栏成功标志位
      positionMark: [],
      arrpath: [],
      center: [121.5273285, 31.21515044], // 初始位置
      polygon: [],
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
        type: '',
        name: '',
        path: [], //  围栏·经纬度数组
        addmoney: '',
        overkmfixed: '',
        commission: '',
        overkmcom: '',
        remark: ''
      },
      events: {
        init: (o) => {
          self.mouseTool = new AMap.MouseTool(o)
          self.map = o
          // const addPolygonButton = document.getElementById('addPolygon')
          const clearPolygonButton = document.getElementById('clearPolygon')
          // // 加载围栏
          // if (self.polygon.path.length > 0) {
          //   console.log(self.polygon.path)
          //   self.polygonnew = new AMap.Polygon({
          //     path: self.polygon.path,
          //     strokeColor: '#80d8ff',
          //     strokeWeight: 6,
          //     strokeOpacity: 0.2,
          //     fillOpacity: 0.4,
          //     fillColor: '#00b0ff'
          //   })
          //   o.add(self.polygonnew)
          //   o.setFitView([self.polygonnew])
          //   self.mouseTool.close(false)
          //   self.renderFenceOk = true
          // }
          // 绘制围栏
          // AMap.event.addDomListener(addPolygonButton, 'click', (resData) => {
          //   if (self.flagBit) {
          //     self.mouseTool.close(false)
          //   } else {
          //     self.mouseTool.polygon()
          //   }
          // }, false)
          // 绘制完成触发此事件
          self.mouseTool.on('draw', function(e) {
            var path = e.obj.getPath()
            var arr = []
            for (var i = 0; i < path.length; i++) {
              arr.push([path[i].lng, path[i].lat])
            }

            self.temp.path = arr
            self.$message.success('绘制围栏成功')
            self.draw_polygon = false
            self.mouseTool.close()
            // // self.mouseTool.close(false)
            // self.flagBit = true
            // const arr = e.obj.F.path.map(item => {
            //   return [item.lng, item.lat]
            // })
            // self.temp.path = arr
            // self.$message.success('绘制围栏成功')
            // self.polygon = ''
            // self.renderFenceOk = true
          })
          // 清除围栏
          AMap.event.addDomListener(clearPolygonButton, 'click', () => {
            // 移除计算的围栏
            o.remove(self.temp.path)
            self.temp.path = []
            self.polygon = []
            self.mouseTool.close(true)
          }, false)
        }
      },
      statusOptions,
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      draw_polygon: false,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        name: [{ required: true, message: '围栏名称不能为空', trigger: 'blur' }],
        overkmfixed: [{ required: true, message: '超出里程不能为空', trigger: 'blur' }],
        addmoney: [{ required: true, message: '加收金额不能为空', trigger: 'blur' }],
        commission: [{ required: true, message: '加收比例不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '加收类型不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    this.getInfo()
  },
  methods: {
    drawPolygon() {
      if (this.draw_polygon === false) {
        this.$refs['deleteFenceclick'].$el.click()
        this.mouseTool.polygon({
          strokeColor: '#FF33FF',
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillColor: '#1791fc',
          fillOpacity: 0.4,
          // 线样式还支持 'dashed'
          strokeStyle: 'solid'
          // strokeStyle是dashed时有效
          // strokeDasharray: [30,10],
        })
        this.temp.path = []
        this.draw_polygon = true
      } else {
        this.draw_polygon = false
        this.mouseTool.close()
      }
    },
    closeDialog() {
      this.dialogFormVisible = false
      this.$refs['deleteFenceclick'].$el.click()
    },
    getList() {
      this.listLoading = true
      getFencelist(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getInfo() {
      getCompanyInfo(this.listQuery).then(response => {
        this.center = [response.data.lng, response.data.lat]
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        type: '0',
        name: '',
        path: [],
        addmoney: '',
        overkmfixed: '',
        commission: '',
        overkmcom: '',
        remark: ''
      }
    },
    handleCreate() {
      this.polygon = this.temp.path
      this.resetTemp()
      // this.flagBit = false
      // this.renderFenceOk = false
      this.dialogStatus = 'create'
      this.dialogFormVisible = true

      this.$nextTick(() => {
        this.$refs['deleteFenceclick'].$el.click()
        this.$refs['dataForm'].clearValidate()
      })
    },
    getTempPath() {
      var arrpath = []
      var path = this.temp.path

      for (var i = 0; i < path.length; i++) {
        arrpath.push([path[i].lng, path[i].lat])
      }
      this.temp.path = arrpath
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.getTempPath()
          postFence(this.temp).then(response => {
            this.list.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.$refs['deleteFenceclick'].$el.click()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.polygon = this.temp.path
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.getTempPath()
          const tempData = Object.assign({}, this.temp)
          postFence(tempData).then(response => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, response.data)
                break
              }
            }
            // this.$refs['deleteFenceclick'].$el.click()
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
        deleteFence(row).then(() => {
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
  .el-form-item__label{
    font-weight: normal;
    font-size: 12px;
  }
   .fence_div{
     padding-top: 20px;
     top: 50px;
     left: 10px;
     width:300px;
     background-color: #ffffff;
     position: absolute;
     border-radius: .25rem;
     box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
   }
    .amap-page-container{
      /*position: absolute;*/
      /*top: 50px;*/
      /*right: 50px;*/
      /*width: 700px;*/
      height: 700px;
    }
    .amap-page-container {
      position: relative;
    }
  </style>

