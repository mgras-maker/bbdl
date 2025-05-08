import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from '@emotion/styled';
import Button from '../common/Button';
import { useProcessContext } from '../../context/ProcessContext';

const StageContainer = styled(motion.section)`
  min-height: 100vh;
  padding: 6rem 0 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  width: 100%;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background-color: var(--stage-color);
  }
`;

const StageContent = styled.div`
  width: 100%;
  padding: 0 5%;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const StageHeader = styled.div`
  margin-bottom: 3rem;
  position: relative;
  text-align: center;
  width: 100%;
`;

const StageTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  margin-bottom: 1rem;
  background: linear-gradient(45deg, var(--stage-color) 0%, var(--color-text) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StageDescription = styled(motion.p)`
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  color: var(--color-text-light);
  max-width: 800px;
  margin: 0 auto;
`;

const StageBody = styled.div`
  flex: 1;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  gap: 1rem;
  width: 100%;
  padding: 0 5%;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.3,
      duration: 0.6 
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

const StageLayout = ({ 
  stageName, 
  stageDescription, 
  stageTheme,
  children, 
  canGoBack = true, 
  canContinue = true,
  onComplete
}) => {
  const { nextStage, prevStage } = useProcessContext();
  
  // Use intersection observer to trigger animations when the section is in view
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <StageContainer 
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={`${stageTheme}-theme`}
      style={{ '--stage-color': `var(--color-${stageTheme === 'reasoning' ? 'primary' : stageTheme === 'empathy' ? 'secondary' : 'tertiary'})` }}
    >
      <StageContent>
        <StageHeader>
          <StageTitle variants={itemVariants}>
            {stageName}
          </StageTitle>
          <StageDescription variants={itemVariants}>
            {stageDescription}
          </StageDescription>
        </StageHeader>
        
        <StageBody>
          {children}
        </StageBody>
      </StageContent>
      
      <NavigationButtons>
        {canGoBack && (
          <Button 
            variant="secondary"
            onClick={prevStage}
            stageTheme={stageTheme}
          >
            Previous Stage
          </Button>
        )}
        
        <div style={{ flex: 1 }} />
        
        {canContinue && (
          <Button 
            variant="primary"
            onClick={() => {
              if (onComplete) onComplete();
              nextStage();
            }}
            stageTheme={stageTheme}
          >
            Continue to Next Stage
          </Button>
        )}
      </NavigationButtons>
    </StageContainer>
  );
};

export default StageLayout;