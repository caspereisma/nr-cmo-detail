import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CmoDetailPage from "./pages/CmoDetailPage";
import CmosOverviewPage from "./pages/CmosOverviewPage";

// Vite is configured with base "/nr-cmo-detail/" — match that here so the
// router's URLs align with how the app is served in dev and in GitHub Pages.
const BASENAME = "/nr-cmo-detail";

function App() {
  return (
    <BrowserRouter basename={BASENAME}>
      <Routes>
        <Route path="/" element={<Navigate to="/cmo-list" replace />} />
        <Route path="/cmo-list" element={<CmosOverviewPage />} />
        <Route path="/cmo-list/new" element={<CmoDetailPage mode="create" />} />
        <Route path="/cmo-list/:id" element={<CmoDetailPage mode="view" />} />
        <Route path="*" element={<Navigate to="/cmo-list" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
