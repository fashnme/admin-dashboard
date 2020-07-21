import axios from 'axios';
import sharedVariables from '../shared/sharedVariables';
import { FETCH_ORDER, FETCH_ORDER_LOADING } from '../types';
const { headers, baseUrl } = sharedVariables;


export const orderPageDataFetch = (orderId) => {

    return (dispatch) => {

        //Dispatch Loading Action
        dispatch({ type: FETCH_ORDER_LOADING, payload: {} });

        //Call Function to get order from server
        getOrder(orderId, dispatch);
    }
};

const getOrder = (orderId, dispatch) => {

    axios.post(`${baseUrl}/admin/get-order-details/`, { orderId }, { headers })
        .then((order) => {
            return dispatch({
                type: FETCH_ORDER,
                payload: order.data
            });
        })
        .catch(error => {
            // dispatch(ordersFailed(error.message))
        });

}


export const updateOrderProductStatus = (orderId, productId, status) => {
    console.log(orderId, productId, status)
    // axios.post(`${baseUrl}/admin/update-order-status/`, { orderId, productId, status }, {headers})
    //     .then((updated) => {
    //         console.log('order updated', updated);

    //         return (dispatch) => {

    //             //Dispatch Loading Action
    //             dispatch({ type: FETCH_ORDER_LOADING, payload: {} });

    //             //Call Function to get order from server
    //             getOrder(orderId, dispatch);
    //         }
    //     })
    //     .catch(error => {
    //         // dispatch(ordersFailed(error.message))
    //     });

}