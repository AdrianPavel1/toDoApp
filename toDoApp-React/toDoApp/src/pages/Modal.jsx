import { useState } from "react";
import { useCookies } from "react-cookie";
function Modal({ mode, setShowModal, getData, task }) {
  const editMode = mode === "edit" ? true : false;

  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [data, setData] = useState({
    user_email: editMode ? task.user_email : cookies.Email,
    title: editMode ? task.title : "",
    progress: editMode ? task.progress : "",
    date: editMode ? task.date : new Date(),
  });

  const postData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8081/todo`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        setShowModal(false);
        getData();
        console.log("asfwsgd");
      } else {
        console.log(err);
      }
    } catch (err) {
      console.log("error:", err);
    }
  };

  const editData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8081/todo/${task.id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        console.log(response);
        setShowModal(false);
        getData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target; //destructuring

    setData((data) => ({
      ...data,
      [name]: value,
    }));
    console.log(data);
  };
  return (
    <>
      <div className="overlay">
        <div className="modal">
          <div className="form-title-container">
            <h3>Let's {mode} your task</h3>
            <button onClick={() => setShowModal(false)}>X</button>
          </div>

          <form action="">
            <input
              required
              maxLength={35}
              placeholder="Your task goes here"
              name="title"
              value={data.title}
              type="text"
              onChange={handleChange}
            />
            <br />
            <label htmlFor="range">Drag to select your current progress</label>
            <input
              id="range"
              required
              min="0"
              max="100"
              type="range"
              name="progress"
              value={data.progress}
              onChange={handleChange}
            />
            <input
              type="submit"
              className={mode}
              onClick={editMode ? editData : postData}
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default Modal;
