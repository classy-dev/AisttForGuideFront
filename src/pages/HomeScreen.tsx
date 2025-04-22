import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import preferenceSlice from 'SliceFarm/preference';
import { useAppDispatch } from 'StoreFarm/index';
import { RootState } from 'StoreFarm/reducer';
import styled from '@emotion/styled';
import { LeftDirection, RightDirection } from 'ComponentFarm/icon/Direction';

const HomeScreenStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .info {
    flex: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4.2rem 0;
  }

  h3 {
    font-size: 3.2rem;
    margin-bottom: 1.6rem;
    font-weight: 700;
  }

  p {
    font-size: 2.4rem;
    color: #b0adab;
  }

  img {
    width: 13.2rem;
    margin-bottom: 2.4rem;
  }

  .button-wrapper {
    flex: 1;
    display: flex;
    width: 100%;
    border-top: 2px solid #e5e5e5;
  }

  button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fff;
    font-size: 3.2rem;
    font-weight: bold;
    color: #2264e5;
    svg {
      margin-bottom: 3.6rem;
    }
    .sub {
      margin-top: 2.4rem;
      color: #b2ddff;
      font-size: 2.4rem;
      font-weight: normal;
    }
  }

  button + button {
    margin-left: 2px solid #e5e5e5;
  }
`;

const HomeScreen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const preference = useSelector((state: RootState) => state.preference);

  useEffect(() => {
    if (preference.direction) {
      navigate(`/${preference.direction}`);
    }
  }, [preference.direction]);

  const handleDirectionClick = (direction: 'left' | 'right') => {
    dispatch(
      preferenceSlice.actions.setPreferenceAndSaveStorage({
        direction,
      })
    );
    navigate(`/${direction}`);
  };

  return (
    <HomeScreenStyle>
      <section className="info">
        <img src="/img/blue-logo.png" alt="home-bg" className="w-full" />
        <h3>스마트 토핑 테이블 교육가이드</h3>
        <p>해당 토핑 테이블의 위치를 선택해서 진행해주세요.</p>
      </section>
      <div className="button-wrapper">
        <button type="button" onClick={() => handleDirectionClick('left')}>
          <LeftDirection />
          토핑테이블 좌측 선택
          <span className="sub">TOPING TABLE LEFT</span>
        </button>
        <button type="button" onClick={() => handleDirectionClick('right')}>
          <RightDirection />
          토핑테이블 우측 선택
          <span className="sub">TOPING TABLE RIGHT</span>
        </button>
      </div>
    </HomeScreenStyle>
  );
};

export default HomeScreen;
