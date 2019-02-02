pragma solidity ^0.5.0;

contract Voting {
    // Model a Candidate
    struct Candidate {
        uint id;
        // string name;
        string email;
        uint voteCount;
    }
    // Store accounts that have voted
    mapping (bytes32=>bool) public voters;
    // Store candidate
    // Read Candidate
    mapping (uint=>Candidate) public candidates;
    // Store Candidate Count
    // Using counterCache to determine how many Candidates are there after mapping
    // Helpful for accessing each Candidate inside loops
    uint private candidatesCount;
    uint private votersCount;
    // Constructor
    constructor () public { 
        // addAccount("john@sample.com", "john");
    }
    // Add Candidate
    function addAccount(string memory _email) public {
        bool uniqueEmail = isEmailUnique(_email);
        require(uniqueEmail, "Account already registered!");
        candidatesCount++;
        // Instantiate the candidate with hashed password
        candidates[candidatesCount] = Candidate(candidatesCount, _email, 0);
    }
    // Voting
    // Read candidate from mapping, increase voteCount from that candidate
    function vote(string memory _email, uint _id) public {
        bytes32 email = convertBytes32(_email);
        // Require that they haven't voted before
        require(!voters[email], "Voter has already voted!");
        // Require voter is valid
        require(!isEmailUnique(_email), "Voter not found!");
        // Require a valid candidate
        // require(!isEmailUnique(_candidateEmail), "Candidate not found!");

        // Record that the voter has voted, to ensure that the voter can vote once
        // Access the voter using msg.sender
        // Add the voter to voters mapping and set the value to true
        voters[email] = true;
        votersCount++;

        // Increase the vote count of the voted candidate
        // candidates[getID(_candidateEmail)].voteCount++;
        candidates[_id].voteCount++;
    }
    function getVoteCount(string memory _email) public view returns (uint) {
        // Check if account existed
        require(!isEmailUnique(_email), "Account doesn't exist");
        return candidates[getID(_email)].voteCount;
    }
    function getCandidatesCount() public view returns (uint) {
        return candidatesCount;
    }
    function getVotersCount() public view returns (uint) {
        return votersCount;
    }
    function getID(string memory _email) private view returns (uint) {
        bytes32 email = convertBytes32(_email);
        for (uint i = 1; i <= candidatesCount; i++) {    
            bytes32 candidateEmail = convertBytes32(candidates[i].email);
            if(email == candidateEmail) {
                return i;
            }
        }
        return 0;
    }
    // Check if email is unique
    function isEmailUnique(string memory _email) private view returns (bool){
        return (getID(_email) == 0);
    }
    // Convert string to bytes32
    function convertBytes32(string memory _str) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_str));
    }
    // Check if the registered user has voted by checking voters map using hashed email as key to the voters map
    function hasVoted(string memory _email) public view returns (bool) {
        // require(!isEmailUnique(_email), "Not registered");
        return voters[convertBytes32(_email)];
    }
}