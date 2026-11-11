// CSS length; numbers are treated as px.
export type ThinkingOutlineSize = number | string;

export type ThinkingOutlineGradient = {
  // Arc color. Defaults to the theme's active color.
  color?: string;
  // Orbit speed multiplier: 1 is one lap per 3.5s, 2 is twice as fast.
  speed?: number;
  // Orbit counter-clockwise.
  reverse?: boolean;
  // Starting point along the orbit, as a fraction of a lap (0..1).
  phase?: number;
  // Per-gradient override of the outline's `thickness`.
  thickness?: ThinkingOutlineSize;
  // Per-gradient override of the outline's `spread`.
  spread?: ThinkingOutlineSize;
};

export type ThinkingOutlineProps = {
  // When omitted, hover on the outline drives the glow.
  active?: boolean;
  // Arc layers orbiting together inside one outline. Defaults to a single
  // active-color gradient at speed 1.
  gradients?: ThinkingOutlineGradient[];
  // Width of the sharp glow line. Default 1.5px.
  thickness?: ThinkingOutlineSize;
  // How far the soft bloom reaches beyond the line (blur radius). Default 20px.
  spread?: ThinkingOutlineSize;
  className?: string;
};
