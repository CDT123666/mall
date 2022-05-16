import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)


const store=new Vuex.Store({
    state:{
        cartList:[]
    },
    mutations:{   
        addCounter(state,payload){
            payload.count++
        },
        addToCart(state,payload){
            payload.checked=true
            payload.count=1
            state.cartList.push(payload)
        }
    },
    actions:{
        addCart(context,payload){       //context={state,commit}
            return new Promise((resolve,reject)=>{
                let oldProduct=context.state.cartList.find(item=>item.iid===payload.iid)

                if(oldProduct){
                    context.commit('addCounter',payload)
                    resolve('商品数量+1')
                }else{
                    context.commit('addToCart',payload)
                    resolve('成功添加至购物车')
                }
            })
        }
    },
    getters
})


export default store