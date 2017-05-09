/* =======================================================================
Scene
========================================================================== */
(function($,_) {
		
	var _scene, _parent, _shutter, _humanSize, _bgm, _time;
	
	(function(){
		
		_.scene  = _this = {};
		_parent  = $("#all");
		_shutter = $("#shutter");
		
		_humanSize = {
			'w' : 60,
			'h' : 189,
			'r' : 0.3
		};
		
	})();
	
	_this.opening = opening;
	_this.result  = result;
	
	/* -------------------------
	OPENING
	------------------------- */
	function opening() {
		
		var target = Math.random()*19 | 0;
		drawTarget(target);
		$("a").click(function(){
			closed("start", $(this), target);
		});
		
	}
	
	/* -------------------------
	CLOSE
	------------------------- */
	function closed(judge, btn, target) {
		
		if(judge == "start") _shutter.text(3).addClass("noClick");
		
		_shutter.css("line-height", $(window).height() + 'px').stop().animate({ "height" : $(window).height() }, 240, "easeOutBounce", function(){
			
			if(judge == "start") {
				opened();
				selectLevel(btn, target);
			} else {
				result(judge);
			}
		});
	}
	
	/* -------------------------
	OPEN
	------------------------- */
	function opened() {
		_shutter.delay(3000).animate({ "height" : 0 }, 240, "easeOutBounce",function(){
			_shutter.text("").removeClass("noClick");
			clearTimeout(countId);
		});
		var count = 0;
		
		var countId;
		var countDown = function() {
			countId = setTimeout(function() {
				count = count + 1;
				var time = (count == 3) ? "" : 3 - count;
				_shutter.text(time);
				countDown();
			}, 1000);
		}
		countDown();
	}
	
	/* -------------------------
	RESULT
	------------------------- */
	function result(judge) {
		
		//_.bgm.result();
		var message = (judge) ? "☆◯(＞▽<)。CLEAR!!" : "( ´,_ゝ｀)ププッ";
		var again   = '<img src="files/img/txt_again.png" width="528" height="284" alt="Once More Again?">';
		_shutter.addClass("result").html('<p>'+ again +'<span>' + _time + '秒 ' + message + '</span></p>');
		
		resetScene();
		_shutter.click(function(){
			
			if($(this).hasClass("noClick")) return false;
			//_.bgm.opening();
			
			$(this).addClass("noClick").text("").animate({ "height" : 0 }, 240, "easeOutBounce", function(){
				_shutter.removeClass("noClick result");
			}).css("line-height", 0 + 'px');
		});
	}
	
	/* -------------------------
	RESET SCENE
	------------------------- */
	function resetScene() {
		
		var ctxHumam  = document.getElementById('human').getContext('2d');
		ctxHumam.clearRect(0, 0, $(window).width(), $(window).height());
		$("#stage").html("");
		
		_parent.removeClass("active");
		$("ul").removeClass("none");
		$("#target").removeClass("active").find("canvas").remove();
		$("#human").removeClass("active");
		
		opening();
	}
	
	/* =======================================================================
	Select LEVEL
	========================================================================== */
	function selectLevel(btn, target) {
		
		var level = btn.attr("href").split("#")[1];
		$("ul").addClass("none");
		$("#target").addClass("active");
		_parent.addClass("active");
		
		//_.bgm.start(level);
		showImageCanvas(level, target);
		
		return false;
	}
	
	/* =======================================================================
	Show Target
	========================================================================== */
	function drawTarget(target) {
		
		var canvas = document.createElement("canvas");
		canvas.width  = 100;
		canvas.height = 100;
		
		$("#target").prepend(canvas);
		
		if ( ! canvas || ! canvas.getContext ) { return false; }
		var ctx = canvas.getContext('2d');
		
		var img = new Image();
		img.src = 'files/img/human'+ doubleNum(target) +'.png';
		
		img.onload = function() {
			ctx.drawImage(img, canvas.width / 2 - 30, 10);
		}
	}
	
	function doubleNum(num) {
		return (num < 10) ? "0" + num : num;
	}
	
	/* =======================================================================
	Show Image
	========================================================================== */
	function showImageCanvas(level, target){
		
		var fileArray = [];
		var xywh      = [];
		
		var count = {
			'level01' : 10,
			'level02' : 50,
			'level03' : 150,
			'levelMax' : 300,
		}
		
		for(var i = 0; i < count[level]; i++) {
			
			var randomNum = parseInt(Math.random()*19 | 0);
			var dummyNum  = [20, 21, 22, 23, 24][parseInt(Math.random()*4 | 0)];
			var num       = (i == count[level] - 1) ? target : (randomNum == target) ? dummyNum : randomNum;
			
			fileArray[i] = 'files/img/human'+ doubleNum(num) +'.png';
			xywh[i]      = {x : Math.random()*($(window).width() - _humanSize["w"] * _humanSize["r"]) | 0, y : Math.random()*($(window).height() - _humanSize["h"]*0.8) | 0, w : _humanSize["w"] * _humanSize["r"], h : _humanSize["h"] * _humanSize["r"]};
		}
		
		var targetPoint = xywh[count[level] - 1];
		
		var numFiles = fileArray.length;
		var loadedCount = 0;
		var imgArr = [];
		
		var stage = document.createElement("canvas");
		$("#stage").append(stage).find("canvas").attr("id", "human");
		var canvas = document.getElementById('human');
		
		$("#human").addClass("active");
		
		var ctx = canvas.getContext('2d');
		
		function loadImages(){
			var imgObj = new Image();
			imgObj.addEventListener('load',
				function(){
					loadedCount++;
					imgArr.push(imgObj);
					if(numFiles === loadedCount){
						drawImage();
					}else{
						loadImages();
					}
				}, false
			);
			imgObj.src = fileArray[imgArr.length];
		}
		function drawImage(){
			canvas.width  = $(window).width();
			canvas.height = $(window).height() - 25;
			
			for(var i in imgArr){
				ctx.drawImage(imgArr[i], xywh[i]['x'], xywh[i]['y'], xywh[i]['w'], xywh[i]['h']);
				imgArr[i] = null;
			}
		}
		loadImages();
		time();
		
		canvas.addEventListener("click", function(e){ closed(mouseEvent(e, targetPoint)); }, false);
		
		return false;
	}
	
	/* =======================================================================
	Timer
	========================================================================== */
	function time(){
		
		var startTime, timerID;
		var start = new Date();
		startTime = start.getTime();
		
		timer();
		
		function timer() {
			
			var currentTime = new Date();
			_time = ((currentTime - start - 3000) / 1000).toFixed(2);
			timerID = setTimeout(function(){ timer(); }, 1);
			
			return false;
			
		}
		
		$("#human").click(function(){ clearTimeout(timerID); });
		
		return false;
	}
	
	
	/* =======================================================================
	Mouse Event
	========================================================================== */
	function mouseEvent(e, point){
		
		var rect = e.target.getBoundingClientRect();
		
		//座標取得
		var mouseX1 = e.clientX - rect.left;
		var mouseY1 = e.clientY - rect.top;
		
		var judge = false;
		
		if (mouseX1 > point['x'] && mouseX1 < point['x'] + _humanSize["w"] * _humanSize["r"]) {
			if (mouseY1 > point['y'] && mouseY1 < point['y'] + _humanSize["h"] * _humanSize["r"]) {
				judge = true;
			}
		}
		
		return judge;
	}
	
	(function(e) {
		
		e.easeOutBounce = function (x,t,b,c,d) {
			
			if ((t /= d) < (1 / 2.75)) return c * (7.5625 * t * t) + b;
			else if (t < (2 / 2.75)) return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
			else if (t < (2.5 / 2.75)) return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
			else return c*(7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
		
		};
		
	})($.easing);
	
	return false;
	
})(jQuery,Manager);