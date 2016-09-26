'use strict';

describe('Directive: maxLimit', function () {

  // load the directive's module
  beforeEach(module('canteenApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<max-limit></max-limit>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the maxLimit directive');
  }));
});
