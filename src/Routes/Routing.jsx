import React from "react";

import { Route, Routes } from "react-router-dom";
import Login from "../pages/admin/login/Login";
import VerifyEmail from "../pages/admin/verifyEmail/VerifyEmail";
import RecoverAccount from "../pages/admin/recoverAccount/RecoverAccount";

import Layout from "../pages/admin/components/layout/Layout";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import UserManagement from "../pages/admin/userManagement/UserManagement";
import InviteUsers from "../pages/admin/userManagement/InviteUsers";
import ServiceProvider from "../pages/admin/serviceProvider/ServiceProvider";
import ActivityLogs from "../pages/admin/activityLogs/ActivityLogs";
import Disputes from "../pages/admin/serviceProvider/Disputes";
import DisputeDetails from "../pages/admin/serviceProvider/DisputeDetails";
import HealthcareProvider from "../pages/admin/healthcareProvider/HealthcareProvider";
import Performance from "../pages/admin/serviceProvider/Performance";
import ReviewCredential from "../pages/admin/healthcareProvider/ReviewCredential";
import MentalHealthScreeningDetail from "../pages/admin/healthcareProvider/MentalHealthScreeningDetail";
import MentalHealthScreening from "../pages/admin/healthcareProvider/MentalHealthScreening";
import SalesAndRevenue from "../pages/admin/analytics/SalesAndRevenue";


import CaseloadSummaries from "../pages/admin/healthcareProvider/CaseloadSummaries";
import AllCaseload from "../pages/admin/healthcareProvider/AllCaseload";
import Promotions from "../pages/admin/content/Promotions";
import Resource from "../pages/admin/content/Resource";
import Blog from "../pages/admin/content/Blog";

import Product from "../pages/admin/marketPlace/Product";
import AddProduct from "../pages/admin/marketPlace/AddProduct";
import MarketPromotions from "../pages/admin/marketPlace/MarketPromotions";
import PayoutRequests from "../pages/admin/order/PayoutRequests";

import TransactionHistory from "../pages/admin/order/TransactionHistory";
import General from "../pages/admin/settings/General";
import EscalatedTickets from "../pages/admin/support/EscalatedTickets";
import AllTickets from "../pages/admin/support/AllTickets";
import TicketDetails from "../pages/admin/support/TicketDetails";
import Refund from "../pages/admin/order/Refund";

import ProtectedRoute from "../pages/admin/components/ProtectedRoute";
import AutoLogin from "../pages/admin/components/AutoLogin";
import UserManagementProfile from "../pages/admin/userManagement/UserManagementProfile";
import ConsulationVolumes from "../pages/admin/analytics/ConsulationVolumes";
import ScreeningOutcomes from "../pages/admin/analytics/ScreeningOutcomes";
import UserEngagement from "../pages/admin/analytics/UserEngagement";
import ProviderVendor from "../pages/admin/analytics/ProviderVendor";
import CustomReport from "../pages/admin/analytics/CustomReport";

import MotherMessages from "../pages/admin/mothers/MotherMessages";
import AllMothers from "../pages/admin/mothers/AllMothers";
import BookingInformation from "../pages/admin/userManagement/BookingInformation";
import MotherProfile from "../pages/admin/userManagement/MotherProfile";
import SingleHealthCareProvider from "../pages/admin/healthcareProvider/SingleHealthCareProvider";
import SingleVendor from "../pages/admin/serviceProvider/SingleVendor";
import ServiceDetails from "../pages/admin/serviceProvider/auxiliary/ServiceDetails";
import CreateCommunity from "../pages/admin/communities/CreateCommunity";
import Communities from "../pages/admin/communities/Communities";
import Role from "../pages/admin/settings/Role";
import Permissions from "../pages/admin/settings/Permissions";
import NewRole from "../pages/admin/settings/NewRole";
import OrderDetail from "../pages/admin/order/OrderDetail";
import Order from "../pages/admin/order/Order";
import BlogDetail from "../pages/admin/content/BlogDetail";
import NewBlog from "../pages/admin/content/NewBlog";
import CreateAccount from "../pages/admin/createAccount/CreateAccount";
import NotFound from "../pages/admin/notFound/NotFound";

function Routing() {
  
  return (
    <AutoLogin>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/create-account" element={<CreateAccount />} />
        <Route path="/admin/verify-account" element={<VerifyEmail />} />
        <Route path="/admin/recover-account" element={<RecoverAccount />} />

        <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<Dashboard />} />

          {/* user management */}
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route path="/admin/user-management/profile" element={<UserManagementProfile />} />
          <Route path="/admin/user-management/booking-information" element={<BookingInformation />} />
          {/* <Route path="/admin/user-management/activity-logs" element={<ActivityLogs />} /> */}
          <Route
            path="/admin/user-management/invite-user"
            element={<InviteUsers />}
          />       





          {/* Mothers  */}
          <Route
            path="/admin/mothers"
            element={<AllMothers />}
          />               
          <Route
            path="/admin/mothers/single-mother"
            element={<MotherProfile />}
          />           
          <Route
            path="/admin/mothers/mother-messages"
            element={<MotherMessages />}
          />          





          {/* service providers */}
          <Route
            path="/admin/service-providers"
            element={<ServiceProvider />}
          />
          <Route
            path="/admin/service-provider/single-vendor"
            element={<SingleVendor />}
          />          
          <Route
            path="/admin/service-provider/single-vendor/service-details"
            element={<ServiceDetails />}
          />             
          {/* <Route
            path="/admin/service-provider/disputes"
            element={<Disputes />}
          /> */}
          <Route
            path="/admin/service-provider/performance"
            element={<Performance />}
          />
          <Route
            path="/admin/service-provider/disputes/:id"
            element={<DisputeDetails />}
          />





          {/* healthcare provider */}
          <Route
            path="/admin/healthcare-provider"
            element={<HealthcareProvider />}
          />
          <Route
            path="/admin/healthcare-provider/single-provider"
            element={<SingleHealthCareProvider />}
          />          
          <Route
            path="/admin/healthcare-provider/credentials-review"
            element={<ReviewCredential />}
          />
          {/* mental health screening */}
          <Route
            path="/admin/healthcare-provider/mental-health-screening"
            element={<MentalHealthScreening />}
          />
          <Route
            path="/admin/healthcare-provider/mental-health-screening/:id"
            element={<MentalHealthScreeningDetail />}
          />
          <Route path="/admin/healthcare-provider/caseloads" element={<CaseloadSummaries />} />
          <Route path="/admin/healthcare-provider/all-caseload" element={<AllCaseload />} />






          {/* blog */}
          <Route path="/admin/content/blog" element={<Blog />} />
          <Route path="/admin/content/new-blog" element={<NewBlog />} />
          <Route path="/admin/content/blog-detail" element={<BlogDetail />} />
          {/* <Route path="/admin/content/resource" element={<Resource />} /> */}
          {/* <Route path="/admin/content/promotions" element={<Promotions />} /> */}



          {/* marketplace */}
          <Route path="/admin/marketplace/manage-product" element={<Product />} />
          <Route path="/admin/marketplace/add-product" element={<AddProduct />} />
          <Route path="/admin/marketplace/edit-product" element={<AddProduct />} />
          {/* <Route path="/admin/marketplace/promotions" element={<MarketPromotions />} /> */}

          {/* order and transactions */}
          {/* <Route path="/admin/orders" element={<Order />} />
          <Route path="/admin/order/refunds" element={<Refund />} />
          <Route path="/admin/order/payout-requests" element={<PayoutRequests />} />
          <Route path="/admin/order/transaction-history" element={<TransactionHistory />} />
          <Route path="/admin/order/detail" element={<OrderDetail />} /> */}


          {/* support */}
          <Route path="/admin/support/all-tickets" element={<AllTickets />} />
          {/* <Route path="/admin/support/escalated-tickets" element={<EscalatedTickets />} /> */}
          <Route path="/admin/support/ticket-details/:id" element={<TicketDetails />} />

          {/* analytics */}
          {/* <Route path="/admin/analytics/sales" element={<SalesAndRevenue />} />
          <Route path="/admin/analytics/bookings" element={<ConsulationVolumes />} />
          <Route path="/admin/analytics/screening" element={<ScreeningOutcomes />} />
          <Route path="/admin/analytics/user-engagement" element={<UserEngagement />} />
          <Route path="/admin/analytics/provider-and-vendors" element={<ProviderVendor />} />
          <Route path="/admin/analytics/report-builder" element={<CustomReport />} /> */}


          {/* communities */}
          <Route path="/admin/communities/all-communities" element={<Communities />} />
          <Route path="/admin/communities/create" element={<CreateCommunity />} />



          {/* settings */}
          {/* <Route path="/admin/settings/general" element={<General />} />
          <Route path="/admin/settings/roles" element={<Role />} />
          <Route path="/admin/settings/roles/new" element={<NewRole />} />
          <Route path="/admin/settings/permissions" element={<Permissions />} /> */}
        </Route>

        <Route path="*" element={<NotFound />} />        
      </Routes>
    </AutoLogin>
  );
}

export default Routing;
