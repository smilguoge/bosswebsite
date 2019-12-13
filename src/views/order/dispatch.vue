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
        :events="start_marker.events"/>
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
        v-for="(driver, index) in driver_list"
        :key="index"
        :position="[driver.lng,driver.lat]"
        :draggable="true"
        :events="driver.events"
        anchor="bottom-center"
        cursor="pointer">
        <div :class="'tool-staff-marker driver-marker-status-'+driver.status">
          <div class="tool-staff-marker-name">{{ driver.realname }}</div>
          <span class="tool-staff-marker-corner" />
        </div>
      </el-amap-marker>
      <el-amap-info-window
        v-if="window"
        :is-custom="true"
        :position="window.position"
        :visible="window.visible"
        :content="window.content"
        :offset="window.offset"/>
    </el-amap>
    <div class="info">
      <div v-if="driver_status_count.length > 0" class="status_div">
        <el-radio-group v-if="system === '1'" v-model="union" @change="changeUnion">
          <el-radio-button label="0" >公司</el-radio-button>
          <el-radio-button label="1" >全国</el-radio-button>
        </el-radio-group>
        <el-checkbox-group v-model="driver_status" @change="changeDriverStatus">
          <el-checkbox v-for="item in driver_status_count" :key="item.status" :label="item.status" :value="item.status" >
            <span :class="'fontsize12 font-status-'+item.status">
              {{ item.status_name }}({{ item.count }})
            </span>
          </el-checkbox>
        </el-checkbox-group>
        <div style="margin-top: 10px;">
          <el-button type="primary" plain @click="traffficHandle">查看路况</el-button>
        </div>
      </div>

      <el-card class="order_div">
        <div slot="header" style="font-weight: bold">
          <span @click=" showOrder = showOrder==true?false:true">新订单 <i :class="showOrder==true?'el-icon-arrow-up':'el-icon-arrow-down'"/></span>
          <el-link :underline="false" style="float: right; padding: 3px;font-size: 16px" @click="handleFilter">
            <svg-icon icon-class="refresh"/>
          </el-link>
        </div>
        <div v-show=" showOrder==true " class="text item">
          <el-table
            v-loading="listLoading"
            :data="order_list"
            :stripe="true"
            size="small"
            height="400"
            @row-click="handleOrderRow">
            <el-table-column label="预约地址">
              <template slot-scope="scope">
                <span>{{ scope.row.order_address }}</span>
              </template>
            </el-table-column>
            <el-table-column label="预约时间" width="70">
              <template slot-scope="scope" >
                <span>{{ scope.row.order_at.split(" ")[1] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="客户姓名" width="80">
              <template slot-scope="scope" >
                <span>{{ scope.row.user_realname }}</span>
              </template>
            </el-table-column>
          </el-table>

          <pagination v-show="order_total>0" :total="order_total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" layout="total, prev, pager, next" small style="padding: 10px 16px" @pagination="getList" />
        </div>
      </el-card>
      <div v-if="freeDriverVisible === true" class="driver_div">
        <el-row style="font-size: 12px;line-height: 30px; border-bottom: 1px solid #EEE;padding: 20px;">
          <el-col :span="12">
            <span class="color888"><svg-icon icon-class="order_id"/> 单号:</span> {{ order.id }}
          </el-col>
          <el-col :span="12">
            <span class="color888"><svg-icon icon-class="time"/> 时间:</span>  {{ order.order_at }}
          </el-col>
          <el-col :span="12">
            <span class="color888"> <svg-icon icon-class="customer"/> 姓名:</span> {{ order.user_realname }}
          </el-col>
          <el-col :span="12">
            <span class="color888"><svg-icon icon-class="tel"/> 电话:</span> {{ order.user_mobile }}
          </el-col>
          <el-col :span="24">
            <span class="color888"> <svg-icon icon-class="start_mini"/> 起点:</span> {{ order.order_address }}
          </el-col>
          <el-col :span="24">
            <span class="color888"><svg-icon icon-class="end_mini"/> 终点:</span> {{ order.order_destination_address }}
          </el-col>
        </el-row>
        <div class="block" style="font-size: 12px;border-bottom: 1px solid #EEE;padding: 10px;">
          <el-input
            v-model="driver_keyword"
            clearable
            size="mini"
            style="width: 155px"
            placeholder="司机工号/姓名/手机"/>
          <span class="demonstration"> 搜索范围( {{ distance }} km )</span>
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
          v-loading="free_listLoading"
          :data="free_driver_list.filter(data => !driver_keyword || data.realname.toLowerCase().includes(driver_keyword.toLowerCase()) || data.username.toLowerCase().includes(driver_keyword.toLowerCase()) || data.mobile.toLowerCase().includes(driver_keyword.toLowerCase()))"
          :stripe="true"
          size="small"
          height="300"
          width="100%">
          <el-table-column label="操作" fixed align="center" width="80">
            <template slot-scope="scope">
              <span> <el-button :disabled="submit_disabled" class="filter-item" type="primary" size="mini" @click="postPatch(order.id, scope.row.id)">派单</el-button></span>
            </template>
          </el-table-column>
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
          <el-table-column label="公司">
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
        <div style="line-height: 50px; float: right; padding-right: 20px;">
          <el-button size="mini" @click="freeDriverVisible = false">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Vue from 'vue'
// import VueAMap from 'vue-amap'
// Vue.use(VueAMap)
// VueAMap.initAMapApiLoader({
//   key: 'b6f6175fda66c5c2a1bda1fc73d08e7e',
//   plugin: ['AMap.Autocomplete', 'AMap.MouseTool', 'AMap.Driving', 'AMap.RangingTool', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.Geocoder', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geolocation'],
//   // 默认高德 sdk 版本为 1.4.4
//   v: '1.4.4'
// })
import { postOrderPatch, getOrderList } from '@/api/order'
import { getDriverNearby, getDriverPlist, getDriverStatusCount } from '@/api/driver'
import { getCompanyInfo } from '@/api/company'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import AMap from 'AMap'
import mark from '@/assets/dir-marker.png'
import avatar from '@/assets/avatar.png'
import mqtt from 'mqtt'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { MQTT_USERNAME, MQTT_PASSWORD } from '@/utils/mqtt.js'

const distanceZoom = {
  '3': '14',
  '6': '13',
  '9': '13',
  '12': '12',
  '15': '12'
}

export default {
  name: 'OrderDispatch',
  components: { Pagination },
  data() {
    const self = this
    return {
      start_marker: {
        position: [],
        icon: ''
      },
      driving: '',
      zoom: 13,
      center: [118.105964, 24.493929],
      address: '',
      circle: {
        center: [],
        radius: 5000,
        strokeColor: '#3366FF',
        strokeWeight: 1,
        fillOpacity: 0.2,
        fillColor: '#3366FF'
      },
      mileage: '0',
      mileage_time: '0',
      distance: 9,
      map: '',
      driver_list: [],
      order_list: [],
      windows_list: [],
      order_total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        status: '0'
      },
      free_driver_list: [],
      free_listLoading: false,
      freeDriverVisible: false,
      showOrder: true,
      order: {
        id: '',
        user_realname: '',
        user_mobile: '',
        order_at: '',
        order_lng: '',
        order_lat: '',
        order_address: '',
        order_destination_address: ''
      },
      submit_disabled: false,
      company: null,
      timer: null,
      plugin: [{
        pName: 'Scale'
      }
      ],
      // plugin: [{
      //   pName: 'Scale'
      // }, {
      //   pName: 'ToolBar',
      //   position: 'RT'
      // }],
      window: '',
      events: {
        init: (o) => {
          self.map = o
          self.trafficLayer = new AMap.TileLayer.Traffic({
            zIndex: 10
          })
          self.trafficLayer.setMap(self.map)
          self.trafficLayer.hide()
          self.trafffic = ''
        },
        click: (e) => {
        }
      },
      driver_status_count: [],
      driver_status: ['10', '20', '30', '33', '35', '38', '40', '50'],
      driver_keyword: '',
      union: '0',
      map_style: '',
      trafffic: '',
      trafficLayer: '',
      measure: '',
      ruler: '',
      rules: {
        user_mobile: [{ required: true, message: '请输入客户手机', trigger: 'blur' }],
        driver_num: [{ required: true, message: '请输入司机人数', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'company_uuid',
      'system'
    ])
  },
  created() {
    this.$store.state.app.sidebar.opened = false
    this.getCenter()
    this.getList()
    this.handleMqtt()
    this.handleDriver()
    setInterval(() => {
      this.handleDriver()
    }, 30 * 1000)
  },
  methods: {
    handleDriver() {
      this.getDriverStatusCount()
      this.getDriverPList()
    },
    handleMqtt() {
      // todo 接收推送
      const options = {
        connectTimeout: 60000,
        clientId: new Date(),
        username: MQTT_USERNAME,
        password: MQTT_PASSWORD,
        clean: true
      }
      var client = mqtt.connect(process.env.MQTT_SERVICE, options)
      // mqtt连接
      client.on('connect', (e) => {
        // console.log('sub连接成功:', this.company_uuid)
        client.subscribe(this.company_uuid, { qos: 1 }, (error) => {
          if (!error) {
            console.log('sub订阅成功')
          } else {
            console.log('sub订阅失败')
          }
        })
      })
      // 接收消息处理
      client.on('message', (topic, message) => {
        if (message.toString()) {
          // console.log('收到来自', topic, '的消息', message.toString())
          var data = JSON.parse(message.toString())
          if (Object.keys(data).length > 0) {
            if (data.code === 'order') {
              var res = data.data
              for (const v of this.order_list) {
                if (v.id === res.id) {
                  const index = this.order_list.indexOf(v)
                  this.order_list.splice(index, 1)
                  break
                }
              }
              this.order_list.unshift(data.data)
              // this.handleFilter()
            }
          }
        }
      })
      // 断开发起重连
      client.on('reconnect', (error) => {
        console.log('正在重连:', error)
      })
      // 链接异常处理
      client.on('error', (error) => {
        console.log('连接失败:', error)
      })
    },
    traffficHandle() {
      // todo  实时路况图层
      if (this.trafffic === '1') {
        this.trafficLayer.hide()
        this.trafffic = ''
      } else {
        this.trafficLayer.show()
        this.trafffic = '1'
      }
    },
    getDriverPList() {
      getDriverPlist({ status: this.driver_status, union: this.union }).then(response => {
        this.driver_list = response.data
        this.getWindowInfo()
      })
    },
    getWindowInfo() {
      const self = this
      this.windows_list = []
      this.driver_list.forEach((item, index) => {
        self.windows_list.push({
          offset: [0, -40],
          position: [item.lng, item.lat],
          content: `<div class="bottom-center amap-info-contentContainer"><div class="driver-info-window">
                <div class="driver-info-window-img">
                  <img src="${item.avatar_url ? item.avatar_url : avatar}" alt="${item.realname}">
                </div>
                <p class="driver-info-window-name">${item.realname}</p>
                <div class="driver-info-window-content">
                  <span class="info-window-title">今日完成</span>
                  <span>${item.today_completed_count}单</span>
                </div>
                <div class="driver-info-window-content">
                  <span class="info-window-title">本月完成</span>
                  <span>${item.month_completed_count}单</span>
                </div>
                <div class="driver-info-window-content">
                  <span class="info-window-title">所属公司</span>
                  <span>${item.company_name}</span>
                </div>
                <div class="driver-info-window-content">
                  <span class="info-window-title">司机工号</span>
                  <span>${item.username}</span>
                </div>
                <div class="driver-info-window-content">
                  <span class="info-window-title">司机电话</span>
                  <span>${item.mobile}</span>
                </div>
                <div class="driver-info-window-content">
                  <span class="info-window-title">定位时间</span>
                  <span>${item.location_at ? moment(item.location_at).format('MM-DD HH:mm') : '-'}</span>
                </div>
              </div></div>`,
          visible: false
        })
        item.events = {
          mouseover() {
            self.window = self.windows_list[index]
            self.$nextTick(() => {
              self.window.visible = true
            })
          },
          mouseout() {
            self.window = self.windows_list[index]
            self.$nextTick(() => {
              self.window.visible = false
            })
          }
        }
      })
    },
    changeDriverStatus(value) {
      this.getDriverPList()
    },
    changeUnion() {
      if (this.union === '1') {
        this.timer = setTimeout(() => {
          this.union = '0'
        }, 1000 * 5 * 60)
      } else {
        clearTimeout(this.timer)
      }
      this.handleDriver()
    },
    getList() {
      this.listLoading = true
      getOrderList(this.listQuery).then(response => {
        this.order_list = response.data.list
        this.order_total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleOrderRow(val) {
      this.order = val
      this.markStart()
      this.freeDriverVisible = true
    },
    getDriver() {
      this.circle.radius = this.distance * 1000
      this.zoom = distanceZoom[this.distance]
      if (this.distance && this.order.order_lng && this.order.order_lat) {
        this.free_listLoading = true

        getDriverNearby({ distance: this.distance, lng: this.order.order_lng, lat: this.order.order_lat, status: [10] }).then(response => {
          this.free_driver_list = response.data
          // Just to simulate the time of the request
          setTimeout(() => {
            this.free_listLoading = false
          }, 0.5 * 1000)
        })
      }
    },
    changeDistance() {
      this.getDriver()
    },
    // 起点地址搜索
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

      this.start_marker.position = [this.order.order_lng, this.order.order_lat]
      this.start_marker.icon = startIcon
      this.center = this.start_marker.position

      this.getDriver()
    },
    getDriverStatusCount() {
      getDriverStatusCount().then(response => {
        this.driver_status_count = response.data
      })
    },
    getCenter() {
      getCompanyInfo().then(response => {
        this.company = response.data
        this.center = [this.company.lng, this.company.lat]
      })
    },
    postPatch(order_id, driver_id) {
      this.submit_disabled = true
      postOrderPatch({ order_id: order_id, driver_id: driver_id }).then(response => {
        if (response) {
          this.freeDriverVisible = false

          for (const v of this.order_list) {
            if (v.id === order_id) {
              const index = this.order_list.indexOf(v)
              this.order_list.splice(index, 1)
              break
            }
          }
          // this.getList()
          // this.$nextTick(() => {
          //   this.getDriverStatusCount()
          //   this.getDriverPList()
          // })
          this.start_marker.position = []
          this.start_marker.icon = ''

          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        }
        setTimeout(() => {
          this.submit_disabled = false
        }, 0.5 * 1000)
      })
    }
  }
}
</script>
<style>

  .driver-info-window {
    width: 183px;
    height: 300px;
    background-color: #fff;
    border-radius: 6px;
    box-sizing: border-box;
    padding-top: 19px
  }

  .driver-info-window .driver-info-window-img {
    width: 64px;
    height: 64px;
    /*background-color: #ccc;*/
    margin: 0 auto 9px;
    border-radius: 50%
  }

  .driver-info-window .driver-info-window-img img {
    width: 100%;
    height: 100%;
    border-radius: 50%
  }

  .driver-info-window .driver-info-window-name {
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    color: #222;
    text-align: center;
    margin-bottom: 32px
  }

  .driver-info-window .driver-info-window-content {
    padding: 0 16px;
    margin-bottom: 8px;
    display: -ms-flexbox;
    display: flex
  }

  .driver-info-window .driver-info-window-content span {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 16px;
    color: #666;
    -ms-flex-negative: 0;
    flex-shrink: 0
  }

  .driver-info-window .driver-info-window-content .info-window-title {
    margin-right: 30px
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .amap-page-container{
    width: 100%;
    height: 95vh;
  }
  .fontsize12{
    font-size: 12px;
  }
  .color888{
    color: #888888;
  }
  .status_div{
    background-color: #fff;
    border-radius: 25px;
    padding: 10px 0px 10px 15px;
    /*-webkit-box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.15);*/
    /*box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.15);*/
    position: absolute;
    width: 140px;
    top: 100px;
    /*left: 420px;*/
    right: 30px;
    z-index: 9;
  }
  .order_div{
    top: 50px;
    left: 50px;
    width:400px;
    position: absolute;
    z-index: 10;
    border-radius: .25rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
  }
  .driver_div{
    top: 50px;
    left: 470px;
    width:500px;
    background-color: #ffffff;
    position: absolute;
    border-radius: .25rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
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
    /*font-size: 12px;*/
    /*padding: .75rem 1.25rem;*/
    /*margin-bottom: 1rem;*/
    /*border-radius: .25rem;*/
    position: fixed;
    top: 1rem;
    /*background-color: white;*/
    width: 100%;
    /*min-width: 22rem;*/
    /*border-width: 0;*/
    left: 1rem;
    /*box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);*/
    /*.address /deep/ {*/
    /*  input {*/
    /*    font-size: 12px;*/
    /*    padding-right: 40px;*/
    /*    resize: none;*/
    /*    border: none;*/
    /*    border-radius: 0px;*/
    /*    border-bottom: 1px solid #eeeeee;*/
    /*  }*/
    /*}*/
  }
</style>
