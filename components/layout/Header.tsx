import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full px-3 pt-3 md:px-6 lg:px-10">
      {/* Banner keeps its own proportions (2172 × 355) so it is NEVER cropped on any screen — it just scales down on phones. */}
      <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-xl md:rounded-2xl shadow-md" style={{ aspectRatio: "2172 / 355" }}>
        <Image
          src="/banner1.png"
          alt="Race to Recognition"
          fill
          className="object-contain"
          priority
          sizes="100vw"
        />
      </div>
    </header>
  );
}