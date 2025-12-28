// import { BrowserRouter, Routes, Route } from "react-router-dom"
// import Rewards from "./pages/Rewards"
// import Login from "./pages/Login"
// import Signup from "./pages/Signup"
// import Sidebar from "./components/Sidebar"

// function AppLayout({ children }) {
//   return (
//     <div className="flex min-h-screen">
//       <div className="basis-1/10">
//         <Sidebar />
//       </div>
//       <div className="basis-9/10 p-6 overflow-auto">
//         {children}
//       </div>
//     </div>
//   )
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* AUTH ROUTES – FULL SCREEN */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         {/* APP ROUTES – WITH SIDEBAR */}
//         <Route
//           path="/"
//           element={
//             <AppLayout>
//               <Rewards />
//             </AppLayout>
//           }
//         />

//       </Routes>
//     </BrowserRouter>
//   )
// }


import { BrowserRouter, Routes, Route } from "react-router-dom"
import Rewards from "./pages/Rewards"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Sidebar from "./components/Sidebar"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <div className="basis-1/10">
        <Sidebar />
      </div>
      <div className="basis-9/10 p-6 overflow-auto">
        {children}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>

      {/* ✅ TOAST CONTAINER (GLOBAL) */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      <Routes>
        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* APP ROUTES */}
        <Route
          path="/"
          element={
            <AppLayout>
              <Rewards />
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
