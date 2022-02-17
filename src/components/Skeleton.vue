<template>
  <div id="reach-calendar-container">
    <div id="reach-calendar-modal-container">
      <modal :modalEvent="modalEvent" v-show="isModalVisible" @close="closeModal" />
    </div>
    <div id="reach-calendar-loader" v-show="!calendarsLoaded">
      <div class="reach-calendar-lds-ripple"><div></div><div></div></div>
    </div>
    <div id="reach-calendar-calendar" v-if="calendarsLoaded">
      <div id='reach-calendar-left-col' class="reach-calendar-col" v-show="!inMonthView">
        <div id="reach-calendar-mini-calendar">
          <mini-calendar @prevMonth="prevMonth" @nextMonth="nextMonth" @getSelectedWeekAndDisplay="getSelectedWeekAndDisplay" @setDate="setDate" :weekDays="weekDays" :viewType="viewType" :monthNames="monthNames" :date="date" :today="today" :selectedDates="selectedDates"></mini-calendar>
        </div>
        <div id="reach-calendar-categories" ref="reachCalendarCategories" v-if="isGroup" v-show="!inMonthView">
          <categories @displayEvents="displayEvents" @toggleCategory="toggleCategory" :weekDays="weekDays" :monthNames="monthNames" :calendars="calendars"></categories>
        </div>
      </div>
      <div id='reach-calendar-right-col' class="reach-calendar-col" :class="[inMonthView ? 'reach-calendar-month-view-cat' : '']">
        <div id="reach-calendar-week-picker" v-if="!inMonthView">
          <week-picker @setDate="setDate" @getSelectedWeekAndDisplay="getSelectedWeekAndDisplay" :weekDays="weekDays" :monthNames="monthNames" :date="date" :selectedYear="selectedYear" :selectedMonth="selectedMonth" :selectedDates="selectedDates"></week-picker>
        </div>
        <div id="reach-calendar-helper-bar">
          <helper-bar @toggleMonthView="toggleMonthView" @printEvents="printEvents" @searchEventsByName="searchEventsByName" :inMonthView="inMonthView" :searchText="filterText"></helper-bar>
        </div>
        <div id="reach-calendar-categories-right" v-if="isGroup" :class="[inMonthView ? 'reach-calendar-month-view-right-categories' : '']">
          <categories @displayEvents="displayEvents" @toggleCategory="toggleCategory" :rightColumn=true :weekDays="weekDays" :monthNames="monthNames" :calendars="calendars"></categories>
        </div>
        <div id="reach-calendar-calendar-events" ref="reachCalendarEventsContainer" v-if="calendars.length > 0 && !inMonthView">
          <events-container @goToday="goToday" :viewToday="viewToday" :maxHeight="maxHeight" :filterText="filterText" :activeEventsContainer="activeEventsContainer" :calendars="calendars" :selectedDates="selectedDates" :weekDays="weekDays" :monthNames="monthNames"></events-container>
        </div>
        <div id="reach-calendar-calendar-month-view" ref="reachCalendarEventsContainer" v-if="calendars.length > 0 && inMonthView">
          <month @showEventModal="showEventModal" @goToday="goToday" @getSelectedMonthAndDisplay="getSelectedMonthAndDisplay" @nextMonth="nextMonth" @prevMonth="prevMonth" :filterText="filterText" :activeEventsContainer="activeEventsContainer" :calendars="calendars" :selectedDates="selectedDates" :weekDays="weekDays" :monthNames="monthNames" :date="date"></month>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MiniCalendar from './MiniCalendar'
import WeekPicker from './WeekPicker'
import axios from 'axios'
import Categories from './Categories'
import EventsContainer from './EventsContainer'
import '../include.js'
import HelperBar from './HelperBar'
import Month from './Month'
import Modal from './Modal'

let moment = require('moment')
export default {
  name: 'Skeleton',
  components: {
    Month,
    HelperBar,
    EventsContainer,
    Categories,
    MiniCalendar,
    WeekPicker,
    Modal
  },
  data () {
    return {
      isModalVisible: false,
      inMonthView: false,
      calendarsLoaded: false,
      modalEvent: null,
      viewType: 'week',
      selectedDates: [],
      filterText: null,
      eventsByWeek: [],
      today: new Date(),
      date: new Date(),
      calendars: [],
      activeEventsContainer: [],
      firstDay: null,
      lastDay: null,
      errors: [],
      monthsBefore: 1,
      maxHeight: 160,
      isGroup: true,
      viewToday: false,
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      weekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  },
  computed: {
    selectedYear () {
      return this.date.getFullYear()
    },
    selectedMonth () {
      return this.date.getMonth()
    }
  },
  methods: {
    showEventModal (event) {
      this.isModalVisible = true
      this.modalEvent = event
    },
    closeModal () {
      this.isModalVisible = false
    },
    toggleCategory (calendar) {
      calendar.selected = !calendar.selected
      this.displayEvents()
    },
    toggleMonthView () {
      // this.filterText = null
      if (!this.inMonthView) {
        this.inMonthView = true
      } else {
        this.inMonthView = false
        this.getSelectedRange(this.today)
        this.displayEvents()
      }
    },
    printEvents () {
      let elementHtml = this.$refs.reachCalendarEventsContainer ? this.$refs.reachCalendarEventsContainer.innerHTML : ''
      let legendHtml = this.$refs.reachCalendarCategories ? this.$refs.reachCalendarCategories.innerHTML : ''
      let WinPrint = window.open('', '', 'left=100,top=100,width=800,height=800')
      let styles = '<style>' +
              'body { font-family: arial; color: black; font-size: 13px; }' +
              '.reach-calendar-event-card-title { font-size: 15px; font-weight:bold; }' +
              '.reach-calendar-event-card { padding-bottom: 10px }' +
              '.reach-calendar-event-date-label { font-size: 15px; font-weight: bold; }' +
              '.reach-calendar-select-all-categories, .reach-calendar-category-not-selected { display:none; }' +
              '.reach-calendar-categories-body { padding-top:5px }' +
              '.reach-calendar-category-color-indicator { width: 12px; height: 12px; display: inline-block } ' +
              '.reach-calendar-category-label { display: inline-block; padding-left: 3px; }' +
              '.reach-calendar-categories-legend-label { font-weight: bold; font-size: 15px; }' +
              '.reach-calendar-card-left-color { height:12px; width: 100%; }' +
              '#reach-calendar-categories-container { border-top: solid black thin }' +
              '.reach-calendar-card-read-indicator { display: none }' +
              '</style>'
      WinPrint.document.write(styles + elementHtml + legendHtml)
      WinPrint.document.close()
      WinPrint.focus()
      WinPrint.print()
    },
    searchEvent (event, searchThis) {
      let searchName = event.metadata.name ? event.metadata.name.toLowerCase().search(searchThis.toLowerCase()) : -1
      let searchDescr = event.metadata.description ? event.metadata.description.toLowerCase().search(searchThis.toLowerCase()) : -1
      let searchLoc = event.metadata.location ? event.metadata.location.toLowerCase().search(searchThis.toLowerCase()) : -1
      let searchInst = event.metadata.instructor ? event.metadata.instructor.toLowerCase().search(searchThis.toLowerCase()) : -1

      return (searchName !== -1 || searchDescr !== -1 || searchLoc !== -1 || searchInst !== -1)
    },
    searchEventsByName (searchThis) {
      this.filterText = searchThis
      this.activeEventsContainer.forEach(function (event) {
        event.active = this.searchEvent(event, searchThis)
      }.bind(this))
    },
    formatDateForApi (date) {
      return date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate()
    },
    goToday () {
      this.setDate(this.today)
    },
    setDate (idx) {
      this.viewType = 'day'
      this.selectedDates.forEach(function (dt) {
        dt.selected = false
      })
      this.selectedDates[idx].selected = true
      this.date = this.selectedDates[idx].date
      this.activeEventsContainer = this.determineEvents()
    },
    prevMonth () {
      this.date = new Date(this.selectedYear, this.selectedMonth - 1, 1)
      this.getSelectedRange(this.date)
      this.displayEvents()
    },
    nextMonth () {
      this.date = new Date(this.selectedYear, this.selectedMonth + 1, 1)
      this.getSelectedRange(this.date)
      this.displayEvents()
    },
    determineEvents () {
      let startDate, endDate
      startDate = this.viewType === 'day' ? this.date : this.selectedDates[0].date
      if (this.viewType !== 'month') {
        endDate = this.viewType === 'day' ? this.date : this.selectedDates[6].date
      } else {
        startDate = this.date
        endDate = this.selectedDates[this.selectedDates.length - 1].date
      }

      let rangeStartDate = moment(startDate.valueOf())
      let rangeEndDate = moment(endDate.valueOf())

      rangeStartDate = rangeStartDate.startOf(this.viewType)
      rangeEndDate = rangeEndDate.endOf(this.viewType)

      let activeEvents = []

      this.calendars.forEach(function (calendar) {
        if (calendar.selected) {
          calendar.events.forEach(function (event) {
            let eventStartDate = moment(event.start_date)
            let eventEndDate = moment(event.end_date)

            if (event.all_day === 'true') {
              eventEndDate.subtract(1, 'minute')
            }

            event.calendarColor = calendar.color
            event.calendarId = calendar.id
            event.local_timezone = calendar.local_timezone

            event.active = this.filterText ? this.searchEvent(event, this.filterText) : true

            if (eventStartDate <= rangeEndDate && eventEndDate >= rangeStartDate) {
              activeEvents.push(event)
            }
          }.bind(this))
        }
      }.bind(this))

      // reorder events to be chronological rather than calendar-chronological

      activeEvents.sort(function (a, b) {
        return new Date(a.start_date) - new Date(b.start_date)
      })
      return activeEvents
    },
    displayEvents () {
      this.activeEventsContainer = this.determineEvents()
    },
    getEvents () {

      let ourScript = document.getElementsByTagName('web-calendar')[0]

      let auth = ourScript && ourScript.getAttribute('data-web-calendar-auth') ? ourScript.getAttribute('data-web-calendar-auth') : 'Ki4qFAy5cls7Ax1W1DaZv6W73aAhMPMZt4pAxM2OeCZf6ogmt57De4xctGzlogtXXZ0OEIN%2Ftt0FZHTKdo6jFQN0o95gTmAIKqoZu86ZaZ0UYM%2F2qxaq7cQN9Bv%2FFaqTdxzfAVCOnsOoLHWm1pC7HayrFcAWt6iTFMQGVSWYg1dHbUggQhMjwEYXSZYytuyR8ojimjkVZ6Zmdrs5w6icmxqC52Be9gl6paXhvSx8yJfmHJdYWB5QawC6XHHUpshQ%2FDDsDx6TVxgXQVW7dyL5HTOvcLVjCTyDRi8wg1PrdLJBLQQiiyQrpi2rio%2BsCWWtQ89j3Nd7ZlDwPUWn2FamWiqhaUs4%2BLTUDJ%2Fn3mGPNh%2BSqso%3D'
      let groupId = ourScript && ourScript.getAttribute('data-group-id') ? ourScript.getAttribute('data-group-id') : null
      let monthsBefore = ourScript && ourScript.getAttribute('data-months-before') ? parseInt(ourScript.getAttribute('data-months-before')) : 1
      let monthsAfter = ourScript && ourScript.getAttribute('data-months-after') ? parseInt(ourScript.getAttribute('data-months-after')) : 6
      let calendarId = ourScript && ourScript.getAttribute('data-calendar-id') ? ourScript.getAttribute('data-calendar-id') : null
      let startingView = ourScript && ourScript.getAttribute('data-calendar-init-view') ? ourScript.getAttribute('data-calendar-init-view') : 'week'

      let startRange = new Date()
      startRange.setMonth(startRange.getMonth() - monthsBefore)
      startRange.setDate(1)

      let endRange = new Date()
      endRange.setMonth(endRange.getMonth() + monthsAfter)
      endRange.setDate(endRange.getNumberOfDaysInMonth())

      let start = this.formatDateForApi(startRange)
      let end = this.formatDateForApi(endRange)

      // expanded  =  Ki4qCOd8JHv6eLg3pjTUbASHOEljjGNq%2BcZB7puKgomaDrEAzK%2BNy%2FcWfalYpgE8DuxjPyu1s9eCdUBYKBTO%2BFUVxf1kslNjJmNDNzHJ%2BpUPyWoR7RQm8dZatQpr7WnPofMTu4XCw0XisCjs6OLvIcnUgKeIEPFVtIXNW0A%2FDpRgWDZgn0eaZ8BeZTWIzDQCrqDyt8DD3o4cRdPWWoFuwRT0GMLoSf2YEtjMGtotmNiZgb7WI3a9GALNUgSZTCu%2FdiT00RjEGiwD1xmds1ZhrNxxIVObddnbEjOuCEBS4oa4CjjBOWo20A%2FzQdS3DuBM8IwCc8aJpEoaYt%2Bx%2FdfFEY3o8yAi%2FF6qPiauV3khht0jfRk%3D
      // non-expanded Ki4qJfvAC3YiZNE%2F%2FbhInGI9a6L%2Bv%2FtfbN1zihfsV4RD5t5yEoJCBsb5eWuqyQdjp%2BzEnke2ucKwBkNmNSRmGGRgOWm5KXn9NHkX%2B5Pa1e8nKyU6djpMw%2BjClp4NrPjqte04aIXeFQwnw%2Fn5zx9zpnMe3p8vD2IEFYTgQNtnVuII4cG4B2Ehh2r8jBxQMKadkCn1y7vkDbk5FDy3g54uJqFBFst89IAaqRcU4fAsYOZoIelnvGqLpKwA%2F5ekdSF1CwyyPqD0P4voSkMwG%2F9WKccJliT58EbjPUMAxxGzEZ0JL%2BOuLhtRd%2FRHxJ5NF3R%2BaJB2RCDLC9wdMPp3H54mAXPZSp1IQ5%2FhGy6uyhCMze4vtAo%3D

      // group-id = fake profile: 867
      // Ki4qjGTtuCUr56T1KTO%2F0PECb80%2BBIZduTSPVVnWlr%2Bf%2BeJru2aEtk418hnGBBlNxcKruodoousMvOp5af5zpyfoerE3Cou%2Fx%2F34%2BttSJyxH3r7tJ5EkR3iJRxvFZM%2FJZpU0vZpVTxnEZb1V7X4ZBKD%2FSto6YtdDdW91Hg1XtrFKXdWUAzoWxSqsvm9tEDEpfJIbh8yl%2BUBgyzFl%2FmJ0UBA2vpL2xQpespZ8cQVm%2FZc6SAb3nfxvHW6PDm%2BcK1RSIHb%2FmaE4ymIzL%2FzU2IHLw%2FDDeVO72HG4KkRgdyyv0Ux0PkRHWSWYxJyCmobEdrmfQlUHtB5suLy%2Bk1aIWnGop3orJmqM4np04yCIBkcO2X%2BkBlE%3D

      // Ki4q3gJIjDTFFeHhuJ%2BrigD5ZDNndNXw0MhV2IDabzzirnD69FKyBTGfYtwRsAvW%2FGou4otg1raYLfobmxxEwGumB1UnJj79cQbuItW7bajrLK57mIOL0ALeO89r3hS755iTLuLYemKXYnaZ4q0xPxiarUY%2BEOpf4Obr5YZvxBSYG2AWHDARDX7GI4PtwJCIv9vIS1NI9qZB2xQd1iYU4Y4BZqf23RCeU2XuA8DaThUKiVS%2FHRM4EpeUrqTwUDu93zreNIq9XPa50t7Lhah%2B%2FDUvhVuF6JELfWmzOnzRtT3gMl3v2jCJ1pVmF32FutbgobFbBg5Jko%2Bo%2F9kobFcHvbRxOxxrNXQShsKoKirvFix4xls%3D

      let apiPrefix = 'https://api.reachcm.com/calendar/export/web/'

      if (calendarId) {
        this.isGroup = false
        apiPrefix += `expanded/` + calendarId
      } else {
        this.isGroup = true
        apiPrefix += `group/expanded/` + (groupId || '936')
      }

      let apiUrl = apiPrefix + `/?start_date=` + start + `&end_date=` + end + `&authorization=` + auth

      axios.get(apiUrl)
        .then(response => {
          this.calendarsLoaded = true
          this.calendars = response.data.calendars.map(function (item) {
            item.selected = true
            return item
          })
          this.getSelectedRange(this.today)

          // override if day is default view
          if (startingView === 'day') {
            this.viewType = 'day'
            this.date = this.today

            this.selectedDates.forEach(function (dt) {
              let compareDate = dt.date.getMonth() + '/' + dt.date.getDate() + '/' + dt.date.getFullYear()
              let todayDate = this.today.getMonth() + '/' + this.today.getDate() + '/' + this.today.getFullYear()
              dt.selected = compareDate === todayDate
            }.bind(this))
          } else if (startingView === 'month') {
            if (!this.inMonthView) {
              this.inMonthView = true
            } else {
              this.inMonthView = false
              this.getSelectedRange(this.today)
              this.displayEvents()
            }
          }

          this.displayEvents()
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    getSelectedMonthAndDisplay () {
      this.viewType = 'month'
      this.getSelectedRange(this.date)
      this.displayEvents()
    },
    getSelectedWeekAndDisplay (dt) {
      this.viewType = 'week'
      this.getSelectedRange(dt)
      this.displayEvents()
    },
    getSelectedRange (dt) {
      let tempFirstDay, tempLastDay
      let tempMoment = moment(dt.toISOString())

      this.firstDay = tempFirstDay = tempMoment.startOf('week').valueOf()
      this.lastDay = tempLastDay = tempMoment.endOf('week').valueOf()

      this.selectedDates = []

      let firstDate = new Date(tempFirstDay)
      let dateIsDST = firstDate.isDstObserved()

      while (tempFirstDay <= tempLastDay) {
        let newDate = new Date(tempFirstDay)
        let timeChange = dateIsDST !== newDate.isDstObserved()

        // check to see if time change happened
        if (timeChange) {
          newDate = new Date(newDate.getTime() + 3600000)
          tempFirstDay += 3600000
          timeChange = false
        }

        this.selectedDates.push({ date: newDate, selected: false })
        tempFirstDay += 86400000
      }

      if (this.selectedDates[0].date.getMonth() === this.selectedDates[6].date.getMonth()) {
        this.date = new Date(this.selectedDates[0].date.getFullYear(), this.selectedDates[0].date.getMonth(), 1)
      }
    }
  },
  beforeMount () {
    this.getEvents()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
  @import '../css/_variables.sass'
  @import '../css/skeleton.sass'
</style>
