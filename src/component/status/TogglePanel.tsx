import styled from '@emotion/styled';
import { PanelStyle } from './Panel';

interface Props {
  title: string;
  icon: React.ReactNode;
  connected?: boolean;
  checked?: boolean;
  loading?: boolean;
  onChange: (status: boolean) => void;
}

const TogglePannelStyle = styled(PanelStyle)`
  display: inline-flex;
  flex: none;
  width: calc(50% - 13px);
  justify-content: space-between;
  align-items: center;
  min-height: 91px;
  background: linear-gradient(
    134deg,
    #4e4e4e 0%,
    #333 19.79%,
    #1a1a1a 37.5%,
    #1a1a1a 60.94%,
    #262626 80.73%,
    #4e4e4e 100%
  );

  .left {
    display: flex;
    align-items: center;
  }

  .panel-title {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 26px;
    font-weight: 600;
    line-height: 1.5;
    margin-left: 24px;
  }

  .connect-status {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    font-size: 13px;
    font-weight: 700;
    color: #ff7e78;

    svg {
      position: relative;
      top: 1px;
      left: -2px;
      margin-right: 0;
    }
  }

  &.connected .connect-status {
    color: #1ecb4f;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 42px;
    height: 20px;
    margin-left: auto;
    margin-right: 0;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
    background-color: #434343;
    border-radius: 11px;
    transition: all 0.3s ease;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  input:checked + .slider {
    background-color: #1ecb4f;
  }

  input:checked + .slider:before {
    transform: translateX(calc(42px - 20px));
  }
  .slider.round:before {
    border-radius: 50%;
  }
`;

export const TogglePanel = ({
  title,
  icon,
  connected,
  checked,
  loading,
  onChange,
}: Props) => {
  return (
    <TogglePannelStyle className={connected ? 'connected' : 'disconnected'}>
      <div className="left">
        <div className="icon">{icon}</div>
        <h3 className="panel-title">
          {title}
          <span className="connect-status">
            {connected ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 48 48"
                fill="none"
              >
                <g clipPath="url(#clip0_18_342)">
                  <path
                    d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM18.58 32.58L11.4 25.4C10.62 24.62 10.62 23.36 11.4 22.58C12.18 21.8 13.44 21.8 14.22 22.58L20 28.34L33.76 14.58C34.54 13.8 35.8 13.8 36.58 14.58C37.36 15.36 37.36 16.62 36.58 17.4L21.4 32.58C20.64 33.36 19.36 33.36 18.58 32.58Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_18_342">
                    <rect width="48" height="48" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 48 48"
                fill="none"
              >
                <g clipPath="url(#clip0_21_701)">
                  <path
                    d="M24 4C12.94 4 4 12.94 4 24C4 35.06 12.94 44 24 44C35.06 44 44 35.06 44 24C44 12.94 35.06 4 24 4ZM32.6 32.6C31.82 33.38 30.56 33.38 29.78 32.6L24 26.82L18.22 32.6C17.44 33.38 16.18 33.38 15.4 32.6C14.62 31.82 14.62 30.56 15.4 29.78L21.18 24L15.4 18.22C14.62 17.44 14.62 16.18 15.4 15.4C16.18 14.62 17.44 14.62 18.22 15.4L24 21.18L29.78 15.4C30.56 14.62 31.82 14.62 32.6 15.4C33.38 16.18 33.38 17.44 32.6 18.22L26.82 24L32.6 29.78C33.36 30.54 33.36 31.82 32.6 32.6Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_21_701">
                    <rect width="48" height="48" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            )}
            {connected ? 'Connected' : 'Disable'}
          </span>
        </h3>
      </div>
      <label className="switch">
        <input
          type="checkbox"
          checked={!!checked}
          disabled={loading}
          onChange={() => onChange(!checked)}
        />
        <span className="slider round" />
      </label>
    </TogglePannelStyle>
  );
};
