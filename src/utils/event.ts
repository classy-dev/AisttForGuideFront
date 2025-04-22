export const debounceEvent =
  <T extends any>(
    callback: (e?: T) => void,
    time = 100,
    timer: number | null = null
  ) =>
  (e?: T) => {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(callback, time, e);
  };

export const throttleEvent = <T extends unknown[]>(
  callback: (...args: T) => void,
  time = 100
) => {
  let throttled = false;
  let savedArgs: T;

  const wrapper = (...args: T) => {
    savedArgs = args;

    if (throttled) {
      return;
    }

    throttled = true;

    setTimeout(() => {
      throttled = false;
      callback(...savedArgs);
    }, time);
  };

  return wrapper;
};

export const timer = (time: number) =>
  new Promise(resolve => setTimeout(resolve, time));
