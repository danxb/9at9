import Logo from './components/Logo';
import { LastUpdated } from './components/LastUpdated';

import { Articles } from "./components/Articles";

export default function Page() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-light bg-light text-dark mt-1 mb-3">
        <div className="container d-flex flex-column flex-md-row align-items-start">
          <div>
            <Logo />
          </div>
          <div className="ms-md-auto mt-2 mt-md-0">
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
