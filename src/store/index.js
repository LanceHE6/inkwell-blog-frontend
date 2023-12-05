import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
    plugins:[createPersistedState()],//状态持久化，即使刷新也不会重置store中的值
    state() {
        return {
            userId: null,
            userNum: null,
            userLmc: null,
            userExchangeNum:null
        };
    },
    mutations: {
        setUserId(state, userId) {
            state.userId = userId;
        },
        setUserNum(state, userNum) {
            state.userNum = userNum;
        },
        setUserLmc(state, userLmc){
            state.userLmc = userLmc;
        },
        setUserExchangeNum(state, userExchangeNum){
            state.userExchangeNum = userExchangeNum;
        }
    },
});

export default store;
