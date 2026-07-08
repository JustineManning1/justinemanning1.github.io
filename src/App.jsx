import Header from "./components/Header";
import Summary from "./components/Summary";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Dashboards from "./components/Dashboards";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <main>
        <Summary />
        <Skills />
        <Projects />
        <Dashboards />
        <Experience />
        <Education />
      </main>
      <Footer />
    </>
  );
}

export default App;
