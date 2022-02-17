<template>
    <div id="reach-calendar-events-container" ref="reachCalendarEventsContainer">
        <div v-for="(day, dayIdx) in selectedDates" :key="dayIdx">
            <div class="reach-calendar-events-day-of-week" v-if="dayHasEvents(day.date)">
                <div class="reach-calendar-event-date-label">{{formatDate(day.date)}}</div>
            </div>
            <div v-for="(event) in activeEventsContainer" :key="event.id">
                <event v-if="event.active && eventBelongsToDay(event, day.date)" :maxHeight="maxHeight" :event="event" :calendars="calendars" :el="event.id"></event>
            </div>
        </div>
    </div>
</template>

<script>
import Event from './Event'
let moment = require('moment')
export default {
  name: 'EventsContainer',
  components: {
    Event
  },
  props: {
    filterText: String,
    viewToday: Boolean,
    msg: String,
    maxHeight: Number,
    calendars: Array,
    activeEventsContainer: Array,
    selectedDates: {
      type: Array,
      default () {
        return []
      }
    },
    monthNames: {
      type: Array
    },
    weekDays: {
      type: Array
    }
  },
  methods: {
    dayHasEvents (day) {
      let dayStart = moment(day)

      let tempStartDay = dayStart.startOf('day').valueOf()
      let tempEndDay = dayStart.endOf('day').valueOf()

      let eventCount = 0

      this.activeEventsContainer.forEach(function (event) {
        let eventStart = moment(event.start_date)
        let eventEnd = moment(event.end_date)

        if (event.all_day === 'true') {
          eventEnd.subtract(1, 'minute')
        }

        if ((eventStart <= tempEndDay && eventEnd >= tempStartDay) && event.active) {
          eventCount++
        }
      })
      return eventCount > 0
    },
    eventBelongsToDay (event, day) {
      let eventStart = moment(event.start_date)
      let eventEnd = moment(event.end_date)

      if (event.all_day === 'true') {
        eventEnd.subtract(1, 'minute')
      }

      let dayOfWeek = moment(day)

      return eventStart <= dayOfWeek.endOf('day') && eventEnd >= dayOfWeek.startOf('day')
    },
    goToday () {
      this.$emit('goToday')
    },
    formatDate (date) {
      return this.weekDays[date.getDay()] + ', ' + this.monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()
    }
  },
  mounted () {
    if (this.viewToday) {
      this.goToday()
    }
  }
}
</script>
<style lang="sass" scoped>
    @import '../css/_variables.sass'
    @import '../css/events-container.sass'
</style>
