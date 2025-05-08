import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const FooterContainer = styled.footer`
  background-color: #f5f5f5;
  padding: 4rem 2rem;
  border-top: 1px solid #eaeaea;
  width: 100%;
`;

const FooterContent = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h4`
  font-family: var(--font-secondary);
  font-size: 1.25rem;
  color: var(--color-text);
  margin-bottom: 1rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 2rem;
    height: 2px;
    background: linear-gradient(
      to right,
      var(--color-secondary),
      var(--color-primary),
      var(--color-tertiary)
    );
    
    @media (max-width: 768px) {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const FooterLink = styled.a`
  color: var(--color-text-light);
  text-decoration: none;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--color-primary);
  }
`;

const FooterText = styled.p`
  color: var(--color-text-light);
  line-height: 1.6;
`;

const Copyright = styled.div`
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eaeaea;
  text-align: center;
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SocialIcon = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  background-color: #f0f0f0;
  color: var(--color-text);
  transition: all var(--transition-medium);
  
  &:hover {
    background-color: var(--color-primary);
    color: white;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>BBDL Design Process</FooterTitle>
          <FooterText>
            An interactive tool for exploring and applying the three-stage sustainable design methodology: Empathy, Reasoning, and Materialization.
          </FooterText>
          <SocialLinks>
            <SocialIcon 
              href="#" 
              aria-label="Twitter"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </SocialIcon>
            <SocialIcon 
              href="#" 
              aria-label="Instagram"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </SocialIcon>
            <SocialIcon 
              href="#" 
              aria-label="GitHub"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"></path>
              </svg>
            </SocialIcon>
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Design Stages</FooterTitle>
          <FooterLink href="#empathy">Empathy</FooterLink>
          <FooterLink href="#reasoning">Reasoning</FooterLink>
          <FooterLink href="#materialization">Materialization</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Resources</FooterTitle>
          <FooterLink href="#" target="_blank">Sustainable Design Guidelines</FooterLink>
          <FooterLink href="#" target="_blank">Accessibility in Design</FooterLink>
          <FooterLink href="#" target="_blank">Design Ethics</FooterLink>
          <FooterLink href="#" target="_blank">Biomimicry Resources</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Contact</FooterTitle>
          <FooterText>
            Have questions about the BBDL design process or need assistance?
          </FooterText>
          <FooterLink href="mailto:info@bbdldesign.com">info@bbdldesign.com</FooterLink>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        © {new Date().getFullYear()} BBDL Design Process. All rights reserved.
        <div>Built with sustainability in mind.</div>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;