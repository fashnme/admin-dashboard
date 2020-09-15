import axios from 'axios';
import sharedVariables from '../shared/sharedVariables';
import { FETCH_ORDERS, FETCH_ORDERS_LOADING } from '../types';

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
            console.log('these are active orders', orders)
            return dispatch({
                type: FETCH_ORDERS,
                payload: orders.data
            });
        })
        .catch(error => {
            // dispatch(ordersFailed(error.message))
        });

}
