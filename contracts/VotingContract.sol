// VotingContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract VotingContract {
    // Структура для представлення реєстраційних даних виборця
    struct VoterRegistration {
        uint256 registrationDateTime;
        address walletAddress;
        uint256 numberOfTokens;
    }

    // Структура для представлення голосу виборця
    struct VoteData {
        uint256 voteDateTime;
        address walletAddress;
        string voteResult;
    }

    // Мапа для зберігання реєстраційних даних виборців
    mapping(address => VoterRegistration) public voterRegistrations;

    // Масив для зберігання голосів
    VoteData[] public votes;

    // Функція реєстрації виборця
    function registerVoter(uint256 _numberOfTokens) public {
        require(voterRegistrations[msg.sender].registrationDateTime == 0, "Voter already registered");
        require(_numberOfTokens > 0, "Number of tokens should be greater than 0");

        // Збереження реєстраційних даних виборця
        voterRegistrations[msg.sender] = VoterRegistration({
            registrationDateTime: block.timestamp,
            walletAddress: msg.sender,
            numberOfTokens: _numberOfTokens
        });
    }

    // Функція голосування
    function vote(string memory _voteResult) public {
        require(voterRegistrations[msg.sender].registrationDateTime > 0, "Voter not registered");
        require(voterRegistrations[msg.sender].numberOfTokens > 0, "Insufficient tokens");

        // Збереження голосу
        votes.push(VoteData({
            voteDateTime: block.timestamp,
            walletAddress: msg.sender,
            voteResult: _voteResult
        }));

        // Зменшення кількості токенів у реєстрації
        voterRegistrations[msg.sender].numberOfTokens--;
    }
}
