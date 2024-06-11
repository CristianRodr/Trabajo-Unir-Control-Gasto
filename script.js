'use strict';

/******************************************************************
 * App Cuenta
 *****************************************************************/

// Data, simulando ingreso API
const cuenta1 = {
  propietario: 'Cristian Rodriguez',
  movimientos: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interesTasa: 1.2, // %
  pin: 1111,
};

const cuenta2 = {
  propietario: 'Felipe Quintero',
  movimientos: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interesTasa: 1.5,
  pin: 2222,
};

const cuenta3 = {
  propietario: 'Camilo Soto',
  movimientos: [200, -200, 340, -300, -20, 50, 400, -460],
  interesTasa: 0.7,
  pin: 3333,
};

const cuenta4 = {
  propietario: 'Miguel Mejia',
  movimientos: [430, 1000, 700, 50, 90],
  interesTasa: 1,
  pin: 4444,
};

 /*                     variables
 *---------------------------------------------------------*/

const accounts = [cuenta1, cuenta2, cuenta3, cuenta4];

// Elementos
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const contenedorMovimientos = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/*-------------------------------------------------------------*/

const displayMovements = function(movimientos, sort = false) {
  contenedorMovimientos.innerHTML = '';

  const movs = sort ? movimientos.slice().sort((a, b) => a - b) : movimientos;

  movs.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposito' : 'retiro';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}$</div>
      </div>    
    `;

    contenedorMovimientos.insertAdjacentHTML('afterbegin', html)
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movimientos.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}$`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movimientos
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}$`;

  const out = acc.movimientos
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}$`;

  const interest = acc.movimientos
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interesTasa) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}$`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.propietario
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  // Display movimientos
  displayMovements(acc.movimientos);

  // Display balance
  calcDisplayBalance(acc);

  // Display contador
  calcDisplaySummary(acc);
};

// Event en cabeza
let currentAccount;

btnLogin.addEventListener('click', function (e) {

  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {

    labelWelcome.textContent = `Bienvenido, ${
      currentAccount.propietario.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // limpiar
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();


    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Transferencia
    currentAccount.movimientos.push(-amount);
    receiverAcc.movimientos.push(amount);

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movimientos.some(mov => mov >= amount * 0.1)) {
    // agregar movimientos
    currentAccount.movimientos.push(amount);

    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // Borrar cuenta
    accounts.splice(index, 1);


    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movimientos, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////


