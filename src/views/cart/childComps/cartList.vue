<template>
  <div class="cartList">
        <scroll class="content" ref="scroll">
            <cart-list-item v-for="item,index in cartList" 
            :key="index"
            :itemInfo="item">
            </cart-list-item>
            
        </scroll>  
  </div>
</template>

<script>

import { mapGetters } from "vuex"
import Scroll from 'components/common/scroll/Scroll.vue'
import CartListItem from "./CartListItem.vue"

export default {
  components: { Scroll, CartListItem },
 name:'cartList',
 computed:{
     ...mapGetters(['cartList'])
 },
 activated(){
     this.$refs.scroll.refresh()
     console.log(this.cartList);
 }
}
</script>

<style scoped>
/* .cartList{
    position:relative; 
     height:calc(100%-49px) ;
} */
  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

</style>