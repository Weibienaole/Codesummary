import React from 'react';
import Route from './router/Router'
import ErrorBoundary from './components/ErrorBoundary'
function App() {
  return (
    <>
      <ErrorBoundary>
        <Route />
      </ErrorBoundary>
    </>
  );
}

export default App;
