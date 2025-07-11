function Show() {
  fetch("http://localhost:3000/", {
    method: "GET",
    headers: {
      auth: "1111"
    }
  })
  .then(response => response.json())
  .then(data => {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";
    data.forEach(jugador => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${jugador.nombre} (${jugador.edad}) - ${jugador.nombre_usuario}
        <button onclick="editarJugador(${jugador.id}, '${jugador.nombre}', ${jugador.edad}, '${jugador.nombre_usuario}')">Editar</button>
        <button onclick="eliminarJugador(${jugador.id})">Eliminar</button>
      `;
      lista.appendChild(li);
    });
  })
  .catch(error => console.error("Error al obtener datos:", error));
}

function eliminarJugador(id) {
  fetch(`http://localhost:3000/eliminar/${id}`, {
    method: "DELETE",
    headers: {
      auth: "1111"
    }
  })
  .then(res => res.json())
  .then(data => {
    console.log("Eliminado:", data);
    Show();
  })
  .catch(err => console.error("Error al eliminar:", err));
}

function editarJugador(id, nombre, edad, nombre_usuario) {
  document.getElementById("id").value = id;
  document.getElementById("nombre").value = nombre;
  document.getElementById("edad").value = edad;
  document.getElementById("usuario").value = nombre_usuario;
}

document.getElementById("formJugador").addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Formulario enviado");

  const id = document.getElementById("id").value;
  const nombre = document.getElementById("nombre").value;
  const edad = parseInt(document.getElementById("edad").value);
  const nombre_usuario = document.getElementById("usuario").value;

  const jugador = { nombre, edad, nombre_usuario };

  if (id) {
    // Editar jugador
    fetch(`http://localhost:3000/editar/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        auth: "1111"
      },
      body: JSON.stringify(jugador)
    })
    .then(res => res.json())
    .then(data => {
      console.log("Editado:", data);
      document.getElementById("formJugador").reset();
      Show();
    })
    .catch(err => console.error("Error al editar:", err));
  } else {
    // Insertar nuevo jugador
    fetch("http://localhost:3000/insertar", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        auth: "1111"
      },
      body: JSON.stringify(jugador)
    })
    .then(res => res.json())
    .then(data => {
      console.log("Insertado:", data);
      document.getElementById("formJugador").reset();
      Show();
    })
    .catch(err => console.error("Error al insertar:", err));
  }
});
