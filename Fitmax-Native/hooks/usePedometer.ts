import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { Alert } from 'react-native';

export function usePedometer() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  useEffect(() => {
    subscribe();
  }, []);

  async function subscribe() {
    const available = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(available ? 'available' : 'unavailable');

    if (available) {
      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const pastSteps = await Pedometer.getStepCountAsync(start, end);
      if (pastSteps) setPastStepCount(pastSteps.steps);

      return Pedometer.watchStepCount(result => {
        setCurrentStepCount(result.steps);
      });
    }
  }

  return {
    isPedometerAvailable,
    totalSteps: pastStepCount + currentStepCount,
  };
}
