# Tools

These are the testing tools we are using:

- [Mocha](https://mochajs.org/) as a test runner
- [Chai](https://www.chaijs.com/) for assertions
- [Istanbul](https://istanbul.js.org/) as a coverage tool

## How to run the tests
* First make sure you have installed all the required dependencies with `npm install`. 
* Also make sure you have a proper `.env` file, see the [Setup instructions](../README.md#Setup).
* Run `npm run test`

## How to run test coverage

After you are able to run the tests as per the previous section, run `npm run cover`. The cover report will be generated under `coverage/` folder; review the coverage results by opening the `coverage/index.html`.


# About

* Each test will start the testing engine.
* The tests are run sequentially.
* The Cron service is disabled while running the tests: the cronjobs will be tested separately.
* Each test that use database must start with: 
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

