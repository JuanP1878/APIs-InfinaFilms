const express = require("express"); //Importa la libreria
const body_parser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require('cors');
// Firebase //
const admin = require("firebase-admin");
let serviceAccount = require("./infinafilms-1e4f3-firebase-adminsdk-xsh1b-011b6cd9cc.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
let db = admin.firestore();

const app = express(); //Crea el servidor
app.use(cors());
const port = process.env.PORT || 3000;
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.get("/", (req, resp) => {
  resp.send({ message: "Hola mundo" });
});

/* API QUE REGRESA EL URL DEL TRAILER DE LA PELICULA */
app.get("/qrdata/:name", (req, resp) => {
 const {name} = req.params;
 console.log(name)
  let data;
  db.collection("movies")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        data = doc.data();
        //console.log(doc.data());
        if (data.movie_name == name) {
          resp.send(data.trailer);
        }
      });
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
});

/* API QUE REGRESA DATOS DE LA PELICULA */
app.get("/getMovie/:name", (req, resp) => {
  const {name} = req.params;
  console.log(name)
   let data;
   db.collection("movies")
     .get()
     .then((snapshot) => {
       snapshot.forEach((doc) => {
         data = doc.data();
         //console.log(doc.data());
         if (data.movie_name == name) {
           resp.send(data);
         }
       });
     })
     .catch((err) => {
       console.log("Error getting documents", err);
     });
 });

/*  API QUE REGRESA EL CATALOGO DE PELICULAS */
app.get("/catalogo", (req, resp) => {
  let data = [];
  db.collection("movies")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });
      resp.send(data);
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
});

/*  API QUE REGRESA LAS PELICULAS ORDENADAS POR SCORE */
app.get("/catalogoScore", (req, resp) => {
  let data = [];
  db.collection("movies")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });

      data.sort((a, b) => Number(b.score) - Number(a.score));
      console.log("descending", data);
      resp.send(data);
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
});

/*  API QUE REGRESA LAS PELICULAS ORDENADAS POR NÚMERO DE COMENTARIOS */
app.get("/catalogoComentario", (req, resp) => {
  let data = [];
  db.collection("movies")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });

      data.sort((a, b) => Number(b.comentarios) - Number(a.comentarios));
      console.log("descending", data);
      resp.send(data);
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
});

app.listen(port, () => {
  console.log("Listening in port " + port);
});
