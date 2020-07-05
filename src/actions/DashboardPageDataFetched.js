import sharedVariables from './../shared/sharedVariables';
import { DASHBOARD_PAGE_DATA_FETCHED, DASHBOARD_TOGGLE_LOADING } from './../types';

import axios from 'axios';

export const dashboardPageDataFetch = () => {
    
    return (dispatch) => {
        
        // Dispatch loading payload
        dispatch({ type: DASHBOARD_TOGGLE_LOADING, payload: true });
        
        // Function to dispatch action
        getDashboardData(dispatch);
    }
}

const getDashboardData = (dispatch) => {
    
    const { headers, baseUrl } = sharedVariables;

    axios.get(`${baseUrl}/seller/get-active-orders/`, { headers })
         .then((response) => {
            dispatch({ type: DASHBOARD_PAGE_DATA_FETCHED, payload: response.data.activeOrders });
         })
        .catch(error => {
            console.log('Done', error);
         });

}