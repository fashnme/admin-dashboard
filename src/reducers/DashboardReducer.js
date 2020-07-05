import {
    DASHBOARD_PAGE_DATA_FETCHED, DASHBOARD_TOGGLE_LOADING
  } from './../types';
  
  
  const INITIAL_STATE = {
    dashboardData: {},
    loading: true
  };
  
  export default (state = INITIAL_STATE, action) => {
      switch (action.type) {
        case DASHBOARD_PAGE_DATA_FETCHED:
            return { ...state, dashboardData: action.payload,  loading: false };
        case DASHBOARD_TOGGLE_LOADING:
            return {...state, loading: action.payload}
        default:
            return state;
      }
  };
  