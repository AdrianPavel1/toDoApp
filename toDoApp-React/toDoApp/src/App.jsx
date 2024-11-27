import { useState, useEffect } from "react";
import ListHeader from "./pages/ListHeader.jsx";
import ListItem from "./pages/ListItem.jsx";
import Auth from "./pages/Auth.jsx";
import { useCookies } from "react-cookie";
function App() {
  const [cookies, setCookie, removeCookie] = useCookies(null);

  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;
  const [tasks, setTasks] = useState(null);

  // const authToken = false;

  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:8081/todo/${userEmail}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
      // console.log("data:", data);
    } catch (err) {
      console.log("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    if (authToken) {
      getData();
    }
  }, []);
  console.log(tasks);

  //sort by date
  const sortedTasks = tasks?.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken && (
        <>
          <ListHeader listName={"Online To Do List"} getData={getData} />
          <p className="user-email">Wlocome back, {userEmail}</p>
          {sortedTasks?.map((task) => (
            <ListItem key={task.id} task={task} getData={getData} />
          ))}
        </>
      )}
    </div>
  );
}

export default App;
