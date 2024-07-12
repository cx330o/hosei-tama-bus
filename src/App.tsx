import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import { useEffect } from "react";
import Home from "../src/pages/home";
import Discount from "../src/pages/discount/discount";
import Fuji from "../src/pages/discount/fuji";
import Hicheese from "../src/pages/discount/hicheese";
import Kokuterudo from "./pages/discount/kokuterudo";
import { ThemeProvider } from "./components/theme-provider";

const TRACKING_ID = "G-4F3PMM48SS";
if (TRACKING_ID) {
  ReactGA.initialize(TRACKING_ID);
}

const TrackPageViews = () => {
  const location = useLocation();
  useEffect(() => {
    if (TRACKING_ID) {
      ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    }
  }, [location]);

  return null;
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="tamap-theme">
      <BrowserRouter basename={import.meta.env.PROD ? "/tamap" : ""}>
        <TrackPageViews />
        <Routes>
          <Route
            path="/"
            element={
              <Home />
            }
          />
          <Route path="discount" element={<Discount />} />
          <Route path="fuji" element={<Fuji />} />
          <Route path="hicheese" element={<Hicheese />} />
          <Route path="kokuterudo" element={<Kokuterudo />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
