// ATM Machine JavaScript

// Account class to manage account information
class Account {
  constructor(username, password, balance = 0) {
    this.username = username;
    this.password = password;
    this.balance = balance;
  }
}

// ATM class to manage ATM functionality
class ATM {
  constructor() {
    this.accounts = [];
    this.currentAccount = null;
    this.transactionType = null;
  }

  // Create a new account
  createAccount(username, password) {
    if (this.findAccount(username)) {
      return 'Account already exists';
    }
    const account = new Account(username, password);
    this.accounts.push(account);
    return 'Account created successfully';
  }

  // Login to an existing account
  login(username, password) {
    const account = this.findAccount(username);
    if (account && account.password === password) {
      this.currentAccount = account;
      return 'Login successful';
    }
    return 'Invalid username or password';
  }

  // Find account by username
  findAccount(username) {
    return this.accounts.find(account => account.username === username);
  }

  // Check balance
  getBalance() {
    return this.currentAccount ? this.currentAccount.balance : null;
  }

  // Deposit money
  deposit(amount) {
    if (this.currentAccount) {
      this.currentAccount.balance += parseFloat(amount);
      return `Deposit successful. New balance: $${this.currentAccount.balance.toFixed(2)}`;
    }
    return 'No account logged in';
  }

  // Withdraw money
  withdraw(amount) {
    if (this.currentAccount) {
      if (this.currentAccount.balance >= amount) {
        this.currentAccount.balance -= parseFloat(amount);
        return `Withdrawal successful. New balance: $${this.currentAccount.balance.toFixed(2)}`;
      }
      return 'Insufficient funds';
    }
    return 'No account logged in';
  }
}

// Initialize ATM
const atm = new ATM();

// DOM Elements
const loginCreateAccountDiv = document.querySelector('.login-create-account');
const loginFormDiv = document.querySelector('.login-form');
const createAccountFormDiv = document.querySelector('.create-account-form');
const atmInterfaceDiv = document.querySelector('.atm-interface');
const balanceDisplay = document.getElementById('balance-display');
const messageDisplay = document.getElementById('message-display');
const userDisplayText = document.getElementById('user-display-text');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  const atmMachine = document.querySelector('.atm-machine');
  const initialScreen = document.querySelector('.initial-screen');
  const enterButton = document.querySelector('.enter-button');
  const Screen = document.querySelector('.screen');
  const loginCreateAccountScreen = document.querySelector('.login-create-account');
  
  enterButton.addEventListener('click', function() {
    atmMachine.classList.add('flip');
    setTimeout(function() {
      initialScreen.style.display = "none";
      Screen.style.display = "block";
      loginCreateAccountScreen.style.display = "flex";
    }, 1000);
  });

});

document.querySelector('.login-button').addEventListener('click', () => {
  loginFormDiv.style.display = 'block';
  createAccountFormDiv.style.display = 'none';
  atmInterfaceDiv.style.display = 'none';
});

document.querySelector('.create-account-button').addEventListener('click', () => {
  createAccountFormDiv.style.display = 'block';
  loginFormDiv.style.display = 'none';
  atmInterfaceDiv.style.display = 'none';
});

document.querySelector('.login-submit').addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const loginMessage = atm.login(username, password);
  messageDisplay.textContent = loginMessage;

  if (loginMessage === 'Login successful') {
    loginFormDiv.style.display = 'none';
    atmInterfaceDiv.style.display = 'block';
    balanceDisplay.textContent = `Balance: $${atm.getBalance().toFixed(2)}`;
    userDisplayText.textContent = `User: ${username}`;
  }
});

document.querySelector('.create-account-submit').addEventListener('click', () => {
  const username = document.getElementById('new-username').value;
  const password = document.getElementById('new-password').value;
  const createAccountMessage = atm.createAccount(username, password);
  messageDisplay.textContent = createAccountMessage;

  if (createAccountMessage === 'Account created successfully') {
    createAccountFormDiv.style.display = 'none';
    loginFormDiv.style.display = 'block';
  }
});

document.querySelectorAll('.option-button').forEach(button => {
  button.addEventListener('click', (event) => {
    const option = event.target.value;

    switch (option) {
      case 'withdraw':
      case 'deposit':
        atm.transactionType = option;
        messageDisplay.textContent = `Enter amount to ${option}:`;
        break;
      case 'balance':
        messageDisplay.textContent = `Current balance: $${atm.getBalance().toFixed(2)}`;
        break;
      case 'back':
        atm.currentAccount = null;
        atmInterfaceDiv.style.display = 'none';
        loginCreateAccountDiv.style.display = 'flex';
        messageDisplay.textContent = '';
        userDisplayText.textContent = '';
        atm.transactionType = null;
        break;
    }
  });
});

document.querySelectorAll('.num-button').forEach(button => {
  button.addEventListener('click', (event) => {
    const value = event.target.value;
    const currentText = messageDisplay.textContent;
    if (atm.transactionType && currentText.includes('Enter amount')) {
      messageDisplay.textContent += value;
    }
  });
});

document.querySelector('.func-button[value="enter"]').addEventListener('click', () => {
  const currentText = messageDisplay.textContent;
  if (atm.transactionType && currentText.includes('Enter amount')) {
    const amount = parseFloat(currentText.replace(`Enter amount to ${atm.transactionType}:`, ''));
    if (!isNaN(amount)) {
      if (atm.transactionType === 'withdraw') {
        messageDisplay.textContent = atm.withdraw(amount);
      } else if (atm.transactionType === 'deposit') {
        messageDisplay.textContent = atm.deposit(amount);
      }
      balanceDisplay.textContent = `Balance: $${atm.getBalance().toFixed(2)}`;
      atm.transactionType = null;
    } else {
      messageDisplay.textContent = 'Invalid amount';
    }
  }
});

document.querySelector('.func-button[value="clear"]').addEventListener('click', () => {
  if (atm.transactionType) {
    messageDisplay.textContent = `Enter amount to ${atm.transactionType}:`;
  }
});
