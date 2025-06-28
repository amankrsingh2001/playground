import App from "@/App";
import Auth from "@/components/Auth";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path:'/',
        element:<App/>
    },{
        path:"/auth",
        element:<Auth/>
    }
])


export default router