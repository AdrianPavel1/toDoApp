import TickIcon from "./TickIcon";
import ProgressBar from "./ProgressBar";
import { useState } from "react";
import Modal from "./Modal";
function ListItem({ task, getData }) {
  const [showModal, setShowModal] = useState(false);

  const deleteData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8081/todo/${task.id}`, {
        method: "delete",
      });
      if (response.status === 200) {
        getData();
        console.log("da");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <li className="list-item">
        <div className="info-container">
          <TickIcon />
          <p className="task-title">{task.title}</p>
          <ProgressBar progress={task.progress} />
        </div>

        <div className="button-container">
          <button className="edit" onClick={() => setShowModal(true)}>
            Edit
          </button>
          <button className="delete" onClick={deleteData}>
            Delete
          </button>
        </div>
        {showModal && (
          <Modal
            mode={"edit"}
            setShowModal={setShowModal}
            getData={getData}
            task={task}
          />
        )}
      </li>
    </>
  );
}

export default ListItem;
