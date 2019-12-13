<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="temp" label-position="right" label-width="120px">
      <el-tabs v-model="activeName" type="card" style="margin-left:50px;" @tab-click="handleClick">
        <el-tab-pane label="推荐顾客" name="first">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="开启活动:" prop="is_enable">
                <el-switch
                  v-model="temp.driver_customer.is_enable"
                  active-value="1"
                  inactive-value="0"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="temp.driver_customer.is_enable === '1'" :gutter="30">
            <el-col :span="8">
              <el-form-item label="首单奖励:" prop="first_reward">
                <el-input v-model="temp.driver_customer.first_reward" placeholder="推荐顾客首单奖励金额">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <el-form-item label="以后每单奖励:" prop="next_reward" >
                <el-input v-model="temp.driver_customer.next_reward" placeholder="推荐顾客以后每单奖励金额">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="temp.driver_customer.is_enable==='1'" label="推广渠道:" prop="order_source">
            <el-select v-model="temp.driver_customer.order_source" multiple placeholder="请选择" style="width: 400px;">
              <el-option
                v-for="item in ordersource"
                :key="item.key"
                :label="item.value"
                :value="item.key"/>
            </el-select>
          </el-form-item>
          <el-form-item v-if="temp.driver_customer.is_enable==='1'" label="需要在线:" prop="need_online">
            <el-switch
              v-model="temp.driver_customer.need_online"
              active-value="1"
              active-color="#13ce66"
              active-text="需要在线"
              inactive-text="不需要在线"
              inactive-value="0"/>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="推荐司机" name="second">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="开启活动:" prop="is_enable">
                <el-switch
                  v-model="temp.driver_driver.is_enable"
                  active-value="1"
                  inactive-value="0"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="temp.driver_driver.is_enable==='1'" label="奖励类型" prop="royalty_type">
            <el-radio-group v-model="temp.driver_driver.royalty_type">
              <el-radio v-for="item in royaltyOptions" :key="item.key" :label="item.key">{{
              item.display_name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row v-if="temp.driver_driver.is_enable === '1' && temp.driver_driver.royalty_type==='0'" :gutter="30">
            <el-col :span="8">
              <el-form-item label="一次奖励:" prop="onemoney">
                <el-input v-model="temp.driver_driver.onece_money" placeholder="一次奖励">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            v-if="temp.driver_driver.is_enable==='1' && temp.driver_driver.royalty_type==='1' "
            label="按单奖励"
            prop="royalty_type">
            <el-radio-group v-model="temp.driver_driver.reward_type">
              <el-radio v-for="item in orderOptions" :key="item.key" :label="item.key">{{
              item.display_name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row
            v-if="temp.driver_driver.is_enable=== '1' && temp.driver_driver.royalty_type==='1' && temp.driver_driver.reward_type==='0'"
            :gutter="30">
            <el-col :span="8">
              <el-form-item label="每单奖励:" prop="rewardmoney">
                <el-input v-model="temp.driver_driver.reward_money" placeholder="每单奖励">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-if="temp.driver_driver.is_enable=== '1' && temp.driver_driver.royalty_type==='1' && temp.driver_driver.reward_type==='1'"
            :gutter="30">
            <el-col :span="8">
              <el-form-item label="每单奖励:" prop="rewardpercent">
                <el-input v-model="temp.driver_driver.reward_percent" placeholder="每单奖励">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="temp.driver_driver.is_enable==='1'" label="需要在线:" prop="need_online">
            <el-switch
              v-model="temp.driver_driver.need_online"
              active-value="1"
              inactive-value="0"/>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <div class="dialog-footer" style="margin-left:100px;">
        <el-button type="primary" @click="updateData()">
          保存
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getDriverReward, postDriverReward } from '@/api/activity'
import { getParameterItem } from '@/api/parameter'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination, postDriverrecdriveract
import PanThumb from '@/components/PanThumb'
// eslint-disable-next-line no-unused-vars
const royaltyOptions = [
  { key: '0', display_name: '一次奖励' },
  { key: '1', display_name: '按单奖励' }
]
const orderOptions = [
  { key: '0', display_name: '固定金额' },
  { key: '1', display_name: '比例金额' }
]
export default {
  name: 'Driveract',
  components: { PanThumb, Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      activeName: 'first',
      listLoading: true,
      ordersource: [],
      temp: {
        id: undefined,
        driver_customer: {
          is_enable: '0',
          first_reward: '0',
          next_reward: '0',
          order_source: '',
          need_online: '0'
        },
        driver_driver: {
          is_enable: '0',
          royalty_type: '0',
          need_online: '0',
          onece_money: '',
          reward_type: '0',
          reward_money: '0',
          reward_percent: '0'
        }
      },
      royaltyOptions,
      orderOptions,
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: ''
    }
  },
  created() {
    this.getList()
    this.getOrderSource()
  },
  methods: {
    getList() {
      this.listLoading = true
      getDriverReward(this.listQuery).then(response => {
        this.temp = response.data
        console.log(this.temp)
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleClick(tab, event) {

    },
    resetTemp() {
      this.temp = {
        id: undefined,
        driver_customer: {
          is_enable: '0',
          first_reward: '0',
          next_reward: '0',
          order_source: '',
          need_online: '0'
        },
        driver_driver: {
          is_enable: '0',
          royalty_type: '0',
          need_online: '0',
          onece_money: '',
          reward_type: '0',
          reward_money: '0',
          reward_percent: '0'
        }
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          postDriverReward(tempData).then(response => {
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
    },
    getOrderSource() {
      getParameterItem('ORDER_SOURCE').then(response => {
        this.ordersource = response.data
      })
    }
  }
}
</script>
