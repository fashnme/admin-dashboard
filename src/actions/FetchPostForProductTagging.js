import axios from 'axios';
import sharedVariables from './../shared/sharedVariables';
import {
    FETCH_POST_FOR_PRODUCT_TAGGING,
    FETCH_POST_FOR_PRODUCT_TAGGING_LOADING,

    FETCH_VISUALLY_SIMILAR_PRODUCTS, FETCH_VISUALLY_SIMILAR_PRODUCTS_LOADING
} from './../types';


export const fetchPostForProductTagging = (pageNo) => {

    return (dispatch) => {

        // Dispatch loading payload
        dispatch({ type: FETCH_POST_FOR_PRODUCT_TAGGING_LOADING, payload: { loading: true } });

        // Function to dispatch action
        getPostsForTagging(pageNo, dispatch);
    }
}

const getPostsForTagging = (pageNo, dispatch) => {

    const { baseUrl } = sharedVariables;

    axios.post(`${baseUrl}/admin/fetch-posts-for-product-tagging`, { pageNo })
        .then((response) => {
            dispatch({ type: FETCH_POST_FOR_PRODUCT_TAGGING, payload: response.data });
        })
        .catch(error => {
            console.log('Error', error);
        });

}

export const fetchVisuallySimilarProducts = (sourceUrl, bbCordinates) => {

    return (dispatch) => {

        // Dispatch loading payload
        dispatch({ type: FETCH_VISUALLY_SIMILAR_PRODUCTS_LOADING, payload: { loading: true } });

        // Function to dispatch action
        getVSProducts(sourceUrl, bbCordinates, dispatch);
    }
}


const getVSProducts = (sourceUrl, bbCordinates, dispatch) => {

    const { baseUrl } = sharedVariables;
    console.log(sourceUrl, bbCordinates)

    axios.post(`${baseUrl}/admin/get-visually-similar-products`, { source: sourceUrl, bbox: bbCordinates })
        .then((response) => {
            dispatch({ type: FETCH_VISUALLY_SIMILAR_PRODUCTS, payload: response.data });
        })
        .catch(error => {
            console.log('Error', error);
        });

}

export const submitTaggedProducts = (postId, productIdArray, dispatch) => {

    const { baseUrl } = sharedVariables;

    axios.post(`${baseUrl}/admin/update-tagged-products-array`, { postId: postId, taggedProducts: productIdArray })
        .then((response) => {
            return (dispatch) => {

                // Dispatch loading payload
                dispatch({ type: FETCH_POST_FOR_PRODUCT_TAGGING_LOADING, payload: { loading: true } });

                // Function to dispatch action
                getPostsForTagging(dispatch);
            }
        })
        .catch(error => {
            console.log('Error', error);
        });

}