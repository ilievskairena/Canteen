'use strict';

describe('Controller: ReportsOrdersCostCenterCtrl', function () {

  // load the controller's module
  beforeEach(module('canteenApp'));

  var ReportsOrdersCostCenterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReportsOrdersCostCenterCtrl = $controller('ReportsOrdersCostCenterCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ReportsOrdersCostCenterCtrl.awesomeThings.length).toBe(3);
  });
});
