import React, { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ARButton, XR, Controllers, useXR } from '@react-three/xr';
import { Box, Typography, CircularProgress, Button, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const CameraSelector = ({ cameras, selectedCamera, onCameraChange }) => {
  if (cameras.length <= 1) return null;
  
  return (
    <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 1 }}>
      <FormControl sx={{ minWidth: 200, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 1, p: 1 }}>
        <InputLabel>Select Camera</InputLabel>
        <Select
          value={selectedCamera}
          onChange={(e) => onCameraChange(e.target.value)}
          label="Select Camera"
        >
          {cameras.map((camera) => (
            <MenuItem key={camera.deviceId} value={camera.deviceId}>
              {camera.label || `Camera ${camera.deviceId}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

const ARContent = ({ children, model }) => {
  const { isPresenting } = useXR();
  
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Controllers />
      {children}
    </Suspense>
  );
};

const ARScene = ({ children }) => {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [permissionError, setPermissionError] = useState(false);
  const [arSupported, setArSupported] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    // Check if WebXR is supported
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar')
        .then(supported => {
          setArSupported(supported);
        })
        .catch(err => {
          console.warn('AR support check failed:', err);
          setArSupported(false);
        });
    } else {
      setArSupported(false);
    }

    const loadModel = async () => {
      try {
        await tf.ready();
        console.log('TensorFlow.js loaded');
        const loadedModel = await cocoSsd.load();
        console.log('Model loaded');
        setModel(loadedModel);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading TensorFlow model:', error);
        setIsLoading(false);
      }
    };

    const getCameras = async () => {
      try {
        // First request permissions
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Once we have permission, enumerate devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameras(videoDevices);
        
        // Try to find front camera
        const frontCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('front') || 
          device.label.toLowerCase().includes('face')
        );
        
        if (frontCamera) {
          setSelectedCamera(frontCamera.deviceId);
        } else if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
        
        // Stop the initial stream
        stream.getTracks().forEach(track => track.stop());
        
      } catch (error) {
        console.error('Error getting cameras:', error);
        setPermissionError(true);
      }
    };

    loadModel();
    getCameras();
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      if (!selectedCamera) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedCamera,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(error => {
            console.error('Error playing video:', error);
          });
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setPermissionError(true);
      }
    };

    startCamera();

    // Cleanup function to stop camera when component unmounts or camera changes
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [selectedCamera]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
        <Typography variant="h6" ml={2}>
          Loading AR Experience...
        </Typography>
      </Box>
    );
  }

  // Create a modified version of children with the videoRef prop
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { videoRef, model });
    }
    return child;
  });

  return (
    <Box sx={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <video
        ref={videoRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
        autoPlay
        playsInline
        muted
      />
      
      <CameraSelector
        cameras={cameras}
        selectedCamera={selectedCamera}
        onCameraChange={setSelectedCamera}
      />
      
      {arSupported ? (
        <Box sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
          <ARButton />
        </Box>
      ) : (
        <Box sx={{ 
          position: 'absolute', 
          bottom: 20, 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: 2,
          borderRadius: 2
        }}>
          <Typography variant="body1">
            AR not supported on this device/browser
          </Typography>
        </Box>
      )}
      
      <Canvas
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
        linear
      >
        <XR>
          <ARContent model={model}>
            {childrenWithProps}
          </ARContent>
        </XR>
      </Canvas>
      
      <Snackbar 
        open={permissionError} 
        autoHideDuration={6000} 
        onClose={() => setPermissionError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setPermissionError(false)}>
          Camera access denied. Please enable camera permissions to use this app.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ARScene; 