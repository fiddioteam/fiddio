var db      = require('../config'),
    Promise = require('bluebird');

require('./user');
require('./question');

var QuestionWatch = db.Model.extend({
  tableName: 'questionsWatches',
  defaults: {
    active: true
  },
  user: function() {
    return this.belongsTo('User');
  },
  question: function() {
    return this.hasOne('Question');
  },
  // only one star per user
  fetchOrCreate: function(userId, questionId, active) {
    var options = {
      user: userId,
      question: questionId
    };
    var newQuestionWatch = new this(options);

    // create the model object
    // determines if already a QuestionWatch in database
    newQuestionWatch.fetch()
    .then(function(questionwatch) {
      if (!questionwatch) {
        questionwatch = newQuestionWatch;
      }
      questionwatch.set('active', active);
      return questionwatch.save();
    });
  },
});

module.exports = db.model('QuestionWatch', QuestionWatch);