<template>
    <div class="reach-calendar-modal-backdrop" @click="close">
        <div class="reach-calendar-modal" v-if="modalEvent" ref="reachModalEventContainer">
            <header class="reach-calendar-modal-header">
                <slot name="reach-calendar-header">
                    <div class="reach-calendar-modal-titles">{{modalEvent.metadata.name}}</div>
                </slot>
            </header>
            <section class="reach-calendar-modal-body">
                <slot name="reach-calendar-body">
                    <div class="reach-calendar-modal-times" v-html="formatDates(modalEvent)"></div>
                    <div class="reach-calendar-modal-locations" v-if="modalEvent.metadata.location">{{modalEvent.metadata.location}}</div>
                </slot>
            </section>
            <section class="reach-calendar-modal-body" v-if="modalEvent.metadata.description">
                <slot name="reach-calendar-footer">
                    <div class="reach-calendar-modal-descriptions" v-html="searchUrls(modalEvent.metadata.description)"></div>
                </slot>
            </section>
            <footer class="reach-calendar-modal-footer">
                <slot name="reach-calendar-body">
                    <div class="reach-calendar-modal-action reach-calendar-link-pointer" style="padding-right:10px" @click="addToCalendar(modalEvent)">Add to Calendar</div>
                    <div class="reach-calendar-modal-action"> | </div>
                    <div class="reach-calendar-modal-action reach-calendar-link-pointer" style="padding-left:10px" @click="printEvent()">Print Event</div>
                </slot>
            </footer>
        </div>
    </div>
</template>

<script>
let moment = require('moment')
export default {
  name: 'modal',
  methods: {
    close () {
      this.$emit('close')
    },
    searchUrls (text) {
      let urlRegex = /(https?:\/\/[^\s]+)/g
      return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>'
      })
    },
    printEvent () {
      let elementHtml = this.$refs.reachModalEventContainer ? this.$refs.reachModalEventContainer.innerHTML : ''
      let WinPrint = window.open('', '', 'left=100,top=100,width=800,height=800')
      let styles = '<style> body { font-family: arial; color: black; font-size: 20px; text-align: center; }' +
        '.reach-calendar-modal-backdrop{ position: fixed; top: 0; bottom: 0; left: 0; right: 0; background-color: rgba(0, 0, 0, 0.3); display: flex; justify-content: center; align-items: center; z-index: 999999999; font-size: 12px; }' +
        '.reach-calendar-modal; background: #FFFFFF; box-shadow: 2px 2px 20px 1px; overflow-x: auto; display: flex; flex-direction: column; max-width: 60%; }' +
        '.reach-calendar-modal-header { border-bottom: 1px solid #eeeeee; justify-content: center; color: #000; }' +
        '.reach-calendar-modal-footer { border-top: 1px solid #eeeeee; }' +
        '.reach-calendar-modal-titles { padding: 15px; font-weight: bold; font-size: 24px; }' +
        '.reach-calendar-modal-body { position: relative; padding: 20px 10px; }' +
        '.reach-calendar-modal-descriptions{ font-size: 18px; }' +
        '.reach-calendar-modal-times { font-size: 18px; padding-bottom: 5px }' +
        '.reach-calendar-modal-locations { font-size: 18px; font-weight: bold; }' +
        '.reach-calendar-modal-action{ display: none }</style>'
      WinPrint.document.write(styles + elementHtml)
      WinPrint.document.close()
      WinPrint.focus()
      WinPrint.print()
    },
    addToCalendar (event) {
      window.open('https://api.reachcm.com/calendar/export/ics/event/' + event.id + '?timezone=' + event.local_timezone)
    },
    formatDates (event) {
      /* let momentStartDate = moment(event.start_date)
      let momentEndDate = moment(event.end_date)

      if (event.all_day === 'true') {
        momentEndDate.subtract(1, 'minute')
      }
      if (momentStartDate.isSame(momentEndDate, 'day')) {
        return event.all_day === 'true' ? '' : momentStartDate.format('h:mm a') + ' - ' + momentEndDate.format('h:mm a')
      } else {
        return event.all_day === 'true' ? '' : momentStartDate.format('h:mm a')
      } */
      let momentStartDate = moment(event.start_date)
      let momentEndDate = moment(event.end_date)

      if (event.all_day === 'true') {
        momentEndDate.subtract(1, 'minute')
      }
      if (momentStartDate.isSame(momentEndDate, 'day')) {
        return event.all_day === 'true' ? momentStartDate.format('dddd, MMMM D') : momentStartDate.format('dddd, MMMM D[<br>]h:mm a') + ' - ' + momentEndDate.format('h:mm a')
      } else {
        return event.all_day === 'true' ? momentStartDate.format('dddd, MMMM D') + ' - ' + momentEndDate.format('dddd, MMMM D') : momentStartDate.format('dddd, MMMM D[<br>]h:mm a') + ' - ' + momentEndDate.format('dddd, MMMM D[<br>]h:mm a')
      }
    }
  },
  props: {
    modalEvent: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>

<style lang="sass" scoped>
    @import '../css/_variables.sass'
    @import '../css/modal.sass'
</style>
