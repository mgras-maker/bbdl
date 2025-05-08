import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from '@emotion/styled';
import StageLayout from '../../layout/StageLayout';
import { useProcessContext } from '../../../context/ProcessContext';

const ReasoningContainer = styled.div`
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ReasoningSection = styled(motion.div)`
  background-color: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  
  &:hover {
    box-shadow: var(--shadow-lg);
  }
`;

const SectionTitle = styled.h3`
  color: var(--color-primary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  &:before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    background-color: var(--color-primary);
    border-radius: var(--radius-full);
  }
`;

const ConnectionsMap = styled(motion.div)`
  background-color: rgba(44, 110, 73, 0.05);
  border-radius: var(--radius-lg);
  padding: 2rem;
  margin: 2rem 0;
  position: relative;
  min-height: 300px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  
  &:before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: rgba(44, 110, 73, 0.2);
    transform: translateX(-50%);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    
    &:before {
      display: none;
    }
  }
`;

const InsightCard = styled(motion.div)`
  background-color: white;
  padding: 1.5rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    right: -1rem;
    width: 1rem;
    height: 2px;
    background-color: rgba(44, 110, 73, 0.3);
    transform: translateY(-50%);
    
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  &:nth-of-type(2n) {
    &:after {
      left: -1rem;
      right: auto;
    }
  }
`;

const TextInput = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid #ddd;
  margin-top: 1rem;
  font-family: var(--font-primary);
  resize: vertical;
  
  &:focus {
    border-color: var(--color-primary);
    outline: none;
    box-shadow: 0 0 0 2px rgba(44, 110, 73, 0.2);
  }
`;

const PatternSection = styled.div`
  margin-top: 2rem;
`;

const PatternVisual = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const PatternTag = styled(motion.div)`
  background-color: ${props => props.selected ? 'var(--color-primary)' : 'rgba(44, 110, 73, 0.1)'};
  color: ${props => props.selected ? 'white' : 'var(--color-primary)'};
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-medium);
  
  &:hover {
    background-color: ${props => props.selected ? 'var(--color-primary)' : 'rgba(44, 110, 73, 0.2)'};
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
  background-color: var(--color-primary);
  border-radius: 4px;
  transition: width var(--transition-medium);
  width: ${props => props.progress}%;
`;

// Motion variants for animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.3,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

const patternTagVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

// Sample pattern tags for the reasoning stage
const patternTagOptions = [
  'Efficiency', 'Accessibility', 'Sustainability', 'User Control',
  'Clarity', 'Consistency', 'Feedback', 'Aesthetics', 'Simplicity',
  'Flexibility', 'Recovery', 'Familiarity', 'Progressive Disclosure'
];

const ReasoningStage = () => {
  const { updateProgress } = useProcessContext();
  const [userInput, setUserInput] = useState({
    synthesis: '',
    insights: '',
    patterns: '',
  });
  
  const [selectedPatterns, setSelectedPatterns] = useState([]);
  const [progress, setProgress] = useState(0);
  
  // Calculate completion percentage
  const calculateProgress = () => {
    let completed = 0;
    const total = 3;
    
    if (userInput.synthesis.length > 10) completed++;
    if (userInput.insights.length > 10) completed++;
    if (selectedPatterns.length >= 3) completed++;
    
    const percentage = Math.floor((completed / total) * 100);
    setProgress(percentage);
    updateProgress('reasoning', percentage);
  };
  
  const handleInputChange = (field) => (e) => {
    setUserInput(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Update progress after input changes
    setTimeout(calculateProgress, 500);
  };
  
  const togglePattern = (pattern) => {
    if (selectedPatterns.includes(pattern)) {
      setSelectedPatterns(prev => prev.filter(p => p !== pattern));
    } else {
      setSelectedPatterns(prev => [...prev, pattern]);
    }
    
    // Update progress after pattern selection changes
    setTimeout(calculateProgress, 500);
  };
  
  // Intersection observer for animations
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <StageLayout
      stageName="Reasoning"
      stageDescription="Synthesizing insights and identifying patterns from your empathy work"
      stageTheme="reasoning"
      onComplete={() => calculateProgress()}
    >
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <p>In the Reasoning stage, we make sense of the information gathered during the Empathy stage. We identify patterns, form insights, and create a foundation for innovative solutions.</p>
        
        <ReasoningContainer>
          <ReasoningSection variants={itemVariants}>
            <SectionTitle>Data Synthesis</SectionTitle>
            <p>Organize and synthesize the information you gathered from users. What key themes emerged from your empathy work?</p>
            <TextInput 
              placeholder="Describe the key themes that emerged from your empathy work..."
              value={userInput.synthesis}
              onChange={handleInputChange('synthesis')}
            />
          </ReasoningSection>
          
          <ReasoningSection variants={itemVariants}>
            <SectionTitle>Mapping Connections</SectionTitle>
            <p>Identify connections between different user needs and observations. How do these connections inform potential solutions?</p>
            
            <ConnectionsMap variants={itemVariants}>
              <InsightCard variants={itemVariants}>
                <h4>User Need</h4>
                <p>Identify a key user need or pain point you observed.</p>
              </InsightCard>
              
              <InsightCard variants={itemVariants}>
                <h4>Connection</h4>
                <p>How does this need relate to other observations?</p>
              </InsightCard>
              
              <InsightCard variants={itemVariants}>
                <h4>Insight</h4>
                <p>What insight can you draw from this connection?</p>
              </InsightCard>
              
              <InsightCard variants={itemVariants}>
                <h4>Design Opportunity</h4>
                <p>What design opportunity emerges from this insight?</p>
              </InsightCard>
            </ConnectionsMap>
            
            <TextInput 
              placeholder="Describe the connections and insights you've identified..."
              value={userInput.insights}
              onChange={handleInputChange('insights')}
            />
          </ReasoningSection>
          
          <ReasoningSection variants={itemVariants}>
            <SectionTitle>Pattern Recognition</SectionTitle>
            <p>Identify design patterns that would address the user needs you've uncovered. Select at least three patterns that are relevant to your project.</p>
            
            <PatternSection>
              <h4>Select Relevant Design Patterns:</h4>
              <PatternVisual>
                {patternTagOptions.map(pattern => (
                  <PatternTag 
                    key={pattern}
                    selected={selectedPatterns.includes(pattern)}
                    onClick={() => togglePattern(pattern)}
                    variants={patternTagVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {pattern}
                  </PatternTag>
                ))}
              </PatternVisual>
            </PatternSection>
          </ReasoningSection>
        </ReasoningContainer>
        
        <ProgressWrapper>
          <h3>Your Reasoning Progress</h3>
          <p>Complete the sections above to advance to the next stage.</p>
          <ProgressBar>
            <ProgressIndicator progress={progress} />
          </ProgressBar>
        </ProgressWrapper>
      </motion.div>
    </StageLayout>
  );
};

export default ReasoningStage;