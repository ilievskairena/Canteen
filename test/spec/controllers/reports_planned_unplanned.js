'use strict';

describe('Controller: ReportsPlannedUnplannedCtrl', function () {

  // load the controller's module
  beforeEach(module('canteenApp'));

  var ReportsPlannedUnplannedCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReportsPlannedUnplannedCtrl = $controller('ReportsPlannedUnplannedCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ReportsPlannedUnplannedCtrl.awesomeThings.length).toBe(3);
  });
});
