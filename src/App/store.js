/*
    This file stores reducers that manages states of the app
*/
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/Portal/userSlice";
import accountsReducer from '../features/Portal/accountsSlice'
import officesReducer from '../features/Portal/officesSlice'
import rolesReducer from '../features/Portal/rolesSlice'
import classificationsReducer from "../features/dts/classifications/classifications";
import draftsReducer from '../features/dts/drafts/draftsSlice'
import communicationSlice from '../features/dts/communications/communications'
import inboxSlice from '../features/dts/inbox/inboxSlice'
import tasksSlice from "../features/dts/tasks/tasksSlice";
import routingSlice from "../features/dts/routing/routingSlice";
import actionSlice from "../features/dts/action/actionSlice";
import trailSlice from "../features/dts/trail/trailSlice";
import reportSlice from "../features/dts/reports/reportSlice";
import logsSlice from "../features/dts/logs/logsSlice";
import uploadsSlice from "../features/dts/uploads/uploadsSlice";
const store = configureStore({
    reducer: {
        user: userReducer,
        accounts: accountsReducer,
        offices: officesReducer,
        roles: rolesReducer,
        classifications: classificationsReducer,
        drafts: draftsReducer,
        communication: communicationSlice,
        inbox: inboxSlice,
        tasks: tasksSlice,
        routing: routingSlice,
        action: actionSlice,
        trail: trailSlice,
        reports: reportSlice,
        logs: logsSlice,
        uploads: uploadsSlice
    }
})

export default store;