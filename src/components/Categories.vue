<template>
    <div id="reach-calendar-categories-container" attr="Categories Container" v-bind:class="[rightColumn ? 'reach-calendar-right-categories-container' : '']">
        <div class="reach-calendar-categories-header">
            <div class="reach-calendar-categories-legend-label">LEGEND KEY</div><div class="reach-calendar-categories-legend-label-description">Click on the category name to select/deselect</div>
        </div>
        <div class="reach-calendar-categories-body" v-bind:class="[rightColumn ? 'reach-calendar-right-categories-body' : '']">
            <div class="reach-calendar-select-all-categories" @click="toggleSelectAll()">
                <div class="reach-calendar-category-color-indicator" :style="[allSelected() ? { 'background-color': '#000' } : { 'background-color': '#FFF' }]"></div>
                <div class="reach-calendar-category-label select-deselect-all"><span>{{allSelected() ? 'Deselect All' : 'Select All'}}</span></div>
            </div>
            <div class="reach-calendar-category-container" v-for="(cal, index) in calendars" :key="index" @click="toggleCategory(cal)" :class="[!cal.selected ? 'reach-calendar-category-not-selected' : '']">
                <div class="reach-calendar-category-color-indicator" :style="[cal.selected ? { 'background-color': cal.color } : { 'background-color': '#FFF' }]"></div>
                <div class="reach-calendar-category-label"><span>{{cal.name}}</span></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Categories',
  data () {
    return { }
  },
  methods: {
    allSelected () {
      let cnt = 0
      this.calendars.forEach(function (calendar) {
        if (calendar.selected) {
          cnt++
        }
      })
      return cnt === this.calendars.length
    },
    toggleCategory (calendar) {
      this.$emit('toggleCategory', calendar)
    },
    toggleSelectAll () {
      if (this.allSelected()) {
        this.calendars.forEach(function (calendar) {
          calendar.selected = false
        })
      } else {
        this.calendars.forEach(function (calendar) {
          calendar.selected = true
        })
      }
      this.$emit('displayEvents')
    }
  },
  props: {
    msg: String,
    rightColumn: {
      type: Boolean,
      default () {
        return false
      }
    },
    calendars: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>
<style lang="sass" scoped>
    @import '../css/_variables.sass'
    @import '../css/categories.sass'
</style>
