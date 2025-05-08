import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

// Styled components for the presentation
const PresentationContainer = styled.section`
  width: 100%;
  padding: 3rem 2rem; /* Reduced from 5rem to 3rem */
  background-color: #f9fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  position: relative;
`;

const CircleContainer = styled(motion.div)`
  position: relative;
  width: min(800px, 90vw);
  height: min(700px, 80vw); /* Reduced height from 800px to 700px */
  margin: 1rem auto; /* Reduced margins */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CenterCircle = styled(motion.div)`
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle, #7CC9E8, #0095DA);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.4rem;
  text-align: center;
  box-shadow: 0 0 30px rgba(124, 201, 232, 0.4);
  z-index: 10;
  padding: 1rem;

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    font-size: 1.2rem;
  }
`;

const OrbitCircle = styled(motion.div)`
  position: absolute;
  width: ${props => props.radius}px;
  height: ${props => props.radius}px;
  border-radius: 50%;
  border: 2px dashed ${props => props.borderColor};
`;

const OrbitLabel = styled(motion.div)`
  background-color: ${props => props.backgroundColor || 'white'};
  color: ${props => props.color || 'black'};
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-size: 0.9rem;
  white-space: nowrap;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  z-index: 20;
  font-weight: 600;
  min-width: 100px;
  width: fit-content;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 2px solid ${props => props.borderColor || 'transparent'};
  text-align: center;
  transform-origin: center;
  pointer-events: auto;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    z-index: 21;
    white-space: normal;
    overflow: visible;
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
    max-width: 180px;
    min-width: 80px;
  }
`;

const OrbitDot = styled(motion.div)`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color || '#7CC9E8'};
  box-shadow: 0 0 10px ${props => props.color || 'rgba(124, 201, 232, 0.5)'};
  z-index: 25; // Zwiększamy z-index, aby kulka była nad etykietą
`;

const StageLabel = styled(motion.div)`
  position: absolute;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.color || 'rgba(0, 0, 0, 0.5)'};
  transform-origin: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 3;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

// New designer-friendly navigation component
const DesignerNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0 1rem; /* Reduced margin */
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const StageButton = styled(motion.button)`
  background-color: ${props => props.active ? props.color : 'white'};
  color: ${props => props.active ? 'white' : props.color};
  border: 2px solid ${props => props.color};
  border-radius: var(--radius-md);
  padding: 0.7rem 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-medium);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const NumberBadge = styled.span`
  background-color: ${props => props.active ? 'white' : props.color};
  color: ${props => props.active ? props.color : 'white'};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.85rem;
  transition: all var(--transition-medium);
`;

const MapToggleContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0; /* Reduced from 3rem to 1.5rem to bring menu closer to the presentation */
  flex-wrap: wrap;
  justify-content: center;
`;

const MapToggleButton = styled(motion.button)`
  background-color: ${props => props.isActive ? props.activeColor : 'white'};
  color: ${props => props.isActive ? 'white' : props.color};
  border: 2px solid ${props => props.isActive ? props.activeColor : props.color};
  border-radius: var(--radius-md);
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all var(--transition-medium);
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover {
    border-color: ${props => props.activeColor};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }
`;

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
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

// Dane dla procesu "miasto piękne" zgodnie z obrazkiem
const miastoPiekneItems = [
  // Orbita 1 - Empatia/Odczuj (niebieska) - równomierne rozłożenie co 60 stopni
  { text: "potrzeba piękna", orbit: 1, angle: 0, color: '#7CC9E8', backgroundColor: 'white', borderColor: '#7CC9E8' },
  { text: "harmonia mundi", orbit: 1, angle: 60, color: '#7CC9E8', backgroundColor: 'white', borderColor: '#7CC9E8' },
  { text: "chaos wizualny", orbit: 1, angle: 120, color: '#7CC9E8', backgroundColor: 'white', borderColor: '#7CC9E8' },
  { text: "agresywna reklama", orbit: 1, angle: 180, color: '#7CC9E8', backgroundColor: 'white', borderColor: '#7CC9E8' },
  { text: "chaos przestrzenny", orbit: 1, angle: 240, color: '#7CC9E8', backgroundColor: 'white', borderColor: '#7CC9E8' },
  { text: "dziedzictwo", orbit: 1, angle: 300, color: '#7CC9E8', backgroundColor: 'white', borderColor: '#7CC9E8' },

  // Orbita 2 - Rozumowanie/Wymyśl (zielona) - równomierne rozłożenie co 72 stopnie (5 elementów)
  { text: "uchwała reklamowa", orbit: 2, angle: 0, color: '#4c956c', backgroundColor: 'white', borderColor: '#4c956c' },
  { text: "edukacja o pięknie", orbit: 2, angle: 72, color: '#4c956c', backgroundColor: 'white', borderColor: '#4c956c' },
  { text: "nowa koncepcja szyldów", orbit: 2, angle: 144, color: '#4c956c', backgroundColor: 'white', borderColor: '#4c956c' },
  { text: "reklama a architektura", orbit: 2, angle: 216, color: '#4c956c', backgroundColor: 'white', borderColor: '#4c956c' },
  { text: "ochrona dziedzictwa", orbit: 2, angle: 288, color: '#4c956c', backgroundColor: 'white', borderColor: '#4c956c' },

  // Orbita 3 - Materializacja/Zrób (pomarańczowa) - równomierne rozłożenie co 60 stopni
  { text: "rewitalizacja historyczna", orbit: 3, angle: 0, color: '#d68c45', backgroundColor: 'rgba(214, 140, 69, 0.1)', borderColor: '#d68c45' },
  { text: "nowe szyldy - warsztaty", orbit: 3, angle: 60, color: '#d68c45', backgroundColor: 'rgba(214, 140, 69, 0.1)', borderColor: '#d68c45' },
  { text: "uchwała reklamowa - poradnik", orbit: 3, angle: 120, color: '#d68c45', backgroundColor: 'rgba(214, 140, 69, 0.1)', borderColor: '#d68c45' },
  { text: '"rozmowa o pięknie" - seminarium', orbit: 3, angle: 180, color: '#d68c45', backgroundColor: 'rgba(214, 140, 69, 0.1)', borderColor: '#d68c45' },
  { text: "BB_Design Lab - wystawy", orbit: 3, angle: 240, color: '#d68c45', backgroundColor: 'rgba(214, 140, 69, 0.1)', borderColor: '#d68c45' },
  { text: "komunikacja wizualna", orbit: 3, angle: 300, color: '#d68c45', backgroundColor: 'rgba(214, 140, 69, 0.1)', borderColor: '#d68c45' }
];

// Przygotowanie na przyszłe dane
const miastoDostepneItems = [];
const miastoKreatywneItems = [];

const ProcessPresentation = () => {
  const [activeMap, setActiveMap] = useState("miastopiekne");
  const [items, setItems] = useState(miastoPiekneItems);
  const [orbitsRotation, setOrbitsRotation] = useState({ orbit1: 0, orbit2: 0, orbit3: 0 });
  const [activeStages, setActiveStages] = useState([1]); // Start with just stage 1 active
  const [maxIterations, setMaxIterations] = useState(3);
  
  // Stage information
  const stageInfo = {
    1: { name: 'Empatia', color: '#7CC9E8' },
    2: { name: 'Rozumowanie', color: '#4c956c' },
    3: { name: 'Materializacja', color: '#d68c45' }
  };
  
  // Funkcja do obliczania optymalnej szerokości etykiety na podstawie długości tekstu
  const calculateLabelWidth = (text) => {
    // Bazowa szerokość dla krótkiego tekstu
    const baseWidth = 100;
    // Średnia szerokość znaku w pikselach (przybliżona wartość)
    const charWidth = 7;
    // Obliczenie szerokości na podstawie długości tekstu
    const calculatedWidth = Math.max(baseWidth, text.length * charWidth + 40);
    // Ograniczenie maksymalnej szerokości
    return Math.min(calculatedWidth, 280);
  };

  // Efekt animacji ciągłego obrotu orbit
  useEffect(() => {
    const interval = setInterval(() => {
      setOrbitsRotation(prev => ({
        orbit1: (prev.orbit1 + 0.03) % 360,  // Zmniejszona prędkość z 0.05 na 0.03
        orbit2: (prev.orbit2 - 0.02) % 360,  // Zmniejszona prędkość z 0.03 na 0.02
        orbit3: (prev.orbit3 + 0.015) % 360  // Zmniejszona prędkość z 0.02 na 0.015
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Obsługa przełączania między mapami
  const handleMapToggle = (map) => {
    setActiveMap(map);
    setActiveStages([1]); // Reset to first stage when changing maps
    switch (map) {
      case "miastopiekne":
        setItems(miastoPiekneItems);
        setMaxIterations(3);
        break;
      case "miastodostepne":
        setItems(miastoDostepneItems);
        setMaxIterations(3);
        break;
      case "miastokreatywne":
        setItems(miastoKreatywneItems);
        setMaxIterations(3);
        break;
      default:
        setItems(miastoPiekneItems);
        setMaxIterations(3);
    }
  };

  // Toggle a stage on/off in the activeStages array
  const toggleStage = (stage) => {
    if (activeStages.includes(stage)) {
      // Don't allow deactivating if it's the only active stage
      if (activeStages.length > 1) {
        setActiveStages(prev => prev.filter(s => s !== stage));
      }
    } else {
      setActiveStages(prev => [...prev, stage].sort());
    }
  };

  // Update displayed items based on active stages
  useEffect(() => {
    if (activeMap === "miastopiekne") {
      // Filter items based on active stages
      const filteredItems = miastoPiekneItems.filter(item => activeStages.includes(item.orbit));
      setItems(filteredItems);
    }
  }, [activeStages, activeMap]);
  
  const orbitConfig = {
    1: { radius: 240, dotRadius: 8 },
    2: { radius: 400, dotRadius: 8 },
    3: { radius: 560, dotRadius: 8 }
  };

  const getPositionOnCircle = (radius, angle) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: radius * Math.cos(radians),
      y: radius * Math.sin(radians)
    };
  };

  const getAdjustedPosition = (position, item, index, allItems) => {
    // Zwracamy pozycję z uwzględnieniem przesunięcia, żeby etykieta była wycentrowana
    // nad punktem
    return {
      x: position.x,
      y: position.y
    };
  };

  return (
    <PresentationContainer>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        {/* New designer-friendly navigation */}
        <DesignerNavigation>
          {Object.entries(stageInfo).map(([stageNum, stage]) => (
            <StageButton
              key={stageNum}
              active={activeStages.includes(Number(stageNum))}
              color={stage.color}
              onClick={() => toggleStage(Number(stageNum))}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <NumberBadge 
                active={activeStages.includes(Number(stageNum))}
                color={stage.color}
              >
                {stageNum}
              </NumberBadge>
              {stage.name}
            </StageButton>
          ))}
        </DesignerNavigation>

        <CircleContainer>
          {/* Only show stage labels for active stages */}
          {activeStages.includes(1) && (
            <StageLabel
              style={{
                left: '50%',
                top: '15%',
                transform: 'translateX(-50%) translateY(-50%)'
              }}
              color="#7CC9E8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              EMPATIA
            </StageLabel>
          )}
          
          {activeStages.includes(2) && (
            <StageLabel
              style={{
                right: '15%',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
              color="#4c956c"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              ROZUMOWANIE
            </StageLabel>
          )}
          
          {activeStages.includes(3) && (
            <StageLabel
              style={{
                left: '50%',
                bottom: '15%',
                transform: 'translateX(-50%) translateY(50%)'
              }}
              color="#d68c45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              MATERIALIZACJA
            </StageLabel>
          )}
            
          {/* Only show orbit circles for active stages */}
          {activeStages.includes(1) && (
            <OrbitCircle 
              radius={orbitConfig[1].radius} 
              borderColor="rgba(124, 201, 232, 0.5)"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: orbitsRotation.orbit1 
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          )}
          
          {activeStages.includes(2) && (
            <OrbitCircle 
              radius={orbitConfig[2].radius} 
              borderColor="rgba(76, 149, 108, 0.5)"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: orbitsRotation.orbit2 
              }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            />
          )}
          
          {activeStages.includes(3) && (
            <OrbitCircle 
              radius={orbitConfig[3].radius} 
              borderColor="rgba(214, 140, 69, 0.5)"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: orbitsRotation.orbit3 
              }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            />
          )}

          <CenterCircle
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            BB Design Lab
          </CenterCircle>

          {items.map((item, index) => {
            const orbitRotation = orbitsRotation[`orbit${item.orbit}`] || 0;
            const adjustedAngle = item.angle + orbitRotation;
            const position = getPositionOnCircle(orbitConfig[item.orbit].radius / 2, adjustedAngle);
            const labelPosition = getPositionOnCircle(orbitConfig[item.orbit].radius / 2, adjustedAngle);
            const adjustedLabelPosition = getAdjustedPosition(labelPosition, item, index, items);
            
            // Obliczamy przesunięcie punktu względem etykiety
            // Punkt będzie przesunięty w stronę środka o 20px
            const radians = (adjustedAngle * Math.PI) / 180;
            const dotOffsetX = -20 * Math.cos(radians);
            const dotOffsetY = -20 * Math.sin(radians);
            
            // Uproszczone wyrównanie tekstu
            const textAlign = 'center';
            
            return (
              <React.Fragment key={`${item.orbit}-${item.angle}-${index}`}>
                <OrbitLabel
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${adjustedLabelPosition.x}px), calc(-50% + ${adjustedLabelPosition.y}px))`,
                    textAlign: textAlign,
                    width: `${calculateLabelWidth(item.text)}px`,
                  }}
                  backgroundColor={item.backgroundColor}
                  textColor={item.color}
                  borderColor={item.borderColor}
                  color={item.color}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {item.text}
                </OrbitLabel>
                
                <OrbitDot
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translateX(${position.x + dotOffsetX}px) translateY(${position.y + dotOffsetY}px)`,
                  }}
                  color={item.color}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </React.Fragment>
            );
          })}
        </CircleContainer>
        
        <MapToggleContainer>
          <MapToggleButton
            isActive={activeMap === "miastopiekne"}
            activeColor="#7CC9E8"
            color="#7CC9E8"
            onClick={() => handleMapToggle("miastopiekne")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Miasto Piękne
          </MapToggleButton>
          
          <MapToggleButton
            isActive={activeMap === "miastodostepne"}
            activeColor="#FCC900"
            color="#FCC900"
            onClick={() => handleMapToggle("miastodostepne")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={miastoDostepneItems.length === 0}
          >
            Miasto Dostępne
          </MapToggleButton>
          
          <MapToggleButton
            isActive={activeMap === "miastokreatywne"}
            activeColor="#F85974"
            color="#F85974"
            onClick={() => handleMapToggle("miastokreatywne")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={miastoKreatywneItems.length === 0}
          >
            Miasto Kreatywne
          </MapToggleButton>
        </MapToggleContainer>
      </motion.div>
    </PresentationContainer>
  );
};

// Export both as default and named export to ensure it's accessible
export { ProcessPresentation };
export default ProcessPresentation;