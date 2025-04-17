import { useState } from 'react';
import './App.css';

function App() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Credit card validation function
  const validateCreditCard = (number) => {
    // Remove any spaces or dashes
    const cleanNumber = number.replace(/[\s-]/g, '');

    // Check if it's 16 digits and all are numbers
    if (!/^\d{16}$/.test(cleanNumber)) {
      return { valid: false, message: 'Card number must be 16 digits' };
    }

    // Check if there are at least two different digits
    const uniqueDigits = new Set(cleanNumber.split(''));
    if (uniqueDigits.size < 2) {
      return { valid: false, message: 'Card must have at least two different digits' };
    }

    // Check if the final digit is even
    const lastDigit = parseInt(cleanNumber.charAt(15));
    if (lastDigit % 2 !== 0) {
      return { valid: false, message: 'Final digit must be even' };
    }

    // Check if the sum of all digits is greater than 16
    const sum = cleanNumber.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    if (sum <= 16) {
      return { valid: false, message: 'Sum of all digits must be greater than 16' };
    }

    return { valid: true, message: 'Credit card is valid' };
  };

  // Expiry date validation function (extra feature)
  const validateExpiryDate = (date) => {
    // Check format MM/YY
    if (!/^\d{2}\/\d{2}$/.test(date)) {
      return { valid: false, message: 'Expiry date must be in MM/YY format' };
    }

    const [month, year] = date.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last two digits of year
    const currentMonth = currentDate.getMonth() + 1; // January is 0

    // Convert to numbers
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    // Check if month is valid (1-12)
    if (monthNum < 1 || monthNum > 12) {
      return { valid: false, message: 'Month must be between 1 and 12' };
    }

    // Check if the card is expired
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      return { valid: false, message: 'Card is expired' };
    }

    return { valid: true, message: 'Expiry date is valid' };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate credit card
    const cardValidation = validateCreditCard(cardNumber);

    // Validate expiry date if provided
    let expiryValidation = { valid: true };
    if (expiryDate) {
      expiryValidation = validateExpiryDate(expiryDate);
    }

    // Card is valid only if both validations pass
    if (cardValidation.valid && expiryValidation.valid) {
      setIsValid(true);
      setErrorMessage('Credit card is valid!');
    } else {
      setIsValid(false);
      setErrorMessage(cardValidation.valid ? expiryValidation.message : cardValidation.message);
    }
  };

  // Format credit card number with spaces for better readability
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value;

    // Remove any non-digit characters except for the slash
    value = value.replace(/[^\d\/]/g, '');

    // Add slash after 2 digits if not already there
    if (value.length === 2 && !value.includes('/')) {
      value += '/';
    }

    // Limit to 5 characters (MM/YY)
    if (value.length <= 5) {
      setExpiryDate(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Credit Card Validator</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Credit Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="XXXX XXXX XXXX XXXX"
              maxLength="19" // 16 digits + 3 spaces
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date (MM/YY)
            </label>
            <input
              type="text"
              id="expiryDate"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              placeholder="MM/YY"
              maxLength="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Validate Card
          </button>
        </form>

        {isValid !== null && (
          <div className={`mt-6 p-4 rounded-md ${isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-medium">{errorMessage}</p>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Valid Examples:</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>9999-9999-8888-0000</li>
            <li>6666-6666-6666-1666</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Invalid Examples:</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>a923-3211-9c01-1112 (invalid characters)</li>
            <li>4444-4444-4444-4444 (only one type of number)</li>
            <li>1111-1111-1111-1110 (sum less than 16)</li>
            <li>6666-6666-6666-6661 (odd final number)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
