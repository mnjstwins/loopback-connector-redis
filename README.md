## loopback-connector-redis

Redis connector for loopback

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

**Note**: username/password is only required if the Redis server has
authentication enabled.

## Running tests

    npm test

## Release notes
