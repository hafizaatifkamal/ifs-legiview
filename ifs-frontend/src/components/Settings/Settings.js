import React from "react";
import { useState } from "react";

import "./Settings.css";
import CreateUser from "./CreateUser";
import RoleManagement from "./RoleManagement";

function Settings() {
  const [activeTab, setActiveTab] = useState(1);
  // console.log(activeTab, "activeTab");

  const activeTabComponent = (id) => {
    if (id === 1) {
      return <CreateUser />;
    }

    if (id === 2) {
      return <RoleManagement />;
    }
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setActiveTab(1)}
          className={activeTab === 1 ? "active-tab" : null}
        >
          <h2>Create a user</h2>
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setActiveTab(2)}
          className={activeTab === 2 ? "active-tab" : null}
        >
          <h2>Role Management</h2>
        </div>
      </div>
      {activeTabComponent(activeTab)}
    </div>
  );
}

export default Settings;
