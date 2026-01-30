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
import CommunityChat from "../pages/admin/communities/CommunityChat";
import { VoiceNoteProvider } from "../hooks/chatHooks/voiceNotes/useVoiceNote";
import Orders from "../pages/admin/marketPlace/Orders";
import VariantCombinations from "../pages/admin/marketPlace/VariantCombinations";
import ServiceSetup from "../pages/admin/serviceProvider/ServiceSetup";
import Coupons from "../pages/admin/marketPlace/coupons/Coupons";
import CouponForm from "../pages/admin/marketPlace/coupons/CouponForm";
import CouponStats from "../pages/admin/marketPlace/coupons/CouponStats";
import PermissionCheck from "../pages/admin/components/permissions/PermissionCheck";

function Routing() {

  return (
    <AutoLogin>
      <VoiceNoteProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/create-account" element={<CreateAccount />} />
          <Route path="/admin/verify-account" element={<VerifyEmail />} />
          <Route path="/admin/recover-account" element={<RecoverAccount />} />





          {/* BLOGS  */}
          <Route path="/admin" element={
            <PermissionCheck
              permission_required={['content.delete', 'content.edit', 'content.create']}
            >
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            </PermissionCheck>
          }>
            <Route index element={<Blog />} />
            <Route path="/admin/content/blog" element={<Blog />} />
            <Route path="/admin/content/new-blog" element={<NewBlog />} />
            <Route path="/admin/content/edit-blog" element={<NewBlog />} />
            <Route path="/admin/content/blog-detail" element={<BlogDetail />} />
          </Route>





          {/* COMMUNITIES  */}
          <Route path="/admin" element={
            <PermissionCheck
              permission_required={['community.manage']}
            >
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            </PermissionCheck>
          }>
            <Route path="/admin/communities/all-communities" element={<Communities />} />
            <Route path="/admin/communities/create" element={<CreateCommunity />} />
            <Route path="/admin/communities/chat" element={<CommunityChat />} />
          </Route>





          {/* PRODUCTS  */}
          <Route path="/admin" element={
            <PermissionCheck
              permission_required={['products.manage']}
            >
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            </PermissionCheck>
          }>
            <Route path="/admin/marketplace/manage-product" element={<Product />} />
            <Route path="/admin/marketplace/manage-product/product-variants" element={<VariantCombinations />} />
            <Route path="/admin/marketplace/add-product" element={<AddProduct />} />
            <Route path="/admin/marketplace/edit-product" element={<AddProduct />} />
          </Route>





          {/* ORDERS */}
          <Route path="/admin" element={
            <PermissionCheck
              permission_required={['orders.manage']}
            >
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            </PermissionCheck>
          }>
            <Route path="/admin/marketplace/orders" element={<Orders />} />
          </Route>





          {/* COUPONS  */}
          <Route path="/admin" element={
            <PermissionCheck
              permission_required={['coupons.manage']}
            >
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            </PermissionCheck>
          }>
            <Route path="/admin/marketplace/coupons" element={<Coupons />} />
            <Route path="/admin/marketplace/coupons/create" element={<CouponForm />} />
            <Route path="/admin/marketplace/coupons/edit" element={<CouponForm />} />
            <Route path="/admin/marketplace/coupons/single-coupon-stats" element={<CouponStats />} />
          </Route>





          {/* PROVIDERS */}
          <Route path="/admin" element={
            <PermissionCheck
              permission_required={['providers.approve', 'providers.assign', 'services.edit', 'services.create', 'service.delete']}
            >
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            </PermissionCheck>
          }>
            <Route
              path="/admin/healthcare-provider"
              element={
                <PermissionCheck
                  permission_required={['providers.assign', 'services.edit', 'services.create', 'service.delete']}
                >
                  <HealthcareProvider />
                </PermissionCheck>
              }
            />
            <Route
              path="/admin/healthcare-provider/single-provider"
              element={
                <PermissionCheck
                  permission_required={['providers.assign', 'services.edit', 'services.create', 'service.delete']}
                >
                  <SingleVendor />
                </PermissionCheck>
              }
            />
            <Route
              path="/admin/healthcare-provider/credentials-review"
              element={
                <PermissionCheck
                  permission_required={['providers.approve']}
                >
                  <ReviewCredential />
                </PermissionCheck>
              }
            />
          </Route>





          {/* SERVICES */}
          <Route path="/admin" element={
            <PermissionCheck
              permission_required={['services.create', 'services.edit', 'services.delete']}
            >
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            </PermissionCheck>
          }>
            <Route
              path="/admin/services"
              element={<ServiceProvider />}
            />
            <Route
              path="/admin/services/single-provider/service-setup"
              element={<ServiceSetup />}
            />
            <Route
              path="/admin/services/single-provider/service-details"
              element={<ServiceDetails />}
            />
          </Route>





          {/* SCREENINGS */}
          <Route path="/admin" element={
            <PermissionCheck
              permission_required={['screenings.manage']}
            >
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            </PermissionCheck>
          }>
            <Route
              path="/admin/healthcare-provider/mental-health-screening"
              element={<MentalHealthScreening />}
            />
            <Route
              path="/admin/healthcare-provider/mental-health-screening/:id"
              element={<MentalHealthScreeningDetail />}
            />
          </Route>





          {/* User Mgt  */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/admin/user-management" element={
              <PermissionCheck
                permission_required={['care_coordinator', 'providers.assign']}
              >
                <UserManagement />
              </PermissionCheck>
            } />
            <Route
              path="/admin/mothers/mother-messages"
              element={
                <PermissionCheck
                  permission_required={['care_coordinator']}
                >
                  <MotherMessages />
                </PermissionCheck>
              } />
            <Route
              path="/admin/mothers/single-mother"
              element={
                <PermissionCheck
                  permission_required={['care_coordinator', 'providers.assign']}
                >
                  <MotherProfile />
                </PermissionCheck>
              }
            />
            <Route
              path="/admin/user-management/invite-user"
              element={
                <PermissionCheck
                  permission_required={['invite_user']}
                >
                  <InviteUsers />
                </PermissionCheck>
              }
            />
          </Route>




          {/* DASHBOARD  */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Route>





          {/* Roles & Permissions  */}
          <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/admin/settings/roles" element={<Role />} />
            <Route path="/admin/settings/roles/new" element={<NewRole />} />
            <Route path="/admin/settings/roles/edit" element={<NewRole />} />
            <Route path="/admin/settings/permissions" element={<Permissions />} />
          </Route>





          {/* GLOBAL */}
          <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            {/* support */}
            <Route path="/admin/support/all-tickets" element={<AllTickets />} />
            <Route path="/admin/support/ticket-details/:id" element={<TicketDetails />} />

            {/* settings */}
            <Route path="/admin/settings/general" element={<General />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </VoiceNoteProvider>
    </AutoLogin>
  );
}

export default Routing;
