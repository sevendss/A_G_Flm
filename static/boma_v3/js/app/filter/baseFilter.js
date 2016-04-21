(function() {

    angular.module('base.filter', [])

    // 字典过滤器
    .filter("dic", ['$$dic', '$log', '$$base', '$rootScope', function($$dic, $log, $$base, $rootScope) {

        return function(key, type) {

            if ($rootScope.isAgent) {

                if (eval('$$dic.agent("' + key + '")')) {

                    return eval('$$dic.agent("' + key + '")');
                };

            };

            if (!angular.isFunction(eval('$$dic.' + type))) {

                $log.error("####未找到该字典类型:" + type + "####")

                return '';

            };

            return eval('$$dic.' + type + '("' + key + '")');

        };

    }])

    // 唯一性过滤器
    .filter("unique", function() {

        return function(items, filterOn) {

            if (filterOn === false) {
                return items;
            }

            if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
                var hashCheck = {},
                    newItems = [];

                var extractValueToCompare = function(item) {
                    if (angular.isObject(item) && angular.isString(filterOn)) {
                        return item[filterOn];
                    } else {
                        return item;
                    }
                };

                angular.forEach(items, function(item) {
                    var valueToCheck, isDuplicate = false;

                    for (var i = 0; i < newItems.length; i++) {
                        if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                            isDuplicate = true;
                            break;
                        }
                    }
                    if (!isDuplicate) {
                        newItems.push(item);
                    }

                });
                items = newItems;
            }
            return items;

        };

    })

    .filter("gamerule", function() {

        return function(item) {
          
            return item +'娱乐城';
        };

    })

})();