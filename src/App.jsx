import { Link } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import Routing from "./Routes/Routing";
import AppLoading from "./pages/admin/components/appLoading/AppLoading";

function App() {

  return (
    <>
      <AppLoading />    

      <ToastContainer />

      <Routing />
    </>
  )

}

export default App;
