import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three-full';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  @ViewChild('rendererContainer') rendererContainer: ElementRef;

  renderer = new THREE.WebGLRenderer({ alpha: true });
  scene = null;
  camera = null;
  controls = null;
  constructor() {
      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth * 0.69  / window.innerHeight, 1, 1000);
      this.camera.position.z = 30;
      this.camera.position.y = 10;

      this.controls = new THREE.OrbitControls(this.camera);
      this.controls.update();

     

      //helper
      var gridHelper = new THREE.GridHelper(20, 20);
      var axesHelper = new THREE.AxesHelper( 1 );

      this.scene.add(gridHelper);
      this.scene.add(axesHelper);

      //lights
      var ambientLight = new THREE.AmbientLight(0xffffff, 1.0);

      this.scene.add(ambientLight);
  }

  ngAfterViewInit() {
      this.renderer.setSize(window.innerWidth * 0.69, window.innerHeight);
      this.renderer.setClearColor( 0xffffff, 0);
      this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
      this.gltfLoader(this.scene);
      this.animate();
  }

  animate() {
      window.requestAnimationFrame(() => this.animate());
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
  }

  ngOnInit() {
  }

  loadOBJ(scene) {
    //loader
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath('assets/car/');
    mtlLoader.setPath('assets/car/');
    mtlLoader.load('Lamborghini_Aventador.mtl', function (materials) {

      materials.preload();

      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('assets/car/');
      objLoader.load('Lamborghini_Aventador.obj', function (object) {
        object.scale.set(0.01,0.01,0.01);
        scene.add(object);
      });
    });
  }

  gltfLoader(scene) {
    var loader = new THREE.GLTFLoader();
    loader.load(
      'assets/airplane/scene.gltf',
      function(gltf) {
        //gltf.asset.scale.set(0.1,0.1,0.1);
        scene.add(gltf.scene);
      },
      function(xhr) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      },
      function(err) {
        console.log( 'An error happened' );
        console.log( err );
      }
    )
  }

}
