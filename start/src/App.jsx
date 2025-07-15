import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";


const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello World</div>,
  },
  {
    path: "/auth",
    element: <AdminLayout />,
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App