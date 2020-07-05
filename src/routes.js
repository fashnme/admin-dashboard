import Dashboard from "./views/Dashboard.js";
// import UserProfile from "./views/UserProfile.js";
// import Typography from "./views/Typography.js";
import Icons from "./views/Icons.js";
import Maps from "./views/Maps.js";
import Notifications from "./views/Notifications.js";
import TagProducts from "./views/TagProducts.js";
import Orders from "./views/Orders.js";
import Order from './views/Order';

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/tag-products/:pageNo",
    name: "Tag Products",
    icon: "pe-7s-graph",
    component: TagProducts,
    layout: "/admin"
  },
  {
    path: "/orders",
    name: "Orders",
    icon: "pe-7s-graph",
    component: Orders,
    layout: "/admin"
  },
  {
    path: "/order/:id",
    name: "Order",
    icon: "pe-7s-graph",
    component: Order,
    layout: "/admin",
    invisible:true
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "pe-7s-science",
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "pe-7s-map-marker",
    component: Maps,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "pe-7s-bell",
    component: Notifications,
    layout: "/admin"
  }
];

export default dashboardRoutes;
