import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface CheckboxProps {
  id: string;
  color: string;
  schedules: any[];
}

const Checkbox: React.FC<CheckboxProps> = ({ id, color, schedules }) => {
  const [schedulesByCategory, setSchedulesByCategory] = useState<any[]>([]);

  useEffect(() => {
    setSchedulesByCategory([
      ...document.querySelectorAll(`.schedule-category-${+id.slice(-2)}`),
    ]);
  }, [schedules]);

  function toggle() {
    schedulesByCategory.forEach((scheduleEl) => {
      scheduleEl.classList.toggle('hidden');
    });
  }

  return (
    <StyledWrapper color={color}>
      <div className="checkbox-wrapper-12">
        <div className="cbx">
          <input defaultChecked type="checkbox" id={id} onChange={toggle} />
          <label htmlFor={id} />
          <svg
            fill="none"
            filter="invert(0%) sepia(100%) saturate(100%) hue-rotate(331deg) brightness(0) contrast(114%)"
            viewBox="0 0 15 14"
            height={7}
            width={8}
          >
            <path d="M2 8.36364L6.23077 12L13 2" />
          </svg>
        </div>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goo-12">
              <feGaussianBlur
                result="blur"
                stdDeviation={4}
                in="SourceGraphic"
              />
              <feColorMatrix
                result="goo-12"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
                mode="matrix"
                in="blur"
              />
              <feBlend in2="goo-12" in="SourceGraphic" />
            </filter>
          </defs>
        </svg>
      </div>
    </StyledWrapper>
  );
};

const generateSplashAnimation = (color: string) => keyframes`
  40% {
    background: ${color || '#000'};
    box-shadow: 0 -18px 0 -8px ${color || '#000'},
      16px -8px 0 -8px ${color || '#000'},
      16px 8px 0 -8px ${color || '#000'},
      0 18px 0 -8px ${color || '#000'},
      -16px 8px 0 -8px ${color || '#000'},
      -16px -8px 0 -8px ${color || '#000'};
  }

  100% {
    background: ${color || '#000'};
    box-shadow: 0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent,
      32px 16px 0 -10px transparent, 0 36px 0 -10px transparent,
      -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
  }
`;

const StyledWrapper = styled.div<{ color: string }>`
  .checkbox-wrapper-12 {
    position: relative;
    margin-right: 8px;
  }

  .checkbox-wrapper-12 > svg {
    position: absolute;
    top: -130%;
    left: -170%;
    width: 110px;
    pointer-events: none;
  }

  .checkbox-wrapper-12 * {
    box-sizing: border-box;
  }

  .checkbox-wrapper-12 input[type='checkbox'] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    margin: 0;
  }

  .checkbox-wrapper-12 input[type='checkbox']:focus {
    outline: 0;
  }

  .checkbox-wrapper-12 .cbx {
    width: 16px;
    height: 16px;
    top: calc(100px - 12px);
    left: calc(100px - 12px);
  }

  .checkbox-wrapper-12 .cbx input {
    position: absolute;
    top: 0;
    left: 0;
    width: 16px;
    height: 16px;
    border: 2px solid ${(props) => props.color || '#bfbfc0'};
    border-radius: 50%;
  }

  .checkbox-wrapper-12 .cbx label {
    width: 16px;
    height: 16px;
    background: none;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    pointer-events: none;
  }

  .checkbox-wrapper-12 .cbx svg {
    position: absolute;
    top: 5px;
    left: 4px;
    z-index: 1;
    pointer-events: none;
  }

  .checkbox-wrapper-12 .cbx svg path {
    stroke: #fff;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 19;
    stroke-dashoffset: 19;
    -webkit-transition: stroke-dashoffset 0.3s ease;
    transition: stroke-dashoffset 0.3s ease;
    -webkit-transition-delay: 0.2s;
    transition-delay: 0.2s;
  }

  .checkbox-wrapper-12 .cbx input:checked + label {
    -webkit-animation: ${(props) => generateSplashAnimation(props.color)} 0.6s
      ease forwards;
    animation: ${(props) => generateSplashAnimation(props.color)} 0.6s ease
      forwards;
  }

  .checkbox-wrapper-12 .cbx input:checked + label + svg path {
    stroke-dashoffset: 0;
  }
`;

export default Checkbox;
