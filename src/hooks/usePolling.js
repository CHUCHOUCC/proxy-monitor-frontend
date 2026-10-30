import { useEffect, useRef } from 'react';
import { Poller } from '../core/Poller.js';

/** Calls the latest version of `task` every `intervalMs`. */
export function usePolling(task, intervalMs) {
  const taskRef = useRef(task);
  taskRef.current = task;

  useEffect(() => {
    const poller = new Poller(() => taskRef.current(), intervalMs);
    poller.start();
    return () => poller.stop();
  }, [intervalMs]);
}
