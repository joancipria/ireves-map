<template>
  <SideBar :id="'newQuery'" :title="i18n.NEW_QUERY">
    
  </SideBar>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { i18n } from "@/main"; 
import SideBar from "@/components/SideBar.vue"

@Options({
  props: {},
  data() {
    return {
      i18n: i18n,
    };
  },
  components:{
    SideBar
  }
})
export default class NewQuery extends Vue {

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
