import React, { useEffect, useRef } from 'react';

interface ToppingStepProps {
  stepName: string;
  toppingValue: number | string;
  toppingUnit: string;
  progressString: string;
  unit: string;
  active?: boolean;
}

const ToppingStep = ({
  stepName,
  progressString,
  toppingUnit,
  toppingValue,
  active,
  unit,
}: ToppingStepProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!active) return;
    // 스텝 활성화시 스크롤 포커스
    sectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
    });
  }, [active]);

  return (
    <section
      ref={sectionRef}
      className={`flex-none w-auto min-w-[210px] h-full justify-between inline-flex flex-col rounded-lg overflow-hidden border-typo-4 border bg-white font-bold transition-all ${
        active
          ? 'scale-100 opacity-100  text-primary-5 border-2 !border-primary-5'
          : 'scale-90 opacity-50'
      } `}
    >
      <h3 className="flex-none w-full text-center text-xl p-2 border-b border-[inherit]">
        {stepName}
      </h3>
      <div className="flex justify-between">
        <p className="flex justify-end  items-end tracking-normal text-2xl pl-4 pb-4 font-medium mr-4">
          {unit === '%' && (
            <span className="inline-flex items-baseline whitespace-pre">
              {toppingValue}
              <span className="pl-1 text-lg">{toppingUnit}</span>
            </span>
          )}
        </p>
        <p className="flex justify-end items-baseline  pb-4 pr-2 tracking-normal text-xl lg:text-3xl -letter font-medium">
          {progressString} <span className="pl-1 text-lg">{unit}</span>
        </p>
      </div>
    </section>
  );
};

export default ToppingStep;
