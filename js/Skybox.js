define([],

function(){
	'use strict';

	var path = "img/skybox/",
		format = ".png",
		skyboxUrls = [
			path + 'px' + format, path + 'nx' + format,
			path + 'py' + format, path + 'ny' + format,
			path + 'pz' + format, path + 'nz' + format
		],
		textureCube = THREE.ImageUtils.loadTextureCube( skyboxUrls, new THREE.CubeRefractionMapping() ),
		shader = THREE.ShaderUtils.lib["cube"],
		material = new THREE.ShaderMaterial( {
			fragmentShader: shader.fragmentShader,
			vertexShader: shader.vertexShader,
			uniforms: shader.uniforms,
			depthWrite: false,
			side: THREE.BackSide,
			opacity: 0.8
		} ),
		size = 30000,
		skybox = new THREE.Mesh( new THREE.CubeGeometry( size, size, size ), material );

	shader.uniforms["tCube"].value = textureCube;
	return skybox;
	
});