ABTests._ensureIndex({name: 1});

Meteor.publish('abtests.get', function (name) {
  return ABTests.find({name: name});
});
