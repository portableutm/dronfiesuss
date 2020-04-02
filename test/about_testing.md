# Tools
To test we use mocha as a test runner
Chai for assertions.
nyc and coverall as a coverage tool


# About
Each test will start the server.
The data will be the same every server restart (?)
The test need to be secuential
Cron service will be disable. (the jobs, will be tested alone)

# kind of test
*.api.test.ts -- test api
*.dao.test.ts -- dao test

