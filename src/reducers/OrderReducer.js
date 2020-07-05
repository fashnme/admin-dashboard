import {
    FETCH_ORDER_LOADING, 
    FETCH_ORDER
  } from '../types';
  
  
  const INITIAL_STATE = {
    orderDetails:{}
  };
  
  export default (state = INITIAL_STATE, action) => {

      switch (action.type) {
        case FETCH_ORDER:
            return { ...state, orderDetails: action.payload.orderDetails, loading: false};
        case FETCH_ORDER_LOADING:
            return {...INITIAL_STATE, loading: true}

        default:
            return state;
      }
  };
  