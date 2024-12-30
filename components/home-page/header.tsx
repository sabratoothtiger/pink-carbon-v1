export default function Header() {
    return (
        <div className="flex gap-8 justify-center items-center">
          <span
            className="brand-name"
            style={{ display: "flex", alignItems: "center" }}
          >
            <h1 className="pink-text" style={{ marginLeft: "4px" }}>
              PINK
            </h1>
            <h1 className="carbon-text">CARBON</h1>
          </span>
        </div>
    )
}