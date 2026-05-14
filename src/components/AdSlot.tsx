import { useEffect, useRef } from "react";

type AdSlotProps = {
  className?: string;
  slotId?: string;
};

const ADSENSE_CLIENT = "ca-pub-7370555010073791";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({
  className = "",
  slotId,
}: AdSlotProps) {
  const insRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    if (typeof window === "undefined") return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch (err) {
      console.warn("AdSense push error:", err);
    }
  }, [slotId]);

  return (
    <div className={className}>
      <ins
        ref={insRef}
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId || ""}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}