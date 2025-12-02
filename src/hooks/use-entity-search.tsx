import { useEffect, useRef, useState } from "react";
import { PAGINATION } from "@/constants/pagination";

type UseEntitySearchProps<T extends { search: string; page: number }> = {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
};

export function useEntitySearch<T extends { search: string; page: number }>(
  props: UseEntitySearchProps<T>
) {
  const [localSearch, setLocalSearch] = useState(props.params.search);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip page reset on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (localSearch === "" && props.params.search !== "") {
      // Reset params
      props.setParams({
        ...props.params,
        search: "",
        page: PAGINATION.DEFAULT_PAGE,
      });
      return;
    }

    const timer = setTimeout(() => {
      props.setParams({
        ...props.params,
        search: localSearch,
        page: PAGINATION.DEFAULT_PAGE,
      });
    }, props.debounceMs);

    return () => clearTimeout(timer);
  }, [localSearch, props.debounceMs]);

  useEffect(() => {
    setLocalSearch(props.params.search);
  }, [props.params.search]);

  return {
    value: localSearch,
    onSearchChange: setLocalSearch,
  };
}
