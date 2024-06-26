<template>
  <!--Content notifications-->
  <div
    id="drawerNotificationsComponent"
    :style="style"
    >
    <!-- ===== Header ===== -->
    <div class="row col justify-between items-center">
        <label class="text-subtitle1 text-weight-bold">{{ $tr('notification.cms.sidebar.adminGroup') }}</label>
        <div class="tw-flex tw-justify-end tw-content-center tw-gap-x-4">
          <!-- Close icon -->
          <q-btn
            unelevated
            rounded
            dense
            @click="$eventBus.$emit('toggleMasterDrawer', 'notification')"
          >
            <q-icon
              name="fa-light fa-times"
              color="blue-grey"
              size="20px"
              class="cursor-pointer"
            />
          </q-btn>
        </div>

    </div>
    <!--Separator-->
    <q-separator :spaced="'10px'"/>
    <!--Notifications-->
      <!--Notifications List-->
      <div v-for="notification in notificationsData.slice(0, 6)" :key="notification.id">
        <notification-card
          :notification="notification"
          :small-icon="true"
          :source-settings="sourceSettings"
          @read="markAsRead(notification)"
        />
        <q-separator v-if="!lastItem(notification)"/>
      </div>
      <!-- Go to notifications -->
      <q-btn
        unelevated
        rounded
        dense
        outline
        class="full-width q-mt-md"
        no-caps
        color="white"
        text-color="black"
        @click="gotoNotifications()"
        label="Ver todas"
        v-if="!loading"
      />
      <!--Inner loading-->
      <inner-loading :visible="loading"/>
  </div>
</template>

<script>
import services from '@imagina/qnotification/services'
import notificationCard from '@imagina/qnotification/_components/notificationCard.vue'
import markAllAsRead from '@imagina/qnotification/_components/markAllAsRead.vue'

export default {
  beforeDestroy() {
    this.$eventBus.$off('inotification.notifications.new')
  },
  props: {
    isMobile: false
  },
  components: {
    notificationCard, 
    markAllAsRead
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      notifications: [],
      pagination: {
        page: 1,
        perPage: 5,
        lastPage: -1
      },
      sourceSettings: null
    }
  },
  computed: {
    style() {
      return this.isMobile ? 'margin: 0px;' : 'margin: 50px 10px 0px 0px;'
    },
    //Items transformed
    notificationsData() {
      //Default response
      let response = []
      let notifications = this.$clone(this.notifications)

      //Emit badge
      this.$eventBus.$emit('header.badge.manage', {notification: false})

      //Parse notifications
      if (notifications && notifications.length) {
        notifications.forEach(notification => {
          //Instance notification data
          let notificationData = {
            id: notification.id || this.$uid(),
            message: `<b>${notification.title}</b> ${notification.message}`,
            icon: notification.icon || 'fas fa-bell',
            createdAt: notification.createdAt || this.$moment(),
            isRead: notification.isRead || false,
            link: notification.link || false,
            isImportant: (notification.options && notification.options.isImportant) ? notification.options.isImportant : false,
          }

          //Show alert important notification
          if (!notification.isRead && notification.options && notification.options.isImportant) {
            this.$alert.warning({
              mode: 'modal',
              message: notificationData.message,
              icon: notificationData.icon,
              actions: [{
                label: this.$tr('isite.cms.label.ok'),
                color: 'green',
                handler: () => this.handlerActon(notificationData)
              }],
            })
          }

          //Show badge header button
          if (!notification.isRead)
            this.$eventBus.$emit('header.badge.manage', {notification: true})

          //Add notification data to response
          response.push(notification)
        })
      }

      //Response
      return response
    },
  },
  methods: {
    async init() {
      this.listenEvents()
      await this.getSources()
      this.getData()
    },
    //Listen events
    listenEvents() {
      this.$eventBus.$on('inotification.notifications.new', response => {
        //Add notification
        this.notifications.unshift(response)
        //Show alert notification
        this.$alert.info({
          message: `${response.message.substr(0, 30)}...`,
          icon: 'fas fa-bell',
          actions: [{
            label: this.$tr('isite.cms.label.show'),
            color: 'white',
            handler: () => this.$eventBus.$emit('openMasterDrawer', 'notification')
          }],
        })
        //Play sound
        this.$helper.playSound({url: `${this.$store.state.qsiteApp.baseUrl}/modules/notification/audio/sound_notification.mp3`});
      })
    },
    //Get notifications
    getData() {
      return new ((resolve, reject) => {
        this.loading = true

        //Request Params
        let requestParams = {
          refresh: true,
          params: {
            take: this.pagination.perPage,
            page: this.pagination.page,
            filter: {
              me: true,
              type: 'broadcast'
            }
          }
        }
        //get notifications
        services.getNotifications(requestParams).then(response => {
          this.notifications = [...this.notifications, ...response.data]
          this.pagination.lastPage = response.meta.page.lastPage
          this.pagination.page = response.meta.page.currentPage
          this.loading = false
          resolve(response.data)
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            this.loading = false
          })
        })
      })
    },

    gotoNotifications(){
      if(this.$route.name != 'notification.admin.notificationIndex'){
        this.$router.push({name: 'notification.admin.notificationIndex'})
      } 
    },

    getSources(){
      this.loading = true
      services.getSources().then( (sources) => {
        this.sourceSettings = sources
      })
    }, 
    lastItem(notification){
      const last = this.notifications[this.notifications.length - 1]
      return last.id == notification.id
    }, 
    markAsRead(notification){
      this.notifications.find((e) => {
        if(e.id == notification.id){
          e.isRead = true
        }
      })
    }

  }
}
</script>
<style scoped>
  #drawerNotificationsComponent {
    background-color: rgb(255, 255, 255);
    border: 2px solid #e2e2e2;
    border-radius: 8px;
    min-height: 300px;
    height: auto;
    padding: 20px;
    position: fixed;
    top: 0;
    right: 0;
    width: 320px;
    z-index: 2000;
  }
</style>
