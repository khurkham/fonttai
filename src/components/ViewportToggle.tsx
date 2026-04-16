import { Monitor, Tablet, Smartphone, Maximize2, Minimize2 } from "lucide-react";

export type PreviewMode = "desktop" | "tablet" | "mobile";

type Props = {
  mode: PreviewMode;
  isFullscreen: boolean;
  onChangeMode: (mode: PreviewMode) => void;
  onToggleFullscreen: () => void;
};

export function ViewportToggle({
  mode,
  isFullscreen,
  onChangeMode,
  onToggleFullscreen,
}: Props) {
  const base =
    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition";
  const active = "border-blue-600 bg-blue-600 text-white";
  const inactive = "border-slate-300 bg-white text-slate-700 hover:bg-slate-50";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onChangeMode("desktop")}
        className={`${base} ${mode === "desktop" ? active : inactive}`}
      >
        <Monitor size={16} />
        Desktop
      </button>

      <button
        type="button"
        onClick={() => onChangeMode("tablet")}
        className={`${base} ${mode === "tablet" ? active : inactive}`}
      >
        <Tablet size={16} />
        Tablet
      </button>

      <button
        type="button"
        onClick={() => onChangeMode("mobile")}
        className={`${base} ${mode === "mobile" ? active : inactive}`}
      >
        <Smartphone size={16} />
        Mobile
      </button>

      <button
        type="button"
        onClick={onToggleFullscreen}
        className={`${base} ${inactive}`}
      >
        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      </button>
    </div>
  );
}