import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useProcessContext, STAGES } from '../../context/ProcessContext';

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
`;

const Logo = styled.div`
  font-family: var(--font-secondary);
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  span {
    color: var(--stage-color, var(--color-primary));
    transition: color var(--transition-medium);
  }
`;

const StageIndicator = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  background-color: var(--stage-color, var(--color-primary));
  width: 100%;
  transform-origin: left;
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
  cursor: pointer;
  color: ${props => props.active ? 'var(--stage-color, var(--color-primary))' : 'var(--color-text)'};
  font-weight: ${props => props.active ? '600' : '400'};
  opacity: ${props => props.disabled ? '0.5' : '1'};
  
  &:hover {
    color: ${props => !props.disabled && 'var(--stage-color, var(--color-primary))'};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  z-index: 200;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 4rem;
`;

const MobileNavLink = styled.button`
  background: none;
  border: none;
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  padding: 1rem;
  text-align: left;
  position: relative;
  cursor: pointer;
  color: ${props => props.active ? 'var(--stage-color, var(--color-primary))' : 'var(--color-text)'};
  font-weight: ${props => props.active ? '600' : '400'};
  opacity: ${props => props.disabled ? '0.5' : '1'};
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 2rem;
    height: 2px;
    background-color: ${props => props.active ? 'var(--stage-color, var(--color-primary))' : 'transparent'};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
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

const Navigation = () => {
  const { currentStage, goToStage, isStageAccessible, progress, STAGES } = useProcessContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Animation variants for mobile menu
  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <NavContainer>
        <Logo>
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
        
        <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </MobileMenuButton>
      </NavContainer>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <CloseButton onClick={() => setMobileMenuOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </CloseButton>
            
            <Logo>
              BBDL <span style={{ color: getStageColor() }}>Design</span>
            </Logo>
            
            <MobileNavLinks>
              {Object.values(STAGES).map((stage) => (
                <MobileNavLink
                  key={stage}
                  active={currentStage === stage}
                  disabled={!isStageAccessible(stage)}
                  onClick={() => {
                    if (isStageAccessible(stage)) {
                      goToStage(stage);
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  {getStageName(stage)}
                </MobileNavLink>
              ))}
            </MobileNavLinks>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;