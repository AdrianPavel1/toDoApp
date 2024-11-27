const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
app.get("/", (re, res) => {
  return res.json("From Backend side");
});

app.listen(8081, () => {
  console.log("listening");
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todo",
});

app.get("/todo/:userEmail", (req, res) => {
  const { userEmail } = req.params;
  const sql = "select * from todo where user_email =?";

  try {
    db.query(sql, [userEmail], (err, data) => {
      if (err) return res.status(500).json({ succes: false });

      return res.json(data);
    });
  } catch (err) {
    console.log(err);
  }
});

//create a new todo

app.post("/todo", (req, res) => {
  const { user_email, title, progress, date } = req.body;
  console.log(
    "EMAIL:",
    user_email,
    "TITLE:",
    title,
    "PROGRESS:",
    progress,
    "DATE:",
    date
  );
  const token = jwt.sign({ user_email }, "secret", { expiresIn: "1hr" });
  try {
    const sql = `insert into todo(user_email,title,progress,date) values(?, ?, ?, ?) `;
    db.query(sql, [user_email, title, progress, date], (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows > 0) {
        return res.status(200).json({ user_email, token });
      } else return res.status(404).json({ message: "not found" });
    });
  } catch (err) {
    console.log(err);
    if (err) {
      res.json({ detail: err.detail });
    }
  }
});

//edit a new todo
app.put("/todo/:id", async (req, res) => {
  const { id } = req.params;
  const { user_email, title, progress, date } = req.body;

  const sql =
    "update todo set user_email = ?, title = ?, progress = ?, date = ? where id = ?";
  db.query(sql, [user_email, title, progress, date, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ succes: false });
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ succes: true });
    } else {
      console.log("error");
    }
  });
});

//delete

app.delete("/todo/:id", (req, res) => {
  const { id } = req.params;
  try {
    const sql = "delete from todo where id=?";
    const sqlResult = db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ err });
      if (result.affectedRows > 0) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ success: false });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ succes: false });
  }
});

//signup
app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const sql = "INSERT INTO users (email, hashed_password) VALUES (?, ?)";
    db.query(sql, [email, hashedPassword], (err, result) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });

      if (result.affectedRows > 0) {
        const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
        return res.status(200).json({ email, token });
      } else {
        return res.status(404).json({ message: "User not created" });
      }
    });
  } catch (err) {
    console.log(err);
    if (err) {
      res.json({ detail: err.detail });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const user = result[0];
      const hashedPassword = user.hashed_password;

      // Asigură-te că utilizezi `await` pentru comparația bcrypt
      const comparedPass = await bcrypt.compare(password, hashedPassword);
      if (!comparedPass) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }

      // Creează un token JWT
      const token = jwt.sign({ email: user.email }, "secret", {
        expiresIn: "1hr",
      });

      return res.status(200).json({ email: user.email, token });
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});
