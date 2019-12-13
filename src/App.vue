<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import mqtt from 'mqtt'
import moment from 'moment'
import { mapGetters } from 'vuex'
import new_msg_mp3 from '@/assets/new_msg.mp3'
import cancel_order_mp3 from '@/assets/cancel_order.mp3'
import empty_mp3 from '@/assets/empty.mp3'
import { MQTT_USERNAME, MQTT_PASSWORD } from '@/utils/mqtt.js'
import { getToken } from '@/utils/auth' // 验权

export default {
  name: 'App',
  data() {
    return {
      new_msg_mp3: empty_mp3 + '?' + moment().format('YYYYMMDDHH'),
      cancel_order_mp3: empty_mp3 + '?' + moment().format('YYYYMMDDHH')
    }
  },
  computed: {
    ...mapGetters([
      'company_uuid'
    ])
  },
  watch: {
    $route(to, from) {
      if (getToken()) {
        // todo 监听余额
        const whiteBalanceList = ['/dashboard']
        if (whiteBalanceList.indexOf(this.$route.path) === -1) {
          this.$store.dispatch('GetCompany').then(res => {
            const balance = res.data.balance
            if (balance <= 0) {
              this.$router.push({ path: '/' })
            }
          }).catch(() => {
          })
        }
      }
    },
    company_uuid: function(val) {
      if (val) {
        this.mqttMSG()
      }
    }
  },
  methods: {
    mqttMSG() {
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
        console.log('连接成功:', this.company_uuid)
        client.subscribe(this.company_uuid, { qos: 1 }, (error) => {
          if (!error) {
            console.log('订阅成功')
          } else {
            console.log('订阅失败')
          }
        })
      })
      // 接收消息处理
      client.on('message', (topic, message) => {
        // console.log('收到来自', topic, '的消息', message.toString())
        if (message.toString()) {
          var data = JSON.parse(message.toString())
          if (Object.keys(data).length > 0) {
            if (data.code === 'order') {
              if (data.event === 'new_order') {
                this.audio = new Audio()
                this.audio.src = new_msg_mp3
                this.audio.play()
              } else if (data.event === 'order_cancel') {
                this.audio = new Audio()
                this.audio.src = cancel_order_mp3
                this.audio.play()
              }
            }
            if (data.type) {
              this.$notify({
                message: data.message,
                type: data.type,
                duration: 5 * 1000
              })
            }
            // console.log(data.type)
          }
          // this.testAutoPlay()
          // this.msg = message.toString()
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
    }
  }
}
</script>
