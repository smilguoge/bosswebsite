<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="150px" >
      <el-tabs type="card">
        <el-tab-pane label="基础设置" >
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="自动消单时间" prop="canceltime">
                <el-input v-model="temp.basic_set.canceltime" placeholder="请输入名称">
                  <template slot="append">分钟</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="自动回收时间:" prop="revoketime" >
                <el-input v-model="temp.basic_set.revoketime" placeholder="自动回收时间">
                  <template slot="append">分钟</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="强制冻结时间:" prop="autofreezetime">
                <el-input v-model="temp.basic_set.autofreezetime" placeholder="强制冻结时间">
                  <template slot="append">天</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="强制下线时间:" prop="autoofflinetime" >
                <el-input v-model="temp.basic_set.autoofflinetime" placeholder="建议 10 分钟以上">
                  <template slot="append">分钟</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="微信下单间隔:" prop="weixintime">
                <el-input v-model="temp.basic_set.weixintime" placeholder="强制冻结时间">
                  <template slot="append">分钟</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最低上班金额:" prop="lowestworkvirtual" >
                <el-input v-model="temp.basic_set.lowestworkvirtual" placeholder="最低上班金额">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="大厅提醒司机距离:" prop="paidanremindkm" >
                <el-input v-model="temp.basic_set.paidanremindkm" placeholder="大厅提醒司机距离">
                  <template slot="append">km</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单保险费:" prop="insurancemoney" >
                <el-input v-model="temp.basic_set.insurancemoney" placeholder="公司收取订单保险费用">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="信息费(单笔):" prop="messagemoney" >
                <el-input v-model="temp.basic_set.messagemoney" placeholder="信息费(单笔)">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="小程序代叫奖励:" prop="call_pay" >
                <el-input v-model="temp.basic_set.call_pay" placeholder="小程序代叫奖励">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="开启自动回收:" prop="">
                <el-switch
                  v-model="temp.basic_set.isrecovery"
                  active-value="1"
                  inactive-value="0"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开启自动消单:" prop="">
                <el-switch
                  v-model="temp.basic_set.eliminate"
                  active-value="1"
                  inactive-value="0"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="开启保险短信:" prop="">
                <el-switch
                  v-model="temp.basic_set.sendinsurancesms"
                  active-value="1"
                  inactive-value="0"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开启结束短信:" prop="">
                <el-switch
                  v-model="temp.basic_set.sendendsms"
                  active-value="1"
                  inactive-value="0"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="16">
              <el-form-item label="有效上班开始时间:" prop="">
                <el-time-picker
                  v-model="temp.basic_set.workstarttime"
                  value-format="HH:mm"
                  format="HH:mm"
                  size="medium"
                  placeholder="选择时间"/>--
                <el-time-picker
                  v-model="temp.basic_set.workendtime"
                  value-format="HH:mm"
                  format="HH:mm"
                  size="medium"
                  placeholder="选择时间"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="开启加倍:" prop="" >
                <el-switch
                  v-model="temp.basic_set.israin"
                  active-value="1"
                  inactive-value="0"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item v-if="temp.basic_set.israin === '1'" label="价格倍数:" prop="" >
                <el-input-number v-model="temp.basic_set.israinmultiple" :precision="2" :step="0.1" :max="10"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item v-if="temp.basic_set.israin === '1'" label="加倍原因:" prop="israinreason" >
                <el-input v-model="temp.basic_set.israinreason" placeholder="雨天、雪天、节假日"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="APP设置">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="允许服务人员加价:" prop="">
                <el-switch
                  v-model="temp.app_set.canaddprice"
                  active-value="1"
                  inactive-value="0"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="允许服务人员转单:" prop="">
                <el-switch
                  v-model="temp.app_set.canchangeorder"
                  active-value="1"
                  inactive-value="0"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="允许服务人员消单:" prop="">
                <el-switch
                  v-model="temp.app_set.caneliminateorder"
                  active-value="1"
                  inactive-value="0"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="附近服务人员距离:" prop="">
                <el-input-number v-model="temp.app_set.colleaguedistance" :precision="2" :step="0.1" :max="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="显示真实姓名:" prop="">
                <el-switch
                  v-model="temp.app_set.colleaguerealname"
                  active-value="1"
                  inactive-value="0"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-alert
                :closable="false"
                title="设置服务人员端显示多少公里范围内的服务人员，0不显示"
                show-icon
                type="info"/>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="派单设置">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="推荐本公司司机距离:" prop="paidankm">
                <el-input v-model="temp.dispatch_set.paidankm" placeholder="推荐本公司司机距离">
                  <template slot="append">km</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="推荐联盟司机距离:" prop="paidanunionkm" >
                <el-input v-model="temp.dispatch_set.paidanunionkm" placeholder="推荐联盟司机距离">
                  <template slot="append">km</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="司机全职/兼职 距离:" prop="paidanfullkm">
                <el-input v-model="temp.dispatch_set.paidanfullkm" placeholder="司机全职/兼职 距离">
                  <template slot="append">km</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="代驾自动派单:" prop="">
                <el-switch
                  v-model="temp.dispatch_set.isautomatic"
                  active-value="1"
                  inactive-value="0"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="星级司机优先派单:" prop="">
                <el-switch
                  v-model="temp.dispatch_set.starfirst"
                  active-value="1"
                  inactive-value="0"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item v-if="temp.dispatch_set.starfirst === '1'" label="星级公里数:" prop="" >
                <el-input-number v-model="temp.dispatch_set.starfirstkm" :precision="2" :step="0.1" :max="10"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <el-form-item label="" prop="">
        <el-button type="primary" @click="updateData">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCompanySetup, postCompanySetup } from '@/api/company'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import PanThumb from '@/components/PanThumb'

export default {
  name: 'CompanySetup',
  components: { PanThumb, Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      driverLoading: false,
      temp: {
        id: undefined,
        basic_set: {
          canceltime: '0',
          revoketime: '0',
          autofreezetime: '0',
          autoofflinetime: '0',
          weixintime: '0',
          lowestworkvirtual: '0',
          paidanremindkm: '0',
          insurancemoney: '0',
          isrecovery: '1',
          eliminate: '1',
          workstarttime: '',
          workendtime: '',
          israin: '0',
          israinmultiple: '1',
          israinreason: '',
          sendendsms: '0',
          sendinsurancesms: '0',
          call_pay: '0',
          messagemoney: '0'
        },
        app_set: {
          canaddprice: '0',
          canchangeorder: '1',
          colleaguedistance: '5.00',
          caneliminateorder: '1'
        },
        dispatch_set: {
          paidankm: '0',
          paidanunionkm: '0',
          isautomatic: '0',
          starfirst: '0',
          starfirstkm: '0.1',
          paidanfullkm: '0'
        }
      },
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: '状态不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getDetil()
  },
  methods: {
    getDetil() {
      this.listLoading = true
      getCompanySetup(this.listQuery).then(response => {
        this.temp = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postCompanySetup(this.temp).then(response => {
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          postCompanySetup(tempData).then(response => {
            this.temp = response.data
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
    }
  }
}
</script>
