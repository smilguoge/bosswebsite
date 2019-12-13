<template>
  <div class="amap-page-container">

    <el-amap
      :events="events"
      :center="center"
      :plugin="plugin"
      :zoom="zoom"
      vid="amapDemo"
      class="amap-demo">
      <el-amap-marker
        v-if="start_marker.position.length > 0"
        :position="start_marker.position"
        :icon="start_marker.icon"
        :events="start_marker.events"
        animation ="AMAP_ANIMATION_DROP"/>
      <el-amap-circle
        v-if="start_marker.position.length > 0"
        :center="start_marker.position"
        :radius="circle.radius"
        :bubble="true"
        :stroke-color="circle.strokeColor"
        :stroke-weight="circle.strokeWeight"
        :fill-color="circle.fillColor"
        :fill-opacity="circle.fillOpacity" />

      <el-amap-marker
        v-if="end_marker.position.length > 0"
        :position="end_marker.position"
        :icon="end_marker.icon"
        :events="end_marker.events"
        animation ="AMAP_ANIMATION_DROP"/>

      <el-amap-marker
        v-for="(driver, index) in driver_list"
        :key="index"
        :position="[driver.lng,driver.lat]"
        :draggable="true"
        anchor="bottom-center"
        cursor="pointer">
        <div :class="'tool-staff-marker driver-marker-status-'+driver.status">
          <div class="tool-staff-marker-name">{{ driver.realname }}</div>
          <span class="tool-staff-marker-corner" />
        </div>
      </el-amap-marker>
    </el-amap>

    <div class="info">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" size="small" label-width="80px" style="width: 250px;">
        <el-card class="box-card" style="width: 300px;">
          <el-input v-model="temp.order_address" clearable class="filter-item address" placeholder="预约地" @input="startSearch">
            <i slot="prefix" class="el-input__icon">
              <svg-icon icon-class="start" style="font-size: 20px"/>
            </i>
          </el-input>
          <el-input v-model="temp.order_destination_address" clearable class="filter-item address" placeholder="目的地" @input="endSearch">
            <i slot="prefix" class="el-input__icon">
              <svg-icon icon-class="end" style="font-size: 20px"/>
            </i>
          </el-input>
          <p style="color: #2c3e50;padding-left: 10px;"><svg-icon icon-class="mileage" style="font-size: 15px"/> &nbsp;{{ mileage }}公里 | {{ mileage_time }}分钟 </p>
        </el-card>

        <el-card class="box-card" style="width: 300px; margin-top: 5px;">
          <el-form-item label="来源" prop="">
            <el-select v-model="temp.source_id" placeholder="来源" class="filter-item">
              <el-option v-for="item in order_source" :key="item.key" :label="item.value" :value="item.key"/>
            </el-select>
          </el-form-item>
          <el-form-item label="客户电话" prop="user_mobile">
            <el-input v-model="temp.user_mobile" placeholder="请输入客户电话"/>
          </el-form-item>
          <el-form-item label="客户姓名" prop="user_realname">
            <el-input v-model="temp.user_realname" placeholder="请输入客户姓名"/>
          </el-form-item>
          <el-form-item label="司机人数" prop="driver_num">
            <el-input-number v-model="temp.driver_num" :min="1" :max="10" label="司机人数" />
          </el-form-item>
          <el-form-item label="预约时间" prop="order_at">
            <el-date-picker
              v-model="temp.order_at"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm"
              type="datetime"
              style="width: 178px;"
              placeholder="默认系统时间" />
          </el-form-item>
          <el-form-item label="备注" prop="">
            <el-input
              :rows="2"
              v-model="temp.remark"
              type="textarea"
              placeholder="请输入内容"/>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="submit_disabled" type="primary" @click="onSubmit">创建订单</el-button>
          </el-form-item>
        </el-card>
      </el-form>

      <div v-if="start_enable === true" class="start_div">
        <el-table
          :data="start_list"
          :show-header="false">
          <el-table-column>
            <template slot-scope="scope" >
              <div @click="setStart(scope.row)">
                <span>
                  <svg-icon icon-class="location_start"/>{{ scope.row.name }}
                </span>
                <div class="district">{{ scope.row.district }}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="end_enable === true" class="end_div">
        <el-table
          :data="end_list"
          :show-header="false">
          <el-table-column>
            <template slot-scope="scope" >
              <div @click="setEnd(scope.row)">
                <span>
                  <svg-icon icon-class="location_end"/>{{ scope.row.name }}
                </span>
                <div class="district">{{ scope.row.district }}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="start_marker.position.length > 0" class="driver_div">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>推荐司机</span>
          </div>
          <div class="block">
            <span class="demonstration"> 搜索范围({{ distance }}km)</span>
            <el-slider
              v-model="distance"
              :step="3"
              :min="3"
              :max="15"
              class="slider"
              show-stops
              @change="changeDistance"/>
          </div>
          <el-table
            v-loading="listLoading"
            :data="driver_list"
            :stripe="true"
            size="small"
            height="300"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection" />
            <el-table-column label="姓名" fixed width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.realname }}</span>
              </template>
            </el-table-column>
            <el-table-column label="距离(km)" width="70">
              <template slot-scope="scope" >
                <span>{{ scope.row.distance }}</span>
              </template>
            </el-table-column>
            <el-table-column label="公司" width="80">
              <template slot-scope="scope" >
                <span>{{ scope.row.company_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="星级" width="50">
              <template slot-scope="scope" >
                {{ scope.row.star_name }}
              </template>
            </el-table-column>
            <el-table-column label="类型" width="50">
              <template slot-scope="scope" >
                {{ scope.row.job_type_name }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

    </div>
  </div>
</template>

<script>
import { postOrder, getOrderDetail } from '@/api/order'
import { getDriverNearby } from '@/api/driver'
import { getParameterItem } from '@/api/parameter'
import { getCompanyInfo } from '@/api/company'
import moment from 'moment'
import AMap from 'AMap'
import mark from '@/assets/dir-marker.png'

const distanceZoom = {
  '3': '14',
  '6': '13',
  '9': '13',
  '12': '12',
  '15': '12'
}

export default {
  name: 'OrderCreate',
  data() {
    const self = this
    return {
      start_marker: {
        position: [],
        icon: ''
      },
      end_marker: {
        position: [],
        icon: ''
      },
      driving: '',
      zoom: 13,
      center: [118.105964, 24.493929],
      address: '',
      ContextMenuPositon: [],
      circle: {
        center: [],
        radius: 5000,
        strokeColor: '#3366FF',
        strokeWeight: 1,
        fillOpacity: 0.2,
        fillColor: '#3366FF'
      },
      temp: {
        order_address: '',
        order_lng: '',
        order_lat: '',
        order_destination_address: '',
        order_destination_lng: '',
        order_destination_lat: '',
        order_at: this.timeNow(),
        user_mobile: '',
        user_realname: '',
        group_id: '',
        source_id: '1',
        remark: '',
        driver_id: [],
        driver_num: '1'
      },
      mileage: '0',
      mileage_time: '0',
      distance: 9,
      map: '',
      start_list: [],
      start_enable: false,
      end_list: [],
      end_enable: false,
      driver_list: [],
      listLoading: false,
      submit_disabled: false,
      company: null,
      plugin: [{
        pName: 'Scale'
      }, {
        pName: 'ToolBar',
        position: 'RB'
      }],
      events: {
        init: (o) => {
          self.map = o
          const contextMenu = new AMap.ContextMenu()
          contextMenu.addItem('设为起点', function(e) {
            self.markStart()
          }, 0)

          contextMenu.addItem('设置为终点', function() {
            self.markEnd()
          }, 1)
          this.map.on('rightclick', function(e) {
            contextMenu.open(self.map, e.lnglat)
            self.ContextMenuPositon = e.lnglat
          })
        },
        click: (e) => {
        }
      },
      lng: 0,
      lat: 0,
      order_source: [],
      group_id: '',
      rules: {
        user_mobile: [{ required: true, message: '请输入客户手机', trigger: 'blur' }],
        driver_num: [{ required: true, message: '请输入司机人数', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.getOrderSource()
    this.getCenter()

    // todo 追加订单
    this.group_id = this.$route.params && this.$route.params.group_id
    if (this.group_id) {
      this.getOrderDetail()
    }

    var mobile = this.$route.query && this.$route.query.mobile
    if (mobile) {
      this.temp.user_mobile = mobile
    }
  },
  methods: {
    timeNow() {
      return moment().format('YYYY-MM-DD HH:mm:ss')
    },
    // 起点地址搜索
    startSearch() {
      var keywords = this.temp.order_address
      // this.start_list = []
      if (keywords) {
        var autoComplete = new AMap.Autocomplete({
          city: this.company.city
        })
        const that = this
        autoComplete.search(keywords, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            var _list = []
            var tips = result.tips
            var item
            for (item in tips) {
              if (tips[item]['location']) {
                _list.push(tips[item])
              }
            }
            that.start_list = _list

            // 打开检索列表
            that.start_enable = true
            that.end_enable = false
          }
        })
      } else {
        this.start_list = []
        this.start_enable = false
      }
    },
    endSearch() {
      var keywords = this.temp.order_destination_address
      if (keywords) {
        var autoComplete = new AMap.Autocomplete({
          city: this.company.city
        })
        const that = this
        autoComplete.search(keywords, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            var _list = []
            var tips = result.tips
            var item
            for (item in tips) {
              if (tips[item]['location']) {
                _list.push(tips[item])
              }
            }
            that.end_list = _list
            // 打开检索列表
            that.end_enable = true
            that.start_enable = false
          }
        })
      } else {
        this.end_list = []
        this.end_enable = false
      }
    },
    markStart() {
      const startIcon = new AMap.Icon({
        // 图标尺寸
        size: new AMap.Size(25, 34),
        // 图标的取图地址
        image: mark,
        // 图标所用图片大小
        imageSize: new AMap.Size(135, 40),
        // 图标取图偏移量
        imageOffset: new AMap.Pixel(-9, -3)
      })

      this.start_marker.position = [this.ContextMenuPositon.lng, this.ContextMenuPositon.lat]
      this.start_marker.icon = startIcon
      this.zoom = 13
      this.center = this.start_marker.position
      this.temp.order_lat = this.ContextMenuPositon.lat
      this.temp.order_lng = this.ContextMenuPositon.lng
      this.drivingSearch(this.map)
      // 关闭检索列表
      this.start_enable = false
      // 推荐司机列表
      this.getDriver()

      // 获取地址
      var geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: 'all'
      })
      const that = this
      geocoder.getAddress(this.start_marker.position, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.regeocode) {
            that.temp.order_address = result.regeocode.aois.length > 0 ? result.regeocode.aois[0].name : result.regeocode.formattedAddress
            // that.temp.order_address = result.regeocode.formattedAddress
            // that.$nextTick()
          }
        }
      })
    },
    markEnd() {
      if (this.ContextMenuPositon.lng) {
        const endIcon = new AMap.Icon({
          size: new AMap.Size(25, 34),
          image: mark,
          imageSize: new AMap.Size(135, 40),
          imageOffset: new AMap.Pixel(-95, -3)
        })
        this.end_marker.position = [this.ContextMenuPositon.lng, this.ContextMenuPositon.lat]
        this.end_marker.icon = endIcon
        this.zoom = 14
        this.center = this.end_marker.position
        this.temp.order_destination_lat = this.ContextMenuPositon.lat
        this.temp.order_destination_lng = this.ContextMenuPositon.lng
        this.drivingSearch(this.map)
        // 关闭检索列表
        this.end_enable = false
        // 获取地址
        var geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: 'all'
        })
        const that = this
        geocoder.getAddress(this.end_marker.position, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            if (result && result.regeocode) {
              that.temp.order_destination_address = result.regeocode.aois.length > 0 ? result.regeocode.aois[0].name : result.regeocode.formattedAddress
              // that.temp.order_destination_address = result.regeocode.formattedAddress
              // that.$nextTick()
            }
          }
        })
      }
    },
    drivingSearch(map) {
      if (this.start_marker.position.length > 0 && this.end_marker.position.length > 0) {
        if (this.driving) {
          this.driving.clear()
        }
        this.driving = new AMap.Driving({
          map: map,
          // extensions: 'all',
          hideMarkers: true
          // panel: 'panel'
        })
        // 根据起终点经纬度规划驾车导航路线
        var a = new AMap.LngLat(this.start_marker.position[0], this.start_marker.position[1])
        var b = new AMap.LngLat(this.end_marker.position[0], this.end_marker.position[1])
        const that = this
        this.driving.search(a, b, function(status, result) {
          // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
          if (status === 'complete') {
            that.mileage = (result.routes[0].distance / 1000).toFixed(2)
            that.mileage_time = Math.ceil(result.routes[0].time / 60)
            // that.tolls = result.routes[0].tolls
            // console.log('绘制驾车路线完成')
          } else {
            that.$notify({
              title: '错误',
              message: '获取驾车数据失败：' + result,
              type: 'error',
              duration: 2000
            })
            console.log('获取驾车数据失败：' + result)
          }
        })
      }
    },
    setStart(row) {
      this.ContextMenuPositon = row.location
      this.markStart()
    },
    setEnd(row) {
      this.ContextMenuPositon = row.location
      this.markEnd()
    },
    getDriver() {
      this.circle.radius = this.distance * 1000
      this.zoom = distanceZoom[this.distance]
      if (this.distance && this.temp.order_lng && this.temp.order_lat) {
        this.listLoading = true

        getDriverNearby({ distance: this.distance, lng: this.temp.order_lng, lat: this.temp.order_lat, status: [10] }).then(response => {
          this.driver_list = response.data
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
      }
    },
    changeDistance() {
      this.getDriver()
    },
    handleSelectionChange(val) {
      this.temp.driver_id = val
    },
    getOrderSource() {
      getParameterItem('ORDER_SOURCE').then(response => {
        this.order_source = response.data
      })
    },
    getCenter() {
      getCompanyInfo().then(response => {
        this.company = response.data
        this.center = [this.company.lng, this.company.lat]
      })
    },
    closeWindow() {
      var userAgent = navigator.userAgent
      if (userAgent.indexOf('Firefox') !== -1 || userAgent.indexOf('Chrome') !== -1) {
        window.open('', '_self').close()
      } else {
        window.opener = null
        window.open('about:blank', '_self')
        window.close()
      }
    },
    onSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.submit_disabled = true
          postOrder(this.temp).then(response => {
            if (response) {
              this.closeWindow()
            }
            setTimeout(() => {
              this.submit_disabled = false
            }, 0.5 * 1000)
          })
        }
      })
    },
    getOrderDetail() {
      getOrderDetail(this.group_id).then(response => {
        const data = response.data
        this.temp.source_id = data.source_id
        this.temp.order_lat = data.order_lat
        this.temp.order_lng = data.order_lng
        this.temp.order_address = data.order_address
        this.temp.order_destination_lng = data.order_destination_lng
        this.temp.order_destination_lat = data.order_destination_lat
        this.temp.order_destination_address = data.order_destination_address
        this.temp.user_mobile = data.user_mobile
        this.temp.user_realname = data.user_realname
        this.temp.group_id = this.group_id
        this.ContextMenuPositon.lng = this.temp.order_lng
        this.ContextMenuPositon.lat = this.temp.order_lat
        this.markStart()
        this.ContextMenuPositon.lng = this.temp.order_destination_lng
        this.ContextMenuPositon.lat = this.temp.order_destination_lat
        this.markEnd()
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
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .amap-page-container{
    width: 100%;
    height: 100%;
  }
  .start_div{
    top: 65px;
    left: 1px;
    width:298px;
    position: absolute;
    z-index: 9;
    border-radius: .25rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
  }
  .end_div{
    top: 110px;
    left: 1px;
    width:298px;
    position: absolute;
    z-index: 10;
    border-radius: .25rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
  }
  .driver_div{
    top: 0px;
    left: 310px;
    width:300px;
    position: absolute;
    border-radius: .25rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
  }
  .clearfix {
    font-size: 14px;
  }
  .district{
    font-size: 12px;
    color: #999999
  }
  .label{
    .el-form-item__label{
      font-size: 12px;
      font-weight: normal;
    }
  }

  .info {
    font-size: 12px;
    /*padding: .75rem 1.25rem;*/
    margin-bottom: 1rem;
    /*border-radius: .25rem;*/
    position: fixed;
    top: 1rem;
    /*background-color: white;*/
    width: auto;
    /*min-width: 22rem;*/
    border-width: 0;
    left: 1rem;
    /*box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);*/
    .address /deep/ {
      input {
        font-size: 12px;
        padding-right: 40px;
        resize: none;
        border: none;
        border-radius: 0px;
        border-bottom: 1px solid #eeeeee;
      }
    }
  }
</style>
