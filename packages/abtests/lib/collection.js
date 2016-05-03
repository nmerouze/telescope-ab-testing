ABTests = new Mongo.Collection('abtests');

ABTests.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
    publish: true
  },

  name: {
    type: String,
    publish: true
  },

  variant: {
    type: String,
    publish: true
  },

  plays: {
    type: Number,
    publish: true,
    defaultValue: 0
  },

  wins: {
    type: Number,
    publish: true,
    defaultValue: 0
  }
});

Meteor.methods({
  'abtests.play': function (name, variant) {
    ABTests.upsert({name: name, variant: variant}, {$inc: {plays: 1}});
  },

  'abtests.win': function (name, variant) {
    ABTests.update({name: name, variant: variant}, {$inc: {wins: 1}});
  }
});
