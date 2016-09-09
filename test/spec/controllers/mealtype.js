'use strict';

describe('Controller: MealtypeCtrl', function () {

  // load the controller's module
  beforeEach(module('canteenApp'));

  var MealtypeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MealtypeCtrl = $controller('MealtypeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MealtypeCtrl.awesomeThings.length).toBe(3);
  });
});
