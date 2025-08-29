import { BrowserRouter as Router } from "react-router-dom";
import {  QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppRoutes } from "./pages/routes"
import { Toaster } from "sonner";

import { queryClient } from "./lib/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
        <Toaster/>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
