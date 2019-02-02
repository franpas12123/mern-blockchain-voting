import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

class Navbar extends Component {
  logout(e) {
    e.preventDefault();
    localStorage.removeItem("usertoken");
    this.props.history.push("/");
  }

  render() {
    const loginRegLink = (
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Login
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </li>
      </ul>
    );
    const voteLink = (
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <a href="/" onClick={this.logout.bind(this)} className="nav-link">
            Logout
          </a>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-expand-lg navbar-dar bg-dark rounded">
        {/* <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbar1"
          aria-controls="navbar1"
          aria-expanded="false"
          aria-label="Toogle navigation"
        >
          <span className="navbar-toogler-icon" />
        </button> */}

        <div
          className="collapse navbar-collapse justify-content-md-center"
          id="navbar1"
        >
          {/* <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
          </ul> */}
          {localStorage.usertoken ? voteLink : loginRegLink}
        </div>
      </nav>
    );
  }
}
export default withRouter(Navbar);
