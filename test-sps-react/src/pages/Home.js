import React from "react";

function Home() {
  return (
    <div className="container">
      <h1 className="page-title">SPS REACT TEST</h1>
      <div style={{ textAlign: "center" }}>
        <a href="/users" className="btn btn-primary" style={{ display: "inline-block", marginBottom: "10px" }}>
          Usuários
        </a>
        <br />
        <a href="/signin" className="btn btn-secondary" style={{ display: "inline-block" }}>
          Login
        </a>
      </div>
    </div>
  );
}

export default Home;
