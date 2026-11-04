import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './InteractiveModelthreeD.module.scss';

interface InteractiveModelthreeDProps {
  modelUrl: string;
  eyeTarget?: { x: number; y: number; z: number };
  headTarget?: { x: number; y: number; z: number };
  theme: 'light' | 'dark';
}

const InteractiveModelthreeD: React.FC<InteractiveModelthreeDProps> = ({ modelUrl, eyeTarget = { x: 0, y: 0, z: 0 }, headTarget = { x: 0, y: 0, z: 0 }, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const loader = new THREE.GLTFLoader();
  let model: THREE.Group;

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  useEffect(() => {
    loader.load(modelUrl, (gltf) => {
      model = gltf.scene;
      scene.add(model);
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.z = 5;

    animate();

    return () => {
      scene.dispose();
      renderer.dispose();
    };
  }, [modelUrl]);

  useEffect(() => {
    const handleWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={`interactive-modelthreeD__canvas ${theme === 'dark' ? 'dark' : ''}`}></canvas>;
};

export default InteractiveModelthreeD;
