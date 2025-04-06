// Appel à l'API Spring Boot
fetch("http://localhost:8080/api/services")
  .then(response => response.json())
  .then(services => {
    const ul = document.getElementById("service-list");
    services.forEach(service => {
      const li = document.createElement("li");
      li.textContent = service;
      ul.appendChild(li);
    });
  })
  .catch(error => console.error("Erreur :", error));
