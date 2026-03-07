import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

import Dashboard from './pages/Dashboard/Dashboard'
import NotFound from './pages/NotFound/NotFound'

function App() {
  return (
    <HelmetProvider>
      <div className="bg-gray-100 min-vh-100">
        <Router>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </HelmetProvider>
  );
}

export default App;
