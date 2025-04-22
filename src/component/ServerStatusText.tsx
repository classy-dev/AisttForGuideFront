import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'StoreFarm/reducer';

const ServerStatusText = () => {
  const isConnected = useSelector(
    (state: RootState) => state.connected.isConnected
  );
  const isSaveHost = useSelector(
    (state: RootState) => !!state.preference.hostname
  );

  const statusText = React.useMemo(
    () =>
      !isSaveHost ? '연결 정보 없음' : isConnected ? '연결됨' : '연결 안 됨',
    [isConnected, isSaveHost]
  );
  const statusColor = React.useMemo(
    () =>
      !isSaveHost
        ? 'before:bg-typo-2 before:border-typo-4'
        : isConnected
          ? 'before:bg-download-2 before:border-transparent'
          : 'before:bg-error-1 before:border-transparent',
    [isConnected, isSaveHost]
  );

  return (
    <span className="text-sm font-bold inline-flex items-center">
      서버 상태:
      <span
        className={`ml-1 before:inline-flex before:rounded-full before:mr-2 before:relative before:top-[-2px] before:w-3 before:h-3 before:box-border before:border-[1px] ${statusColor}`}
      >
        {statusText}
      </span>
    </span>
  );
};

export default ServerStatusText;
