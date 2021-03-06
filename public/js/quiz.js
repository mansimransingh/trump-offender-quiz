(function () {

    var app = angular.module('quiz', []);

    app.controller('QuizController', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {

        $scope.currQuestion = 0;
        $scope.showFeedback = false;
        $scope.offended = false;
        $scope.ytUrl = '';
        $scope.questions = [];

        
        //Defining a route to actually post an answer to the API
        $scope.postAnswer = function(id) {
            console.log(id);
            $http.post('/api/answer', {ans: id})
                .then(function(data) {

                })
                .finally(function(){
                    $scope.moveProgressBar();
                });
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

        $scope.shuffle = function(o){
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        };

        $http.get('./js/quiz_data.json').then(function (quizData) {
            var last = quizData.data.pop();

            quizData.data = $scope.shuffle(quizData.data);

            quizData.data.push(last);

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

                // setTimeout(function(){ $scope.moveProgressBar(); }, 1000);

            });
        };

        $scope.moveProgressBar = function() {
            var animationLength = 1000;
            console.log("moveProgressBar");
            $('.progress-wrap').each(function(i,v){

                var wrap = $(this);
                var percent = wrap.data('progress-percent');

                var getPercent = percent/100;
                var getProgressWrapWidth = wrap.width();
                var progressTotal = getPercent * getProgressWrapWidth;



                $(this).children('.progress-bar').first().stop().animate({
                    left: progressTotal
                }, animationLength);
              });
        };

        $scope.getStats();

    }]);



})();