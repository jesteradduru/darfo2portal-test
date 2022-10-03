// import DTS from "./DTS/DTS";
// import Homepage from "./Homepage/Homepage";
import Login from "./Login/Login";
import LoadingApp from "./LoadingApp/LoadingApp";
// import PageUnavailable from "./PageUnavailable/PageUnavailable";
// import AdminPanel from "./AdminPanel/AdminPanel";
// import Accounts from "./Accounts/Accounts";
// import Roles from "./Roles/Roles";
import {lazy} from 'react';
const DTS = lazy(() => import('./DTS/DTS'));
const Homepage = lazy(() => import('./Homepage/Homepage'))
// const Login = lazy(() => import('./Login/Login'))
const PageUnavailable = lazy(() => import('./PageUnavailable/PageUnavailable'))
const AdminPanel = lazy(() => import('./AdminPanel/AdminPanel'))
const Accounts = lazy(() => import('./Accounts/Accounts'))
const Roles = lazy(() => import('./Roles/Roles'));

export {
    DTS,
    Homepage,
    Login,
    LoadingApp,
    PageUnavailable,
    AdminPanel,
    Accounts,
    Roles
}