'use strict';

describe('Controller: WorkerplanningCtrl', function () {

  // load the controller's module
  beforeEach(module('canteenApp'));

  var WorkerplanningCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WorkerplanningCtrl = $controller('WorkerplanningCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(WorkerplanningCtrl.awesomeThings.length).toBe(3);
  });
});
