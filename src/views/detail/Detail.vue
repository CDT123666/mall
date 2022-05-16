<template>
  <div id="detail">
    <detail-nav-bar ref="datailNav" class="detail-nav" @titleClick="titleClick"/>
      <!-- <div>{{this.$store.state.cartList.length}}</div> -->
    <scroll class="content" 
    ref="scroll"
    :probe-type="3"
    @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <toast :message="message" :show="isShow"></toast>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import Scroll from 'components/common/scroll/Scroll'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import GoodsList from 'components/content/goods/GoodsList'
  import DetailBottomBar from "./childComps/DetailBottomBar";
  import Toast from '../../components/common/toast/Toast.vue'


  import {debounce} from 'common/utils'
  import {getDetail, Goods, Shop, GoodsParam,getRecommend} from "network/detail";






  export default {
    name: "Detail",
    components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailBottomBar,
    GoodsList,
    DetailCommentInfo,
    Scroll,
    Toast
},
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo:{},
        recommends:[],
        themeTopYs:[0],
        getThemeTopY:null,
        message:'',
        isShow:false
      }
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid
      console.log(this.iid);

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {

        // 1.获取顶部的图片轮播数据
        // console.log(res);
        const data = res.result;
        this.topImages = data.itemInfo.topImages

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo;

        // 5.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        //获取评论信息
        if(data.rate.cRate!=0){
          this.commentInfo=data.rate.list[0]
        }

        //渲染完会调用,获取组件位置
      
      })

      this.getThemeTopY=debounce(()=>{
        this.$nextTick(()=>{
          this.themeTopYs=[0]
          this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

          // console.log(this.themeTopYs);  
        })         
      },200)
    
      //3.请求推荐数据
      getRecommend().then(res=>{
        console.log(res);
        this.recommends=res.data.list
      })



    },
    mounted() {
      // 1.图片加载完成的事件监听
      const refresh = debounce(this.$refs.scroll.refresh, 50)
      this.$bus.$on('detailItemImageLoad', () => {
        refresh()
      })
    },    
    updated() {
     
    },

    methods: {
      //最后一张商品图片加载完成后调用
      imageLoad() {
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      // 跳转导航栏指定位置
      titleClick(index){
        // console.log(index);
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],1000)
      },
      //获取位置
      contentScroll(position){
        // console.log(position);
        let positionY=-position.y;

        if(positionY<this.themeTopYs[1]){
          this.$refs.datailNav.currentIndex=0
        }else if(positionY>=this.themeTopYs[1]&&positionY<this.themeTopYs[2]){
          this.$refs.datailNav.currentIndex=1
        }else if(positionY>=this.themeTopYs[2]&&positionY<this.themeTopYs[3]){
          this.$refs.datailNav.currentIndex=2
        }else{
          this.$refs.datailNav.currentIndex=3
        }
      },
      addToCart(){
        // console.log('加入购物车');
        const product={}
        product.image=this.topImages[0]
        product.title=this.goods.title
        product.desc=this.goods.desc
        product.price=this.goods.realPrice
        product.iid=this.iid

        this.$store.dispatch('addCart',product).then(res=>{
          this.isShow=true
          this.message=res
          console.log(res);

          setTimeout(()=>{
            this.isShow=false
          },1500)
        })
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    /* 视界高度100% */
    height: 100vh;
  }

  .detail-nav {
    /* width: 100%; */
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 102px );
  }
</style>
