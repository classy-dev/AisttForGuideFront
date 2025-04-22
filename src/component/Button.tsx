const Variants = {
  primary:
    'bg-[#2264E5] transition-colors text-white font-medium disabled:bg-[#B2DDFF] disabled:text-white disabled:cursor-not-allowed',
  outline:
    'text-[#2264E5] bg-transparent transition-colors border-[2px] border-currentColor font-medium disabled:bg-[#B2DDFF] disabled:text-[#B2DDFF] disabled:cursor-not-allowed',
};

const Sizes = {
  md: 'min-w-[20rem] h-[7.8rem] rounded-[0.6rem] text-2xl font-medium',
  sm: 'min-w-[15rem] h-[4.8rem] rounded-[0.6rem] text-1xl font-medium',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof Variants;
  size?: keyof typeof Sizes;
}

export const Button = ({
  variant = 'primary',
  type = 'button',
  size = 'md',
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      type={type}
      className={`${Sizes[size]} ${Variants[variant]} ${props.className}`}
    >
      {props.children}
    </button>
  );
};
