import React, { Component } from "react";
import { register } from "./UserFunctions";

// Imports for communicating to blockchain
import VotingContract from "../build/contracts/Voting.json";
import Web3 from "web3";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      account: "",
      web3: new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.setState({ account: this.state.web3.eth.coinbase });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    };

    this.addAccount();

    // Redirects users
    register(user).then(res => {
      this.props.history.push("/");
    });
  }

  addAccount() {
    const { email, account } = this.state;

    // Code that will link the blockchain
    let web3 = Web3();
    if (web3 === undefined || web3 === null) {
      // Specify default instance if no web3 instance provided
      web3 = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    }

    // const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    const contract = require("truffle-contract");
    const voting = contract(VotingContract);

    // alert("account: " + account);
    voting.setProvider(web3);
    voting
      .deployed()
      .then(instance => {
        return instance.addAccount(email, {
          from: account
        });
      })
      .catch(err => {
        alert("err: " + err);
      });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Enter Name"
                  value={this.state.name}
                  onChange={this.onChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter Email"
                  value={this.state.email}
                  onChange={this.onChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Enter password"
                  value={this.state.password}
                  onChange={this.onChange}
                  required
                />
              </div>
              <button className="btn btn-lg btn-primary btn-block">
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
