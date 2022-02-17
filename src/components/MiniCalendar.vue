<template>
    <div id="reach-mini-calendar-main-container">
        <div class="reach-mini-calendar reach-mini-calendar-container">
            <div class="reach-mini-calendar-header">
                <div class="reach-mini-calendar-left-arrow" @click="prevMonth">
                    <svg version="1.1" class="reach-mini-calendar-directional-arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                         viewBox="0 0 492 492" style="enable-background:new 0 0 492 492;" xml:space="preserve">
                        <path d="M198.608,246.104L382.664,62.04c5.068-5.056,7.856-11.816,7.856-19.024c0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12
                            C361.476,2.792,354.712,0,347.504,0s-13.964,2.792-19.028,7.864L109.328,227.008c-5.084,5.08-7.868,11.868-7.848,19.084
                            c-0.02,7.248,2.76,14.028,7.848,19.112l218.944,218.932c5.064,5.072,11.82,7.864,19.032,7.864c7.208,0,13.964-2.792,19.032-7.864
                            l16.124-16.12c10.492-10.492,10.492-27.572,0-38.06L198.608,246.104z"></path>
                    </svg>
                </div>
                <div class="reach-mini-calendar-month">{{ selectedMonthName }} {{ selectedYear }}</div>
                <div class="reach-mini-calendar-right-arrow" @click="nextMonth">
                    <svg version="1.1" class="reach-mini-calendar-directional-arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                         viewBox="0 0 492.004 492.004" style="enable-background:new 0 0 492.004 492.004;" xml:space="preserve">
                        <path d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12
                                c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028
                                c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265
                                c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"></path>
                    </svg>
                </div>
            </div>
            <div class="reach-mini-calendar-body">
                <div v-for="(day, index) in weekDays" :key="`day-name-${index + 1}`" class="reach-mini-calendar-day-name" :title="day">
                    {{ day[0] }}
                </div>
                <div v-for="(day,index) in days" :key="index" class="reach-mini-calendar-day-container">
                    <div class="reach-mini-calendar-before" v-if="day">&nbsp;</div>
                    <div v-if="day" :class="['reach-mini-calendar-day', `reach-mini-calendar-day-${day.getDate()}, reach-mini-calendar-weekday-${day.getDay()}`, day.toDateString() === today.toDateString() ? 'reach-mini-calendar-today' : null, isSelectedWeek(day) ? 'reach-mini-calendar-selected-week' : null, isSelected(day) ? 'reach-mini-calendar-selected-day' : null]" @click="selectDay(day)">
                        <span>{{ day.getDate() }}</span>
                    </div>
                    <div class="reach-mini-calendar-after" v-if="day">&nbsp;</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
let moment = require('moment')

export default {
  name: 'MiniCalendar',
  data () {
    return {
      today: new Date()
    }
  },
  computed: {
    days () {
      let emptyDays = Array((this.startWeekDayOfMonth - this.firstDayOfWeek + 7) % 7).fill(null)
      let days = Array(this.numberOfDays).fill().map((item, index) => new Date(this.selectedYear, this.selectedMonth, index+1))
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
    generateWeekdayNames (firstDayOfWeek = 1) {
      for (let i = 2; i <= firstDayOfWeek; i++) {
        let first = this.weekDays.shift()
        this.weekDays.push(first)
      }
      return this.weekDays
    },
    selectDay (dt) {
      if (this.isSelectedWeek(dt)) {
        this.$emit('setDate', dt.getDay())
      } else {
        this.$emit('getSelectedWeekAndDisplay', dt)
      }
    },
    prevMonth () {
      this.$emit('prevMonth')
    },
    nextMonth () {
      this.$emit('nextMonth')
    },
    isSelectedWeek (day) {
      if (this.selectedDates.length === 1) {
        return false
      }
      let weekfound = false
      this.selectedDates.forEach(function (weekday) {
        if (day.toDateString() === weekday.date.toDateString()) {
          weekfound = true
          return false
        }
      })
      return weekfound
    },
    isSelected (day) {
      return this.viewType === 'day' && (day.toDateString() === this.date.toDateString())
    },
    goToday () {
      this.$refs.calendar.goToday()
    }
  },
  props: {
    viewType: {
      type: String
    },
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
    selectedDates: {
      type: Array,
      default () {
        return []
      }
    },
    firstDayOfWeek: {
      type: Number,
      default: 1 // 1: Sunday, 2: Monday, etc
    },
    date: {
      type: Date,
      default: new Date()
    }
  }
}
</script>

<style lang="sass" scoped>
    @import '../css/_variables.sass'
    @import '../css/mini-calendar.sass'
</style>
