# Mineboss Server

<img src="http://i.imgur.com/U6zG4Bs.png" width="300" />

## Development

Requires [yarn](https://yarnpkg.com) for package management.

To start:
1. Create `config/development.json` with necessary configuration.
2. `$ yarn install`
3. `$ npm run dev`

This will start an HTTP server on `http://localhost:3000`.

## Database

Mineboss Server uses PostgreSQL as a database.

1. `brew install postgresql`
2. `brew services start postgresql` (to start pgsql on boot, optional)
3. `$ createuser mineboss`
4. `$ createdb mineboss`
5. `$ echo "grant all privileges on database mineboss to mineboss" | psql`

You'll also need Redis, which is used for pub/sub in the websocket system. Just `brew install redis`.

## Configuration

The following environment variables are required. You can safely copy and paste this into
`development.json` to get started.

```js
{
  "ALLOWED_ORIGINS": "http://localhost:8081",
  "AUTH_SECRET": "that's a spicy meatball", // or whatever you want :)
  "DB_HOST": "localhost",
  "DB_PORT": 5432,
  "DB_USER": "mineboss",
  "DB_PASSWORD": "mineboss",
  "DB_DATABASE": "mineboss",
  "DB_TLS": false,
  "REDIS_HOST": "localhost",
  "REDIS_PORT": 6379
}
```
