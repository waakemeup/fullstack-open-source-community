import { RouterProvider } from "react-router-dom";
import router from "../router/router";

function View() {
  return <RouterProvider router={router} />;
}

export default View;
