import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from '@emotion/styled';
import StageLayout from '../../layout/StageLayout';
import Footer from '../../common/Footer';
import { ProcessPresentation } from '../../common/ProcessPresentation';
import { useProcessContext } from '../../../context/ProcessContext';

const MaterializationContainer = styled.div`
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Section = styled(motion.div)`
  background-color: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
`;

const MaterializationStage = () => {
  const { updateProgress } = useProcessContext();
  const [progress, setProgress] = useState(0);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <>
      <StageLayout
        stageName="Materialization"
        stageDescription="Bringing your sustainable design concepts to life"
        stageTheme="materialization"
        canContinue={false}
      >
        <motion.div ref={ref}>
          <MaterializationContainer>
            <Section>
              <h3>Materialization Stage</h3>
              <p>This is where your design ideas become reality.</p>
            </Section>
          </MaterializationContainer>
        </motion.div>
      </StageLayout>
      <ProcessPresentation />
      <Footer />
    </>
  );
};

// Export both as default and named export to ensure it's accessible
export { MaterializationStage };
export default MaterializationStage;