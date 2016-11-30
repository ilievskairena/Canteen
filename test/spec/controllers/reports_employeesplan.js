'use strict';

describe('Controller: ReportsEmployeesplanCtrl', function () {

  // load the controller's module
  beforeEach(module('canteenApp'));

  var ReportsEmployeesplanCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReportsEmployeesplanCtrl = $controller('ReportsEmployeesplanCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ReportsEmployeesplanCtrl.awesomeThings.length).toBe(3);
  });
});
