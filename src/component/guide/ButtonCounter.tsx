import { useLayoutEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';

interface Props {
  nextSecond: number;
  sound?: boolean;
  onNext: () => void;
}

const CountTextStyle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  font-size: 1.4rem;
  font-weight: bold;
  background-color: #fff;
  color: #2264e5;
  margin-left: 0.5rem;
  line-height: 1;
`;

const ButtonCounter = ({ nextSecond, sound = false, onNext }: Props) => {
  const [counText, setCountText] = useState(nextSecond);
  const onNextRef = useRef(onNext);

  useLayoutEffect(() => {
    const timer = setInterval(() => {
      setCountText(prev => {
        if (prev === 1) {
          onNextRef.current();
          return nextSecond;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [nextSecond]);

  useLayoutEffect(() => {
    onNextRef.current = onNext;
  }, [onNext]);

  return (
    <CountTextStyle>
      {counText}
      {sound && (
        <audio autoPlay>
          <source src="/audio/countdown.mp3" type="audio/mpeg" />
        </audio>
      )}
    </CountTextStyle>
  );
};

export default ButtonCounter;
