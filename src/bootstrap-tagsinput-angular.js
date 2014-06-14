angular.module('bootstrap-tagsinput', [])
.directive('bootstrapTagsinput', [function() {
  "use strict";
  function getItemProperty(scope, property) {
    if (!property)
      return undefined;

    if (angular.isFunction(scope.$parent[property]))
      return scope.$parent[property];

    return function(item) {
      return item[property];
    };
  }
  var tagsInputController = ['$scope', function($scope){
    this.getInput = function getInput(){
        return $scope.select.tagsinput('input');
    }
  }];

  return {
    restrict: 'EA',
    controller: tagsInputController,
    scope: {
      model: '=ngModel',
      itemValue: '=',
      itemText: '=',
      tagClass: '=',
      freeInput: '=',
      maxTags: '=',
      confirmKeys: '=',
      onTagExists: '=',
      trimValue: '=',
      confirmOnBlur: '='
    },
    template: '<select multiple></select>',
    replace: false,
    link: function(scope, element, attrs) {
      $(function() {
        if (!angular.isArray(scope.model))
          scope.model = [];

        // create a shallow copy of model's current state, needed to determine
        // diff when model changes
        var prev = scope.model.slice();

        scope.select = $('select', element);
        scope.select.attr('placeholder', typeof attrs.placeholder !== 'undefined' ? attrs.placeholder : '');
        var typeaheadSourceArray = attrs.typeaheadSource ? attrs.typeaheadSource.split('.') : null;
        var typeaheadSource = typeaheadSourceArray ?
            (typeaheadSourceArray.length > 1 ?
                scope.$parent[typeaheadSourceArray[0]][typeaheadSourceArray[1]]
                : scope.$parent[typeaheadSourceArray[0]])
            : null;

        scope.select.tagsinput({
          typeahead: {
            source: angular.isFunction(typeaheadSource) ? typeaheadSource : null
          },
          itemValue: scope.itemValue,
          itemText: scope.itemText,
          tagClass: scope.tagClass,
          freeInput: scope.freeInput,
          maxTags: scope.maxTags,
          confirmKeys: scope.confirmKeys,
          onTagExists: scope.onTagExists,
          trimValue: scope.trimValue,
          confirmOnBlur: scope.confirmOnBlur
        });

        for (var i = 0; i < scope.model.length; i++) {
          scope.select.tagsinput('add', scope.model[i]);
        }

        scope.select.on('itemAdded', function(event) {
          scope.$apply( function(){
            if (scope.model.indexOf(event.item) === -1){
              scope.model.push(event.item);
              //element already removed from the typeahead control stop the model watcher from updating
              prev = scope.model.slice();
            }
          });
        });

        scope.select.on('itemRemoved', function(event) {
          scope.$apply( function(){
            var idx = scope.model.indexOf(event.item);
            if (idx !== -1){
              scope.model.splice(idx, 1);
              //element already removed from the typeahead control stop the model watcher from updating
              prev = scope.model.slice();
            }
          });
        });

        scope.$watch("model", function() {
          var added = scope.model.filter(function(i) {return prev.indexOf(i) === -1;}),
              removed = prev.filter(function(i) {return scope.model.indexOf(i) === -1;}),
              i;

          prev = scope.model.slice();

          // Remove tags no longer in binded model
          for (i = 0; i < removed.length; i++) {
            scope.select.tagsinput('remove', removed[i]);
          }

          // Refresh remaining tags
          scope.select.tagsinput('refresh');

          // Add new items in model as tags
          for (i = 0; i < added.length; i++) {
            scope.select.tagsinput('add', added[i]);
          }
        }, true);
      });
    }
  };
}]);
