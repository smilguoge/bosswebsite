<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable style="width: 200px;" class="filter-item" placeholder="用户名/手机/姓名" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.enable" placeholder="是否禁用" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in driver_status" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.job_type" placeholder="职位类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in job_type" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.insure" placeholder="保险类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in insure_type" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>
      <el-date-picker
        v-model="listQuery.hiredate"
        :default-time="['00:00:00', '23:59:59']"
        value-format="yyyy-MM-dd HH:mm:ss"
        class="filter-item-date"
        type="datetimerange"
        range-separator="至"
        start-placeholder="入职开始日期"
        end-placeholder="入职结束日期"
        align="right"/>
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
      <el-table-column label="ID" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工号" align="center" width="150">
        <template slot-scope="scope">
          <span>
            {{ scope.row.username }}
            <el-tooltip :content="scope.row.enable == '1'?'启用':'禁用'" placement="top">
              <svg-icon :icon-class="scope.row.enable == '1'?'enabled':'disabled'"/>
            </el-tooltip>
            <el-tooltip v-if="scope.row.commission == '1'" content="提成" placement="top">
              <svg-icon icon-class="commission"/>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.realname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职位类型 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.job_type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保险类型 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.insure_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="本月在线时长 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.month_online_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间 " align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary" size="mini">
            <span class="el-dropdown-link" @click="handleUpdate(scope.row)">
              编辑
            </span>
            <el-dropdown-menu slot="dropdown">
              <span @click="handleOnlineTime(scope.row)">
                <el-dropdown-item >在线记录</el-dropdown-item>
              </span>
              <el-dropdown-item>
                <router-link :to="{name:'DriverRecharge', params:{driver_id: scope.row.id}}">
                  资金流水
                </router-link>
              </el-dropdown-item>
              <span @click="handleDelete(scope.row)">
                <el-dropdown-item>设备解绑</el-dropdown-item>
              </span>
              <span @click="handleFrozen(scope.row)">
                <el-dropdown-item >{{ scope.row.enable=='1'?'冻结':'解冻' }}</el-dropdown-item>
              </span>
              <span @click="handleOffwork(scope.row)">
                <el-dropdown-item>强制下班</el-dropdown-item>
              </span>
              <span @click="handlePass(scope.row)">
                <el-dropdown-item>修改密码</el-dropdown-item>
              </span>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" width="1000px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 850px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="头像">
              <el-input v-model="temp.avatar_id" type="hidden"/>
              <pan-thumb :image="temp.avatar_url"/>
              <el-button type="primary" icon="upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">上传头像</el-button>
              <image-cropper
                v-show="imagecropperShow"
                :width="100"
                :height="100"
                :key="imagecropperKey"
                :url="upload_url"
                field="file"
                lang-type="zh"
                @close="close"
                @crop-upload-success="cropSuccess"/>
            </el-form-item>
            <el-form-item label="工号" prop="username">
              <el-input v-model="temp.username" :disabled="username_disabled" placeholder="请输入工号 登录账号"/>
            </el-form-item>
            <el-form-item label="真实姓名" prop="realname">
              <el-input v-model="temp.realname" placeholder="请输入真实姓名"/>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="temp.mobile" maxlength="11" placeholder="请输入手机号码"/>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="temp.password" type="password" placeholder="请输入密码，不修改密码，不填即可"/>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select v-model="temp.sex" placeholder="性别" clearable class="filter-item">
                <el-option v-for="item in sex" :key="item.key" :label="item.value" :value="item.key"/>
              </el-select>
            </el-form-item>
            <el-form-item label="职位类型" prop="job_type">
              <el-select v-model="temp.job_type" placeholder="职位类型" clearable class="filter-item">
                <el-option v-for="item in job_type" :key="item.key" :label="item.value" :value="item.key"/>
              </el-select>
            </el-form-item>
            <el-form-item label="保险类型" prop="insure">
              <el-select v-model="temp.insure" placeholder="保险类型" clearable class="filter-item">
                <el-option v-for="item in insure_type" :key="item.key" :label="item.value" :value="item.key"/>
              </el-select>
            </el-form-item>
            <el-form-item label="星级" prop="star">
              <el-select v-model="temp.star" placeholder="星级" clearable class="filter-item">
                <el-option v-for="item in driver_star" :key="item.key" :label="item.value" :value="item.key"/>
              </el-select>
            </el-form-item>
            <el-form-item label="入职时间" prop="hiredate">
              <el-date-picker
                v-model="temp.hiredate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"/>
            </el-form-item>
            <el-form-item label="推荐人" prop="">
              <el-select
                v-if="dialogStatus==='create'"
                v-model="temp.introducer_id"
                :remote-method="searchDriver"
                :loading="driverLoading"
                filterable
                clearable
                remote
                reserve-keyword
                placeholder="输入推荐人用户名/手机/姓名">
                <el-option
                  v-for="item in driverOptions"
                  :key="item.id"
                  :label="item.realname"
                  :value="item.id" >
                  {{ item.realname }} / {{ item.mobile }} / {{ item.username }}
                </el-option>
              </el-select>
              <el-input v-else v-model="temp.introducer_name" :disabled="true" placeholder=""/>
            </el-form-item>

            <el-form-item label="紧急联系人" prop="emergency_contact">
              <el-input v-model="temp.emergency_contact" placeholder="请输入紧急联系人"/>
            </el-form-item>
            <el-form-item label="紧急电话" prop="emergency_phone">
              <el-input v-model="temp.emergency_phone" maxlength="11" placeholder="请输入紧急联系电话"/>
            </el-form-item>
            <el-form-item label="籍贯" prop="native_place">
              <el-input v-model="temp.native_place" placeholder="请输入籍贯"/>
            </el-form-item>
            <el-form-item label="住址" prop="address">
              <el-input v-model="temp.address" placeholder="请输入住址"/>
            </el-form-item>
            <el-form-item label="提成" prop="commission">
              <el-switch
                v-model="temp.commission"
                active-value="1"
                inactive-value="0"/>
            </el-form-item>
            <el-form-item label="启用" prop="enable">
              <el-switch
                v-model="temp.enable"
                active-value="1"
                inactive-value="0"/>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark" type="textarea" placeholder="请输入备注"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证正面" prop="card_front_id">
              <Upload
                v-model="temp.card_front_url"
                @upload-success="cardFrontSuccess"
                @upload-delete="cardFrontDelete"/>
              <input v-model="temp.card_front_id" type="hidden">
            </el-form-item>
            <el-form-item label="身份证反面" prop="card_back_id">
              <Upload
                v-model="temp.card_back_url"
                @upload-success="cardBackSuccess"
                @upload-delete="cardBackDelete"/>
              <input v-model="temp.card_back_id" type="hidden">
            </el-form-item>
            <el-form-item label="驾驶证" prop="license_id">
              <Upload
                v-model="temp.license_url"
                @upload-success="licenseSuccess"
                @upload-delete="licenseDelete"/>
              <input v-model="temp.license_id" type="hidden">
            </el-form-item>
            <el-form-item label="驾照类型" prop="license_type">
              <el-select v-model="temp.license_type" placeholder="驾照类型" clearable class="filter-item">
                <el-option v-for="item in license_type" :key="item.key" :label="item.value" :value="item.key"/>
              </el-select>
            </el-form-item>
            <el-form-item label="领证时间" prop="license_date">
              <el-date-picker
                v-model="temp.license_date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"/>
            </el-form-item>

            <el-form-item label="支付宝二维码" prop="address">
              <el-image :src=" temp.alipay_qrcode_url" style="width: 200px; font-size: 200px" fit="fill">
                <div slot="error" class="image-slot">
                  <svg-icon icon-class="img" />
                </div>
              </el-image>
            </el-form-item>
            <el-form-item label="微信二维码" prop="address">
              <el-image :src=" temp.wechat_qrcode_url" style="width: 200px; font-size: 200px" fit="fill">
                <div slot="error" class="image-slot">
                  <svg-icon icon-class="img" />
                </div>
              </el-image>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogChangePass" :close-on-press-escape="false" :close-on-click-modal="false" title="修改密码" width="550px">
      <el-form ref="form" :model="temp" :rules="passwordRules" label-width="120px">
        <el-form-item label="新密码" prop="password">
          <el-input v-model="temp.password" type="password" auto-complete="off" placeholder="请输入新密码"/>
        </el-form-item >
        <el-form-item label="确认密码" prop="passwordconfirm">
          <el-input v-model="temp.password_confirmation" type="password" auto-complete="off" placeholder="请输入确认密码"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChangePass = false">取消</el-button>
        <el-button :disabled="submit_disabled" type="primary" @click="onSubmit">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogOnlineTimeVisible" :close-on-press-escape="dialogEsc" :close-on-click-modal="dialogEsc" title="在线记录" width="900px">
      <div class="filter-container">
        <el-date-picker
          v-model="online_time_listQuery.created_at"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          class="filter-item-date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"/>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleOnlineTimeFilter">搜索</el-button>
      </div>
      <el-table
        v-loading="online_time_listLoading"
        :key="online_time_tableKey"
        :data="online_time_list"
        border
        highlight-current-row
        style="width: 100%;">
        <el-table-column label="ID" prop="id" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.start_at }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.end_at }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时长 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.duration_at }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工作时长 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.work_duration_at }}</span>
          </template>
        </el-table-column>
        <el-table-column label="非工作时长 " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.over_duration_at }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="online_time_total>0" :total="online_time_total" :page.sync="online_time_listQuery.page" :limit.sync="online_time_listQuery.limit" @pagination="getOnlineTimeList" />
    </el-dialog>

  </div>
</template>

<script>
import { getDriverList, postDriver, getDriverSearch, postUntying, postFrozen, postOffwork, postChangePassword, getDriverOnlineTime } from '@/api/driver'
import { getParameterItem } from '@/api/parameter'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import Upload from '@/components/Upload'

const statusOptions = [
  { key: '0', display_name: '禁用' },
  { key: '1', display_name: '启用' }
]

export default {
  name: 'DriverOnlineTime',
  components: { ImageCropper, PanThumb, Pagination, Upload },
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
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      submit_disabled: false,
      listLoading: true,
      online_time_tableKey: 0,
      online_time_list: null,
      online_time_total: 0,
      online_time_listLoading: true,
      username_disabled: false,
      driverOptions: [],
      driverLoading: false,
      license_type: [],
      job_type: [],
      driver_status: [],
      insure_type: [],
      driver_star: [],
      sex: [],
      online_time_listQuery: {
        page: 1,
        limit: 20,
        driver_id: '',
        created_at: []
      },
      listQuery: {
        page: 1,
        limit: 20,
        keyword: '',
        enable: '',
        job_type: '',
        insure: '',
        hiredate: '',
        status: ''
      },
      statusOptions,
      temp: {
        id: undefined,
        realname: '',
        avatar_id: '',
        avatar_url: '',
        card_front_id: '',
        card_front_url: '',
        card_back_id: '',
        card_back_url: '',
        license_id: '',
        license_url: '',
        license_type: '',
        license_date: '',
        sex: '',
        job_type: '',
        insure: '',
        star: '',
        hiredate: '',
        emergency_contact: '',
        emergency_phone: '',
        username: '',
        password: '',
        introducer_id: '',
        introducer_name: '',
        native_place: '',
        address: '',
        remark: '',
        alipay_qrcode_url: '',
        wechat_qrcode_url: '',
        commission: '1',
        enable: '1'
      },
      dialogFormVisible: false,
      dialogChangePass: false,
      dialogOnlineTimeVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        enable: [{ required: true, message: '状态不能为空', trigger: 'change' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        job_type: [{ required: true, message: '请选择职位类型', trigger: 'change' }],
        insure: [{ required: true, message: '请选择保险类型', trigger: 'change' }],
        username: [{ required: true, message: '用户名为必填项', trigger: 'blur' }],
        mobile: [{ required: true, message: '手机号码为必填项', trigger: 'blur' }],
        hiredate: [{ required: true, message: '请选择入职时间', trigger: 'blur' }],
        // card_front_id: [{ required: true, message: '请上传身份证正面照', trigger: 'blur' }],
        // card_back_id: [{ required: true, message: '请上传身份证反面照', trigger: 'blur' }],
        // license_id: [{ required: true, message: '请上传驾驶证', trigger: 'blur' }],
        // license_type: [{ required: true, message: '请选择驾照类型', trigger: 'blur' }],
        // license_date: [{ required: true, message: '领证时间为必填项', trigger: 'blur' }],
        emergency_contact: [{ required: true, message: '紧急联系人为必填项', trigger: 'blur' }],
        emergency_phone: [{ required: true, message: '紧急联系电话为必填项', trigger: 'blur' }],
        realname: [{ required: true, message: '真实姓名为必填项', trigger: 'blur' }]
      },
      passwordRules: {
        password: [{ trigger: 'blur', validator: validatePass, name: '新密码' }],
        password_confirm: [{ trigger: 'blur', validator: validatePass, name: '确认密码' }]
      },
      imagecropperShow: false,
      imagecropperKey: 0,
      upload_url: process.env.BASE_API + '/api/file'
    }
  },
  created() {
    this.getList()
    this.getDriverStar()
    this.getInsureType()
    this.getJobType()
    this.getLicenseType()
    this.getDiverStatus()
    this.getSex()
  },
  methods: {
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.temp.avatar_url = resData.url
      this.temp.avatar_id = resData.id
    },
    close() {
      this.imagecropperShow = false
    },
    getList() {
      this.listLoading = true
      getDriverList(this.listQuery).then(response => {
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
    handleOnlineTime(row) {
      this.online_time_listQuery = {
        page: 1,
        limit: 20,
        driver_id: row.id,
        created_at: []
      }
      this.dialogOnlineTimeVisible = true
      this.getOnlineTimeList()
    },
    handleOnlineTimeFilter() {
      this.online_time_listQuery.page = 1
      this.getOnlineTimeList()
    },
    getOnlineTimeList() {
      this.online_time_listLoading = true
      getDriverOnlineTime(this.online_time_listQuery).then(response => {
        this.online_time_list = response.data.list
        this.online_time_total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.online_time_listLoading = false
        }, 0.5 * 1000)
      })
    },
    resetTemp() {
      this.username_disabled = false
      this.temp = {
        id: undefined,
        realname: '',
        avatar_id: '',
        avatar_url: '',
        card_front_id: '',
        card_front_url: '',
        card_back_id: '',
        card_back_url: '',
        license_id: '',
        license_url: '',
        license_type: '',
        license_date: '',
        sex: '',
        job_type: '',
        insure: '',
        star: '',
        hiredate: '',
        emergency_contact: '',
        emergency_phone: '',
        username: '',
        password: '',
        introducer_id: '',
        introducer_name: '',
        native_place: '',
        address: '',
        remark: '',
        alipay_qrcode_url: '',
        wechat_qrcode_url: '',
        commission: '1',
        enable: '1'
      }
      this.driverOptions = []
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
          postDriver(this.temp).then(response => {
            this.list.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            setTimeout(() => {
              this.submit_disabled = false
            }, 0.5 * 1000)
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.username_disabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          this.submit_disabled = true
          postDriver(tempData).then(response => {
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
            setTimeout(() => {
              this.submit_disabled = false
            }, 0.5 * 1000)
          })
        }
      })
    },
    searchDriver(query) {
      if (query !== '') {
        this.driverLoading = true
        getDriverSearch({ keyword: query }).then(response => {
          this.driverOptions = response.data

          setTimeout(() => {
            this.driverLoading = false
          }, 0.5 * 1000)
        })
      } else {
        this.driverOptions = []
      }
    },
    getLicenseType() {
      getParameterItem('LICENSE_TYPE').then(response => {
        this.license_type = response.data
      })
    },
    getJobType() {
      getParameterItem('JOB_TYPE').then(response => {
        this.job_type = response.data
      })
    },
    getDiverStatus() {
      getParameterItem('DRIVER_STATUS').then(response => {
        this.driver_status = response.data
      })
    },
    getInsureType() {
      getParameterItem('INSURE_TYPE').then(response => {
        this.insure_type = response.data
      })
    },
    getDriverStar() {
      getParameterItem('DRIVER_STAR').then(response => {
        this.driver_star = response.data
      })
    },
    getSex() {
      getParameterItem('SEX').then(response => {
        this.sex = response.data
      })
    },
    cardFrontSuccess(resData) {
      this.temp.card_front_url = resData.url
      this.temp.card_front_id = resData.id
    },
    cardFrontDelete() {
      this.temp.card_front_url = ''
      this.temp.card_front_id = ''
    },
    cardBackSuccess(resData) {
      this.temp.card_back_url = resData.url
      this.temp.card_back_id = resData.id
    },
    cardBackDelete() {
      this.temp.card_back_url = ''
      this.temp.card_back_id = ''
    },
    licenseSuccess(resData) {
      this.temp.license_url = resData.url
      this.temp.license_id = resData.id
    },
    licenseDelete() {
      this.temp.license_url = ''
      this.temp.license_id = ''
    },
    handleDelete(row) {
      this.$confirm('此操作将解绑服务人员设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postUntying(row).then(() => {
          this.$notify({
            title: '成功',
            message: '解绑成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      }).catch(() => {

      })
    },
    handleFrozen(row) {
      this.$confirm('此操作将更改服务人员状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postFrozen(row).then(() => {
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
    handleOffwork(row) {
      this.$confirm('此操作将让服务人员强制下班, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postOffwork(row).then(() => {
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
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const passData = Object.assign({}, this.temp)
          postChangePassword(passData).then(response => {
            if (response.code === 200) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.dialogChangePass = false
              this.getList()
            }
          }).catch(err => {
            console.log(err)
          })
        }
        return false
      })
    },
    handlePass(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogChangePass = true
    }
  }
}
</script>
