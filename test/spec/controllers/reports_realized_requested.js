'use strict';

describe('Controller: ReportsRealizedRequestedCtrl', function () {

  // load the controller's module
  beforeEach(module('canteenApp'));

  var ReportsRealizedRequestedCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReportsRealizedRequestedCtrl = $controller('ReportsRealizedRequestedCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ReportsRealizedRequestedCtrl.awesomeThings.length).toBe(3);
  });
});
