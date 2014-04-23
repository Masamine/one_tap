(function($){
	
	$(document).ready(function(){
		
		var target = Math.random()*4 | 0;
		drawTarget(target);
		$("a").click(function(){ selectLevel($(this), target) });
		
		return false;
		
	});
	
	/* =======================================================================
	Select LEVEL
	========================================================================== */
	function selectLevel(btn, target) {
		
		var level = btn.attr("href").split("#")[1];
		$("ul").remove();
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
		
		return false;
	}
	
	/* =======================================================================
	Mouse Event
	========================================================================== */
	function mouseEvent(){
		
		var rect = e.target.getBoundingClientRect();
		
		//座標取得
		var mouseX1 = e.clientX - rect.left;
		var mouseY1 = e.clientY - rect.top;
		if (mouseX1 > 画像X座標 && mouseX1 < 画像X座標 + 24) {
			if (mouseY1 > 画像Y座標 && mouseY1 < 画像Y座標 + 57) {
			}
		}
		
		return false;
	}
	
	/* =======================================================================
	Scene
	========================================================================== */
	function Scene(){
		
		var _this;
		
		(function(){
			
			_this = {};
			
		})();
		
		_this.test = test;
		
		function test() {
			alert("test");
		}
		
		return _this;
	}
	
	return false;
	
})(jQuery);