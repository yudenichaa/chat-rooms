import { useState, useCallback } from "react";

export function useClientRect(): [DOMRect, (node: HTMLElement) => void] {
    const [rect, setRect] = useState(null);
    const ref = useCallback((node: HTMLElement): void => {
        if (node) {
            setRect(node.getBoundingClientRect());
        }
    }, []);

    return [rect, ref];
}
