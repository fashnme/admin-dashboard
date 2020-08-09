import {
    FETCH_POST_FOR_PRODUCT_TAGGING,
    FETCH_POST_FOR_PRODUCT_TAGGING_LOADING,



    FETCH_TEXTUALLy_SIMILAR_PROUCTS,
    FETCH_TEXTUALLy_SIMILAR_PROUCTS_LOADING, FETCH_VISUALLY_SIMILAR_PRODUCTS,
    FETCH_VISUALLY_SIMILAR_PRODUCTS_LOADING,
    UPDATE_TAGGED_PRODUCTS
} from '../types';


const INITIAL_STATE = {
    pageNo: 1,
    posts: [],
    loading: true,
    // products:[{"productId":"f21-362502","imageUrl":"https://forever21.imgix.net/img/app/product/3/362502-1828082.jpg","price":499,"ecommerce":"forever21","brandName":"Forever21"},{"productId":"aj-410128668_wht","imageUrl":"https://assets.ajio.com/medias/sys_master/root/h5f/ha8/11884333563934/-473Wx593H-410128668-wht-MODEL.jpg","price":1817,"ecommerce":"ajio","brandName":"Hunkemoller"},{"productId":"my-2489626","imageUrl":"https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/2489626/2018/2/15/11518674668825-Candour-London-White-Lace-Underwired-Non-Padded-Everyday-Bra-8801518674668649-1.jpg","price":551,"ecommerce":"myntra","brandName":"Candour London"},{"productId":"aj-410069043_pnk","imageUrl":"https://assets.ajio.com/medias/sys_master/root/h29/ha1/11284485046302/-473Wx593H-410069043-pnk-MODEL.jpg","price":2595,"ecommerce":"ajio","brandName":"Hunkemoller"},{"productId":"aj-410155600_ashlyblue","imageUrl":"https://assets.ajio.com/medias/sys_master/root/hd9/hbc/11881614934046/-473Wx593H-410155600-ashlyblue-MODEL.jpg","price":2795,"ecommerce":"ajio","brandName":"Hunkemoller"},{"productId":"aj-410120403_prlblue","imageUrl":"https://assets.ajio.com/medias/sys_master/root/h3d/h0a/11885066256414/-473Wx593H-410120403-prlblue-MODEL.jpg","price":1748,"ecommerce":"ajio","brandName":"Hunkemoller"},{"productId":"aj-410155999_cvr","imageUrl":"https://assets.ajio.com/medias/sys_master/root/h34/h5c/11882257121310/-473Wx593H-410155999-cvr-MODEL.jpg","price":1348,"ecommerce":"ajio","brandName":"Hunkemoller"},{"productId":"aj-410155584_ashlyblue","imageUrl":"https://assets.ajio.com/medias/sys_master/root/hb0/haf/11881058467870/-473Wx593H-410155584-ashlyblue-MODEL.jpg","price":1957,"ecommerce":"ajio","brandName":"Hunkemoller"},{"productId":"aj-410077125_wht","imageUrl":"https://assets.ajio.com/medias/sys_master/root/hdc/h94/11287974314014/-473Wx593H-410077125-wht-MODEL.jpg","price":1198,"ecommerce":"ajio","brandName":"Hunkemoller"},{"productId":"aj-410081418_wht","imageUrl":"https://assets.ajio.com/medias/sys_master/root/h22/h0e/11281913282590/-473Wx593H-410081418-wht-MODEL.jpg","price":2495,"ecommerce":"ajio","brandName":"Hunkemoller"},{"productId":"aj-410074037_wht","imageUrl":"https://assets.ajio.com/medias/sys_master/root/hab/h26/11213021708318/-473Wx593H-410074037-wht-MODEL.jpg","price":1895,"ecommerce":"ajio","brandName":"Hunkemoller"},{"productId":"my-1355890","imageUrl":"https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/1355890/2016/6/10/11465562874682-Ferrica-by-Dream-of-Glory-Inc-White-Lace-Everyday-Bra-DOGIPATRIZIA-6981465562874462-1.jpg","price":559,"ecommerce":"myntra","brandName":"Ferrica by Dream of Glory Inc."}],
    products: [],
    productsLoading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_POST_FOR_PRODUCT_TAGGING:
            return { ...state, posts: action.payload.posts, pageNo: action.payload.pageNo, loading: false };
        case FETCH_POST_FOR_PRODUCT_TAGGING_LOADING:
            return { ...INITIAL_STATE, loading: true }
        case FETCH_VISUALLY_SIMILAR_PRODUCTS:
            return { ...state, products: [...action.payload.products, ...state.products], loading: false, productsLoading: false };
        case FETCH_VISUALLY_SIMILAR_PRODUCTS_LOADING:
            return { ...state, products: [], productsLoading: true }
        case FETCH_TEXTUALLy_SIMILAR_PROUCTS: {
            return { ...state, products: [...action.payload.productsArray, ...state.products], loading: false, productsLoading: false }
        }
        case FETCH_TEXTUALLy_SIMILAR_PROUCTS_LOADING: {
            return { ...state, products: [], productsLoading: true }
        }
        case UPDATE_TAGGED_PRODUCTS:
            return { ...state, updatedArray: false }


        default:
            return state;
    }
};
