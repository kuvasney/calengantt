import ListProjects from "./components/ListProjects/ListProjects";
import NewProject from "./components/NewProject/NewProject";
import Calengantt from "./components/Calengantt/Calengantt";
import "./App.scss";

function App() {
  return (
    <>
      <h1>Calengantt</h1>
      <ListProjects />
      <NewProject />
      <Calengantt />
    </>
  );
}

export default App;
