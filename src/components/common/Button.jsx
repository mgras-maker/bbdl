import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

// Styled button with variants
const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: var(--font-size-md);
  font-weight: 600;
  border-radius: var(--radius-md);
  transition: all var(--transition-medium);
  border: none;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  /* Accessibility */
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  /* Primary variant */
  ${props => props.variant === 'primary' && css`
    background-color: var(--color-primary);
    color: white;
    
    &:hover {
      background-color: var(--color-primary-light);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}

  /* Secondary variant */
  ${props => props.variant === 'secondary' && css`
    background-color: transparent;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
    
    &:hover {
      background-color: var(--color-primary);
      color: white;
    }
  `}

  /* Text variant */
  ${props => props.variant === 'text' && css`
    background-color: transparent;
    color: var(--color-primary);
    padding: 0.5rem;
    
    &:hover {
      background-color: rgba(44, 110, 73, 0.1);
      border-radius: var(--radius-sm);
    }
  `}

  /* Stage specific styling */
  ${props => props.stageTheme === 'empathy' && css`
    background-color: var(--color-secondary);
    color: var(--color-text);
    
    &:hover {
      background-color: rgba(255, 201, 185, 0.8);
    }
  `}

  ${props => props.stageTheme === 'reasoning' && css`
    /* Already using primary color */
  `}

  ${props => props.stageTheme === 'materialization' && css`
    background-color: var(--color-tertiary);
    
    &:hover {
      background-color: rgba(214, 140, 69, 0.8);
    }
  `}

  /* Size variants */
  ${props => props.size === 'small' && css`
    padding: 0.5rem 1rem;
    font-size: var(--font-size-sm);
  `}

  ${props => props.size === 'large' && css`
    padding: 1rem 2rem;
    font-size: var(--font-size-lg);
  `}

  /* Disabled state */
  ${props => props.disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  `}

  /* Full width */
  ${props => props.fullWidth && css`
    width: 100%;
  `}
`;

// Animation variants for button
const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

// Button component
const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  stageTheme,
  disabled = false,
  fullWidth = false,
  onClick,
  ...props
}, ref) => {
  return (
    <motion.div
      initial="initial"
      whileHover={!disabled && "hover"}
      whileTap={!disabled && "tap"}
      variants={buttonVariants}
    >
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        stageTheme={stageTheme}
        disabled={disabled}
        fullWidth={fullWidth}
        onClick={disabled ? undefined : onClick}
        {...props}
      >
        {children}
      </StyledButton>
    </motion.div>
  );
});

Button.displayName = 'Button';

export default Button;