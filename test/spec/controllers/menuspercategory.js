'use strict';

describe('Controller: MenuspercategoryCtrl', function () {

  // load the controller's module
  beforeEach(module('canteenApp'));

  var MenuspercategoryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MenuspercategoryCtrl = $controller('MenuspercategoryCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MenuspercategoryCtrl.awesomeThings.length).toBe(3);
  });
});
