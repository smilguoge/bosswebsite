<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="temp" label-position="right" label-width="150px" >
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="首单优惠" name="first">
          <el-form-item label="适用订单:" prop="order_source">
            <el-select v-model="temp.first_discount.order_source" multiple placeholder="请选择" style="width: 400px;">
              <el-option
                v-for="item in ordersource"
                :key="item.key"
                :label="item.value"
                :value="item.key"/>
            </el-select>
          </el-form-item>
          <el-form-item label="优惠金额:" prop="discount_money" style="width: 400px;">
            <el-input v-model="temp.first_discount.discount_money" placeholder="首单优惠金额">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动时间:" prop="discount_money" >
            <el-date-picker
              v-model="temp.first_discount.time"
              type="daterange"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"/>
          </el-form-item>
          <el-form-item label="是否提成:" prop="">
            <el-switch
              v-model="temp.first_discount.isroyalty"
              active-value="1"
              inactive-value="0"/>
          </el-form-item>
          <el-form-item label="扣除保险:" prop="">
            <el-switch
              v-model="temp.first_discount.isinsurance"
              active-value="1"
              inactive-value="0"/>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="起步价优惠" name="second">
          <el-form-item label="首单优惠同时使用:" prop="">
            <el-switch
              v-model="temp.first_discount.is_first"
              active-value="1"
              inactive-value="0"/>
          </el-form-item>
          <el-form-item label="适用订单:" prop="order_source">
            <el-select v-model="temp.start_discount.order_source" multiple placeholder="请选择" style="width: 400px;">
              <el-option
                v-for="item in ordersource"
                :key="item.key"
                :label="item.value"
                :value="item.key"/>
            </el-select>
          </el-form-item>
          <el-form-item label="优惠金额:" prop="discount_money" style="width: 400px;">
            <el-input v-model="temp.start_discount.discount_money" placeholder="首单优惠金额">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动时间:" prop="discount_money" >
            <el-date-picker
              v-model="temp.start_discount.time"
              type="daterange"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"/>
          </el-form-item>
          <el-form-item label="是否提成:" prop="">
            <el-switch
              v-model="temp.start_discount.isroyalty"
              active-value="1"
              inactive-value="0"/>
          </el-form-item>
          <el-form-item label="扣除保险:" prop="">
            <el-switch
              v-model="temp.start_discount.isinsurance"
              active-value="1"
              inactive-value="0"/>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <div class="dialog-footer" style="margin-left:150px;">
        <el-button type="primary" @click="updateData()">
          保存
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getCustomerDiscount, postCustomerDiscount } from '@/api/activity'
import { getParameterItem } from '@/api/parameter'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination, postDriverrecdriveract
import PanThumb from '@/components/PanThumb'
export default {
  name: 'Customeract',
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
        first_discount: {
          order_source: '',
          discount_money: '0',
          start_at: '0',
          end_at: '0',
          isroyalty: '0',
          isinsurance: '0'
        },
        start_discount: {
          is_first: '0',
          order_source: '',
          discount_money: '0',
          start_at: '0',
          end_at: '0',
          isroyalty: '0',
          isinsurance: '0'
        }
      },
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
      getCustomerDiscount(this.listQuery).then(response => {
        this.temp = response.data
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
        first_discount: {
          order_source: '',
          discount_money: '0',
          time: '0',
          isroyalty: '0',
          isinsurance: '0'
        },
        start_discount: {
          is_first: '0',
          order_source: '',
          discount_money: '0',
          time: '0',
          isroyalty: '0',
          isinsurance: '0'
        }
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          postCustomerDiscount(tempData).then(response => {
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
