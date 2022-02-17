<template>
    <div id="reach-calendar-week-picker">
        <div class="reach-calendar-week-cards-container" v-if="selectedDates && selectedDates.length > 0">
            <div>
                <div class="reach-calendar-week-label-spacer">&nbsp;</div>
                <div class="reach-calendar-selected-week-label" v-if="selectedDates.length > 1">{{monthNames[selectedDates[0].date.getMonth()] + ' ' + selectedDates[0].date.getDate()}} - {{monthNames[selectedDates[6].date.getMonth()] + ' ' + selectedDates[6].date.getDate()}}</div>
                <div class="reach-calendar-selected-week-label" v-if="selectedDates.length === 1">{{monthNames[selectedDates[0].date.getMonth()] + ' ' + selectedDates[0].date.getDate()}}</div>
                <div class="reach-calendar-week-label-spacer">&nbsp;</div>
            </div>
            <div>
                <div>
                    <div class="reach-calendar-left-arrow reach-calendar-week-arrow" @click="prevWeek">
                        <svg version="1.1" class="reach-calendar-directional-arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                             viewBox="0 0 492 492" style="enable-background:new 0 0 492 492;" xml:space="preserve">
                            <path d="M198.608,246.104L382.664,62.04c5.068-5.056,7.856-11.816,7.856-19.024c0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12
                                        C361.476,2.792,354.712,0,347.504,0s-13.964,2.792-19.028,7.864L109.328,227.008c-5.084,5.08-7.868,11.868-7.848,19.084
                                        c-0.02,7.248,2.76,14.028,7.848,19.112l218.944,218.932c5.064,5.072,11.82,7.864,19.032,7.864c7.208,0,13.964-2.792,19.032-7.864
                                        l16.124-16.12c10.492-10.492,10.492-27.572,0-38.06L198.608,246.104z"></path>
                        </svg>
                    </div>
                    <div class="reach-calendar-week-card" v-for="(item, index) in selectedDates" :class="item.selected ? 'reach-calendar-selected-day' : null" :index="index" :key="index" :item="item.date" @click="selectCard(index)">
                        <span class="reach-calendar-week-card-day">{{require('moment')(item.date.toISOString()).format('ddd')}}</span><br />
                        <span class="reach-calendar-week-card-date">{{require('moment')(item.date.toISOString()).format('D')}}</span>
                    </div>
                    <div class="reach-calendar-right-arrow reach-calendar-week-arrow" @click="nextWeek">
                        <svg version="1.1" class="reach-calendar-directional-arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                             viewBox="0 0 492.004 492.004" style="enable-background:new 0 0 492.004 492.004;" xml:space="preserve">
                            <path d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12
                                        c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028
                                        c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265
                                        c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
let moment = require('moment')
export default {
  name: 'WeekPicker',
  data: function () {
    return {}
  },
  computed: {

  },
  methods: {
    selectCard (idx) {
      this.$emit('setDate', idx)
    },
    nextWeek () {
      this.$emit('getSelectedWeekAndDisplay', moment(this.selectedDates[0].date.toISOString()).add(1, 'week').toDate())
    },
    prevWeek () {
      this.$emit('getSelectedWeekAndDisplay', moment(this.selectedDates[0].date.toISOString()).subtract(1, 'week').toDate())
    },
    isSelected (day) {
      if (this.selectedDates.length > 1) {
        return false
      }
      let momentDate = moment(this.selectedDates[0].date.toISOString())
      return (day.getFullYear() + '-' + day.getActualMonth() + '-' + day.getDate()) === momentDate.format('YYYY-M-D')
    }
  },
  props: {
    monthNames: {
      type: Array
    },
    selectedDates: {
      type: Array,
      default () {
        return []
      }
    }
  },
  beforeMount () { }
}
</script>

<style lang="sass" scoped>
    @import '../css/_variables.sass'
    @import '../css/week-picker.sass'
</style>
