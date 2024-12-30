export default function Header() {
  return (
    <div className="flex gap-4 md:gap-8 justify-center items-center px-4">
      <span
        className="brand-name flex items-center"
      >
        <h1 className="pink-text text-5xl md:text-8xl font-bold ml-1 md:ml-2">
          PINK
        </h1>
        <h1 className="carbon-text text-5xl md:text-8xl font-bold">
          CARBON
        </h1>
      </span>
    </div>
  );
}
