<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" clearable size="mini" style="width: 180px;" class="filter-item" placeholder="订单id" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.user_keyword" clearable size="mini" style="width: 180px;" class="filter-item" placeholder="下单手机/姓名" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.driver_keyword" clearable size="mini" style="width: 180px;" class="filter-item" placeholder="服务人员手机/姓名" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.status" placeholder="状态" size="mini" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in order_status" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.source_id" placeholder="来源" size="mini" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in order_source" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.is_first" placeholder="是否首单" clearable size="mini" class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.is_share" placeholder="是否外单" clearable size="mini" class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.is_warm" placeholder="是否异常" clearable size="mini" class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-date-picker
        v-model="listQuery.order_at"
        :default-time="['00:00:00', '23:59:59']"
        value-format="yyyy-MM-dd HH:mm:ss"
        class="filter-item-date"
        type="datetimerange"
        range-separator="至"
        start-placeholder="预约开始日期"
        end-placeholder="预约结束日期"
        size="mini"
        align="right"/>
      <el-button v-waves class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <router-link :to="{name:'OrderCreate'}" target="_blank">
        <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-plus">新增</el-button>
      </router-link>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      size="mini"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column fixed="left" label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary" size="medium">
            <span v-if="scope.row.status === '0'" class="el-dropdown-link" @click="handlePatch(scope.row)">
              派单
            </span>
            <span v-else class="el-dropdown-link" @click="handleDetail(scope.row)">
              查看
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link :to="{name:'OrderGroup', params: { group_id: scope.row.id }}" target="_blank">
                  追加
                </router-link>
              </el-dropdown-item>
              <span v-if="scope.row.status === '20' || scope.row.status === '30' || scope.row.status === '33' || scope.row.status === '35'" @click="handleRecover(scope.row)">
                <el-dropdown-item>
                  回收
                </el-dropdown-item>
              </span>
              <span v-if="scope.row.status === '0' || scope.row.status === '20' || scope.row.status === '30' || scope.row.status === '33' || scope.row.status === '35'" @click="handleCancel(scope.row)">
                <el-dropdown-item>销单</el-dropdown-item>
              </span>
              <span v-if="scope.row.status === '40' || scope.row.status === '50'" @click="handleComplate(scope.row)">
                <el-dropdown-item>完工</el-dropdown-item>
              </span>
              <span @click="handleRemark(scope.row)">
                <el-dropdown-item>备注</el-dropdown-item>
              </span>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column fixed="left" label="单号" prop="id" width="145">
        <template slot-scope="scope">
          <span>
            <el-button type="text" size="mini" @click="handleDetail(scope.row)">{{ scope.row.id }}</el-button>
            [{{ scope.row.source_name }}]
            <el-tooltip v-if="scope.row.is_first == '1'" content="首单" placement="top">
              <svg-icon icon-class="is_first" style="font-size: 16px"/>
            </el-tooltip>
            <el-tooltip v-if="scope.row.extension_driver > '0' && scope.row.is_first == '1' " content="司机推荐" placement="top">
              <svg-icon icon-class="is_extension" style="font-size: 16px"/>
            </el-tooltip>
            <el-tooltip v-if="scope.row.is_share == '1'" content="外单" placement="top">
              <svg-icon icon-class="is_share" style="font-size: 16px"/>
            </el-tooltip>
            <el-tooltip v-if="scope.row.is_warm == '1'" content="异常订单" placement="top">
              <svg-icon icon-class="is_warm" style="font-size: 16px"/>
            </el-tooltip>
            <el-tooltip v-if="scope.row.is_group == '1'" content="同单" placement="top">
              <svg-icon icon-class="is_group" style="font-size: 16px"/>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed="left" label="状态" align="center" width="100">
        <template slot-scope="scope">
          <span>
            <el-tag :type="scope.row.node_id | statusFilter" :class="'order-status-'+scope.row.status" effect="dark" size="mini"> {{ scope.row.status_name }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="客户" align="center" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.user_mobile }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="预约时间 " align="center" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.order_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务人员 " align="center" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.driver_mobile }}{{ scope.row.driver_realname }}<span v-if="scope.row.star > 0" style="color: red;">（{{ scope.row.star }}星)</span></span>
        </template>
      </el-table-column>
      <el-table-column label="预约地址 ">
        <template slot-scope="scope">
          <span @click="openaddress(scope.row.order_lng,scope.row.order_lat)">{{ scope.row.order_address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成时间 " align="center" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.settle_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="里程数(km) " align="center" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.mileage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单金额(元) " align="center" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属公司 " align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.company_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务公司 " align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.service_company_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约目的地 ">
        <template slot-scope="scope">
          <span>{{ scope.row.order_destination_address }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogDetailVisible" :before-close="handleClose" :close-on-press-escape="dialogDetailEsc" :close-on-click-modal="dialogDetailEsc" title="详情" width="90%">
      <el-steps :active="order_step.active" align-center>
        <el-step v-for="(item,index) in order_step.list" :key="index" :title="item.name" :description="item.record_at"/>
      </el-steps>
      <el-form ref="abc" :model="temp" size="mini" label-position="right" label-width="120px" >
        <el-row>
          <el-col :span="16">
            <div style="position: relative">
              <el-amap
                :center="track_center"
                :events="events"
                :zoom="14"
                style="height: 700px;"
                vid="trackAmap"
                class="amap-demo">
                <el-amap-marker
                  v-if="lineArr.length > 0"
                  ref="car"
                  :offset="[-26,-13]"
                  :position="car_marker.position"
                  :icon="car_marker.icon"
                  :auto-rotation="true"
                  :angle="car_marker.angle"/>

                <el-amap-polyline
                  v-if="lineArr.length > 0"
                  :path="lineArr"
                  :events="line_events"
                  :show-dir="true"
                  stroke-color="#28F"
                  stroke-weight="6"/>
                <el-amap-polygon
                  v-for="(item, index) in fenlist"
                  :key="index"
                  :ref="`polygon_${index}`"
                  :path="item.path"
                  stroke-color="#FF0000"
                  stroke-weight="2"
                  stroke-opacity="0.6"
                  fill-opacity="0.4"
                  fill-color="#AAAAAA"/>
              </el-amap>

              <div style="position:absolute;top: 20px;left: 10px;">
                <el-button v-if="lineArr.length > 0" type="warning" size="mini" @click="startAnimation">开始回放</el-button>
                <el-button v-if="lineArr.length > 0" size="mini" @click="resetAnimation">重置</el-button>
                <el-button type="primary" size="mini" @click="measureDistance">测距</el-button>
              </div>
              <div v-if="track_info !== null" class="info">
                <div class="info_header">轨迹详情</div>
                <div class="info_body">
                  <p>经度 : {{ track_info.location.split(',')[0] }}</p>
                  <p>纬度 : {{ track_info.location.split(',')[1] }}</p>
                  <p>定位时间 : {{ track_info.locatetime | timeFormatFilter }}</p>
                  <p>速度 : {{ track_info.speed }} km/h</p>
                  <p>类型 : GPS </p>
                  <p>精度 : {{ track_info.accuracy }}</p>
                  <span class="tool-staff-marker-corner" />
                </div>
              </div>
            </div>

          </el-col>
          <el-col :span="8" style="padding-left: 20px">
            <el-tabs style="height: 700px">
              <el-tab-pane label="订单信息">
                <el-form-item label="订单ID">{{ temp.id }}</el-form-item>
                <el-form-item label="创建时间">{{ temp.created_at }}</el-form-item>
                <el-form-item label="代驾地点">{{ temp.order_address }}</el-form-item>
                <el-form-item label="目的地">{{ temp.order_destination_address }}</el-form-item>
                <el-form-item label="预约时间">{{ temp.order_at }}</el-form-item>
                <el-form-item label="实际目的地">{{ temp.destination_address }}</el-form-item>
                <el-form-item label="客户姓名">{{ temp.user_realname }}</el-form-item>
                <el-form-item label="客户电话">{{ temp.user_mobile }}</el-form-item>
                <el-form-item label="所属公司">{{ temp.company_name }}</el-form-item>
                <el-form-item label="服务人员姓名">{{ temp.driver_realname }}</el-form-item>
                <el-form-item label="服务人员电话">{{ temp.driver_mobile }}</el-form-item>
                <el-form-item label="来源">{{ temp.source_name }}</el-form-item>
                <el-form-item label="订单备注">{{ temp.remark }}</el-form-item>
                <el-form-item label="app版本">{{ temp.app_type }} {{ temp.app_version }}</el-form-item>
              </el-tab-pane>
              <el-tab-pane label="付款信息">
                <el-row style="border-bottom: 1px #eeeeee solid;margin-bottom: 10px;">
                  <el-col :span="12">
                    <el-form-item label="里程数">{{ temp.mileage }} km</el-form-item>
                    <el-form-item label="驾驶时间">{{ temp.driving_minute }} 分钟</el-form-item>
                    <el-form-item label="等待时间">{{ temp.waiting_minute }} 分钟</el-form-item>
                    <el-form-item label="支付类型">{{ temp.pay_type_name }}</el-form-item>
                    <el-form-item label="优惠金额">{{ temp.coupon_fee }} 元</el-form-item>
                    <el-form-item label="起步价优惠">{{ temp.first_coupon_fee }} 元</el-form-item>
                    <el-form-item label="首单优惠">{{ temp.first_coupon_fee }} 元</el-form-item>
                    <el-form-item label="围栏跨区">{{ temp.fence_fee }} 元</el-form-item>
                    <el-form-item label="提成">{{ temp.percentage_fee }}</el-form-item>
                    <el-form-item label="加价倍数">{{ temp.markup }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="里程费">{{ temp.driving_fee }} 元</el-form-item>
                    <el-form-item label="时间费">{{ temp.driving_time_fee }} 元</el-form-item>
                    <el-form-item label="等待费">{{ temp.wait_fee }} 元</el-form-item>
                    <el-form-item label="过路费">{{ temp.toll_fee }} 元</el-form-item>
                    <el-form-item label="远程服务费">{{ temp.remote_fee }} 元</el-form-item>
                    <el-form-item label="保险金额">{{ temp.insure_fee }}  元</el-form-item>
                    <el-form-item label="其他费用">{{ temp.other_fee }} 元</el-form-item>
                    <el-form-item label="起步价">{{ temp.start_price }} 元</el-form-item>
                    <el-form-item label="标准收费">{{ temp.standard_money }} 元</el-form-item>
                    <el-form-item label="最低消费">{{ temp.min_cost }} 元</el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="12">&nbsp;</el-col>
                  <el-col :span="12">
                    <el-form-item label="总金额">{{ temp.money }} 元</el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="跟踪记录">
                <el-table
                  v-loading="log_listLoading"
                  :key="log_tableKey"
                  :data="log_list"
                  size="mini"
                  stripe
                  border
                  fit
                  highlight-current-row
                  height="630px">
                  <el-table-column label="时间" width="150" align="center">
                    <template slot-scope="scope">
                      {{ scope.row.created_at }}
                    </template>
                  </el-table-column>
                  <el-table-column label="内容">
                    <template slot-scope="scope">
                      <span>{{ scope.row.content }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作人" width="80" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.operator }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="订单轨迹">
                <el-table
                  v-loading="track_listLoading"
                  :key="track_tableKey"
                  :data="track_list"
                  size="mini"
                  stripe
                  border
                  fit
                  highlight-current-row
                  height="630px"
                  @cell-mouse-enter="showMarker"
                  @cell-mouse-leave="hideMarker">
                  <el-table-column label="定位时间" align="center">
                    <template slot-scope="scope">
                      {{ scope.row.locatetime | timeFormatFilter }}
                    </template>
                  </el-table-column>
                  <el-table-column label="类型" width="100" align="center">
                    <template slot-scope="scope">
                      <span>GPS</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="服务时间">
                <el-table
                  v-loading="driving_time_listLoading"
                  :key="driving_time_tableKey"
                  :data="driving_time_list"
                  size="mini"
                  stripe
                  border
                  fit
                  highlight-current-row
                  height="630px">
                  <el-table-column label="开始时间" width="150" align="center">
                    <template slot-scope="scope">
                      {{ scope.row.start_at }}
                    </template>
                  </el-table-column>
                  <el-table-column label="结束时间" width="150" align="center">
                    <template slot-scope="scope" >
                      <span>{{ scope.row.end_at }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.status_name }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="订单录音">
                <el-table
                  v-loading="sound_listLoading"
                  :key="sound_tableKey"
                  :data="sound_list"
                  size="mini"
                  stripe
                  border
                  fit
                  highlight-current-row
                  height="630px">
                  <el-table-column label="录音文件" align="center" >
                    <template slot-scope="scope">
                      <audio
                        :src="scope.row.url"
                        controls="controls"
                        preload="auto"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="上传时间" width="85" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.created_at }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="拒单日志">
                <el-table
                  v-loading="refuse_log_listLoading"
                  :key="refuse_log_tableKey"
                  :data="refuse_log_list"
                  size="mini"
                  stripe
                  border
                  fit
                  highlight-current-row
                  height="630px">
                  <el-table-column label="拒单时间" width="150" align="center">
                    <template slot-scope="scope">
                      {{ scope.row.created_at }}
                    </template>
                  </el-table-column>
                  <el-table-column label="拒单原因">
                    <template slot-scope="scope">
                      <span>{{ scope.row.reason }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="服务人员" width="100" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.driver_realname }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="dialogPatchVisible" :close-on-press-escape="dialogPatchEsc" :close-on-click-modal="dialogPatchEsc" title="派单" width="90%">
      <el-form :model="temp" size="small" label-position="right" label-width="80px" >
        <el-row >
          <el-col style="width: 70%;height: 800px;">
            <el-amap
              :center="center"
              :zoom="zoom"
              vid="amapDemo"
              class="amap-demo">
              <el-amap-marker
                :position="[temp.order_lng,temp.order_lat]"
                animation ="AMAP_ANIMATION_DROP"/>
              <el-amap-circle
                :center="[temp.order_lng,temp.order_lat]"
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
                anchor="bottom-center"
                cursor="pointer">
                <div :class="'tool-staff-marker driver-marker-status-'+driver.status">
                  <div class="tool-staff-marker-name">{{ driver.realname }}</div>
                  <span class="tool-staff-marker-corner" />
                </div>
              </el-amap-marker>
            </el-amap>
          </el-col>
          <el-col style="width: 30%;padding-left: 20px">
            <h2>客户信息</h2>
            <el-form-item label="客户名称" prop="">
              <el-input v-model="temp.user_mobile" :disabled="true"/>
            </el-form-item>
            <el-form-item label="真实姓名" prop="">
              <el-input v-model="temp.user_realname" :disabled="true"/>
            </el-form-item>
            <el-form-item label="预约地址" prop="">
              <el-input v-model="temp.order_address" :disabled="true" type="textarea" />
            </el-form-item>
            <el-form-item label="预约时间" prop="">
              <el-input v-model="temp.order_at" :disabled="true"/>
            </el-form-item>
            <h2>推荐司机</h2>
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
              v-loading="driverlistLoading"
              :data="driver_list"
              :stripe="true"
              size="small"
              height="300">
              <el-table-column label="操作" fixed width="80">
                <template slot-scope="scope">
                  <span> <el-button class="filter-item" type="primary" size="mini" @click="postPatch(temp.id, scope.row.id)">派单</el-button></span>
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
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="dialogRemarkVisible" :close-on-press-escape="dialogRemarkEsc" :close-on-click-modal="dialogRemarkEsc" title="订单备注" width="500px">
      <el-form ref="remarkForm" :rules="remarkRules" :model="remarkTemp" label-position="right" label-width="80px" >
        <el-form-item label="备注" prop="remark">
          <el-input v-model="remarkTemp.remark" :autosize="{ minRows: 4, maxRows: 10}" type="textarea"/>
        </el-form-item>
        <el-form-item label="已有备注" prop="">
          {{ temp.remark }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRemarkVisible = false">取消</el-button>
        <el-button type="primary" @click="postRemark">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogCancelVisible" :close-on-press-escape="dialogCancelEsc" :close-on-click-modal="dialogCancelEsc" title="销单" width="500px">
      <el-form :model="cancelTemp" label-position="right" label-width="80px" >
        <el-form-item label="销单原因">
          <el-row v-for="item in order_cancel" :key="item.key" class="block" >
            <el-radio v-model="cancelTemp.cancel_item" :label="item.key">{{ item.value }}</el-radio>
          </el-row>
          <el-row class="block" >
            <el-radio v-model="cancelTemp.cancel_item" label=" ">其他</el-radio>
          </el-row>
        </el-form-item>
        <el-form-item v-if="cancelTemp.cancel_item ===' '" label="其他原因">
          <el-input v-model="cancelTemp.cancel_reason" :autosize="{ minRows: 4, maxRows: 10}" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCancelVisible = false">取消</el-button>
        <el-button type="primary" @click="postCancel">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogComplateVisible" :close-on-press-escape="dialogComplateEsc" :close-on-click-modal="dialogComplateEsc" title="手动完工" height="100px" width="800px">
      <el-form ref="dataForm" :model="temp" size="small" label-position="right" label-width="120px" >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>订单信息</span>
              </div>
              <div>
                <el-form-item label="订单ID">{{ temp.id }}</el-form-item>
                <el-form-item label="创建时间">{{ temp.created_at }}</el-form-item>
                <el-form-item label="代驾地点">{{ temp.order_address }}</el-form-item>
                <el-form-item label="目的地">{{ temp.order_destination_address }}</el-form-item>
                <el-form-item label="预约时间">{{ temp.order_at }}</el-form-item>
                <el-form-item label="实际目的地">{{ temp.destination_address }}</el-form-item>
                <el-form-item label="客户姓名">{{ temp.user_realname }}</el-form-item>
                <el-form-item label="客户电话">{{ temp.user_mobile }}</el-form-item>
                <el-form-item label="所属公司">{{ temp.company_name }}</el-form-item>
                <el-form-item label="服务人员姓名">{{ temp.driver_realname }}</el-form-item>
                <el-form-item label="服务人员电话">{{ temp.driver_mobile }}</el-form-item>
                <el-form-item label="来源">{{ temp.source_name }}</el-form-item>
                <el-form-item label="订单备注">{{ temp.remark }}</el-form-item>
                <el-form-item label="app版本">{{ temp.app_type }} {{ temp.app_version }}</el-form-item>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>结算信息</span>
              </div>
              <div>
                <el-form-item label="实际目的地" prop="">
                  <el-input v-model="temp.destination_address" type="textarea"/>
                </el-form-item>
                <el-form-item label="结算方式" prop="">
                  <el-select v-model="temp.pay_type" placeholder="结算方式" clearable>
                    <el-option v-for="item in pay_type" :key="item.key" :label="item.value" :value="item.key"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="等待时间" prop="">
                  <el-input v-model="temp.waiting_minute" @change="getMoney">
                    <template slot="append">分钟</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="行驶时间" prop="">
                  <el-input v-model="temp.driving_minute" @change="getMoney">
                    <template slot="append">分钟</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="总里程" prop="">
                  <el-input v-model="temp.mileage" @change="getMoney">
                    <template slot="append">km</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="等待费用" prop="">
                  <el-input v-model="temp.wait_fee" :disabled="true">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="保险金额" prop="">
                  <el-input v-model="temp.insure_fee" @change="getMoney">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="过路费" prop="">
                  <el-input v-model="temp.toll_fee" @change="getMoney">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="远程服务费" prop="">
                  <el-input v-model="temp.remote_fee" :disabled="true">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="其他费用" prop="">
                  <el-input v-model="temp.other_fee" @change="getMoney">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="优惠金额" prop="">
                  <el-input v-model="temp.coupon_fee" @change="getMoney">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="加价倍数" prop="">
                  <el-input-number v-model="temp.markup" :precision="2" :step="0.1" :max="10" @change="getMoney"/>
                </el-form-item>
                <el-form-item label="总金额" prop="">
                  <el-input v-model="temp.money" :disabled="true">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogComplateVisible = false">取消</el-button>
        <el-button type="primary" @click="postComplate">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList, postOrderPatch, postOrderRemark, postOrderCancel, postOrderRecover, getOrderStep, getOrderLog, getOrderTrack, postOrderComplate, getOrderDrivingTime, getOrderRefuseLog, postOrderMoney, getOrderSound } from '@/api/order'
import { getParameterItem } from '@/api/parameter'
import { getDriverNearby } from '@/api/driver'
import { getFencelist } from '@/api/company'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import moment from 'moment'
import AMap from 'AMap'
import car from '@/assets/car.png'
import mqtt from 'mqtt'
import { mapGetters } from 'vuex'
import { MQTT_USERNAME, MQTT_PASSWORD } from '@/utils/mqtt.js'

const statusOptions = [
  { key: '0', display_name: '否' },
  { key: '1', display_name: '是' }
]

const distanceZoom = {
  '3': 14,
  '6': 13,
  '9': 12,
  '12': 12,
  '15': 12
}

export default {
  name: 'Order',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'news': 'success',
        'service': '',
        'pay': 'danger',
        'completed': 'warning',
        'cancel': 'info'
      }
      return statusMap[status]
    },
    substr(str) {
      return '***' + str.substring(str.length - 4)
    },
    timeFormatFilter(time) {
      var day = moment(time)
      return day.format('YYYY-MM-DD HH:mm:ss')
    }
  },
  data() {
    const self = this
    return {
      tableKey: 0,
      list: null,
      total: 0,
      fenlist: null,
      fentotal: 0,
      listLoading: true,
      log_tableKey: 0,
      log_list: null,
      log_listLoading: true,
      driving_time_tableKey: 0,
      driving_time_list: null,
      driving_time_listLoading: true,
      sound_tableKey: 0,
      sound_list: null,
      sound_listLoading: true,
      refuse_log_tableKey: 0,
      refuse_log_list: null,
      refuse_log_listLoading: true,
      track_tableKey: 0,
      track_list: null,
      track_listLoading: true,
      dialogPatchVisible: false,
      dialogPatchEsc: false,
      dialogDetailVisible: false,
      dialogDetailEsc: false,
      dialogRemarkVisible: false,
      dialogRemarkEsc: false,
      dialogCancelVisible: false,
      dialogCancelEsc: false,
      dialogComplateVisible: false,
      dialogComplateEsc: false,
      driverOptions: [],
      driverLoading: false,
      order_source: [],
      order_status: [],
      pay_type: [],
      order_cancel: [],
      order_step: {
        'list': [],
        'active': 1
      },
      car_marker: {
        position: [118.105964, 24.493929],
        icon: new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(52, 26),
          // 图标的取图地址
          image: car
        }),
        angle: '0'
      },
      track_info: null,
      listQuery: {
        page: 1,
        limit: 20,
        order_at: '',
        user_keyword: '',
        driver_keyword: '',
        source_id: '',
        is_first: '',
        is_share: '',
        is_warm: '',
        status: ''
      },
      statusOptions,
      temp: {
        id: undefined,
        created_at: '',
        company_id: '',
        company_name: '',
        service_company_id: '',
        service_company_name: '',
        user_id: '',
        user_mobile: '',
        user_realname: '',
        driver_id: '',
        driver_mobile: '',
        driver_realname: '',
        order_address: '',
        order_lat: '',
        order_lng: '',
        order_destination_address: '',
        order_destination_lng: '',
        order_destination_lat: '',
        destination_address: '',
        destination_lng: '',
        destination_lat: '',
        order_at: '',
        dispatch_at: '',
        accept_at: '',
        goto_order_at: '',
        reach_order_at: '',
        start_driving_at: '',
        reach_at: '',
        settle_at: '',
        complete_at: '',
        status: '',
        status_name: '',
        is_share: '',
        is_first: '',
        is_warm: '',
        is_group: '',
        source_id: '',
        money: '',
        markup: '',
        insure_fee: '',
        coupon_fee: '',
        first_coupon_fee: '',
        start_coupon_fee: '',
        fence_fee: '',
        percentage_fee: '',
        wait_fee: '',
        toll_fee: '',
        remote_fee: '',
        other_fee: '',
        standard_money: '',
        start_price: '',
        min_cost: '',
        driving_fee: '',
        driving_time_fee: '',
        mileage: '',
        pay_type: '',
        pay_type_name: '',
        total_time: '',
        driving_time: '',
        driving_minute: '',
        waiting_time: '',
        waiting_minute: '',
        star: '',
        extension_driver: '',
        comment: '',
        app_type: '',
        app_version: '',
        remark: '',
        source_name: '',
        cancel_reason: ''
      },
      remarkRules: {
        remark: [{ required: true, message: '备注必填项', trigger: 'blur' }]
      },
      remarkTemp: {
        'remark': '',
        'order_id': ''
      },
      cancelTemp: {
        'cancel_item': '',
        'cancel_reason': '',
        'order_id': ''
      },
      distance: '9',
      driver_list: [],
      driverlistLoading: false,
      measure: '',
      ruler: '',
      map: '',
      events: {
        init: (o) => {
          self.map = o
          self.ruler = new AMap.RangingTool(self.map)
        },
        click: (e) => {
        }
      },
      line_events: {
        init: (o) => {
          var passedPolyline = new AMap.Polyline({
            map: self.map,
            strokeColor: '#AF5',
            strokeWeight: 6
          })

          this.$refs['car'].$$getInstance().on('moving', function(e) {
            passedPolyline.setPath(e.passedPath)
          })
        },
        click: (e) => {
        }
      },
      lineArr: [],
      zoom: 13,
      center: [118.105964, 24.493929],
      track_center: [118.105964, 24.493929],
      circle: {
        radius: 5000,
        strokeColor: '#3366FF',
        strokeWeight: 1,
        fillOpacity: 0.2,
        fillColor: '#3366FF'
      }
    }
  },
  computed: {
    ...mapGetters([
      'company_uuid'
    ])
  },
  created() {
    this.getList()
    this.getFenceList()
    this.getOrderSource()
    this.getOrderStatus()
    this.getOrderCancel()
    this.getPayType()
    this.handleMqtt()
  },
  methods: {
    handleMqtt() {
      // todo 接收推送
      const options = {
        // connectTimeout: 40000,
        clientId: new Date(),
        username: MQTT_USERNAME,
        password: MQTT_PASSWORD,
        clean: true
      }
      var client = mqtt.connect(process.env.MQTT_SERVICE, options)
      // mqtt连接
      client.on('connect', (e) => {
        console.log('sub连接成功:', this.company_uuid)
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
          if (Object.keys(data).length > 0 && data.code === 'order') {
            var res = data.data
            if (res) {
              for (const v of this.list) {
                if (v.id === res.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1)
                  break
                }
              }
              this.list.unshift(data.data)
            }
            // this.handleFilter()
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
    getList() {
      this.listLoading = true
      getOrderList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total

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
    resetDriver() {
      this.distance = 9
      this.driver_list = []
      this.zoom = 12
    },
    handlePatch(row) {
      this.resetDriver()
      this.temp = Object.assign({}, row)
      this.dialogPatchVisible = true
      this.center = [this.temp.order_lng, this.temp.order_lat]
      this.$nextTick(() => {
        this.getDriver()
      })
    },
    postPatch(order_id, driver_id) {
      postOrderPatch({ order_id: order_id, driver_id: driver_id }).then(response => {
        if (response) {
          this.dialogPatchVisible = false
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }
      })
    },
    getDriver() {
      this.circle.radius = this.distance * 1000
      this.zoom = distanceZoom[this.distance]
      if (this.distance && this.temp.order_lng && this.temp.order_lat) {
        this.driverlistLoading = true
        getDriverNearby({ distance: this.distance, lng: this.temp.order_lng, lat: this.temp.order_lat, status: [10] }).then(response => {
          this.driver_list = response.data
          // Just to simulate the time of the request
          setTimeout(() => {
            this.driverlistLoading = false
          }, 0.5 * 1000)
        })
      }
    },
    changeDistance() {
      this.getDriver()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        created_at: '',
        company_id: '',
        company_name: '',
        service_company_id: '',
        service_company_name: '',
        user_id: '',
        user_mobile: '',
        user_realname: '',
        driver_id: '',
        driver_mobile: '',
        driver_realname: '',
        order_address: '',
        order_lat: '',
        order_lng: '',
        order_destination_address: '',
        order_destination_lng: '',
        order_destination_lat: '',
        destination_address: '',
        destination_lng: '',
        destination_lat: '',
        order_at: '',
        dispatch_at: '',
        accept_at: '',
        goto_order_at: '',
        reach_order_at: '',
        start_driving_at: '',
        reach_at: '',
        settle_at: '',
        complete_at: '',
        status: '',
        status_name: '',
        is_share: '',
        is_first: '',
        is_warm: '',
        is_group: '',
        source_id: '',
        money: '',
        markup: '',
        insure_fee: '',
        coupon_fee: '',
        first_coupon_fee: '',
        start_coupon_fee: '',
        fence_fee: '',
        percentage_fee: '',
        wait_fee: '',
        toll_fee: '',
        remote_fee: '',
        other_fee: '',
        mileage: '',
        pay_type: '',
        pay_type_name: '',
        total_time: '',
        driving_time: '',
        driving_minute: '',
        waiting_time: '',
        waiting_minute: '',
        star: '',
        extension_driver: '',
        comment: '',
        app_type: '',
        app_version: '',
        remark: '',
        source_name: '',
        cancel_reason: ''
      }
      this.driverOptions = []
    },
    handleDetail(row) {
      // todo 订单详情
      this.track_info = null
      this.track_list = []
      this.lineArr = []
      this.temp = Object.assign({}, row)
      this.track_center = [this.temp.order_lng, this.temp.order_lat]
      this.getOrderStep()
      this.getOrderLog()
      this.getRefuseLog()
      this.getDrivingTime()
      this.getOrderTrack()
      this.getSound()
      this.dialogDetailVisible = true
    },
    getOrderStep() {
      getOrderStep(this.temp.id).then(response => {
        this.order_step = response.data
        this.order_step.active = Number(this.order_step.active)
      })
    },
    getOrderLog() {
      this.log_listLoading = true
      getOrderLog(this.temp.id).then(response => {
        this.log_list = response.data

        // Just to simulate the time of the request
        setTimeout(() => {
          this.log_listLoading = false
        }, 0.5 * 1000)
      })
    },
    getDrivingTime() {
      this.driving_time_listLoading = true
      getOrderDrivingTime(this.temp.id).then(response => {
        this.driving_time_list = response.data

        // Just to simulate the time of the request
        setTimeout(() => {
          this.driving_time_listLoading = false
        }, 0.5 * 1000)
      })
    },
    getRefuseLog() {
      this.refuse_log_listLoading = true
      getOrderRefuseLog(this.temp.id).then(response => {
        this.refuse_log_list = response.data

        // Just to simulate the time of the request
        setTimeout(() => {
          this.refuse_log_listLoading = false
        }, 0.5 * 1000)
      })
    },
    getSound() {
      this.sound_listLoading = true
      getOrderSound(this.temp.id).then(response => {
        this.sound_list = response.data

        // Just to simulate the time of the request
        setTimeout(() => {
          this.sound_listLoading = false
        }, 0.5 * 1000)
      })
    },
    getOrderTrack() {
      this.track_listLoading = true
      getOrderTrack(this.temp.id).then(response => {
        this.track_list = response.data.points
        this.getLineArr()
        this.markCar()
        setTimeout(() => {
          this.track_listLoading = false
        }, 0.5 * 1000)
      })
    },
    getLineArr() {
      for (const item of this.track_list) {
        this.lineArr.push(item.location.split(','))
      }
    },
    markCar() {
      if (this.lineArr.length > 0) {
        const line = this.lineArr[0]
        this.car_marker.position = line.length === 2 ? line : [line.lng, line.lat]
        this.track_center = this.car_marker.position
        this.car_marker.angle = this.track_list[0]['direction']
      }
    },
    startAnimation() {
      // todo 开始
      this.markCar()
      if (this.lineArr.length > 0) {
        this.$refs['car'].$$getInstance().moveAlong(this.lineArr, 800)
      }
    },
    resetAnimation() {
      // todo 重置坐标
      this.markCar()
      if (this.lineArr.length > 0) {
        this.$refs['car'].$$getInstance().stopMove()
      }
    },
    handleClose() {
      this.resetAnimation()
      this.dialogDetailVisible = false
    },
    handleRemark(row) {
      this.temp = Object.assign({}, row)
      this.remarkTemp.order_id = this.temp.id
      this.remarkTemp.remark = ''
      this.dialogRemarkVisible = true
    },
    postRemark() {
      this.$refs['remarkForm'].validate((valid) => {
        if (valid) {
          postOrderRemark(this.remarkTemp).then(response => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, response.data)
                break
              }
            }
            this.dialogRemarkVisible = false
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleCancel(row) {
      this.temp = Object.assign({}, row)
      this.cancelTemp.order_id = this.temp.id
      this.cancelTemp.cancel_item = ''
      this.cancelTemp.cancel_reason = ''
      this.dialogCancelVisible = true
    },
    postCancel() {
      postOrderCancel(this.cancelTemp).then(response => {
        if (response) {
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, response.data)
              break
            }
          }
          this.dialogCancelVisible = false
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    handleComplate(row) {
      this.temp = Object.assign({}, row)
      this.dialogComplateVisible = true
    },
    postComplate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postOrderComplate(this.temp).then(response => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, response.data)
                break
              }
            }
            this.dialogComplateVisible = false
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleRecover(row) {
      this.temp = Object.assign({}, row)
      this.$confirm('您确认回收此订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postOrderRecover(row.id).then(response => {
          if (response) {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, response.data)
                break
              }
            }
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          }
        })
      }).catch(() => {

      })
    },
    showMarker(row) {
      this.track_info = row
      this.track_center = row.location.split(',')
    },
    hideMarker(row) {
      this.track_info = null
    },
    measureDistance() {
      // todo 测距
      if (this.measure === '1') {
        this.ruler.turnOff()
        this.measure = ''
      } else {
        this.ruler.turnOn()
        this.measure = '1'
      }
    },
    getOrderSource() {
      getParameterItem('ORDER_SOURCE').then(response => {
        this.order_source = response.data
      })
    },
    getOrderStatus() {
      getParameterItem('ORDER_STATUS').then(response => {
        this.order_status = response.data
      })
    },
    getPayType() {
      getParameterItem('PAY_TYPE').then(response => {
        this.pay_type = response.data
      })
    },
    getMoney() {
      postOrderMoney({ order_id: this.temp.id, waiting_minute: this.temp.waiting_minute, driving_minute: this.temp.driving_minute, mileage: this.temp.mileage, markup: this.temp.markup }).then(response => {
        this.temp.remote_fee = response.data.remote_fee
        this.temp.wait_fee = response.data.wait_fee
        this.temp.money = response.data.money - Number(this.temp.coupon_fee) + Number(this.temp.toll_fee) + Number(this.temp.other_fee)
      })
    },
    getOrderCancel() {
      getParameterItem('ORDER_CANCEL').then(response => {
        this.order_cancel = response.data
      })
    },
    openaddress(order_lng, order_lat) {
      this.$alert('<img src="https://restapi.amap.com/v3/staticmap?markers=mid,0xFF0000,起:' + order_lng + ',' + order_lat + '&key=0d313d2b50eace9f2012d35d52e4163c&zoom=17&size=400*400">', '订单位置', {
        closeOnClickModal: true,
        dangerouslyUseHTMLString: true
      })
    },
    getFenceList() {
      getFencelist().then(response => {
        this.fenlist = response.data.list
        console.log(this.fenlist)
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .info {
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: #ffffff;
    line-height: 16px;
    margin-left: -110px;
    margin-top: -156px;
    border-radius: .25rem;
    width: 220px;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
    .info_header{
      background-color: #1c8de0;
      color: #ffffff;
      line-height: 30px;
      text-align: center;
      border-radius: 4px 4px 0 0;
    }
    .info_body{
      font-size: 12px;
      padding: 5px;
      p{
        margin: 0px;
      }
    }
  .tool-staff-marker-corner {
    width: 0;
    height: 0;
    display: block;
    position: absolute;
    left: 50%;
    bottom: -20px;
    transform: translate(-50%);
    border: 10px solid #ffffff;
    border-right: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid transparent;
    z-index: 10;
  }
  }
</style>
