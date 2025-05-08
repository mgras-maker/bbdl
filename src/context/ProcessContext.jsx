import { createContext, useContext, useState } from 'react';

// Stages of the BBDL design process
export const STAGES = {
  EMPATHY: 'empathy',
  REASONING: 'reasoning',
  MATERIALIZATION: 'materialization',
};

// Create the context
const ProcessContext = createContext();

// Custom hook to use the process context
export const useProcessContext = () => {
  const context = useContext(ProcessContext);
  if (!context) {
    throw new Error('useProcessContext must be used within a ProcessProvider');
  }
  return context;
};

// Provider component
export const ProcessProvider = ({ children }) => {
  const [currentStage, setCurrentStage] = useState('home');
  const [progress, setProgress] = useState({
    [STAGES.EMPATHY]: 0,
    [STAGES.REASONING]: 0,
    [STAGES.MATERIALIZATION]: 0,
  });

  // Move to a specific stage
  const goToStage = (stage) => {
    if (Object.values(STAGES).includes(stage) || stage === 'home') {
      setCurrentStage(stage);
    }
  };

  // Move to the next stage in the process
  const nextStage = () => {
    switch (currentStage) {
      case 'home':
        setCurrentStage(STAGES.EMPATHY);
        break;
      case STAGES.EMPATHY:
        setCurrentStage(STAGES.REASONING);
        break;
      case STAGES.REASONING:
        setCurrentStage(STAGES.MATERIALIZATION);
        break;
      default:
        // Already at the last stage
        break;
    }
  };

  // Move to the previous stage in the process
  const prevStage = () => {
    switch (currentStage) {
      case STAGES.MATERIALIZATION:
        setCurrentStage(STAGES.REASONING);
        break;
      case STAGES.REASONING:
        setCurrentStage(STAGES.EMPATHY);
        break;
      case STAGES.EMPATHY:
        setCurrentStage('home');
        break;
      default:
        // Already at the first stage
        break;
    }
  };

  // Update progress for a specific stage
  const updateProgress = (stage, value) => {
    setProgress(prev => ({
      ...prev,
      [stage]: Math.max(0, Math.min(100, value)), // Ensure progress is between 0 and 100
    }));
  };

  // Check if a stage is accessible based on previous stage progress
  const isStageAccessible = (stage) => {
    switch (stage) {
      case 'home':
        return true; // Always accessible
      case STAGES.EMPATHY:
        return true; // Always accessible
      case STAGES.REASONING:
        return progress[STAGES.EMPATHY] >= 50;
      case STAGES.MATERIALIZATION:
        return progress[STAGES.REASONING] >= 50;
      default:
        return false;
    }
  };

  // Values provided by the context
  const value = {
    currentStage,
    goToStage,
    nextStage,
    prevStage,
    progress,
    updateProgress,
    isStageAccessible,
    STAGES,
  };

  return (
    <ProcessContext.Provider value={value}>
      {children}
    </ProcessContext.Provider>
  );
};

export default ProcessContext;