
const sqlite3 = require('sqlite3').verbose(); // requiring database system
const fs = require('fs'); // requiring file system to read db schema.sql
const path = require('path');


// Define table names as constants (refers to schema.db)
const USER_TABLE = 'User';
const CREDENTIALS_MANAGER_TABLE = 'CredentialsManager';
const PHONE_NUMBER_MANAGER_TABLE = 'PhoneNumberManager';

//const schemaFilePath = './db-schema.sql'; // database schema file path
//const databaseName = './database.db' // database name

//const schemaFilePath = path.join(__dirname, 'db-schema.sql');
//const databaseName = path.join(__dirname, './database.db');




/**
 * it handles the database connection inside this function so I can take more control over 
 * and call it in the main once the (main window is loaded).
 *  
 * it creates database connection and file
 * it calls the (create table function inside) as to when called in main the tables should be generated too
 * @returns database connection 
 */
function createDbConnection() {
  const dbConnection = new sqlite3.Database('./database.db', (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database....');  
     
      // creating those tables
    createTables(dbConnection);
    }
  });
  // Return the database connection in case it needs to be used outside the function
  return dbConnection;
};

// Create tables
function createTables(dbConnection) {
  const createUserTable = `
    CREATE TABLE IF NOT EXISTS User (
      UserID INTEGER PRIMARY KEY AUTOINCREMENT,
      FullName VARCHAR(255),
      Username VARCHAR(50),
      Password VARCHAR(100),
      HintForPassword VARCHAR(255)
    );
  `;

  const createCredentialsManagerTable = `
    CREATE TABLE IF NOT EXISTS CredentialsManager (
      CredentialID INTEGER PRIMARY KEY AUTOINCREMENT,
      UserID INT,
      Subject VARCHAR(255),
      Username VARCHAR(100),
      Password VARCHAR(100),
      FOREIGN KEY (UserID) REFERENCES User(UserID)
    );
  `;

  const createPhoneNumberManagerTable = `
    CREATE TABLE IF NOT EXISTS PhoneNumberManager (
      PhoneNumberID INTEGER PRIMARY KEY AUTOINCREMENT,
      UserID INT,
      PersonName VARCHAR(100),
      PhoneNumber VARCHAR(15),
      FOREIGN KEY (UserID) REFERENCES User(UserID)
    );
  `;

  dbConnection.run(createUserTable, (err) => {
    if (err) {
      console.error('Error creating User table:', err);
    } else {
      console.log('User table created successfully');
    }
  });

  dbConnection.run(createCredentialsManagerTable, (err) => {
    if (err) {
      console.error('Error creating CredentialsManager table:', err);
    } else {
      console.log('CredentialsManager table created successfully');
    }
  });

  dbConnection.run(createPhoneNumberManagerTable, (err) => {
    if (err) {
      console.error('Error creating PhoneNumberManager table:', err);
    } else {
      console.log('PhoneNumberManager table created successfully');
    }
  });
}



/**
 * it will be use to close the connection inside the functions that would actually query 
 * the logic for the database schema.
 * 
 * @param. that holds dbConnection 
 */
function closeDbConnection(dbConnection) {
  dbConnection.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
}


// INSERT data into 'USER' table
function insertUser(dbConnection, fullName, userName, password, hint) {
  dbConnection.run(`INSERT INTO ${USER_TABLE} (FullName, Username, Password, HintForPassword) VALUES (?, ?, ?, ?)`, [fullName, userName, password,hint], function(err) {
    if (err) {
      return console.error(err.message);
    } 
    console.log(`Row inserted with ID ${this.lastID}`);
  });
}



//Retrieve User ID 
function retrieveUserID(dbConnection, password) {
  return new Promise((resolve, reject) => {
    dbConnection.get(`SELECT UserID FROM ${USER_TABLE} WHERE Password = ?`, [password], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      // it handles the row if empty 
      if (row && row.UserID !== undefined) {
        const pass = row.UserID;  // table collumn name(Password)
        resolve(pass);
      } else {
        // Handle the case where no matching record is found
        resolve(null); // You can choose an appropriate value when there's no match
      }
    });
  });
}



//Retrieve Hint Pass
function retrieveHintPass(dbConnection, hint) {
  return new Promise((resolve, reject) => {
    dbConnection.get(`SELECT Password FROM ${USER_TABLE} WHERE HintForPassword = ?`, [hint], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      // it handles the row if empty 
      if (row && row.Password !== undefined) {
        const pass = row.Password;  // table collumn name(HintForPassword)
        resolve(pass);
      } else {
        // Handle the case where no matching record is found
        resolve(null); // You can choose an appropriate value when there's no match
      }
    });
  });
}


// -----------------  CREDENTIALS SYSTEM --------------------------------

// INSERT data into 'CRDENTAISL SYSTEM' table
function insertCredentialsSystem(dbConnection, userId, subject, userName, password) {
  dbConnection.run(`INSERT INTO ${CREDENTIALS_MANAGER_TABLE} (UserId, Subject, Username, Password) VALUES (?, ?, ?, ?)`, [userId, subject, userName, password], function(err) {
    if (err) {
      return console.error(err.message);
    } 
    console.log(`Row inserted with ID ${this.lastID}`);
  });
}


// RETRIEVE CREDENTIALS SYSTEM
function retrieveCredentialsManager(dbConnection, userId) {
  return new Promise((resolve, reject) => {
    dbConnection.all(`SELECT * FROM ${CREDENTIALS_MANAGER_TABLE} WHERE UserID = ?`, [userId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      // Handle the case where no matching record is found
      if (rows && rows.length > 0) {
        const credentialsData = rows.map(row => ({
          subject: row.Subject,
          userName: row.Username,
          password: row.Password
        }));
        
        resolve(credentialsData);
      } else {
        resolve(null);
      }
    });
  });
};


// Deletes credentials system row
function deleteCredentialsRow(dbConnection, userId, subject, userName, password) {
  
  console.log(`Attempting to delete row for UserID ${userId}, Subject ${subject}, Username ${userName}, Password ${password}`);

  dbConnection.run(`DELETE FROM ${CREDENTIALS_MANAGER_TABLE} WHERE UserID = ? AND Subject = ? AND Username = ? AND Password = ?`, [userId, subject, userName, password], function(err) {
    if (err) {
      console.error(`Error deleting row: ${err.message}`);
    } else {
      console.log(`Row deleted for UserID ${userId}`);
    }
  });
};



// -----------------  PHONE SYSTEM --------------------------------
// INSERT data into 'PHONE SYSTEM' table
function insertPhoneSystem(dbConnection, userId, personName, phoneNumber ) {
  dbConnection.run(`INSERT INTO ${PHONE_NUMBER_MANAGER_TABLE} (UserId, PersonName, PhoneNumber) VALUES (?, ?, ?)`, [userId, personName, phoneNumber], function(err) {
    if (err) {
      return console.error(err.message);
    } 
    console.log(`Row inserted with ID ${this.lastID}`);
  });
};


// RETRIEVE PHONE SYSTEM
function retrievePhoneManager(dbConnection, userId) {
  return new Promise((resolve, reject) => {
    dbConnection.all(`SELECT * FROM ${PHONE_NUMBER_MANAGER_TABLE} WHERE UserID = ?`, [userId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      // Handle the case where no matching record is found
      if (rows && rows.length > 0) {
        const phoneData = rows.map(row => ({
          PersonName: row.PersonName,
          PhoneNumber: row.PhoneNumber
        }));
        
        resolve(phoneData);
      } else {
        resolve(null);
      }
    });
  });
};


// Deletes credentials system row
function deletePhoneRow(dbConnection, userId, name, phoneNumber) {
  
  console.log(`Attempting to delete row for UserID ${userId}, Name ${name}, Phone Number ${phoneNumber}`);

  dbConnection.run(`DELETE FROM ${PHONE_NUMBER_MANAGER_TABLE} WHERE UserID = ? AND PersonName = ? AND PhoneNumber = ?`, [userId, name, phoneNumber], function(err) {
    if (err) {
      console.error(`Error deleting row: ${err.message}`);
    } else {
      console.log(`Row deleted for UserID ${userId}`);
    }
  });
};




// exporting functions and connection
module.exports = {
  createDbConnection,
  insertUser,
  closeDbConnection,
  retrieveUserID,
  retrieveHintPass,

  // credentials system
  insertCredentialsSystem,
  retrieveCredentialsManager,
  deleteCredentialsRow,

  //phone system
  insertPhoneSystem,
  retrievePhoneManager,
  deletePhoneRow
  };



  