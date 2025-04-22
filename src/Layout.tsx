import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from 'Root/src/component/AppHeader';

const Root = () => {
  return (
    <div className="flex flex-col w-full h-full overflow-auto select-none">
      <AppHeader />
      <div className="flex-1 w-full h-full min-h-[708px] max-h-[964px] pt-[5.4rem] bg-[#f6f6f6]">
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
