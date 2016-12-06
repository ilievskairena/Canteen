'use strict';

describe('Controller: MakeordersnextweekCtrl', function () {

  // load the controller's module
  beforeEach(module('canteenApp'));

  var MakeordersnextweekCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MakeordersnextweekCtrl = $controller('MakeordersnextweekCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MakeordersnextweekCtrl.awesomeThings.length).toBe(3);
  });
});
