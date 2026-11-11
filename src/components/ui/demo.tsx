import { HeroGeometric } from "@/components/ui/shape-landing-hero";

const settings = {
  rotate: 12,
  width: 600,
  height: 140,
  y: 15,
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div className="h-screen w-screen">
      <HeroGeometric {...s} />
    </div>
  );
}
