import "./App.css";
import { ToastContainer } from "react-toastify";
import Routing from "./Routes/Routing";
import AppLoading from "./pages/admin/components/appLoading/AppLoading";
import AppCrash from "./pages/admin/appCrash/AppCrash";
import { ErrorBoundary } from "react-error-boundary"

function App() {

  return (
    <ErrorBoundary fallback={<AppCrash />}>
      <AppLoading />    

      <ToastContainer />

      <Routing />
    </ErrorBoundary>
  )

}

export default App;
