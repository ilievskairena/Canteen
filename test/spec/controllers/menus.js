'use strict';

describe('Controller: MenusCtrl', function () {

  // load the controller's module
  beforeEach(module('canteenApp'));

  var MenusCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MenusCtrl = $controller('MenusCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MenusCtrl.awesomeThings.length).toBe(3);
  });
});
