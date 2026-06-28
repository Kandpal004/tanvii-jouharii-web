import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import AnnouncementBar from "./components/AnnouncementBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import About from "./pages/About";
import Shop from "./pages/Shop";
import Collection from "./pages/Collection";
import ProductDetail from "./pages/ProductDetail";

// Scroll to top on every page change (except hash links)
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/collections/:handle" element={<Collection />} />
        <Route path="/products/:handle" element={<ProductDetail />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <AnnouncementBar />
        <Navbar />
        <CartDrawer />
        <main>
          <AnimatedRoutes />
        </main>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}
