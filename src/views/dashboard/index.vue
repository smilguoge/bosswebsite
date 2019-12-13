<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="30">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ temp.name }} 您好</span>
          </div>
          <div class="text item">
            当前余额: {{ temp.balance }} 元<el-button style="float: right; padding: 3px 0" type="text" @click="handleRecharge(temp.id)">充值</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="11">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>安卓{{ appurl.version }}版本下载链接</span>
          </div>
          <div class="text item">
            下载地址: {{ appurl.update_url }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogRecharge" title="充值" width="550px">
      <div class="app-container">
        <el-form ref="form" :model="recharge" :rules="rules" label-width="120px">
          <el-input v-model="recharge.company_id" type="hidden" auto-complete="off"/>
          <el-form-item label="充值金额" prop="money">
            <el-input v-model="recharge.money" type="text" auto-complete="off" placeholder="请输入充值金额"/>
          </el-form-item >
          <el-form-item>
            <el-button type="primary" @click="onSubmit">充值</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible"
      title="提示"
      width="20%">
      <span>是否支付成功</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="getdetailMore">支付失败</el-button>
        <el-button type="primary" @click="getdetailMore">支付成功</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCompanyInfo, postRecharge, getAppdownurl } from '@/api/company'
import waves from '@/directive/waves'

import Pagination from '@/components/Pagination'
export default {
  name: 'DashboardAdmin',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      temp: {
        name: '',
        logo_url: ''
      },
      appurl: {
        version: '',
        update_url: ''
      },
      recharge: {
        company_id: undefined,
        money: ''
      },
      rules: {
        money: [{ required: true, message: '金额不能为空', trigger: 'change' }]
      },
      dialogRecharge: false,
      dialogVisible: false,
      dwSafari: '',
      dataObj: '',
      data: []
    }
  },
  created() {
    this.getDetail()
    this.Appdownurl()
  },
  methods: {
    getDetail() {
      this.listLoading = true
      getCompanyInfo(this.listQuery).then(response => {
        this.temp = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)

        if (this.temp.balance < 0) {
          this.$message({
            message: '账户余额不足,请充值',
            type: 'warning'
          })
        }
      })
    },
    Appdownurl() {
      this.listLoading = true
      getAppdownurl(this.listQuery).then(response => {
        this.appurl = response.data
      })
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const passData = Object.assign({}, this.recharge)
          postRecharge(passData).then(response => {
            if (response.code === 200) {
              this.dwSafari = window.open()
              this.dwSafari.document.open()
              this.dataObj = response.data
              this.dwSafari.document.write("<html><head><title></title><meta charset='utf-8'><body>" + this.dataObj + '</body></html>')
              this.dwSafari.document.alipaysubmit.submit()
              this.dwSafari.document.close()
              this.dialogRecharge = false
              this.dialogVisible = true
              this.recharge.money = ''
              // const div = document.createElement('div')
              // div.innerHTML = response.data
              // document.body.appendChild(div)
              // document.forms[0].submit()
            }
          }).catch(err => {
            console.log(err)
            this.$router.push({ name: 'PlatformDeal' })
          })
        }
        return false
      })
    },
    getdetailMore() {
      this.dialogVisible = false
      this.getDetail()
    },
    handleRecharge(row) {
      this.recharge.company_id = row
      this.dialogRecharge = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .iframe {
    position:absolute;left: 0px;
    width: 1000px;
    height: 400px;
  }
.dashboard-editor-container {
  padding: 32px;
  min-height: 100vh;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-img {
      float: left;
      width: 48px;
      height: 48px;
      border-radius:5px
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

</style>
