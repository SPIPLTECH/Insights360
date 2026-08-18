"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FullDashboardData, DataServiceError } from "./dataService";

interface State {
  data: FullDashboardData | null;
  error: DataServiceError | null;
  loading: boolean;
  refreshing: boolean;
}

const POLL_MS = 8000;

export function useDashboardData() {
  const [state, setState] = useState<State>({ data: null, error: null, loading: true, refreshing: false });
  const inFlight = useRef(false);

  const fetchData = useCallback(async (isManual = false) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setState((s) => ({ ...s, refreshing: true }));
    try {
      const res = await fetch("/api/sheets-data", { cache: "no-store" });
      const json = await res.json();
      if (json.ok) {
        setState({ data: json.data, error: null, loading: false, refreshing: false });
      } else {
        setState((s) => ({ ...s, error: json.error, loading: false, refreshing: false }));
      }
    } catch (e: any) {
      setState((s) => ({
        ...s,
        error: { code: "UNKNOWN", message: e?.message ?? "Network error while fetching dashboard data." },
        loading: false,
        refreshing: false,
      }));
    } finally {
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(() => fetchData(), POLL_MS);
    return () => clearInterval(id);
  }, [fetchData]);

  return { ...state, refresh: () => fetchData(true) };
}
