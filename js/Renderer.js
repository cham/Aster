define(['DeltaTimer'],

function(DeltaTimer){
	'use strict';

	// set the scene size
	var w = window.innerWidth,
	    h = window.innerHeight,
	    aspect = w / h,
	    scene = new THREE.Scene(),
	    renderer = new THREE.WebGLRenderer(),
	    camera = new THREE.PerspectiveCamera(
	    	45,
            aspect,
            0.1,
            100000
		),
		composer = new THREE.EffectComposer(renderer),
		shader = new THREE.ShaderPass(THREE.VignetteShader);

	// setup
	scene.add(camera);
	renderer.shadowMapEnabled = true;
	shader.renderToScreen = true;
	composer.addPass(new THREE.RenderPass(scene, camera));
	composer.addPass(shader);

	// animation
	DeltaTimer.onTick(function(delta){
			renderer.clear();
			composer.render();
	});

	// resizing
	function setCanvasSize(){
		var nw = window.innerWidth,
		    nh = window.innerHeight - 300;

		if(nh < 250 ) nh = 250;

		camera.aspect = nw / nh;
		camera.updateProjectionMatrix();

		renderer.setSize(nw, nh);
		composer.reset();
	}
	$(window).resize(setCanvasSize);
	setCanvasSize();

	return {

		el: renderer.domElement,

		start: function(){
			DeltaTimer.start();
		},
		stop: function(){
			DeltaTimer.stop();
		},
		render: function(){
			renderer.clear();
			composer.render();
			//renderer.render(scene, camera);
		},

		addLight: function(opts){
			var options = opts || {},
				l = new THREE.SpotLight(0xffffff,options.intensity || 1);

			l.position.x = options.x;
			l.position.y = options.y;
			l.position.z = options.z;
			l.target.position.set(0, 0, 0);	
			if(options.castShadow){
				l.castShadow = true;
				l.shadowCameraNear = options.shadowCameraNear || 1000;
				l.shadowDarkness = 1;
				//l.shadowCameraVisible = true;
			}
			scene.add(l);
			return;
		},

		addAmbientLight: function(opts){
			var options = opts || {};
			scene.add(new THREE.AmbientLight(options.colour || 0x222222));
		},

		add: function(){
			_(Array.prototype.slice.call(arguments)).each(function(threeObj){
				scene.add(threeObj);
			});
		},

		getPosition: function(){
			return camera.position;
		},

		setPosition: function(p){
			if(p.x) camera.position.x = p.x;
			if(p.y) camera.position.y = p.y;
			if(p.z) camera.position.z = p.z;
			camera.target = new THREE.Vector3(0,0,0);
			camera.lookAt(camera.target);
			camera.updateMatrix();
		},

		lookAt: function(threeObj){
			camera.target = new THREE.Vector3( threeObj.position.x, threeObj.position.y, threeObj.position.z );
			camera.lookAt(camera.target);
		}
	};

});