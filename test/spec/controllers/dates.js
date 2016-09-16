'use strict';

describe('Controller: DatesCtrl', function () {

  // load the controller's module
  beforeEach(module('canteenApp'));

  var DatesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DatesCtrl = $controller('DatesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DatesCtrl.awesomeThings.length).toBe(3);
  });
});
