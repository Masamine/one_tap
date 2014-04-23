(function($){
	
	var _scene, _parent;
	
	$(document).ready(function(){
		
		_scene  = Scene();
		_parent = $("#all");
		
		_scene.opening();
		
		return false;
		
	});
	
	/* =======================================================================
	Select LEVEL
	========================================================================== */
	function selectLevel(btn, target) {
		
		var level = btn.attr("href").split("#")[1];
		$("ul").addClass("none");
		$("#target").addClass("active");
		
		showImageCanvas(level, target);
		
		return false;
	}
	
	/* =======================================================================
	Show Target
	========================================================================== */
	function drawTarget(target) {
		
		var canvas = document.createElement("canvas");
		canvas.width  = 80;
		canvas.height = 80;
		
		$("#target").prepend(canvas);
		
		if ( ! canvas || ! canvas.getContext ) { return false; }
		var ctx = canvas.getContext('2d');
		
		var img = new Image();
		img.src = 'files/img/human0'+ target +'.png';
		
		img.onload = function() {
			ctx.drawImage(img, canvas.width / 2 - 24, 10);
		}
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
			'level03' : 100,
			'levelMax' : 2000,
		}
		
		for(var i = 0; i < count[level]; i++) {
			
			var randomNum = parseInt(Math.random()*6 | 0);
			var dummyNum  = [5, 6, 7, 8, 9][parseInt(Math.random()*4 | 0)];
			var num       = (i == count[level] - 1) ? target : (randomNum == target) ? dummyNum : randomNum;
			
			fileArray[i] = 'files/img/human0'+ num +'.png';
			xywh[i]      = {x : Math.random()*($(window).width() - 48) | 0, y : Math.random()*($(window).height() - 115) | 0, w : 48 * 0.5, h : 115 * 0.5};
		}
		
		var targetPoint = xywh[count[level] - 1];
		
		var numFiles = fileArray.length;
		var loadedCount = 0;
		var imgArr = [];
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
			canvas.height = $(window).height() - 45;
			for(var i in imgArr){
				ctx.drawImage(imgArr[i], xywh[i]['x'], xywh[i]['y'], xywh[i]['w'], xywh[i]['h']);
				imgArr[i] = null;
			}
		}
		loadImages();
		
		time();
		canvas.addEventListener("click", function(e){ _scene.closed(mouseEvent(e, targetPoint)); }, false);
		
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
			var time = ((currentTime - start) / 1000).toFixed(2);
			$("#timer").text(time);
			timerID = setTimeout(function(){ timer(); }, 1);
			
			return false;
			
		}
		
		$("#human").click(function(){ clearTimeout(timerID) });
		
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
		
		if (mouseX1 > point['x'] && mouseX1 < point['x'] + 24) {
			if (mouseY1 > point['y'] && mouseY1 < point['y'] + 57) {
				judge = true;
			}
		}
		
		return judge;
	}
	
	/* =======================================================================
	Scene
	========================================================================== */
	function Scene(){
		
		var _this;
		
		(function(){
			
			_this = {};
			_this.opening = opening;
			_this.closed  = closed;
			
		})();
		
		/* -------------------------
		OPENING
		------------------------- */
		function opening() {
			
			var target = Math.random()*4 | 0;
			drawTarget(target);
			$("a").click(function(){ selectLevel($(this), target) });
			
		}
		
		/* -------------------------
		CLOSE
		------------------------- */
		function closed(judge) {
			_parent.append('<div id="shutter"></div>');
			$("#shutter").stop().animate({ "height" : $(window).height() }, 300, "easeOutBounce", function(){
				result(judge);
			});
		}
		
		/* -------------------------
		RESULT
		------------------------- */
		function result(judge) {
			
			var message = (judge) ? "正解！もっと早く見つけよう！！" : "( ´,_ゝ｀)ﾌﾟｯ";
			console.log(message);
			
			resetScene();
			$("#shutter").delay(3000).animate({ "height" : 0 }, 300, "easeOutBounce");
		}
		
		/* -------------------------
		RESET SCENE
		------------------------- */
		function resetScene() {
			
			var ctxHumam  = document.getElementById('human').getContext('2d');
			ctxHumam.clearRect(0, 0, $(window).width(), $(window).height());
			
			$("ul").removeClass("none");
			$("#target").removeClass("active").find("canvas").remove();
			$("#human").removeClass("active");
			$("#timer").text("canvas");
			
			opening();
		}
		
		return _this;
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
	
})(jQuery);