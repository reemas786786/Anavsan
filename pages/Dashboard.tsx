// FIX: Add a default export to make this file a module and resolve the import error.
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="text-text-primary">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-text-secondary">Dashboard content will be displayed here.</p>
    </div>
  );
};

export default Dashboard;
