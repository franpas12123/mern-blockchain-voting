import React, { Component } from "react";
import jwt_decode from "jwt-decode";

// Imports for communicating to blockchain
import VotingContract from "../build/contracts/Voting.json";
import Web3 from "web3";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      candidates_email: [],
      candidates_voteCount: [],
      candidates_name: [],
      candidates: [],
      candidatesCount: 0,
      account: "",
      hasVoted: false,
      contract: null,
      web3: new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    // // this.initWeb3();
    // this.getCandidates();
    // this.instantiateContract();
  }

  componentDidMount() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    const email = decoded.email;

    this.setState({
      name: decoded.name,
      email: email
    });

    // Code that will link the blockchain
    let web3 = Web3();
    if (web3 === undefined || web3 === null) {
      // Specify default instance if no web3 instance provided
      web3 = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    }
    // const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    const contract = require("truffle-contract");
    const voting = contract(VotingContract);
    voting.setProvider(web3);
    voting
      .deployed()
      .then(instance => {
        return instance.hasVoted(email);
      })
      .then(voted => {
        this.setState({ hasVoted: voted });
      })
      .catch(err => {
        alert("error ou: " + err);
      });
  }

  componentWillMount() {
    this.initContract();
    this.setState({ account: this.state.web3.eth.coinbase });
  }

  handleChange(event) {
    this.setState({ selectedCandidate: event.target.value });
  }

  onSubmit(event) {
    const {
      contract,
      email,
      candidates_email,
      candidatesCount,
      selectedCandidate,
      account
    } = this.state;

    let index = 0;

    for (let i = 0; i < candidatesCount; i++) {
      if (candidates_email[i] === selectedCandidate) {
        index = i;
        index++;
      }
    }

    contract
      .deployed()
      .then(instance => {
        return instance.vote(email, index, { from: account });
      })
      .catch(err => {
        alert("You have already voted!");
      });

    alert(
      "Success!" + "\r\nemail: " + email + "\r\ncandidate: " + selectedCandidate
    );

    this.setState({ hasVoted: true });

    // this.viewList();
    window.location = "/dashboard";
  }

  initContract() {
    const { candidates_email, candidates_voteCount } = this.state;

    // Code that will link the blockchain
    let web3 = Web3();
    if (web3 === undefined || web3 === null) {
      // Specify default instance if no web3 instance provided
      web3 = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    }
    // const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    const contract = require("truffle-contract");
    const voting = contract(VotingContract);
    let votingInstance;

    voting.setProvider(web3);

    this.setState({ contract: voting });

    voting
      .deployed()
      .then(instance => {
        votingInstance = instance;
        // Return an instance of candidatesCount
        return votingInstance.getCandidatesCount();
      })
      .then(count => {
        // Convert to number
        return count.toNumber();
      })
      .then(n => {
        this.setState({ candidatesCount: n });
        // Use converted number to determine the number of candidates

        // Reset state
        this.setState({ candidates_email: [] });
        this.setState({ candidates_voteCount: [] });

        for (let i = 1; i <= n; i++) {
          votingInstance.candidates(i).then(candidate => {
            //  Store previoue candidates
            // See Candidate struct from Voting contract
            // candidates[0] = id
            // candidates[1] = name
            // candidates[2] = email
            // candidates[3] = vote

            // Push candidates_email and candidates_voteCount states
            // candidates_name.push(candidate[1]);
            candidates_email.push(candidate[1]);
            candidates_voteCount.push(candidate[2].toNumber());

            if (i === 1) {
              this.setState({ selectedCandidate: candidate[1] });
            }
            // if (candidate[1] != email) {
            //   // Adding candidates to select
            //   candidates.push(candidate[1]);
            //   this.setState({ candidates: candidates });
            // }

            // Update states
            this.setState({ candidates_email: candidates_email });
            this.setState({ candidates_voteCount: candidates_voteCount });
          });
        }
      })
      .catch(err => {
        alert("error: " + err);
      });
  }

  render() {
    const {
      candidates_email,
      // candidates_name,
      candidates_voteCount,
      selectedCandidate,
      hasVoted
    } = this.state;
    const emailList = candidates_email.map((email, index) => (
      <p key={index + email}>{email}</p>
    ));
    // const nameList = candidates_name.map((name, index) => (
    //   <p key={index + name}>{name}</p>
    // ));
    const candidatesList = candidates_email.map((email, index) => (
      <option key={index} value={email}>
        {email}
      </option>
    ));
    const voteCountList = candidates_voteCount.map((vouteCount, index) => (
      <p key={index + vouteCount.toString()}>{vouteCount}</p>
    ));
    let select;
    if (!hasVoted) {
      select = (
        <div className="text-center col-sm-8 mx-auto" id="candidatesSelect">
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label htmlFor="candidatesSelect">
                <b>Select Candidate</b>
              </label>

              <select
                className="form-control text-center"
                id="candidatesSelect"
                value={selectedCandidate}
                onChange={this.handleChange}
              >
                {candidatesList}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Vote
            </button>
            <hr />
          </form>
          {/* <p id="accountAddress" className="text-center">
            Account: {this.state.account}
          </p> */}
        </div>
      );
    }

    return (
      // <Web3Provider>
      <div className="container">
        <div className="jumbotron mt-5">
          <div className="col-sm-8 mx-auto">
            <h1 className="text-center">CANDIDATES</h1>
          </div>
          <br />
          <br />
          <div className="col-sm-8 mx-auto">
            <table className="table col-md-6 mx-auto">
              <tbody className="text-center">
                <tr>
                  {/* <td>Name</td> */}
                  <th>Email</th>
                  <th>Vote Count</th>
                </tr>
                <tr>
                  {/* <td>{nameList}</td> */}
                  <td>{emailList}</td>
                  <td>{voteCountList}</td>
                </tr>
              </tbody>
            </table>
            {select}
          </div>
        </div>
      </div>
      // </Web3Provider>
    );
  }
}
export default Dashboard;
