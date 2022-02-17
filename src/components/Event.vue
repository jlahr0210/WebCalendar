<template>
    <div v-if="calendarIsSelected(event)" class="reach-calendar-event-card" ref="reachCalendarCardTableContainer">
        <div :class="(isTooTall && collapsed) ? 'reach-calendar-truncate-card-table' : null">
            <div class="reach-calendar-card-table-container">
                <div class="reach-calendar-card-left-color" :style="{ 'background-color': event.calendarColor }" >&nbsp;</div>
                <div class="reach-calendar-event-container">
                    <div v-if="event.metadata.name" class="reach-calendar-event-card-title" :style="{ 'color': event.calendarColor }">
                        {{event.metadata.name}}
                    </div>
                    <div v-if="event.metadata.instructor" class="reach-calendar-event-card-detail">
                        {{event.metadata.instructor}}
                    </div>
                    <div v-if="event.start_date && event.end_date" class="reach-calendar-event-card-detail">
                        {{formatDates(event)}}
                    </div>
                    <div v-if="event.metadata.description" v-html="searchUrls(event.metadata.description)" class="reach-calendar-event-card-detail"></div>
                    <div v-if="event.metadata.location" class="reach-calendar-event-card-detail">
                        {{event.metadata.location}}
                    </div>
                </div>
            </div>
        </div>
        <div class="reach-calendar-card-read-indicator" v-if="isTooTall && collapsed" @click="toggleHeight()">&#x2BC6;</div>
        <div class="reach-calendar-card-read-indicator" v-if="isTooTall && !collapsed" :style="{'top': originalHeight-12 + 'px'}" @click="toggleHeight()">&#x2BC5;</div>
    </div>
</template>

<script>
let moment = require('moment')
export default {
  name: 'Event',
  data: function () {
    return {
      isTooTall: false,
      collapsed: true,
      originalHeight: null
    }
  },
  methods: {
    toggleHeight () {
      this.collapsed = !this.collapsed
    },
    changeHeight () {
      let clientHeight = this.$refs.reachCalendarCardTableContainer ? this.$refs.reachCalendarCardTableContainer.clientHeight : 0
      this.originalHeight = clientHeight
      if (clientHeight > this.maxHeight) {
        this.$data.isTooTall = true
      }
    },
    formatDates (event) {
      let momentStartDate = moment(event.start_date)
      let momentEndDate = moment(event.end_date)

      if (event.all_day === 'true') {
        momentEndDate.subtract(1, 'minute')
      }
      if (momentStartDate.isSame(momentEndDate, 'day')) {
        return event.all_day === 'true' ? momentStartDate.format('dddd, MMMM D') : momentStartDate.format('dddd, MMMM D h:mm a') + ' - ' + momentEndDate.format('h:mm a')
      } else {
        return event.all_day === 'true' ? momentStartDate.format('dddd, MMMM D') + ' - ' + momentEndDate.format('dddd, MMMM D') : momentStartDate.format('dddd, MMMM D h:mm a') + ' - ' + momentEndDate.format('dddd, MMMM D h:mm a')
      }
    },
    searchUrls (text) {
      let urlRegex = /(https?:\/\/[^\s]+)/g
      return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>'
      })
    },
    calendarIsSelected (event) {
      let calSelected = false
      this.calendars.forEach(function (cal) {
        if (cal.id === event.calendarId) {
          calSelected = cal.selected
        }
      })
      return calSelected
    }
  },
  props: {
    maxHeight: Number,
    event: {
      type: Object,
      default () {
        return {}
      }
    },
    calendars: {
      type: Array,
      default () {
        return []
      }
    }
  },
  mounted () {
    this.changeHeight()
  }
}
</script>
<style lang="sass" scoped>
    @import '../css/_variables.sass'
    @import '../css/event.sass'
</style>
