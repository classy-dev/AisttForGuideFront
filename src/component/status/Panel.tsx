import styled from '@emotion/styled';

export interface Props {
  title: string;
  connected?: boolean;
}

export const PanelStyle = styled.section`
  display: inline-flex;
  flex: 1;
  min-height: 206px;
  height: 100%;
  padding: 17px;
  background: linear-gradient(
    134deg,
    #4e4e4e 0%,
    #333 19.79%,
    #1a1a1a 37.5%,
    #1a1a1a 60.94%,
    #262626 80.73%,
    #4e4e4e 100%
  );
  color: #d9d9d9;
  border-radius: 13px;
  align-items: flex-start;
  box-shadow: 2px 6px 15px 2px rgba(12, 10, 11, 0.8);

  .panel-title {
    display: flex;
    align-items: center;
    color: #d9d9d9;
    font-size: 19px;
    font-weight: 600;
    font-style: normal;
    line-height: normal;
    svg {
      margin-right: 8px;
      position: relative;
      top: 2px;
    }
  }

  &.connected svg {
    color: #1ecb4f;
  }

  &.disconnected {
    background: #000;
  }
  &.disconnected svg {
    color: #ff7e78;
  }
`;

export const Panel = ({ title, connected }: Props) => {
  return (
    <PanelStyle className={connected ? 'connected' : 'disconnected'}>
      <h3 className="panel-title">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="9"
          height="9"
          viewBox="0 0 34 35"
          fill="none"
        >
          <circle cx="17" cy="17.5" r="17" fill="currentColor" />
        </svg>
        {title}
      </h3>
    </PanelStyle>
  );
};
