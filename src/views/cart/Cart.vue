<template>
  <div id="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <cart-list></cart-list>
    <bottom-bar></bottom-bar>

    
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import CartList from './childComps/cartList.vue'
import Scroll from 'components/common/scroll/Scroll'
import BottomBar from './childComps/BottomBar.vue'

  export default {
  components: {
    NavBar,
    CartList,
    Scroll,
    BottomBar
},

  name: "Cart",
  computed:{
    cartLength(){
      return this.$store.state.cartList.length
    }
  }
  }

</script>

<style scoped>
/* #cart{
    position: relative;
    height: 100vh;

} */
.nav-bar{
  background-color: var(--color-tint);
  color:#fff;
  font-weight:700;
}


</style>
