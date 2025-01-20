import { useEffect, useRef, type MutableRefObject } from "react";

// A custom hook that stores the previous value of a state or prop
const usePrevious = <T>(value: T): MutableRefObject<T> => {
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
};

export default usePrevious;
