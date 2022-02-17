<template>
    <div id="reach-calendar-container">
        <meta charset="UTF-8">
        <Skeleton />
    </div>
</template>

<script>
import '@babel/polyfill'
import Skeleton from './components/Skeleton.vue'
export default {
  name: 'app',
  props: {
    maxHeight: Number
  },
  components: {
    Skeleton
  }
}
</script>
<style lang="sass" scoped>
    @import 'css/_variables.sass'
    @import 'css/calendar.sass'

</style>
