const Loading = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="94"
      height="94"
      viewBox="0 0 94 94"
      fill="none"
      {...props}
    >
      <mask
        id="mask0_193_2913"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="94"
        height="94"
      >
        <rect width="94" height="94" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_193_2913)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M79.7994 55.937C84.6594 37.7991 73.8956 19.1557 55.7578 14.2956C37.6199 9.43561 18.9764 20.1994 14.1164 38.3373C9.25641 56.4751 20.0202 75.1186 38.1581 79.9786C56.2959 84.8386 74.9394 74.0748 79.7994 55.937ZM58.3459 4.63638C81.8185 10.9258 95.7481 35.0526 89.4586 58.5251C83.1692 81.9977 59.0424 95.9273 35.5699 89.6378C12.0974 83.3484 -1.83227 59.2216 4.45717 35.7491C10.7466 12.2766 34.8734 -1.65306 58.3459 4.63638Z"
          fill="#EBEBF3"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M70.4134 22.705C57.7819 10.0734 35.9342 10.0585 23.3102 22.6825C10.5987 35.394 10.4146 53.5928 18.7877 66.8423L10.3342 72.1845C-0.194791 55.5234 -0.210177 32.0608 16.2391 15.6115C32.7759 -0.92534 60.9552 -0.895345 77.4845 15.6339C79.4371 17.5865 79.4371 20.7523 77.4845 22.705C75.5319 24.6576 72.366 24.6576 70.4134 22.705Z"
          fill="url(#paint0_linear_193_2913)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_193_2913"
          x1="39.8011"
          y1="-8.66479"
          x2="18.5662"
          y2="51.0225"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2264E5" />
          <stop offset="1" stopColor="#2264E5" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Loading;
