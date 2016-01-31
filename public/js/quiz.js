(function () {

    var app = angular.module('quiz', []);

    app.controller('QuizController', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {

        $scope.currQuestion = 0;
        $scope.showFeedback = false;
        $scope.offended = false;
        $scope.ytUrl = '';
        
        //Defining a route to actually post an answer to the API
        $scope.postAnswer = function(id) {
            $http.post('/api/answer', {ans: id})
                .then(function(data) {

                })
                .finally(function(){

                })
        };
        $scope.selectAnswer = function(i){
            if (i == 0){
                $scope.showFeedback = true;
                $scope.offended = true;

                $scope.ytUrl = $sce.trustAsResourceUrl($scope.questions[$scope.currQuestion].url);
                // do http request to save answer
                $scope.postAnswer($scope.questions[$scope.currQuestion].id);
                
            } else {
                $scope.currQuestion += 1;

                if ($scope.currQuestion > $scope.questions.length){
                    $scope.currQuestion -= 1;
                }
            }
        };



        $http.get('./js/quiz_data.json').then(function (quizData) {
            $scope.questions = quizData.data;
            $scope.totalQuestions = $scope.questions.length;
        });

        $scope.getStats = function(){
            $http.get('/stats').then(function(res){
                if (res.data.error === true) {
                    return;
                }
                var stats = [];
                var total = 0;

                for (var i =0; i < res.data.data.length; i ++){
                    stats[res.data.data[i]['_id']] = res.data.data[i]['total'];
                    total += res.data.data[i]['total'];
                }

                for (var i=0; i < 10; i ++){
                    if (stats[i]){
                        stats[i] = (stats[i]/total*100).toFixed(2);
                    } else {
                        stats[i] = 0;
                    }
                }

                $scope.stats = stats;

                console.log($scope.stats);
            }, function(err){
                console.log(err);
            }).finally(function(){
                console.log("done");
            });
        };

        $scope.getStats();

    }]);



})();