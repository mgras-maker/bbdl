import { useRef, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled from '@emotion/styled';
import { ProcessProvider, useProcessContext, STAGES } from './context/ProcessContext';
import EmpathyStage from './components/stages/empathy/EmpathyStage';
import ReasoningStage from './components/stages/reasoning/ReasoningStage';
import MaterializationStage from './components/stages/materialization/MaterializationStage';
import HomePage from './components/pages/HomePage';
import './styles/global.scss';

// Navigation component (simplified version since we had issues with the full component)
const Navigation = () => {
  const { currentStage, goToStage, isStageAccessible, progress, STAGES } = useProcessContext();

  // Helper function to get stage name for display
  const getStageName = (stage) => {
    return stage.charAt(0).toUpperCase() + stage.slice(1);
  };

  // Get current stage color for theming
  const getStageColor = () => {
    switch(currentStage) {
      case STAGES.EMPATHY:
        return 'var(--color-secondary)';
      case STAGES.REASONING:
        return 'var(--color-primary)';
      case STAGES.MATERIALIZATION:
        return 'var(--color-tertiary)';
      default:
        return 'var(--color-primary)';
    }
  };

  return (
    <NavContainer className={currentStage === 'home' ? 'transparent' : ''}>
      <Logo onClick={() => goToStage('home')}>
        BBDL <span style={{ color: getStageColor() }}>Design</span>
      </Logo>
      
      <NavLinks>
        {Object.values(STAGES).map((stage) => (
          <NavLink
            key={stage}
            active={currentStage === stage}
            disabled={!isStageAccessible(stage)}
            onClick={() => isStageAccessible(stage) && goToStage(stage)}
          >
            {getStageName(stage)}
            {currentStage === stage && (
              <ProgressBar>
                <ProgressIndicator progress={progress[stage]} />
              </ProgressBar>
            )}
          </NavLink>
        ))}
      </NavLinks>

      <MobileMenuButton>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </MobileMenuButton>
    </NavContainer>
  );
};

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &.transparent {
    background-color: transparent;
    backdrop-filter: none;
    box-shadow: none;
    
    @media (max-width: 768px) {
      background-color: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(8px);
    }
  }
`;

const Logo = styled.div`
  font-family: var(--font-secondary);
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  span {
    color: var(--stage-color, var(--color-primary));
    transition: color var(--transition-medium);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.button`
  background: none;
  border: none;
  font-family: var(--font-primary);
  font-size: var(--font-size-md);
  padding: 0.5rem;
  position: relative;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  color: ${props => props.active ? 'var(--stage-color, var(--color-primary))' : 'var(--color-text)'};
  font-weight: ${props => props.active ? '600' : '400'};
  opacity: ${props => props.disabled ? '0.5' : '1'};
  
  &:hover {
    color: ${props => !props.disabled && 'var(--stage-color, var(--color-primary))'};
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  left: 0;
  bottom: -3px;
  height: 3px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
`;

const ProgressIndicator = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: var(--stage-color, var(--color-primary));
  transition: width 0.5s ease;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const AppContent = () => {
  const { currentStage, goToStage } = useProcessContext();
  const appRef = useRef(null);

  // Set home stage on initial load
  useEffect(() => {
    goToStage('home');
  }, []);

  // Scroll to top when stage changes
  useEffect(() => {
    if (appRef.current) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [currentStage]);

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div ref={appRef}>
      <Navigation />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
        >
          {currentStage === 'home' && <HomePage />}
          {currentStage === STAGES.EMPATHY && <EmpathyStage />}
          {currentStage === STAGES.REASONING && <ReasoningStage />}
          {currentStage === STAGES.MATERIALIZATION && <MaterializationStage />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <ProcessProvider>
      <AppContent />
    </ProcessProvider>
  );
}

export default App;
