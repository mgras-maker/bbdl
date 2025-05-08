import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from '@emotion/styled';
import StageLayout from '../../layout/StageLayout';
import { useProcessContext } from '../../../context/ProcessContext';

const EmpathyContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const EmpathyCard = styled(motion.div)`
  background-color: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    box-shadow: var(--shadow-lg);
  }
`;

const CardTitle = styled.h3`
  color: var(--color-secondary);
  margin-bottom: 1rem;
`;

const CardContent = styled.div`
  flex: 1;
`;

const InteractiveElement = styled(motion.div)`
  margin-top: 2rem;
  padding: 2rem;
  border-radius: var(--radius-lg);
  background-color: rgba(255, 201, 185, 0.1);
  border: 2px dashed var(--color-secondary);
  cursor: pointer;
  text-align: center;
  transition: all var(--transition-medium);
  
  &:hover {
    background-color: rgba(255, 201, 185, 0.2);
  }
`;

const EmpathyInput = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid #ddd;
  margin-top: 1rem;
  font-family: var(--font-primary);
  resize: vertical;
  
  &:focus {
    border-color: var(--color-secondary);
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 201, 185, 0.3);
  }
`;

const ProgressWrapper = styled.div`
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProgressIndicator = styled.div`
  height: 100%;
  background-color: var(--color-secondary);
  border-radius: 4px;
  transition: width var(--transition-medium);
  width: ${props => props.progress}%;
`;

// Motion variants for animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.3,
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const hoverVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

const EmpathyStage = () => {
  const { updateProgress } = useProcessContext();
  const [userInput, setUserInput] = useState({
    listening: '',
    observing: '',
    engaging: '',
  });
  
  const [progress, setProgress] = useState(0);
  
  // Calculate completion percentage based on user input
  const calculateProgress = () => {
    let completed = 0;
    const total = 3;
    
    if (userInput.listening.length > 10) completed++;
    if (userInput.observing.length > 10) completed++;
    if (userInput.engaging.length > 10) completed++;
    
    const percentage = Math.floor((completed / total) * 100);
    setProgress(percentage);
    updateProgress('empathy', percentage);
  };
  
  const handleInputChange = (field) => (e) => {
    setUserInput(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Update progress after input changes
    setTimeout(calculateProgress, 500);
  };
  
  // Intersection observer for animations
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <StageLayout
      stageName="Empathy"
      stageDescription="Understanding user needs through deep observation and connection"
      stageTheme="empathy"
      canGoBack={false}
      onComplete={() => calculateProgress()}
    >
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <p>The empathy stage is all about deeply understanding your users. Through active listening, observation, and engagement, you gain insights into their needs, challenges, and perspectives.</p>
        
        <InteractiveElement 
          variants={itemVariants}
          whileHover={hoverVariants.hover}
        >
          <h3>Begin Your Empathy Journey</h3>
          <p>Click here to start documenting your empathy exercise</p>
        </InteractiveElement>
        
        <EmpathyContainer>
          <EmpathyCard 
            variants={itemVariants}
            whileHover={hoverVariants.hover}
          >
            <CardTitle>Active Listening</CardTitle>
            <CardContent>
              <p>Document the conversations you've had with users. What were their expressed needs? What emotions did you detect?</p>
              <EmpathyInput 
                placeholder="Record your active listening observations here..."
                value={userInput.listening}
                onChange={handleInputChange('listening')}
              />
            </CardContent>
          </EmpathyCard>
          
          <EmpathyCard 
            variants={itemVariants}
            whileHover={hoverVariants.hover}
          >
            <CardTitle>Observation</CardTitle>
            <CardContent>
              <p>What did you observe about user behaviors? What patterns emerged from watching users interact with similar products or services?</p>
              <EmpathyInput 
                placeholder="Record your observational insights here..."
                value={userInput.observing}
                onChange={handleInputChange('observing')}
              />
            </CardContent>
          </EmpathyCard>
          
          <EmpathyCard 
            variants={itemVariants}
            whileHover={hoverVariants.hover}
          >
            <CardTitle>Engagement</CardTitle>
            <CardContent>
              <p>How did you engage with users? What activities or exercises helped you understand their perspective better?</p>
              <EmpathyInput 
                placeholder="Document your engagement activities here..."
                value={userInput.engaging}
                onChange={handleInputChange('engaging')}
              />
            </CardContent>
          </EmpathyCard>
        </EmpathyContainer>
        
        <ProgressWrapper>
          <h3>Your Empathy Progress</h3>
          <p>Complete the sections above to advance to the next stage.</p>
          <ProgressBar>
            <ProgressIndicator progress={progress} />
          </ProgressBar>
        </ProgressWrapper>
      </motion.div>
    </StageLayout>
  );
};

export default EmpathyStage;