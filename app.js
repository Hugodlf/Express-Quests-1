require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);


const movieHandlers = require("./movieHandlers");
const { validateMovie, validateUser } = require("./validates")

const useHandlers = require("./useHandlers");
const { hashPassword, verifyPassword, verifyToken } = require("./auth");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.get("/api/users", useHandlers.getUsers);
app.get("/api/users/:id", useHandlers.getUserById);
app.post("/api/users",hashPassword, validateUser, useHandlers.postUser);

app.post(
  "/api/login",
  useHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);


app.use(verifyToken);

app.post("/api/movies",verifyToken, validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id",validateMovie, movieHandlers.updateMovie)
app.delete("/api/movies/:id",movieHandlers.deleteMovie)

app.put("/api/users/:id",hashPassword, validateUser, useHandlers.updateUser);
app.delete("/api/users/:id", useHandlers.deleteUser)





app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
