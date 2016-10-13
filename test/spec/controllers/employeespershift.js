'use strict';

describe('Controller: EmployeespershiftCtrl', function () {

  // load the controller's module
  beforeEach(module('canteenApp'));

  var EmployeespershiftCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EmployeespershiftCtrl = $controller('EmployeespershiftCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EmployeespershiftCtrl.awesomeThings.length).toBe(3);
  });
});
