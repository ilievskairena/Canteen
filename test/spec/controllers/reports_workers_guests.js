'use strict';

describe('Controller: ReportsWorkersGuestsCtrl', function () {

  // load the controller's module
  beforeEach(module('canteenApp'));

  var ReportsWorkersGuestsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReportsWorkersGuestsCtrl = $controller('ReportsWorkersGuestsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ReportsWorkersGuestsCtrl.awesomeThings.length).toBe(3);
  });
});
