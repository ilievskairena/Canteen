'use strict';

describe('Controller: CostcenterCtrl', function () {

  // load the controller's module
  beforeEach(module('canteenApp'));

  var CostcenterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CostcenterCtrl = $controller('CostcenterCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CostcenterCtrl.awesomeThings.length).toBe(3);
  });
});
