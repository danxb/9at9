import Logo from './components/Logo';
import { LastUpdated } from './components/LastUpdated';

import { Articles } from "./components/Articles";

export default function Page() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-light bg-light text-dark mt-1">
        <div className="container">
          <div className="d-flex flex-column">
              <Logo />
          </div>
          <div className="d-flex ms-auto">
              <LastUpdated />
          </div>
        </div>
      </nav>


      {/* Main Content */}
      <main className="main-container container mt-1">
        <div>
            <Articles />
        </div>
      </main>
    </>
  );
}
