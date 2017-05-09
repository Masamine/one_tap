(function($){
	
	window.Manager = {};
	var _scene, _parent, _bgm, _draw;
	var fileName = ["scene"];
	var src      = "files/js/";
	
	for(var i = 0; i < fileName.length; i++) {
		writeJS(fileName[i], src);
	}
	
	$(document).ready(function(){
		
		Manager.init();
		_scene.opening();
		
		return false;
		
	});
	
	Manager.init = function() {
		
		_scene = Manager.scene;
		//_bgm   = Manager.bgm;
		
		return false;
		
	};
	
	/* =======================================================================
	Write JS
	========================================================================== */
	function writeJS(fileName,src) {
		
		document.write('<script src="' + src + fileName + '.js" type="text/javascript" charset="UTF-8"></script>');
		return false;
		
	}
	
	return false;
	
})(jQuery);