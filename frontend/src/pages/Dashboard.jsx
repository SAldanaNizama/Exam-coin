import React from "react";
import AddStudent from "../components/AddStudent";
import AssignCoins from "../components/AssignCoins";

const Dashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <AddStudent />
      <AssignCoins />
    </div>
  );
};

export default Dashboard;
