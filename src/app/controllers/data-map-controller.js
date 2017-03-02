var datamapCtrl = function ($scope, urlsService) {
            $scope.item = null;

            $scope.showPopup = function (data) {
                $scope.item = data;
                $scope.$modal.modal('show');
            };

            $scope.$on('show_widget_order_item_popup', function (e, data) {
                $scope.order_type_title = data.order_type.title;
                $scope.order_id = data.pk;
                $scope.showPopup(data);
            });

            $scope.showMap = function () {
                $scope.$modal.modal('hide');
                $scope.$root.$broadcast('show_widget_order_map_popup', $scope.item);
            };

            $scope.getPage = function () {
                urlsService.PaymentDetails.query({'order_id': $scope.order_id}, function(data) {
                    $scope.$root.$broadcast('show_widget_order_payment_list', data);
                })
            }

        }
export default datamapCtrl;
