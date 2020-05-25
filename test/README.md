# Tools
To test we use mocha [Mocha](https://mochajs.org/) as a test runner
[Chai](https://www.chaijs.com/) for assertions.
[Istanbul](https://istanbul.js.org/) as a coverage tool


# About
Each test will start the server.
The data will be the same every server restart (?)
The test need to be secuential
Cron service will be disable. (the jobs, will be tested alone)

# kind of test
*.api.test.ts -- test api
*.dao.test.ts -- dao test

