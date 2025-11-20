import Tagline from './components/Tagline';

import { Articles } from "./components/Articles";

export default function Page() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-light bg-light text-dark">
        <div className="container">
          <div className="d-flex flex-column">
            <a className="navbar-brand mb-0" href="#">9at9.news</a>
            <small className="text-secondary" style={{ marginTop: "-4px" }}>
              <Tagline />
            </small>
          </div>
          <div className="d-flex ms-auto">
            <a className="nav-link me-3" href="#">About</a>
            <a className="nav-link" href="#">Breaking</a>
          </div>
        </div>
      </nav>


      {/* Main Content */}
      <main className="main-container container mt-4">
        <div>
            <Articles />
        </div>
      </main>
    </>
  );
}
