<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb />

    <template v-if="device!=='mobile'">
      <el-button size="small" style="float: right;margin: 5px 80px 5px 0px;background: #999999;color:white;">销单量:{{ temporal_data['cancel_nums'] }}</el-button>
      <el-button size="small" style="float: right;margin: 5px 0px 5px 0px;background: #418BCC;color:white;">已完成:{{ temporal_data['completed_nums'] }}</el-button>
      <el-button size="small" style="float: right;margin: 5px 0px 5px 0px;background: #D9534F;;color:white;">执行中:{{ temporal_data['service_nums'] }}</el-button>
      <el-button size="small" style="float: right;margin: 5px 0px 5px 0px;background: #39B3D7;;color:white;">未派单:{{ temporal_data['new_nums'] }}</el-button>
      <el-button size="small" style="float: right;margin: 5px 0px 5px 0px;background: #F0AD4E;color:white;">今日总收入:{{ temporal_data['total_money'] }}</el-button>
      <el-button size="small" style="float: right;margin: 5px 0px 5px 0px;background: #d31c16;color:white;">忙碌人员:{{ temporal_data['driver_service'] }}</el-button>
      <el-button size="small" style="float: right;margin: 5px 0px 5px 0px;background: #47A447;color:white;">空闲人员:{{ temporal_data['driver_free'] }}</el-button>
    </template>
    <template v-else>
      <el-dropdown trigger="click" class="chart-container">
        <span class="el-dropdown-link">
          <svg-icon icon-class="chart"/>
          <i class="el-icon-caret-bottom"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>销单量:{{ temporal_data['cancel_nums'] }}</el-dropdown-item>
          <el-dropdown-item>已完成:{{ temporal_data['completed_nums'] }}</el-dropdown-item>
          <el-dropdown-item>执行中:{{ temporal_data['service_nums'] }}</el-dropdown-item>
          <el-dropdown-item>未派单:{{ temporal_data['new_nums'] }}</el-dropdown-item>
          <el-dropdown-item>今日总收入:{{ temporal_data['total_money'] }}</el-dropdown-item>
          <el-dropdown-item>忙碌人员:{{ temporal_data['driver_service'] }}</el-dropdown-item>
          <el-dropdown-item>空闲人员:{{ temporal_data['driver_free'] }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <el-dropdown class="avatar-container right-menu-item" trigger="click">
      <div class="avatar-wrapper">
        <img v-if="avatar_url" :src="avatar_url" class="user-avatar">
        <svg-icon v-else icon-class="avatar" style="font-size: 40px;"/>

        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <el-dropdown-item disabled>
          <svg-icon icon-class="user" /> {{ realname }}
        </el-dropdown-item>
        <router-link :to="{ name: 'Profile'}" class="inlineBlock">
          <el-dropdown-item>
            个人资料
          </el-dropdown-item>
        </router-link>
        <router-link :to="{ name: 'Password'}" class="inlineBlock">
          <el-dropdown-item>
            修改密码
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTemporalCount } from '@/api/stats'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      temporal_data: []
    }
  },
  computed: {
    ...mapGetters([
      'device',
      'sidebar',
      'realname',
      'avatar_url'
    ])
  },
  created() {
    this.getTemporalCount()
    setInterval(() => {
      this.getTemporalCount()
    }, 30 * 1000)
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    getTemporalCount() {
      getTemporalCount().then(response => {
        this.temporal_data = response.data
        // alert(this.temporal_data['new_num'])
      })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      line-height: initial;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }

  .chart-container {
    height: 50px;
    font-size: 20px;
    display: inline-block;
    position: absolute;
    right: 110px;
    .el-icon-caret-bottom {
      position: absolute;
      right: -20px;
      top: 30px;
      font-size: 12px;
    }
  }
}
</style>

