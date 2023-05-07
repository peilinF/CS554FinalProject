import { combineReducers } from "@reduxjs/toolkit";

import logbookReducer from "./logbookReducer.js";
import chatroomReducer from "./chatroomReducer.js";

const rootReducer = combineReducers({
  chatroom: chatroomReducer,
  logbook: logbookReducer,
});

export default rootReducer;
