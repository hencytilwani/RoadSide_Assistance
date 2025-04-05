# Roadside Assistance AR Guide

A browser-based Augmented Reality (AR) application that provides step-by-step guidance for common vehicle repairs. The application uses WebXR and TensorFlow.js to detect car parts and overlay repair instructions in AR.

## Features

- Real-time car part detection using TensorFlow.js
- AR overlays for repair instructions
- Step-by-step guidance for common repairs:
  - Tire change
  - Battery jump-start
- Cross-device compatibility (Chrome, Safari, Edge, Android, iOS)
- Modern, responsive UI with Material-UI components

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A modern web browser with WebXR support
- A device with a camera (for AR features)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd RoadSide_Assistance/Frontend/RoadSide_Assistance
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Browser Compatibility

The AR features require a browser with WebXR support. The following browsers are recommended:

- Chrome (Android)
- Safari (iOS)
- Edge (Windows)
- Chrome (Desktop)

## Usage

1. Select a repair guide from the home page
2. Allow camera access when prompted
3. Point your camera at the relevant part of your vehicle
4. Follow the AR overlays for step-by-step instructions

## Development

The project is built with:
- React 18
- Vite
- Three.js
- React Three Fiber
- TensorFlow.js
- Material-UI

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TensorFlow.js for object detection
- Three.js for 3D rendering
- React Three Fiber for React integration with Three.js
- Material-UI for the component library
