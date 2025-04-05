import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const CarPartDetector = ({ model, videoRef }) => {
  const detectionRef = useRef();
  const annotationsRef = useRef([]);
  const canvasRef = useRef(null);
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    // Create a canvas element for processing video frames
    if (!canvasRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      canvasRef.current = canvas;
    }

    // Set up regular detection interval
    const detectionInterval = setInterval(() => {
      detectObjects();
    }, 500); // Run detection every 500ms for better performance

    return () => {
      clearInterval(detectionInterval);
    };
  }, []);

  const detectObjects = async () => {
    if (!model || !videoRef?.current || !canvasRef.current || 
        !videoRef.current.readyState || 
        videoRef.current.readyState < 2) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    try {
      // Make sure video dimensions are available
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        return;
      }

      // Update canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame to the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Run object detection
      const predictions = await model.detect(canvas);
      
      // Filter for vehicle-related objects
      const vehiclePredictions = predictions.filter(pred => 
        ['car', 'truck', 'motorcycle', 'bicycle', 'bus'].includes(pred.class)
      );

      // Update detections state for 3D rendering
      setDetections(vehiclePredictions);
      
    } catch (error) {
      console.error('Error detecting objects:', error);
    }
  };

  // Create 3D annotations in the Three.js scene based on detections
  useFrame(() => {
    if (!detectionRef.current) return;

    // Clear previous annotations
    annotationsRef.current.forEach(annotation => {
      if (annotation.parent) {
        annotation.parent.remove(annotation);
      }
    });
    annotationsRef.current = [];

    // Create new annotations for detected objects
    detections.forEach(detection => {
      const { bbox, class: className, score } = detection;
      const [x, y, width, height] = bbox;

      // Create 3D annotation
      const annotation = new THREE.Group();
      
      // Add text label
      const text = new Text({
        text: `${className} (${Math.round(score * 100)}%)`,
        fontSize: 0.1,
        color: 'white',
        anchorX: 'center',
        anchorY: 'bottom',
        outlineWidth: 0.01,
        outlineColor: 'black',
      });
      
      // Create a bounding box wireframe
      const boxGeometry = new THREE.BoxGeometry(width / 100, height / 100, 0.1);
      const boxMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        wireframe: true,
        transparent: true,
        opacity: 0.5 
      });
      const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
      
      annotation.add(text);
      annotation.add(boxMesh);
      
      // Position the annotation in 3D space
      // Convert from screen coordinates to Three.js coordinates
      const xPos = (x / window.innerWidth) * 2 - 1;
      const yPos = -(y / window.innerHeight) * 2 + 1;
      annotation.position.set(xPos, yPos, -1);

      detectionRef.current.add(annotation);
      annotationsRef.current.push(annotation);
    });
  });

  return (
    <group ref={detectionRef}>
      {/* 3D annotations will be added here dynamically */}
    </group>
  );
};

export default CarPartDetector; 