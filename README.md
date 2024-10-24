# Cinema Tickets Service

This project implements a cinema ticket service using **Node.js** and **Express**. The service processes ticket purchases, handles seat reservations, and manages payments for different ticket types (Adult, Child, and Infant). It includes business logic for managing ticket rules, such as requiring an adult ticket for child and infant tickets, and limiting the total number of tickets that can be purchased.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server-side application.
- **Express.js**: Web framework for Node.js to handle HTTP requests.
- **Jest**: Testing framework for unit and integration tests.
- **Nodemon**: A tool for automatically restarting the Node.js application when file changes are detected during development.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/vishnu-vv/cinema-tickets-javascript
   cd cinema-tickets-javascript
   nvm use 20.18.0
   npm install
   ```

2. **Running the project**:

   ```bash
   npm start
   ```

3. **Running the tests**:

   ```bash
   npm test
   ```

## API Endpoints

1. **Purchase Tickets** `POST /ticket/purchase`

   Allows users to purchase tickets

   Request Body:

   ```bash
   {
     "accountId": 1,
     "tickets": {
       "ADULT": 2,
       "CHILD": 1,
       "INFANT": 1,
     }
   }
   ```
