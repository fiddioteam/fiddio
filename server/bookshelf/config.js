var dbOptions = {
  client: process.env.dbClient,
  connection: {
    host: process.env.dbHost,
    user: process.env.dbUser,
    password: process.env.dbPassword,
    database: process.env.dbDatabase,
    charset: 'utf8'
  }
};

var knex    = require('knex')(dbOptions),
    Promise = require('bluebird');

//if (process.isDev()) { dbOptions.debug = true; }

module.exports = db = require('bookshelf')(knex);

db.plugin('registry');

/**
 * Convenience function facilitate building db tables as needed
 * @param  {String}   name     The name of table to create
 * @param  {Function} callback The callback defines table schema
 *                             and takes in knex schema object
 * @return {Promise}           Returns a Promise for chaining;
 *                             Promise contains an object with
 *                             name of table and  Boolean for
 *                             whether it was created or already existed
 */
var buildTable = function(name, callback) {
  return db.knex.schema.hasTable(name)
  .then(function(exists) {
    if (exists) {
      return { name: name, created: false };
    } else {
      return db.knex.schema.createTable(name, callback);
    }
  })
  .then(function(response) {
    if (!response.name) {
      qb = response;
      if (qb) {
        return { name: name, created: true };
      } else {
        return { name: name, created: false };
      }
    } else { return response; }
  });
};

var usersTable = buildTable('users', function(table) {
  table.increments('id').primary();
  table.string('email').unique();
  table.string('fb_id').unique();
  table.string('gh_id').unique();
  table.string('mp_id').unique();
  table.string('name').notNullable();
  table.string('profile_pic');
  table.integer('rank_points');
  table.integer('flags');
  table.timestamps();
});

var questionsTable = buildTable('questions', function(table) {
  table.increments('id').primary();
  table.string('title').notNullable();
  table.string('body').notNullable();
  table.text('code').notNullable();
  table.integer('user_id');
  table.integer('solution');
  table.boolean('closed').notNullable();
  table.integer('star_count').notNullable();
  table.integer('response_count').notNullable();
  table.timestamps();
});

var responsesTable = buildTable('responses', function(table) {
  table.increments('id').primary();
  table.string('body');
  table.text('code');
  table.integer('user_id');
  table.integer('question_id');
  table.integer('vote_count').notNullable();
  table.text('code_changes');
  table.float('duration');
  table.timestamps();
});

var votesTable = buildTable('votes', function(table) {
  table.increments('id').primary();
  table.integer('user_id');
  table.integer('response_id');
  table.integer('up_down').notNullable();
});

var commentsTable = buildTable('comments', function(table) {
  table.increments('id').primary();
  table.string('body');
  table.integer('user_id');
  table.string('parent_type'); //This is automatically generated
  table.integer('parent_id');
  table.float('timeslice');
  table.timestamps();
});

var starsTable = buildTable('stars', function(table) {
  table.increments('id').primary();
  table.integer('user_id');
  table.integer('question_id');
  table.boolean('active').notNullable();
});

var questionsWatchesTable = buildTable('questionsWatches', function(table) {
  table.increments('id').primary();
  table.integer('user_id');
  table.integer('question_id');
  table.boolean('active');
});


var tagsTable = buildTable('tags', function(table) {
  table.increments('id').primary();
  table.string('name').unique();
});

var questions_tagsTable = buildTable('questions_tags', function(table) {
  table.increments('id').primary();
  table.integer('tag_id');
  table.integer('question_id');
});

var tables = [usersTable, questionsTable, responsesTable, votesTable, commentsTable, starsTable, questionsWatchesTable, tagsTable, questions_tagsTable];

Promise.all(tables)
.then(function(tables) {
  tables.forEach(function(table) {
    if (table.created) {
      process.verb('Bookshelf: created table', table.name);
    } else {
      process.verb('Bookshelf:', table.name, 'table already exists');
    }
  });
});
