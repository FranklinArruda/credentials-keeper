
const sqlite3 = require('sqlite3').verbose(); // requiring database system
const fs = require('fs'); // requiring file system to read db schema.sql

// Define table names as constants (refers to schema.db)
const USER_TABLE = 'User';
const CREDENTIALS_MANAGER_TABLE = 'CredentialsManager';
const PHONE_NUMBER_MANAGER_TABLE = 'PhoneNumberManager';

const schemaFilePath = './server/db-schema.sql'; // database schema file path
const databaseName = './server/database.db' // database name


/**
 * it handles the database connection inside this function so I can take more control over 
 * and call it in the main once the (main window is loaded).
 *  
 * it creates database connection and file
 * it calls the (create table function inside) as to when called in main the tables should be generated too
 * @returns database connection 
 */
function createDbConnection() {
  const dbConnection = new sqlite3.Database(databaseName, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');  
     // creating those tables
    createTable(schemaFilePath,dbConnection);
    }
  });
  // Return the database connection in case it needs to be used outside the function
  return dbConnection;
};



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




// createTable function (unchanged)
function createTable(schemaFilePath, dbConnection) {
    const schema = fs.readFileSync(schemaFilePath, 'utf-8');
    dbConnection.exec(schema, (err) => {
      if (err) {
        console.error('Error creating tables:', err);
      } else {
        console.log('Tables created successfully');
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


// exporting functions and connection
module.exports = {
  createDbConnection,
  insertUser,
  closeDbConnection
  };
  