import React from "react";

export default function Unauthorized({ onBack }) {
  return (
    <div>
      <p>You do not have permission to access the admin panel.</p>
      <button onClick={onBack}>Back</button>
    </div>
  );
}
