import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import Web3 from 'web3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
  host: 'localhost',//'your_host_name',
  user: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'my_db',
});

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.net.isListening()
  .then(() => console.log('Connected to Ethereum network'))
  .catch(error => console.error('Error connecting to Ethereum network:', error));

// Обробник для кореневого шляху
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Реєстрація виборця
app.post('/register', async (req, res) => {
  try {
    const { walletAddress, numberOfTokens } = req.body;

    const balance = await web3.eth.getBalance(walletAddress);
    if (balance < numberOfTokens) {
      return res.status(400).json({ error: 'Insufficient tokens in the wallet.' });
    }

    const registrationData = {
      registrationDateTime: new Date(),
      walletAddress,
      numberOfTokens,
    };

    connection.query('INSERT INTO voter_registration SET ?', registrationData, (error, results) => {
      if (error) {
        console.error('Error saving registration data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(200).json({ message: 'Registration successful!' });
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Голосування
app.post('/vote', async (req, res) => {
  try {
    const { walletAddress, voteResult } = req.body;

    connection.query('SELECT * FROM voter_registration WHERE walletAddress = ?', [walletAddress], async (error, results) => {
      if (error) {
        console.error('Error checking voter registration:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.length === 0 || results[0].numberOfTokens <= 0) {
        return res.status(400).json({ error: 'Invalid registration or insufficient tokens.' });
      }

      const voteData = {
        voteDateTime: new Date(),
        walletAddress,
        voteResult,
      };

      connection.query('INSERT INTO vote_data SET ?', voteData, (error, results) => {
        if (error) {
          console.error('Error saving vote data:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        connection.query('UPDATE voter_registration SET numberOfTokens = numberOfTokens - 1 WHERE walletAddress = ?', [walletAddress], (error, results) => {
          if (error) {
            console.error('Error updating token balance:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          return res.status(200).json({ message: 'Vote recorded successfully!' });
        });
      });
    });
  } catch (error) {
    console.error('Error during voting:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Сервер слухає на порті 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
