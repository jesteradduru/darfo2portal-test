import { lazy } from "react";
const AddCommunication = lazy(() => import("./AddCommunication/AddCommunication"));
const MOC = lazy(() => import("./MOC/MOC"));
const Classfications = lazy(() => import("./Classifications/Classfications"));
const Drafts = lazy(() => import("./Drafts/Drafts"));
const Inbox = lazy(() => import("./Inbox/Inbox"));
const ViewCommunication = lazy(() => import("./ViewCommunication/ViewCommunication"));
const AddRouting = lazy(() => import("./AddRouting/AddRouting"));
const RoutingSlip = lazy(() => import("./RoutingSlip/RoutingSlip"));
const AddRoutingNote = lazy(() => import("./AddRoutingNote/AddRoutingNote"));
const ViewRouting = lazy(() => import("./ViewRouting/ViewRouting"));
const ViewTask = lazy(() => import("./ViewTask/ViewTask"));
const AddActionTaken = lazy(() => import("./AddActionTaken/AddActionTaken"));
const ReviewActionTaken = lazy(() => import("./ReviewActionTaken/ReviewActionTaken"));
const ViewActionStatus = lazy(() => import("./ViewActionStatus/ViewActionStatus"));
const Search = lazy(() => import("./Search/Search"));
const Reports = lazy(() => import("./Reports/Reports"));
const CommunicationLogs = lazy(() => import("./CommunicationLogs/CommunicationLogs"));
const Analytics = lazy(() => import("./Analytics/Analytics"));
const HelpCenter = lazy(() => import("./HelpCenter/HelpCenter"));

export {
    MOC,
    AddCommunication,
    Classfications,
    Drafts, 
    Inbox,
    ViewCommunication,
    AddRouting,
    RoutingSlip,
    AddRoutingNote,
    ViewRouting,
    ViewTask,
    AddActionTaken,
    ReviewActionTaken,
    ViewActionStatus,
    Search,
    Reports,
    CommunicationLogs,
    Analytics,
    HelpCenter
}