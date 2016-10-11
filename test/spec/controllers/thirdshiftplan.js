'use strict';

describe('Controller: ThirdShiftPlanCtrl', function () {

  // load the controller's module
  beforeEach(module('canteenApp'));

  var ThirdShiftPlanCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ThirdShiftPlanCtrl = $controller('ThirdShiftPlanCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ThirdShiftPlanCtrl.awesomeThings.length).toBe(3);
  });
});
