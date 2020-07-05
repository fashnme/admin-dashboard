import { combineReducers } from 'redux';

import DashboardReducer from './DashboardReducer';
import PostsTaggingReducer from './PostsTaggingReducer';
import OrdersReducer from './OrdersReducer';
import OrderReducer from './OrderReducer';

export default combineReducers({
    dashboardReducer: DashboardReducer,
    postsTaggingReducer: PostsTaggingReducer,
    ordersReducer: OrdersReducer,
    orderReducer: OrderReducer
});
