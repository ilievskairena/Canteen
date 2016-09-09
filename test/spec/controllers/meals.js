'use strict';

describe('Controller: MealsCtrl', function () {

  // load the controller's module
  beforeEach(module('canteenApp'));

  var MealsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MealsCtrl = $controller('MealsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MealsCtrl.awesomeThings.length).toBe(3);
  });
});
