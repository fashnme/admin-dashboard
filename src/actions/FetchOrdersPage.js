import sharedVariables from '../shared/sharedVariables';
import { FETCH_ORDERS_LOADING, FETCH_ORDERS } from '../types';
import axios from 'axios';

export const ordersPageDataFetch = () => {

    return (dispatch) => {
        
        //Dispatch Loading Action
        dispatch({ type: FETCH_ORDERS_LOADING, payload: {} });
        
        //Call Function to get orders from server
        getOrders(dispatch);
    }
};

const getOrders = (dispatch) => {

    const { headers, baseUrl } = sharedVariables;

    axios.get(`${baseUrl}/admin/get-active-orders/`, { headers })
        .then((orders) => {
            return dispatch({
                type: FETCH_ORDERS,
                payload: orders.data
            });
        })
        .catch(error => {
            // dispatch(ordersFailed(error.message))
        });

}
