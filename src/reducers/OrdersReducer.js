import { FETCH_ORDERS, FETCH_ORDERS_LOADING } from './../types';

const INITIAL_STATE = {
	isLoading: true,
	ordersInfo: [],
	pageNo:1
  };


  
  export default (state = INITIAL_STATE, action) => {


      switch (action.type) {
        case FETCH_ORDERS:
			return { ...state, isLoading: false, errMess: null, ordersInfo: action.payload.activeOrders.ordersInfo };
        case FETCH_ORDERS_LOADING:
            return { ...state, isLoading: true, errMess: null, ordersInfo: [] }
       
        default:
            return state;
      }
  };
  