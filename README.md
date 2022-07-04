# Northcoders House of Games API

Required new files:
.env.development
.env.test
These will contain the environment variables that are what's used to access the relevant database, ensuring that you're not using the test database for development or vice versa.

These files will contain the following information:
.env.development: PGDATABASE=nc_games
.env.test: PGDATABASE=nc_games_test
Here you could also put other relevant information, such as which PSQL user you wanted to use if you wanted it to be different for each environment.
