<template>
    <div id="reach-calendar-view-month-calendar-view">
        <div class="reach-calendar-view-container reach-calendar-view-calendar">
            <div class="reach-calendar-view-header">
                <div class="reach-calendar-view-left-arrow" @click="prevMonth">
                    <svg version="1.1" class="reach-calendar-view-directional-arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                         viewBox="0 0 492 492" style="enable-background:new 0 0 492 492;" xml:space="preserve">
                        <path d="M198.608,246.104L382.664,62.04c5.068-5.056,7.856-11.816,7.856-19.024c0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12
                                    C361.476,2.792,354.712,0,347.504,0s-13.964,2.792-19.028,7.864L109.328,227.008c-5.084,5.08-7.868,11.868-7.848,19.084
                                    c-0.02,7.248,2.76,14.028,7.848,19.112l218.944,218.932c5.064,5.072,11.82,7.864,19.032,7.864c7.208,0,13.964-2.792,19.032-7.864
                                    l16.124-16.12c10.492-10.492,10.492-27.572,0-38.06L198.608,246.104z"></path>
                    </svg>
                </div>
                <div class="reach-calendar-view-month">{{ selectedMonthName }} {{ selectedYear }}</div>
                <div class="reach-calendar-view-right-arrow" @click="nextMonth">
                    <svg version="1.1" class="reach-calendar-view-directional-arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                         viewBox="0 0 492.004 492.004" style="enable-background:new 0 0 492.004 492.004;" xml:space="preserve">
                            <path d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12
                                    c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028
                                    c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265
                                    c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"></path>
                    </svg>
                </div>
            </div>
            <div class="reach-calendar-view-body">
                <div v-for="(day, index) in weekDays" :key="`day-name-${index + 1}`" class="reach-calendar-view-day-name" :title="day">
                    {{ day[0] }}
                </div>
                <div v-for="(day,index) in days" :key="index" class="reach-calendar-view-day-container">
                    <div v-if="day" :class="['reach-calendar-view-day', `reach-calendar-view-day-${day.getDate()}, reach-calendar-view-weekday-${day.getDay()}`, day.toDateString() === today.toDateString() ? 'reach-calendar-view-today' : null]">
                        <div class="reach-calendar-view-date-space">{{ day.getDate() }}</div>
                    </div>
                    <div v-for="(event) in activeEventsContainer" :key="event.id" @click="showEventModal(event)" v-if="event.active && eventBelongsToDay(event, day)" class="reach-calendar-view-month-event-card" :style="{ 'background-color': event.calendarColor, 'color': getContrastColor(event.calendarColor) }">
                        <span class="reach-calendar-view-month-view-event-name">{{event.metadata.name}}</span><br />
                        <span class="reach-calendar-view-month-view-event-time">{{formatDates(event)}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
let moment = require('moment')

export default {
  name: 'Month',
  data () {
    return {
      today: new Date()
    }
  },
  computed: {
    days () {
      let emptyDays = Array((this.startWeekDayOfMonth - this.firstDayOfWeek + 7) % 7).fill(null)
      let days = Array(this.numberOfDays).fill().map((item, index) => new Date(this.selectedYear, this.selectedMonth, index + 1))
      return emptyDays.concat(days)
    },
    startWeekDayOfMonth () {
      return this.date.getFirstWeekdayOfMonth() + 1
    },
    numberOfDays () {
      return this.date.getNumberOfDaysInMonth()
    },
    selectedMonth () {
      return this.date.getMonth()
    },
    selectedMonthName () {
      return this.date.getMonthName()
    },
    selectedYear () {
      return this.date.getFullYear()
    }
  },
  methods: {
    showEventModal (event) {
      this.$emit('showEventModal', event)
    },
    getContrastColor (hexcolor) {
      let r = parseInt(hexcolor.substr(1, 2), 16)
      let g = parseInt(hexcolor.substr(3, 2), 16)
      let b = parseInt(hexcolor.substr(5, 2), 16)
      let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
      return (yiq >= 128) ? 'black' : 'white'
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
    getSelectedMonthAndDisplay () {
      this.$emit('getSelectedMonthAndDisplay')
    },
    generateWeekdayNames (firstDayOfWeek = 1) {
      for (let i = 2; i <= firstDayOfWeek; i++) {
        let first = this.weekDays.shift()
        this.weekDays.push(first)
      }
      return this.weekDays
    },
    prevMonth () {
      this.$emit('prevMonth')
    },
    nextMonth () {
      this.$emit('nextMonth')
    },
    goToday () {
      this.$refs.calendar.goToday()
    },
    formatDates (event) {
      let momentStartDate = moment(event.start_date)
      let momentEndDate = moment(event.end_date)

      if (event.all_day === 'true') {
        momentEndDate.subtract(1, 'minute')
      }
      if (momentStartDate.isSame(momentEndDate, 'day')) {
        return event.all_day === 'true' ? '' : momentStartDate.format('h:mm a') + ' - ' + momentEndDate.format('h:mm a')
      } else {
        return event.all_day === 'true' ? '' : momentStartDate.format('h:mm a')
      }
    }
  },
  props: {
    filterText: String,
    activeEventsContainer: Array,
    weekDays: {
      type: Array,
      default () {
        return []
      }
    },
    initialDate: {
      type: String,
      default: null
    },
    firstDayOfWeek: {
      type: Number,
      default: 1 // 1: Sunday, 2: Monday, etc
    },
    date: {
      type: Date,
      default: new Date()
    }
  },
  beforeMount () {
    this.getSelectedMonthAndDisplay()
  }
}
</script>

<style lang="sass" scoped>
    @import '../css/_variables.sass'
    @import '../css/month-view.sass'
</style>
