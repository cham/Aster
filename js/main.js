require(['Renderer','Skybox','DeltaTimer','makeTextureSphere'],

function(Renderer,Skybox,DeltaTimer,makeTextureSphere){
	'use strict';

	var earthSphere = makeTextureSphere({
			map: 'img/earth-bump-lo.jpg',
			bumpMap: 'img/earth-bump-lo.jpg',
			castShadow: true,
			receiveShadow: true
		}),
		cloudSphere = makeTextureSphere({
			map: 'img/cloudmap-lo.jpg',
			opacity: 0.35,
			radius: 153
		}),
		moonSphere = makeTextureSphere({
			map: 'img/moon.jpg',
			bumpMap: 'img/moon.jpg',
			radius: 40,
			segments: 12,
			rings: 12,
			castShadow: true,
			receiveShadow: true
		}),
		// interaction vars
		mouseX = 0, mouseLastX = 0,
		mouseY = 0, mouseLastY = 0,
		accelX = 0, accelY = 0, accelDist = 0, theta = 0, phi = 0,
		dragging = false,
		// scene vars
		lightDistance = 4200,
		moonDistance = 4000,//4500,
		cameraDistance = 250,
		cameraNearest = 170,
		cameraFurthest = moonDistance * 2;

	earthSphere.rotation.y = -Math.PI/4;

	Renderer.add(earthSphere,cloudSphere,moonSphere,Skybox);

	Renderer.addLight({x: lightDistance, y: 0, z: lightDistance, castShadow: true, shadowCameraNear: lightDistance});
	Renderer.addAmbientLight({colour: 0x444444});

	// animation
	DeltaTimer.onTick(function(delta){
		// mouse related calculations
		if(dragging){
			accelX += (mouseLastX - mouseX) / 2500;
			accelY -= (mouseLastY - mouseY) / 2500;
		}
		mouseLastX = mouseX;
		mouseLastY = mouseY;

		// objects
		earthSphere.rotation.y += 0.0001;
		cloudSphere.rotation.y += 0.00014;
		moonSphere.position.x = Math.sin(earthSphere.rotation.y-Math.PI) * moonDistance;
		moonSphere.position.z = Math.cos(earthSphere.rotation.y-Math.PI) * moonDistance;
		moonSphere.rotation.y = earthSphere.rotation.y * 0.1;

		// camera
		theta += (accelX*0.2);
		phi += (accelY*0.2);
		cameraDistance += (accelDist*2);
		if(cameraDistance<cameraNearest){
			cameraDistance = cameraNearest;
		}
		if(cameraDistance>cameraFurthest){
			cameraDistance = cameraFurthest;
		}
		Renderer.setPosition({
			x: Math.sin(theta) * cameraDistance,
			y: Math.cos(phi-(Math.PI/2)) * cameraDistance,
			z: Math.cos(theta) * cameraDistance
		});

		// friction
		accelX *= 0.975;
		accelY *= 0.975;
		accelDist *= 0.975;
	});

	// interaction
	$(document).mousemove(function(e){
		mouseX = e.pageX;
		mouseY = e.pageY;
	}).mousedown(function(e){
		dragging = true;
	}).mouseup(function(e){
		dragging = false;
	}).mousewheel(function(e, delta, deltaX, deltaY){
		accelDist += deltaY;
	});

	// start
	$('#container').append(Renderer.el);
	Renderer.start();
});