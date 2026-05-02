import "./App.css";
import { ToastContainer } from "react-toastify";
import Routing from "./Routes/Routing";
import AppLoading from "./pages/admin/components/appLoading/AppLoading";
import AppCrash from "./pages/admin/appCrash/AppCrash";
import { ErrorBoundary } from "react-error-boundary"
import { AdminChatProvider } from "./contexts/AdminChatContext";
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {

  return (
    <ErrorBoundary fallback={<AppCrash />}>
      <Provider store={store}>
        <AdminChatProvider>
          <AppLoading />

          <ToastContainer />

          <Routing />
        </AdminChatProvider>
      </Provider>
    </ErrorBoundary>
  )

}

export default App;
