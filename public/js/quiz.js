(function () {

    var app = angular.module('quiz', []);

    app.controller('QuizController', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {

        $scope.currQuestion = 0;
        $scope.showFeedback = false;
        $scope.offended = false;
        $scope.ytUrl = '';
        
        //Defining a route to actually post an answer to the API
        $scope.postAnswer = function(id) {
            $http.post('/api/answers', {ans: id})
                .success(function(data) {

                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };
        $scope.selectAnswer = function(i){
            if (i == 0){
                $scope.showFeedback = true;
                $scope.offended = true;

                $scope.ytUrl = $sce.trustAsResourceUrl($scope.questions[$scope.currQuestion].url);
                // do http request to save answer
                $scope.postAnswer(i);
                
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


    }]);



})();