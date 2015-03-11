## loopback-connector-redis

Redis connector for loopback

Documentation: TBD



## Customizing Redis configuration for tests/examples

By default, examples and tests from this module assume there is a Redis server
instance running on localhost at port 6379.




The .loopbackrc file is in JSON format, for example:

    {
        "dev": {
            "redis": {
                "host": "192.168.59.103",
                "port": 6379
            }
        },
        "test": {
            "redis": {
                "host": "192.168.59.103",
                "port": 6379
            }
        }
    }

**Note**: Redis databases with passwords are not supported at this point.

## Running tests

 Ensure Redis server is running and .loopbackrc has an entry as mentioned above
 * npm test - To run the test
 * npm run coverage - To find the code coverage

## Release notes
 Yet to be Released officially
