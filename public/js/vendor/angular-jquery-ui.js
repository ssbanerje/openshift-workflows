(function () {
  function evalFn(element, scope, exp, property){
    property = property || '$token';
    return function (token) {
      var old = scope.hasOwnProperty(property) ? scope[property] : undefined;
      scope[property] = token;
      var retVal = scope.$eval(exp, element);
      scope[property] = old;
      return retVal;
    };
  }

  angular.module("jqui", [])
    .directive('jquiDragStart', function ($compile) {
      return {
        link: function (scope, item, attrs) {
          var dragStartExp = attrs.jquiDragStart || '',
            dragEndExp = attrs.jquiDragEnd || '',
            helperExp = attrs.jquiDragHelper || 'original',
            handle = attrs.jquiHandle || false,
            axisExp = attrs.jquiAxis,
            dragStart = evalFn(item, scope, dragStartExp, '$event'),
            dragEnd = evalFn(item, scope, dragEndExp),
            helper = helperExp,
            token;

          item.addClass('jqui-dnd-item');

          if (!(helper === 'original' || helper === 'clone')) {
            helper = evalFn(item, scope, helperExp);
          }

          item.draggable({
            addClass: false,
            handle: handle,
            helper: helper,
            start: function (event, ui) {
              item.draggable({revertDuration: 200,
                distance: 5,
                delay: 100});
              item.addClass('jqui-dnd-item-dragging');
              item.data('jqui-dnd-item-token', token = dragStart(event));
              scope.$apply();
            },
            stop: function () {
              item.removeClass('jqui-dnd-item-dragging');
              item.removeClass('jqui-dnd-item-over');
              item.removeData('jqui-dnd-item-token');
              item.removeData('jqui-dnd-event');
              dragEnd(token);
              scope.$apply();
              token = null;
            },
            revert: true
          });

          if (axisExp) {
            scope.$watch(axisExp, function (newValue) {
              item.draggable('option', 'axis', newValue);
            });
          }
        }
      };
    })

    .directive('jquiDropCommit', function ($compile) {
      return {
        link: function (scope, target, attrs) {
          var acceptExp = attrs.jquiDropAccept || 'true',
            commitExp = attrs.jquiDropCommit || '',
            greedyExp = attrs.jquiDropGreedy || false,
            accept = evalFn(target, scope, acceptExp),
            commit = evalFn(target, scope, commitExp);

          target.addClass('jqui-dnd-target');

          target.droppable({
            greedy: greedyExp,
            addClass: false,
            tolerance: 'pointer',
            activate: function (event, ui) {
              var token = ui.draggable.data('jqui-dnd-item-token');
              if (accept(token)) {
                target.addClass('jqui-dnd-target-active');
              } else {
                target.addClass('jqui-dnd-target-disable');
              }
              scope.$apply();
            },
            deactivate: function () {
              target.removeClass('jqui-dnd-target-active');
              target.removeClass('jqui-dnd-target-disable');
              target.removeClass('jqui-dnd-target-over');
            },
            over: function (event, ui) {
              if (target.hasClass('jqui-dnd-target-active')) {
                target.addClass('jqui-dnd-target-over');
                ui.draggable.addClass('jqui-dnd-item-over');
              }
            },
            out: function (event, ui) {
              target.removeClass('jqui-dnd-target-over');
              ui.draggable.removeClass('jqui-dnd-item-over');
            },
            drop: function (event, ui) {
              if (target.hasClass('jqui-dnd-target-active')) {
                commit(ui.draggable.data('jqui-dnd-item-token'));
                ui.draggable.draggable('option', 'revertDuration', 0);
                ui.draggable.css({top: '', left: ''});
                ui.draggable.draggable('option', 'stop')();
              }
              target.removeClass('jqui-dnd-target-active');
              target.removeClass('jqui-dnd-target-disable');
              target.removeClass('jqui-dnd-target-over');
            }
          });
        }
      };
    });

}());
