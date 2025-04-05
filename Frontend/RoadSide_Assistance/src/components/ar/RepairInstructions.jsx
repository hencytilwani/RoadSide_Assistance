import React, { useState } from 'react';
import { Text, Html } from '@react-three/drei';
import { Box, Button, Typography } from '@mui/material';

const repairSteps = {
  tireChange: [
    {
      title: 'Step 1: Safety First',
      instruction: 'Park on a flat surface and engage the parking brake',
      position: [0, 2, -2],
    },
    {
      title: 'Step 2: Loosen Lug Nuts',
      instruction: 'Use the lug wrench to loosen the lug nuts before jacking up the car',
      position: [0, 1.5, -2],
    },
    {
      title: 'Step 3: Jack Up the Car',
      instruction: 'Place the jack under the designated point and raise the car',
      position: [0, 1, -2],
    },
    {
      title: 'Step 4: Remove Tire',
      instruction: 'Remove the lug nuts and take off the flat tire',
      position: [0, 0.5, -2],
    },
    {
      title: 'Step 5: Install Spare',
      instruction: 'Place the spare tire and hand-tighten the lug nuts',
      position: [0, 0, -2],
    },
  ],
  batteryJump: [
    {
      title: 'Step 1: Position Vehicles',
      instruction: 'Park the working vehicle next to the dead battery vehicle',
      position: [0, 2, -2],
    },
    {
      title: 'Step 2: Connect Red Cable',
      instruction: 'Connect the red cable to the positive terminal of both batteries',
      position: [0, 1.5, -2],
    },
    {
      title: 'Step 3: Connect Black Cable',
      instruction: 'Connect the black cable to the negative terminal of the working battery and an unpainted metal surface on the dead car',
      position: [0, 1, -2],
    },
    {
      title: 'Step 4: Start Engine',
      instruction: 'Start the working vehicle and let it run for a few minutes',
      position: [0, 0.5, -2],
    },
  ],
};

const RepairInstructions = ({ repairType }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = repairSteps[repairType] || [];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <group>
      {steps.map((step, index) => (
        <group
          key={index}
          position={step.position}
          visible={index === currentStep}
        >
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {step.title}
          </Text>
          <Text
            position={[0, 0, 0]}
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {step.instruction}
          </Text>
        </group>
      ))}
      
      <Html position={[0, -2, -2]}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={previousStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </Button>
        </Box>
      </Html>
    </group>
  );
};

export default RepairInstructions; 