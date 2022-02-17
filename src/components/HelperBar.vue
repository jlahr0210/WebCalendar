<template>
    <div class="reach-calendar-helper-bar">
        <div class="reach-calendar-search-bar-container">
            <div class="reach-calendar-search-bar-input-container">
                <input v-bind:value="searchText" v-on:input="$emit('searchEventsByName', $event.target.value)" type="text" id="reach-calendar-search-bar" placeholder="Search Events">
            </div><div class="reach-calendar-search-bar-delete-container">
                <div title="Clear Search" @click="clearSearchText()"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/></svg></div>
            </div>
        </div><div class="reach-calendar-print-button-container">
            <div class="reach-calendar-print-icon-div" :title="inMonthView ? 'Print not allowed in Month View' : 'Print Events'" :class="inMonthView ? 'reach-calendar-disable-print' : ''" @click="printEvents()"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14 20h-6v-1h6v1zm10-15v13h-4v6h-16v-6h-4v-13h4v-5h16v5h4zm-6 10h-12v7h12v-7zm0-13h-12v3h12v-3zm4 5.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5.224.5.5.5.5-.224.5-.5zm-6 9.5h-8v1h8v-1z"/></svg></div>
        </div><div class="reach-calendar-calendar-icon-container">
            <div class="reach-calendar-calendar-icon-div" :title="!isIE() ? 'Toggle Month View' : 'Month View Disabled in IE'" @click="!isIE() ? toggleMonthView() : ''" :class="isIE() ? 'reach-calendar-icon-disabled' : ''">
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24" height="24" viewBox="0 0 36.447 36.447" style="enable-background:new 0 0 36.447 36.447;" xml:space="preserve"><g><g><path d="M30.224,3.948h-1.098V2.75c0-1.517-1.197-2.75-2.67-2.75c-1.474,0-2.67,1.233-2.67,2.75v1.197h-2.74V2.75c0-1.517-1.197-2.75-2.67-2.75c-1.473,0-2.67,1.233-2.67,2.75v1.197h-2.74V2.75c0-1.517-1.197-2.75-2.67-2.75c-1.473,0-2.67,1.233-2.67,2.75v1.197H6.224c-2.343,0-4.25,1.907-4.25,4.25v24c0,2.343,1.907,4.25,4.25,4.25h24c2.344,0,4.25-1.907,4.25-4.25v-24C34.474,5.855,32.567,3.948,30.224,3.948z M25.286,2.75c0-0.689,0.525-1.25,1.17-1.25c0.646,0,1.17,0.561,1.17,1.25v4.896c0,0.689-0.524,1.25-1.17,1.25c-0.645,0-1.17-0.561-1.17-1.25V2.75z M17.206,2.75c0-0.689,0.525-1.25,1.17-1.25s1.17,0.561,1.17,1.25v4.896c0,0.689-0.525,1.25-1.17,1.25s-1.17-0.561-1.17-1.25V2.75z M9.125,2.75c0-0.689,0.525-1.25,1.17-1.25s1.17,0.561,1.17,1.25v4.896c0,0.689-0.525,1.25-1.17,1.25s-1.17-0.561-1.17-1.25V2.75zM31.974,32.198c0,0.965-0.785,1.75-1.75,1.75h-24c-0.965,0-1.75-0.785-1.75-1.75v-22h27.5V32.198z"></path><rect x="6.724" y="14.626" width="4.595" height="4.089"/>
                <rect x="12.857" y="14.626" width="4.596" height="4.089"/><rect x="18.995" y="14.626" width="4.595" height="4.089"/><rect x="25.128" y="14.626" width="4.596" height="4.089"/><rect x="6.724" y="20.084" width="4.595" height="4.086"/><rect x="12.857" y="20.084" width="4.596" height="4.086"/><rect x="18.995" y="20.084" width="4.595" height="4.086"/><rect x="25.128" y="20.084" width="4.596" height="4.086"/><rect x="6.724" y="25.54" width="4.595" height="4.086"/><rect x="12.857" y="25.54" width="4.596" height="4.086"/><rect x="18.995" y="25.54" width="4.595" height="4.086"/><rect x="25.128" y="25.54" width="4.596" height="4.086"/></g></g></svg>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'HelperBar',
  methods: {
    clearSearchText () {
      this.$emit('searchEventsByName', '')
    },
    toggleMonthView () {
      this.$emit('toggleMonthView')
    },
    filterEvents () {
      this.$emit('searchEventsByName', this.searchText)
    },
    isIE () {
      let ua = window.navigator.userAgent
      let msie = ua.indexOf('MSIE ')

      return msie > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./)
    },
    printEvents () {
      if (this.inMonthView) {
        return false
      }
      this.$emit('printEvents', this.searchText)
    }
  },
  props: {
    msg: String,
    inMonthView: Boolean,
    searchText: String
  }
}
</script>
<style lang="sass" scoped>
  @import '../css/_variables.sass'
  @import '../css/helper-bar.sass'
</style>
