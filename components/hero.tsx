export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <span className="brand-name" style={{ display: "flex", alignItems: "center" }}>
          <span className="pink-text" style={{ marginLeft: "4px" }}>PINK</span>
          <span className="carbon-text">CARBON</span>
        </span>
      </div>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        <span>Custom management solutions</span>{" "}
        <span>
          delivered on <strong>your</strong> terms.
        </span>
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
    </div>
  );
}
