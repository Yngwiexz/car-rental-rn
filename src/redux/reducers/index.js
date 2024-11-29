import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./user";
import carSlice from './cars'
import orderSlice from './order';
import orderListSlice from './order/list';

const rootReducer = combineReducers({
    user: userSlice,
    cars: carSlice,
    order: orderSlice,
    orderList: orderListSlice,
})

export default rootReducer;
