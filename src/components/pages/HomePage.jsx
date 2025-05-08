import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { useProcessContext } from '../../context/ProcessContext';
import Button from '../common/Button';
import Footer from '../common/Footer';
import ProcessCircle3D from '../3d/ProcessCircle3D';
import ProcessPresentation from '../common/ProcessPresentation';

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Hero = styled.section`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 0;
  background: linear-gradient(to right, #ffffff, #f8f8f8);
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  padding: 0 5%;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 2rem;
    gap: 2rem;
  }
`;

const HeroTextContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 1024px) {
    order: 2;
    align-items: center;
    text-align: center;
  }
`;

const Title = styled(motion.h1)`
  font-family: var(--font-secondary);
  font-size: clamp(3.5rem, 7vw, 5rem);
  margin-bottom: 2rem;
  line-height: 1.1;
  
  @media (max-width: 1024px) {
    text-align: center;
  }
  
  span {
    display: inline-block;
    
    &.empathy {
      color: var(--color-secondary);
    }
    
    &.reasoning {
      color: var(--color-primary);
    }
    
    &.materialization {
      color: var(--color-tertiary);
    }
  }
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
  margin-bottom: 2.5rem;
  color: var(--color-text-light);
  line-height: 1.6;
  max-width: 600px;
  
  @media (max-width: 1024px) {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const CircularChartContainer = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  
  @media (max-width: 1024px) {
    order: 1;
  }
`;

const CircleWrapper = styled.div`
  position: relative;
  width: min(500px, 80vw);
  height: min(500px, 80vw);
`;

const ProcessCircle = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  border: ${props => props.borderWidth}px solid ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CircleLabel = styled(motion.div)`
  position: absolute;
  background-color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  color: ${props => props.color};
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &.empathy {
    top: 15%;
    left: 0;
  }
  
  &.reasoning {
    top: 45%;
    right: 0;
  }
  
  &.materialization {
    bottom: 15%;
    left: 30%;
  }
`;

const Planet = styled(motion.div)`
  position: absolute;
  width: ${props => props.size || '20px'};
  height: ${props => props.size || '20px'};
  border-radius: 50%;
  background-color: ${props => props.color};
  box-shadow: 0 0 10px ${props => props.color}80;
`;

const Process = styled.section`
  padding: 6rem 5%;
  background-color: #fafafa;
  width: 100%;
`;

const ProcessContent = styled.div`
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-secondary);
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  margin-bottom: 3rem;
  text-align: center;
`;

const ProcessDescription = styled.p`
  font-size: clamp(1.1rem, 2vw, 1.25rem);
  text-align: center;
  max-width: 1000px;
  margin: 0 auto 3rem;
  color: var(--color-text-light);
`;

const StagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 4rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
`;

const StageCard = styled(motion.div)`
  background-color: white;
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-medium);
  position: relative;
  overflow: hidden;
  height: 100%;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background-color: ${props => props.stageColor};
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`;

const StageTitle = styled.h3`
  font-family: var(--font-secondary);
  margin-bottom: 1.5rem;
  color: ${props => props.color};
  font-size: 1.75rem;
`;

const StageDescription = styled.p`
  color: var(--color-text-light);
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const HomePage = () => {
  const { goToStage, STAGES } = useProcessContext();
  const [activeStage, setActiveStage] = useState(0);
  
  // Animation for the circular process visualization
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage(prev => (prev + 1) % 3);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 }
    }
  };
  
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i) => ({ 
      y: 0, 
      opacity: 1, 
      transition: { 
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };
  
  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  const planetVariants = {
    empathyOrbit: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    },
    reasoningOrbit: {
      rotate: 360,
      transition: {
        duration: 15,
        repeat: Infinity,
        ease: "linear"
      }
    },
    materializationOrbit: {
      rotate: 360,
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <HomeContainer>
      <Hero>
        <HeroContent>
          <HeroTextContent>
            <Title
              variants={titleVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.span variants={textVariants}>BBDL </motion.span>
              <motion.span variants={textVariants}>Design </motion.span>
              <motion.span variants={textVariants}>Process</motion.span>
            </Title>
            
            <Subtitle
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              An interactive journey through the 3-stage design process: <span className="empathy">Empathy</span>, <span className="reasoning">Reasoning</span>, and <span className="materialization">Materialization</span>.
            </Subtitle>
            
            <ButtonContainer
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              <Button 
                variant="primary" 
                size="large"
                onClick={() => goToStage(STAGES.EMPATHY)}
              >
                Start the Journey
              </Button>
              
              <Button 
                variant="secondary"
                size="large"
                onClick={() => document.getElementById('process').scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </ButtonContainer>
          </HeroTextContent>
          
          <CircularChartContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <CircleWrapper>
              {/* Outer circle - Empathy */}
              <ProcessCircle 
                size={480} 
                borderWidth={2}
                color="var(--color-secondary)"
                animate={activeStage === 0 ? { 
                  borderWidth: [2, 5, 2],
                  boxShadow: [
                    "0 0 0 rgba(255, 201, 185, 0)",
                    "0 0 20px rgba(255, 201, 185, 0.5)",
                    "0 0 0 rgba(255, 201, 185, 0)"
                  ]
                } : {}}
                transition={{ duration: 2, repeat: activeStage === 0 ? Infinity : 0 }}
              >
                <motion.div
                  style={{ 
                    position: "absolute", 
                    width: "100%", 
                    height: "100%",
                    top: 0,
                    left: 0
                  }}
                  variants={planetVariants}
                  animate="empathyOrbit"
                >
                  <Planet 
                    size="24px"
                    color="var(--color-secondary)"
                    style={{ top: "-12px", left: "calc(50% - 12px)" }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>
              </ProcessCircle>
              
              {/* Middle circle - Reasoning */}
              <ProcessCircle 
                size={360} 
                borderWidth={2}
                color="var(--color-primary)"
                animate={activeStage === 1 ? { 
                  borderWidth: [2, 5, 2],
                  boxShadow: [
                    "0 0 0 rgba(44, 110, 73, 0)",
                    "0 0 20px rgba(44, 110, 73, 0.5)",
                    "0 0 0 rgba(44, 110, 73, 0)"
                  ]
                } : {}}
                transition={{ duration: 2, repeat: activeStage === 1 ? Infinity : 0 }}
              >
                <motion.div
                  style={{ 
                    position: "absolute", 
                    width: "100%", 
                    height: "100%",
                    top: 0,
                    left: 0
                  }}
                  variants={planetVariants}
                  animate="reasoningOrbit"
                >
                  <Planet 
                    size="20px"
                    color="var(--color-primary)"
                    style={{ top: "-10px", left: "calc(50% - 10px)" }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                </motion.div>
              </ProcessCircle>
              
              {/* Inner circle - Materialization */}
              <ProcessCircle 
                size={240} 
                borderWidth={2}
                color="var(--color-tertiary)"
                animate={activeStage === 2 ? { 
                  borderWidth: [2, 5, 2],
                  boxShadow: [
                    "0 0 0 rgba(214, 140, 69, 0)",
                    "0 0 20px rgba(214, 140, 69, 0.5)",
                    "0 0 0 rgba(214, 140, 69, 0)"
                  ]
                } : {}}
                transition={{ duration: 2, repeat: activeStage === 2 ? Infinity : 0 }}
              >
                <motion.div
                  style={{ 
                    position: "absolute", 
                    width: "100%", 
                    height: "100%",
                    top: 0,
                    left: 0
                  }}
                  variants={planetVariants}
                  animate="materializationOrbit"
                >
                  <Planet 
                    size="16px"
                    color="var(--color-tertiary)"
                    style={{ top: "-8px", left: "calc(50% - 8px)" }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </ProcessCircle>
              
              {/* Stage labels */}
              <CircleLabel 
                className="empathy"
                color="var(--color-secondary)"
                animate={activeStage === 0 ? "pulse" : {}}
                variants={pulseVariants}
                onClick={() => goToStage(STAGES.EMPATHY)}
              >
                Empathy
              </CircleLabel>
              
              <CircleLabel 
                className="reasoning"
                color="var(--color-primary)"
                animate={activeStage === 1 ? "pulse" : {}}
                variants={pulseVariants}
                onClick={() => goToStage(STAGES.REASONING)}
              >
                Reasoning
              </CircleLabel>
              
              <CircleLabel 
                className="materialization"
                color="var(--color-tertiary)"
                animate={activeStage === 2 ? "pulse" : {}}
                variants={pulseVariants}
                onClick={() => goToStage(STAGES.MATERIALIZATION)}
              >
                Materialization
              </CircleLabel>
            </CircleWrapper>
          </CircularChartContainer>
        </HeroContent>
      </Hero>
      
      <Process id="process">
        <ProcessContent>
          <SectionTitle>The BBDL Design Process</SectionTitle>
          
          <ProcessDescription>
            The BBDL design process is a sustainable, user-centered approach that guides designers through three essential stages. Each stage builds on the previous one, creating a comprehensive methodology for designing innovative solutions.
          </ProcessDescription>
          
          <StagesGrid>
            <StageCard 
              stageColor="var(--color-secondary)"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0}
            >
              <StageTitle color="var(--color-secondary)">Empathy</StageTitle>
              <StageDescription>
                Understanding users through deep observation and connection. This stage focuses on identifying needs, emotions, and perspectives through active listening and engagement.
              </StageDescription>
              <Button 
                variant="text"
                onClick={() => goToStage(STAGES.EMPATHY)}
              >
                Start with Empathy →
              </Button>
            </StageCard>
            
            <StageCard 
              stageColor="var(--color-primary)"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={1}
            >
              <StageTitle color="var(--color-primary)">Reasoning</StageTitle>
              <StageDescription>
                Synthesizing insights and identifying patterns. This analytical stage transforms raw observations into meaningful insights that will guide the design process.
              </StageDescription>
              <Button 
                variant="text"
                onClick={() => goToStage(STAGES.REASONING)}
                disabled
              >
                Continue with Reasoning →
              </Button>
            </StageCard>
            
            <StageCard 
              stageColor="var(--color-tertiary)"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={2}
            >
              <StageTitle color="var(--color-tertiary)">Materialization</StageTitle>
              <StageDescription>
                Bringing concepts to life through sustainable prototyping. This stage focuses on creating tangible representations of your design ideas with sustainability at the core.
              </StageDescription>
              <Button 
                variant="text"
                onClick={() => goToStage(STAGES.MATERIALIZATION)}
                disabled
              >
                Finish with Materialization →
              </Button>
            </StageCard>
          </StagesGrid>
        </ProcessContent>
      </Process>
      
      <ProcessCircle3D />
      
      <ProcessPresentation />
      
      <Footer />
    </HomeContainer>
  );
};

export default HomePage;