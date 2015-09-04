var db      = require('../config');

require('./question');

var Tag = db.Model.extend({
  tableName: 'tags',
  questions: function() {
    return this.belongsToMany('Question').through('QuestionTag');
  }
});

module.exports = db.model('Tag', Tag);