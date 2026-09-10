function Navbar({ data }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {data.name}
      </div>

      <div className="navbar-links">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#work">Work</a>
        <a href="#technology">Technology</a>
        <a href="#contact">Contact</a>
      </div>

      <button className="navbar-menu">
        MENU
      </button>
    </nav>
  )
}

export default Navbar