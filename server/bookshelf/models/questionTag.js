var db      = require('../config');

require('./question');
require('./user');

var QuestionTag = db.Model.extend({
  tableName: 'questions_tags',
  question: function() {
    return this.belongsTo('Question');
  },
  user: function() {
    return this.belongsTo('User');
  }
});

module.exports = db.model('QuestionTag', QuestionTag);