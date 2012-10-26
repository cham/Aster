define([],

function(){
	'use strict';

	/*
		opts:
			map
			bumpMap
			opacity
			radius
			segments
			rings
	*/
	return function makeTextureSphere(opts){
		var mat = new THREE.MeshPhongMaterial({
		        bumpMap: opts.bumpMap ? THREE.ImageUtils.loadTexture(opts.bumpMap) : null,
		        map: opts.map ? THREE.ImageUtils.loadTexture(opts.map) : null,
		        transparent: !!opts.opacity, opacity: opts.opacity || 1
		    }),
			sphere = new THREE.Mesh(
				new THREE.SphereGeometry(opts.radius || 150, opts.segments || 40, opts.rings || 40),
				mat
			);

		if(opts.position){
			sphere.position.x = opts.position.x || 0;
			sphere.position.y = opts.position.y || 0;
			sphere.position.z = opts.position.z || 0;
		}

		sphere.castShadow = !!opts.castShadow;
		sphere.receiveShadow  = !!opts.receiveShadow;

		return sphere;
	};
	
});	