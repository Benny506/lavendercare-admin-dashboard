import { Route, Routes } from "react-router-dom";
import Login from "../pages/admin/login/Login";
import App from "../App";
import VerifyEmail from "../pages/admin/verifyEmail/VerifyEmail";
import RecoverAccount from "../pages/admin/recoverAccount/RecoverAccount";

import Layout from "../pages/admin/components/layout/Layout";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import UserManagement from "../pages/admin/userManagement/userManagement";
import InviteUsers from "../pages/admin/userManagement/InviteUsers";
import ServiceProvider from "../pages/admin/serviceProvider/ServiceProvider";
import ActivityLogs from "../pages/admin/activityLogs/ActivityLogs";
import Disputes from "../pages/admin/serviceProvider/Disputes";
import DisputeDetails from "../pages/admin/serviceProvider/DisputeDetails";
import HealthcareProvider from "../pages/admin/healthcareProvider/HealthcareProvider";
import Performance from "../pages/admin/serviceProvider/Performance";
import ReviewCredential from "../pages/admin/healthcareProvider/ReviewCredential";
import React from "react";
import MentalHealthScreeningDetail from "../pages/admin/healthcareProvider/MentalHealthScreeningDetail";
import MentalHealthScreening from "../pages/admin/healthcareProvider/MentalHealthScreening";


import CaseloadSummaries from "../pages/admin/healthcareProvider/CaseloadSummaries";
import AllCaseload from "../pages/admin/healthcareProvider/AllCaseload";
import Promotions from "../pages/admin/content/Promotions";
import Resource from "../pages/admin/content/Resource";
import Blog from "../pages/admin/content/Blog";

import Product from "../pages/admin/marketPlace/Product";
import AddProduct from "../pages/admin/marketPlace/AddProduct";
import ProductPreview from "../pages/admin/marketPlace/ProductPreview";
import MarketPromotions from "../pages/admin/marketPlace/MarketPromotions";
import PayoutRequests from "../pages/admin/order/PayoutRequests";
import ProtectedRoute from "../pages/admin/components/ProtectedRoute";
import AutoLogin from "../pages/admin/components/AutoLogin";
import UserManagementProfile from "../pages/admin/userManagement/UserManagementProfile";

function Routing() {
  return (
    <AutoLogin>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />
        {/* <Route path="/admin/create-account" element={<CreateAccount />} /> */}
        <Route path="/admin/verify-account" element={<VerifyEmail />} />
        <Route path="/admin/recover-account" element={<RecoverAccount />} />

        <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<Dashboard />} />


          {/* user management */}
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route path="/admin/user-management/profile" element={<UserManagementProfile />} />
          <Route path="/admin/activity-logs" element={<ActivityLogs />} />
          <Route
            path="/admin/user-management/invite-user"
            element={<InviteUsers />}
          />

          {/* service providers */}
          <Route
            path="/admin/service-providers"
            element={<ServiceProvider />}
          />
          <Route
            path="/admin/service-provider/disputes"
            element={<Disputes />}
          />
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
            path="/admin/credentials-review"
            element={<ReviewCredential />}
          />
          {/* mental health screening */}
          <Route
            path="/admin/mental-health-screening"
            element={<MentalHealthScreening />}
          />
          <Route
            path="/admin/mental-health-screening/:id"
            element={<MentalHealthScreeningDetail />}
          />
          <Route path="/admin/caseloads" element={<CaseloadSummaries />} />
          <Route path="/admin/all-caseload" element={<AllCaseload />} />

          {/* blog */}
          <Route path="/admin/content/blog" element={<Blog />} />
          <Route path="/admin/content/resource" element={<Resource />} />
          <Route path="/admin/content/promotions" element={<Promotions />} />



          {/* marketplace */}
          <Route path="/admin/marketplace/manage-product" element={<Product />} />
          <Route path="/admin/marketplace/add-product" element={<AddProduct />} />
          <Route path="/admin/marketplace/yoga-mat" element={<ProductPreview />} />
          <Route path="/admin/marketplace/promotions" element={<MarketPromotions />} />

          {/* order and transactions */}
          {/* <Route path="/admin/order" element={<Product />} /> */}
          <Route path="/admin/order/payout-requests" element={<PayoutRequests />} />
        </Route>
      </Routes>
    </AutoLogin>
  );
}

export default Routing;
