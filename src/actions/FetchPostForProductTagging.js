import axios from 'axios';
import sharedVariables from './../shared/sharedVariables';
import {
    FETCH_POST_FOR_PRODUCT_TAGGING,
    FETCH_POST_FOR_PRODUCT_TAGGING_LOADING,

    FETCH_TEXTUALLy_SIMILAR_PROUCTS,
    FETCH_TEXTUALLy_SIMILAR_PROUCTS_LOADING, FETCH_VISUALLY_SIMILAR_PRODUCTS,


    FETCH_VISUALLY_SIMILAR_PRODUCTS_LOADING
} from './../types';


export const fetchPostByPageNo = (pageNo) => {

    return (dispatch) => {

        // Dispatch loading payload
        dispatch({ type: FETCH_POST_FOR_PRODUCT_TAGGING_LOADING, payload: { loading: true } });

        // Function to dispatch action
        getPostsForTagging(pageNo, dispatch);
    }
}

export const fetchPostById = (postId) => {
    const { baseUrl, headers } = sharedVariables;

    return (dispatch) => {

        // Dispatch loading payload
        dispatch({ type: FETCH_POST_FOR_PRODUCT_TAGGING_LOADING, payload: { loading: true } });

        // Function to dispatch action

        axios.post(`${baseUrl}/admin/fetch-post-for-product-tagging`, { postId }, { headers })
            .then((response) => {
                dispatch({ type: FETCH_POST_FOR_PRODUCT_TAGGING_LOADING, payload: { loading: false } });

                dispatch({ type: FETCH_POST_FOR_PRODUCT_TAGGING, payload: response.data });

            })
            .catch(error => {
                console.log('Error', error);
            });
    }
}

const getPostsForTagging = (pageNo, dispatch) => {

    const { baseUrl, headers } = sharedVariables;

    axios.post(`${baseUrl}/admin/fetch-posts-for-product-tagging`, { pageNo }, { headers })
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

    axios.post(`${baseUrl}/admin/get-visually-similar-products`, { source: sourceUrl, bbox: bbCordinates }, { headers: sharedVariables.headers })
        .then((response) => {
            dispatch({ type: FETCH_VISUALLY_SIMILAR_PRODUCTS, payload: response.data });
        })
        .catch(error => {
            console.log('Error', error);
        });

}

export const fetchTextuallySimilarProducts = (query) => {
    return (dispatch) => {
        dispatch({ type: FETCH_TEXTUALLy_SIMILAR_PROUCTS_LOADING, payload: { loading: true } });
        axios.get(`http://fresh-rope-219511.appspot.com/search?q=${query}`).then((response) => {
            console.log(response.data)
            dispatch({ type: FETCH_TEXTUALLy_SIMILAR_PROUCTS, payload: response.data })
        })
    }
}

export const submitTaggedProducts = (postId, productsArray) => {

    // console.log(productsArray)

    const { baseUrl } = sharedVariables;


    return (dispatch) => {
        dispatch({ type: FETCH_POST_FOR_PRODUCT_TAGGING_LOADING, payload: { loading: true } });
        console.log('updating', { postId: postId, taggedProducts: productsArray });

        axios.post(`${baseUrl}/admin/update-tagged-products-array`, { postId: postId, taggedProducts: productsArray }, { headers: sharedVariables.headers })
            .then((response) => {

                console.log('updated');
                // Dispatch loading payload
                dispatch({ type: FETCH_POST_FOR_PRODUCT_TAGGING_LOADING, payload: { loading: false } });

                // Function to dispatch action
                // getPostsForTagging(pageNo, dispatch);
                window.location.href = `${window.location.href}`;
            }).catch(error => {
                dispatch({ type: FETCH_POST_FOR_PRODUCT_TAGGING_LOADING, payload: { loading: false } });

                console.log('Error', error);
            });
    }
}

