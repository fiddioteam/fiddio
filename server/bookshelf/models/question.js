var db      = require('../config'),
    Promise = require('bluebird');

require('./user');
require('./response');
require('./tag');
require('./questiontag');

var Question = db.Model.extend({
  tableName: 'questions',
  hasTimestamps: true,
  defaults: {
    star_count: 0
  },
  owner: function() {
    return this.belongsTo('User');
  },
  solution: function() {
    return this.hasOne('Response');
  },
  isClosed: function() {
    return this.get('closed');
  },
  tags: function() {
    return this.hasMany('Tag').through('QuestionTag');
  },
  changeStars: function(upOrDown) {
    this.set('star_count', this.get('star_count') + upOrDown);
    return this.save();
  },
  stars: function() {
    return this.hasMany('Star').through('Stars').withPivot('active');
  }
}, {
  fetchQuestionbyId: function(id) {
    return new this({
      id: id
    }).fetch({
      require: true
    });
  },
  fetchQuestion: function(short_url) {
    return new this({
      short_url: short_url
    }).fetch({
      require: true
    });
  },
  newQuestion: function(options) {
    return new this(options);
  },
  changeStarsbyId: function(questionId, upOrDown) {
    return db.model('Question')
    .fetchQuestionbyId(questionId)
    .then(function(Question) {
      question.set('star_count', question.get('star_count') + upOrDown);
      return question.save();
    });
  }
});

module.exports = db.model('Question', Question);