const ToppingCheck = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      {...props}
    >
      <circle
        cx="24"
        cy="24"
        r="22"
        fill="white"
        stroke="#04fc04"
        strokeWidth="4"
      />
      <path
        d="M14 22.5L21.1667 31L34 17"
        stroke="#04fc04"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ToppingCheck;
