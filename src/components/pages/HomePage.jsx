import RouletteWheel from "../core/RouletteWheel";

export default function HomePage() {
  const handleSelect = (num) => {
    console.log("Selected:", num);
  };

  return (
    <div className="">
      <RouletteWheel onSelect={handleSelect} />
    </div>
  );
}
