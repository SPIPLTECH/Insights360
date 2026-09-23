import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full">
      {/* Full-width Banner — static, single image, no margin/padding/rounded corners */}
      <div className="relative w-full h-[120px] sm:h-[250px] md:h-[190px] lg:h-[190px] overflow-hidden">
        <Image
          src="/banner1.png"
          alt="Banner"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
    </header>
  );
}