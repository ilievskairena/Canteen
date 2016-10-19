'use strict';

describe('Filter: dayoftheweek', function () {

  // load the filter's module
  beforeEach(module('canteenApp'));

  // initialize a new instance of the filter before each test
  var dayoftheweek;
  beforeEach(inject(function ($filter) {
    dayoftheweek = $filter('dayoftheweek');
  }));

  it('should return the input prefixed with "dayoftheweek filter:"', function () {
    var text = 'angularjs';
    expect(dayoftheweek(text)).toBe('dayoftheweek filter: ' + text);
  });

});
