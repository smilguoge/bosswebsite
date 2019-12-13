<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in coupon_rule_status" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
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
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center" width="150">
        <template slot-scope="scope">
          <span>
            {{ scope.row.name }}
            <el-tooltip :content="scope.row.status == '1'?'使用中':'已失效'" placement="top">
              <svg-icon :icon-class="scope.row.status == '1'?'enabled':'disabled'"/>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="类型 " align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="抵扣(元)" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣(%)" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.discount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效时间" align="center" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.start_at }} {{ scope.row.end_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="限领取人使用" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.is_share === '1' ? '否' :'是' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="适用来源 " align="center" width="200">
        <template slot-scope="scope">
          <el-tag
            v-for="tag in scope.row.source_name"
            :key="tag"
            class="el-tagbox">
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="生成券类型" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.build_type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总数量" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.total_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已使用" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.used_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已失效" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.invalid_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === '2'" type="warning" @click="handleCoupon(scope.row)">查看已生成优惠券</el-button>
          <el-dropdown v-else split-button type="primary">
            <span class="el-dropdown-link" @click="handleBuild(scope.row)">
              生成优惠券
            </span>
            <el-dropdown-menu slot="dropdown">
              <span @click="handleInvalid(scope.row)">
                <el-dropdown-item>失效</el-dropdown-item>
              </span>
              <span @click="handleCoupon(scope.row)">
                <el-dropdown-item >查看已生成优惠券</el-dropdown-item>
              </span>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" width="800px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 650px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="类型" prop="type_id">
          <el-radio-group v-model="temp.type_id">
            <el-radio v-for="item in coupon_rule_type" :key="item.key" :label="item.key" >
              {{ item.value }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.type_id === 'discount'" label="折扣率" prop="discount">
          <el-input v-model="temp.discount" placeholder="请输入折扣率">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="temp.type_id === 'money'" label="抵扣" prop="money">
          <el-input v-model="temp.money" placeholder="请输入抵扣金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="有效时间" prop="valid_at">
          <el-date-picker
            v-model="temp.valid_at"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            class="filter-item-date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            align="right"/>
        </el-form-item>
        <el-form-item label="共享使用" prop="is_share">
          <el-switch
            v-model="temp.is_share"
            active-value="1"
            inactive-value="0"/>
          <i class="el-icon-info"/> 默认开启 ，关闭分享，只能领取人可以使用该优惠码
        </el-form-item>
        <el-form-item label="适用来源" prop="source_ids">
          <el-checkbox-group v-model="temp.source_ids">
            <el-checkbox v-for="item in order_source" :key="item.key" :label="item.key" >
              {{ item.value }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="生成券类型" prop="build_type">
          <el-radio-group v-model="temp.build_type">
            <el-radio v-for="item in coupon_build_type" :key="item.key" :label="item.key" :value="item.key">
              {{ item.value }}{{ item.note?'('+item.note+')':'' }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button :disabled="submit_disabled" type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogBuildVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" title="生成优惠券" width="800px">
      <el-form ref="buildForm" :rules="build_rules" :model="build_temp" label-position="right" label-width="100px" style="width: 750px;">
        <el-row v-if="temp.build_type === 'direct'">
          <el-form-item label="生成数量" prop="num">
            <el-input-number v-model="build_temp.num" :min="1" :max="200" label="最多一次只能生成200张券" />
            <i class="el-icon-info"/>最多一次只能生成200张券
          </el-form-item>
        </el-row>
        <el-row v-if="temp.build_type === 'put'">
          <el-card shadow="never">
            <el-form-item label="客户来源" prop="source_ids">
              <el-checkbox-group v-model="build_temp.source_id" :disabled="edit_disabled">
                <el-checkbox v-for="item in order_source" :key="item.key" :label="item.key" >
                  {{ item.value }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="客户订单数">
              <el-input v-model="build_temp.gte_order_num" :disabled="edit_disabled" placeholder="请输入订单数" style="width: 200px">
                <template slot="prepend">大于等于</template>
              </el-input>
              and
              <el-input v-model="build_temp.lte_order_num" :disabled="edit_disabled" placeholder="请输入订单数" style="width: 200px">
                <template slot="prepend">小于等于</template>
              </el-input>
            </el-form-item>
            <el-form-item label="客户注册时间">
              <el-date-picker
                v-model="build_temp.created_at"
                :default-time="['00:00:00', '23:59:59']"
                :disabled="edit_disabled"
                value-format="yyyy-MM-dd HH:mm:ss"
                class="filter-item-date"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
                align="right"/>
            </el-form-item>
            <el-form-item label="最后下单时间">
              <el-date-picker
                v-model="build_temp.last_at"
                :default-time="['00:00:00', '23:59:59']"
                :disabled="edit_disabled"
                value-format="yyyy-MM-dd HH:mm:ss"
                class="filter-item-date"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
                align="right"/>
            </el-form-item>
            <el-form-item label="生成投放对象">
              <el-button :disabled="edit_disabled" type="primary" class="filter-item" @click="handleUser">生成投放对象</el-button>
            </el-form-item>
            <el-form-item label="投放人数">
              {{ user_total > 0 ? user_total : temp.total_count }}
            </el-form-item>
          </el-card>
          <el-row style="margin-top: 30px">
            <el-form-item label="投放时间" prop="put_time">
              <el-button type="primary" class="filter-item" icon="el-icon-plus" @click="addItem">新增</el-button>
            </el-form-item>
            <el-form-item v-for="(item,index) in build_temp.put_time" :key="index" label=" " >
              <el-date-picker
                v-model="item.put_at"
                :picker-options="pickerOptions"
                :disabled="item.is_put !== '0'"
                default-time="12:00:00"
                value-format="yyyy-MM-dd HH:mm"
                type="datetime"
                placeholder="选择投放时间"/>
              <el-button v-if="item.is_put === '0'" type="danger" icon="el-icon-delete" circle @click="deleteItem(index)" />
            </el-form-item>
          </el-row>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBuildVisible = false">取消</el-button>
        <el-button :disabled="submit_disabled" type="primary" @click="buildCoupon()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogCouponVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" title="优惠券列表" width="900px">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="优惠券列表" name="couponList">
          <div class="filter-container">
            <el-input v-model="coupon_listQuery.code" clearable style="width: 150px;" class="filter-item" placeholder="优惠码" @keyup.enter.native="handleCouponFilter"/>
            <el-select v-model="coupon_listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
              <el-option v-for="item in coupon_status" :key="item.key" :label="item.value" :value="item.key"/>
            </el-select>
            <el-date-picker
              v-model="coupon_listQuery.created_at"
              :default-time="['00:00:00', '23:59:59']"
              value-format="yyyy-MM-dd HH:mm:ss"
              class="filter-item-date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"/>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleCouponFilter">搜索</el-button>
            <el-button v-if="temp.build_type === 'direct'" :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-document" @click="handleDownload">导出</el-button>
          </div>
          <el-table
            v-loading="coupon_listLoading"
            :key="coupon_tableKey"
            :data="coupon_list"
            border
            highlight-current-row
            style="width: 100%;">
            <el-table-column label="ID" prop="id" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="优惠码 " align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.code }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态 " align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.status_name }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="temp.build_type === 'put'" label="接收手机" align="center" >
              <template slot-scope="scope">
                <span>{{ scope.row.mobile }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间 " align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.created_at }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作 " align="center">
              <template slot-scope="scope">
                <el-button v-if="scope.row.status === '1'" type="primary" @click="handleCouponInvalid(scope.row)">失效</el-button>
                <el-button v-else :disabled="true" >失效</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="coupon_total>0" :total="coupon_total" :page.sync="coupon_listQuery.page" :limit.sync="coupon_listQuery.limit" @pagination="getCouponList" />
        </el-tab-pane>
        <el-tab-pane v-if="temp.build_type === 'put'" label="投放时间">
          <el-table
            v-loading="put_time_listLoading"
            :key="put_time_tableKey"
            :data="put_time_list"
            border
            highlight-current-row
            style="width: 100%;">
            <el-table-column label="ID" prop="id" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="投放时间 " align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.put_at }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态 " align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.put_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="本次投放数量 " align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.put_count }}</span>
              </template>
            </el-table-column>
            <el-table-column label="已发送数量 " align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.send_count }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane v-if="temp.build_type === 'put'" label="投放条件">
          <el-form :model="build_temp" label-position="right" label-width="100px" style="width: 750px;">
            <el-form-item label="客户来源" prop="source_ids">
              <el-checkbox-group v-model="build_temp.source_id" :disabled="true">
                <el-checkbox v-for="item in order_source" :key="item.key" :label="item.key" >
                  {{ item.value }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="客户订单数">
              <el-input v-model="build_temp.gte_order_num" :disabled="true" placeholder="请输入订单数" style="width: 200px">
                <template slot="prepend">大于等于</template>
              </el-input>
              and
              <el-input v-model="build_temp.lte_order_num" :disabled="true" placeholder="请输入订单数" style="width: 200px">
                <template slot="prepend">小于等于</template>
              </el-input>
            </el-form-item>
            <el-form-item label="客户注册时间">
              <el-date-picker
                v-model="build_temp.created_at"
                :default-time="['00:00:00', '23:59:59']"
                :disabled="true"
                value-format="yyyy-MM-dd HH:mm:ss"
                class="filter-item-date"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
                align="right"/>
            </el-form-item>
            <el-form-item label="最后下单时间">
              <el-date-picker
                v-model="build_temp.last_at"
                :default-time="['00:00:00', '23:59:59']"
                :disabled="true"
                value-format="yyyy-MM-dd HH:mm:ss"
                class="filter-item-date"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
                align="right"/>
            </el-form-item>
            <el-form-item label="投放人数">
              {{ temp.total_count }}
            </el-form-item>
          </el-form>
        </el-tab-pane>

      </el-tabs>
    </el-dialog>
    <el-dialog :visible.sync="dialogUserVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" title="用户列表" width="900px">
      <el-table
        v-loading="user_listLoading"
        :key="user_tableKey"
        :data="user_list"
        border
        highlight-current-row
        style="width: 100%;">
        <el-table-column label="ID" prop="id" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号码 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.realname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单数 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.order_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="来源 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.source_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后下单时间 " align="center" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.last_at }}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册时间 " align="center" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="user_total>0" :total="user_total" :page.sync="user_listQuery.page" :limit.sync="user_listQuery.limit" @pagination="getUserList" />
    </el-dialog>
  </div>
</template>

<script>
import { getCouponList, postCouponInvalid, getCouponRuleList, postCouponRuleInvalid, postCouponRuleBuild, postCouponRule, getCouponPlist, getCouponRulePutTime } from '@/api/coupon'
import { getUserList } from '@/api/user'
import { getParameterItem } from '@/api/parameter'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const statusOptions = [
  { key: '0', display_name: '禁用' },
  { key: '1', display_name: '启用' }
]

export default {
  name: 'CouponRule',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      coupon_tableKey: 0,
      list: null,
      coupon_list: null,
      total: 0,
      coupon_total: 0,
      user_tableKey: 0,
      user_list: null,
      user_total: 0,
      put_time_list: [],
      put_time_tableKey: 0,
      put_time_listLoading: false,
      user_listLoading: true,
      submit_disabled: false,
      edit_disabled: false,
      downloadLoading: false,
      listLoading: true,
      coupon_listLoading: true,
      coupon_rule_type: [],
      coupon_rule_status: [],
      order_source: [],
      coupon_build_type: [],
      coupon_status: [],
      activeName: 'couponList',
      sex: [],
      listQuery: {
        page: 1,
        limit: 20,
        keyword: '',
        status: ''
      },
      coupon_listQuery: {
        page: 1,
        limit: 10,
        rule_id: '',
        code: '',
        created_at: [],
        status: ''
      },
      statusOptions,
      temp: {
        id: undefined,
        source_ids: [],
        name: '',
        type_id: '',
        build_type: '',
        is_share: '1',
        money: '',
        discount: '',
        put_condition: '',
        valid_at: []
      },
      build_temp: {
        id: undefined,
        num: '1',
        source_id: [],
        created_at: [],
        lte_order_num: '',
        gte_order_num: '',
        put_time: [],
        last_at: []
      },
      user_listQuery: {
        page: 1,
        limit: 10,
        source_id: [],
        created_at: [],
        lte_order_num: '',
        gte_order_num: '',
        last_at: []
      },
      dialogFormVisible: false,
      dialogCouponVisible: false,
      dialogBuildVisible: false,
      dialogUserVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        type_id: [{ required: true, message: '类型不能为空', trigger: 'change' }],
        discount: [{ required: true, message: '折扣率不能为空', trigger: 'blur' }],
        money: [{ required: true, message: '抵扣金额不能为空', trigger: 'blur' }],
        valid_at: [{ required: true, message: '有效期不能为空', trigger: 'blur' }],
        source_ids: [{ required: true, message: '来源不能为空', trigger: 'blur' }],
        build_type: [{ required: true, message: '生成优惠券类型不能为空', trigger: 'blur' }]
      },
      build_rules: {
        num: [{ required: true, message: '请输入要生成优惠券数量', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getOrderSource()
    this.getCouponRuleStatus()
    this.getCouponStatus()
    this.getCouponRuleType()
    this.getCouponBuildType()
  },
  methods: {
    addItem() {
      var data = {}
      data.put_at = ''
      data.is_put = '0'
      this.build_temp.put_time.push(data)
    },
    deleteItem(index) {
      this.build_temp.put_time.splice(index, 1)
    },
    getList() {
      this.listLoading = true
      getCouponRuleList(this.listQuery).then(response => {
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
    resetTemp() {
      this.temp = {
        source_ids: [],
        name: '',
        type_id: '',
        build_type: '',
        is_share: '1',
        money: '',
        discount: '',
        put_condition: '',
        valid_at: []
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
          this.submit_disabled = true
          postCouponRule(this.temp).then(response => {
            this.list.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
          setTimeout(() => {
            this.submit_disabled = false
          }, 0.5 * 1000)
        }
      })
    },
    getCouponRuleStatus() {
      getParameterItem('COUPON_RULE_STATUS').then(response => {
        this.coupon_rule_status = response.data
      })
    },
    getCouponStatus() {
      getParameterItem('COUPON_STATUS').then(response => {
        this.coupon_status = response.data
      })
    },
    getCouponRuleType() {
      getParameterItem('COUPON_RULE_TYPE').then(response => {
        this.coupon_rule_type = response.data
      })
    },
    getOrderSource() {
      getParameterItem('ORDER_SOURCE').then(response => {
        this.order_source = response.data
      })
    },
    getCouponBuildType() {
      getParameterItem('COUPON_BUILD_TYPE').then(response => {
        this.coupon_build_type = response.data
      })
    },
    handleInvalid(row) {
      this.$confirm('失效后当前规则下所有优惠券都会失效, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postCouponRuleInvalid(row).then(response => {
          const res = response.data
          for (const v of this.list) {
            if (v.id === res.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, res)
              break
            }
          }
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
    handleCouponInvalid(row) {
      this.$confirm('确定失效该优惠券吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postCouponInvalid(row).then(res => {
          if (res) {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            this.getCouponList()
          }
        })
      }).catch(() => {

      })
    },
    handleBuild(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.build_temp = {
        id: row.id,
        num: '1',
        source_id: this.temp.put_condition.hasOwnProperty('source_id') ? this.temp.put_condition.source_id : [],
        created_at: this.temp.put_condition.hasOwnProperty('created_at') ? this.temp.put_condition.created_at : [],
        lte_order_num: this.temp.put_condition.hasOwnProperty('lte_order_num') ? this.temp.put_condition.lte_order_num : '',
        gte_order_num: this.temp.put_condition.hasOwnProperty('gte_order_num') ? this.temp.put_condition.gte_order_num : '',
        put_time: [],
        last_at: this.temp.put_condition.hasOwnProperty('last_at') ? this.temp.put_condition.last_at : []
      }
      this.getPutTime(row.id)
      this.dialogBuildVisible = true
      this.edit_disabled = this.temp.total_count > 0
    },
    handleCoupon(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogCouponVisible = true
      this.activeName = 'couponList'

      this.coupon_listQuery = {
        page: 1,
        limit: 10,
        rule_id: row.id,
        created_at: [],
        code: '',
        status: ''
      }
      this.build_temp = {
        id: row.id,
        source_id: this.temp.put_condition.hasOwnProperty('source_id') ? this.temp.put_condition.source_id : [],
        created_at: this.temp.put_condition.hasOwnProperty('created_at') ? this.temp.put_condition.created_at : [],
        lte_order_num: this.temp.put_condition.hasOwnProperty('lte_order_num') ? this.temp.put_condition.lte_order_num : '',
        gte_order_num: this.temp.put_condition.hasOwnProperty('gte_order_num') ? this.temp.put_condition.gte_order_num : '',
        last_at: this.temp.put_condition.hasOwnProperty('last_at') ? this.temp.put_condition.last_at : []
      }
      this.getCouponList()
      this.getPutTime(row.id)
    },
    getPutTime(rule_id) {
      this.put_time_listLoading = true
      getCouponRulePutTime(rule_id).then(response => {
        this.put_time_list = this.build_temp.put_time = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.put_time_listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleUser() {
      // this.dialogUserVisible = true
      this.build_temp.page = 1
      this.build_temp.limit = 10
      this.getUserList()
    },
    getUserList() {
      this.user_listLoading = true
      getUserList(this.build_temp).then(response => {
        this.user_list = response.data.list
        this.user_total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.user_listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleCouponFilter() {
      this.coupon_listQuery.page = 1
      this.getCouponList()
    },
    getCouponList() {
      this.coupon_listLoading = true
      getCouponList(this.coupon_listQuery).then(response => {
        this.coupon_list = response.data.list
        this.coupon_total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.coupon_listLoading = false
        }, 0.5 * 1000)
      })
    },
    buildCoupon() {
      this.$refs['buildForm'].validate((valid) => {
        if (valid) {
          this.submit_disabled = true
          postCouponRuleBuild(this.build_temp).then(response => {
            const res = response.data
            for (const v of this.list) {
              if (v.id === res.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, res)
                break
              }
            }
            this.dialogBuildVisible = false
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          })
          setTimeout(() => {
            this.submit_disabled = false
          }, 0.5 * 1000)
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const header = ['id', '优惠码', '状态', '创建时间']
        const filterVal = [
          'id',
          'code',
          'status_name',
          'created_at'
        ]
        getCouponPlist(this.coupon_listQuery).then(response => {
          const list = response.data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: header,
            filename: '优惠码',
            autoWidth: true,
            data
          })
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      var res = jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
      return res
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

  .el-tagbox.el-tag{margin-left:10px}
</style>

