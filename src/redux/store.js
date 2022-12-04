import { legacy_createStore as createStore ,combineReducers } from 'redux';

import detailReducer from "./reducers/detailReducer";

const reducers = combineReducers({
  detail : detailReducer
})
const store = createStore(reducers)


export default store;