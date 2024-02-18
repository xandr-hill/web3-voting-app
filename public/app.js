document.addEventListener('DOMContentLoaded', async () => {
  // Змініть URL свого локального сервера
  const serverUrl = 'http://localhost:3000';
  const contractAddress = 'your_contract_address'; // Замініть на адресу свого контракту

  // Підключення до вашого контракту Solidity
  const web3 = new Web3(Web3.givenProvider);
  const contract = new web3.eth.Contract(CONTRACT_ABI, contractAddress); // Замініть CONTRACT_ABI на ABI свого контракту

  // Функція для реєстрації виборця
  const registerVoter = async () => {
    const walletAddress = document.getElementById('walletAddress').value;
    const numberOfTokens = parseInt(document.getElementById('numberOfTokens').value);

    try {
      // Виклик методу контракту для реєстрації виборця
      const result = await contract.methods.registerVoter(walletAddress, numberOfTokens).send({ from: walletAddress });

      alert(result.message);
    } catch (error) {
      console.error('Error during voter registration:', error.message);
      alert('Registration failed. Please try again.');
    }
  };

  // Функція для голосування
  const submitVote = async () => {
    const walletAddressVote = document.getElementById('walletAddressVote').value;
    const voteResult = document.getElementById('voteResult').value;

    try {
      // Виклик методу контракту для голосування
      const result = await contract.methods.vote(walletAddressVote, voteResult).send({ from: walletAddressVote });

      alert(result.message);
    } catch (error) {
      console.error('Error during voting:', error.message);
      alert('Voting failed. Please try again.');
    }
  };

  // Перевірка наявності MetaMask
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      // Запит на підключення до гаманця MetaMask
      await window.ethereum.enable();
      console.log('Connected to MetaMask');
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      alert('MetaMask connection failed. Please make sure it is installed and unlocked.');
    }
  } else {
    console.error('MetaMask not detected');
    alert('MetaMask not detected. Please install and activate MetaMask to use this application.');
  }

  // Прикріплення функцій до кнопок
  document.getElementById('registrationForm').addEventListener('submit', (event) => {
    event.preventDefault();
    registerVoter();
  });

  document.getElementById('votingForm').addEventListener('submit', (event) => {
    event.preventDefault();
    submitVote();
  });
});
