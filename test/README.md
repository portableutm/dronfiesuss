# Tools
To test we use mocha [Mocha](https://mochajs.org/) as a test runner
[Chai](https://www.chaijs.com/) for assertions.
[Istanbul](https://istanbul.js.org/) as a coverage tool

## How to run test
To run test you must have installed all dependencies (`npm install`). 
Then run `npm run test`

## How to run test coverage
To run test you must have installed all dependencies (`npm install`). 
Then run `npm run cover`
The cover report will be generated under coverage folder, open the `cover/index.html`


# About
Each test will start the server.
The test need to be secuential
Cron service will be disable. (the jobs, will be tested alone)
Each test that use database must start with: 
```javascript
    before(function (done) {
        this.timeout(TEST_TIMEOUT);
        initAsync()
            .then(done)
            .catch(done)
    })
```
# How add a test
Under the folder test, or a nested folder, you must add a file whose name ends in `test.ts`

