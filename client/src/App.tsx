import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4">
              <h1 className="text-3xl font-bold text-gray-900">
                🛠️ GearGuard
              </h1>
            </div>
          </header>
          <main className="max-w-7xl mx-auto py-6 px-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Welcome to GearGuard Maintenance Management System
              </h2>
              <p className="text-gray-600">
                Your enterprise-grade maintenance management solution is ready for development!
              </p>
            </div>
          </main>
        </div>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
