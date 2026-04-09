import { useState } from "react";
import CmoDetailPage from "./pages/CmoDetailPage";
import CmosOverviewPage from "./pages/CmosOverviewPage";

function App() {
  const [currentPage, setCurrentPage] = useState<"overview" | "detail">("overview");

  return currentPage === "overview" ? (
    <CmosOverviewPage onNavigateToDetail={() => setCurrentPage("detail")} />
  ) : (
    <CmoDetailPage onNavigateBack={() => setCurrentPage("overview")} />
  );
}

export default App;
