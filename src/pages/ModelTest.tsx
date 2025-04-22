import { useState } from 'react';
import styled from '@emotion/styled';
import InferenceList from 'ComponentFarm/model/InferenceList';
import { useFetchMenuList } from 'HookFarm/useMenu';

const ModelTestScreenStyle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 0 2rem;
  overflow: auto;

  .top {
    padding: 2rem;
    margin: 0 -2rem;
    top: 0;
    position: sticky;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: #fff;
    z-index: 2;
  }

  h1 {
    font-size: 2rem;
    font-weight: bold;
  }

  select {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const ModelTestScreen = () => {
  const [selectedMenuId, setSelectedMenuId] = useState(-1);
  const { data } = useFetchMenuList();

  return (
    <ModelTestScreenStyle>
      <div className="top">
        <h1>피자 AI 모델 테스트 인터페이스</h1>
        <select
          //   value={selectedMenuId}
          onChange={e => setSelectedMenuId(Number(e.target.value))}
        >
          <option disabled selected={selectedMenuId === -1} value={-1}>
            메뉴를 선택해주세요.
          </option>
          {data?.data.map(menu => (
            <option
              key={menu.id}
              value={menu.id}
              selected={menu.id === selectedMenuId}
            >
              {menu.attributes.menu_name}
              (CODE: {menu.attributes.ai_menu_code})
            </option>
          ))}
        </select>
      </div>

      {selectedMenuId > 0 && <InferenceList menuIdx={selectedMenuId} />}
    </ModelTestScreenStyle>
  );
};

export default ModelTestScreen;
