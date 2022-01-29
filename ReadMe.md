# Employee-View

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)



## Description
A command line application that allows businesses to view departments, job roles, and empolyees in a variet of ways as well as add new departments, job roles, and emplyees all through the command line. Employee role and manager can be updated and departments, roles and employees all deleted with ease.

    
![](/image.png)
  
## Table of Contents

* [Installation](#installation)
* [Built With](#built-with)
* [Usage](#usage)
* [Questions](#questions)

## Installation
Clone this repository to your local device. Ensure that MySQL is downloaded as well as node.js. Install mysql2 and inquirer with
```````````
npm install
````````````
from your command line in the root of the directory. Ensure that your local username and password are imputed in the connection2.js file in order to connect to MySQL. Start up the database by running 
``````````
source db/schema.sql 
``````````````````
in the command line of the commputer using you mysql username and password. 
    
## Usage
Once installed, run 
````````
npm start
`````````
in the root directory. Follow the prompts to input data. You can seed data by replacing the information in the seeds.sql file in the db directory and then running 
`````````
source db/seeds.sql 
`````````````````
after running the schema file.

[Example Walk Through Video](https://drive.google.com/file/d/1VctM82IGbUvILzCoMGz147G2Umefe8iP/view?usp=sharing)
  
## Built With

* NODE
* JAVASCRIPT
* INQUIRER
* MYSQL2
* MYSQL
    
## Credits
Danielle Knapp 
Database class code borrowed from americanwebdeveloper.com

## Questions
Please direct any questions to dmknapp2385@gmail.com or visit my [GitHub](https://github.com/dmknapp2385) for more information. 

## License
This projects is protected under [MIT](license.txt).
