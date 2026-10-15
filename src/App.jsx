import { Outlet, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ScanPet from "./pages/ScanPet";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/Dashboard";
import MyPets from "./pages/MyPets";
import AddPet from "./pages/AddPet";
import EditPet from "./pages/EditPet";
import PetDetails from "./pages/PetDetails";
import PetQRCode from "./pages/PetQRCode";
import LostPet from "./pages/LostPet";
import Profile from "./pages/Profile";

// Public pages: top navbar + footer
const PublicLayout = () => (
  <>
    <Navbar />
    <main className="page">
      <Outlet />
    </main>
    <Footer />
  </>
);

// Logged-in pages: top navbar + sidebar
const AppLayout = () => (
  <>
    <Navbar />
    <div className="app-shell">
      <Sidebar />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  </>
);

const App = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/scan" element={<ScanPet />} />
      <Route path="/scan/:petId" element={<ScanPet />} />
    </Route>

    <Route
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pets" element={<MyPets />} />
      <Route path="/pets/add" element={<AddPet />} />
      <Route path="/pets/:id" element={<PetDetails />} />
      <Route path="/pets/:id/edit" element={<EditPet />} />
      <Route path="/pets/:id/qr" element={<PetQRCode />} />
      <Route path="/lost" element={<LostPet />} />
      <Route path="/profile" element={<Profile />} />
    </Route>

    <Route element={<PublicLayout />}>
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default App;