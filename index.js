let currentPage = 0;

window.onload = () => {
  checkAuthAndRenderProfile();
  fetchedCollegeData(`https://college-list-server.vercel.app/api/colleges?page=${currentPage}`);
};
// https://college-list-server-pkkwf248o-niranjans-projects-4854911d.vercel.app/

function checkAuthAndRenderProfile() {
  fetch("https://college-list-server.vercel.app/api/user/myProfile", {
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res) => {
      const profileInfo = document.getElementById("profileInfo");

      if (res.statusCode === 200) {
                                document.getElementById("profileHistory").style.display = "block";

        profileInfo.innerHTML = `
          <div class="dropdown show">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              ${res.data.email}
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" id="logoutBtn" href="#">Logout</a>
            </div>
          </div>
        `;

        document.getElementById("logoutBtn").addEventListener("click", () => {
          fetch("https://college-list-server.vercel.app/api/user/logout", {
            method: "POST",
            credentials: "include",
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.statusCode === 200) {
                window.location.href = "/index.html";
              } else {
                alert(`${res.message}, session expired try logging in again!`);
                window.location.href = "/index.html";
              }
            })
            .catch((err) => console.error(err));
        });

      } else {
          document.getElementById("profileHistory").style.display = "none";

        profileInfo.innerHTML = `
        
          <a class="btn btn-outline-primary ms-lg-3 mt-2 mt-lg-0" href="/login.html" id="loginBtn">Login</a>
        `;
      }
    })
    .catch((err) => console.error(err));
}

const nextBtn = () => {
  currentPage++;
  fetchedCollegeData(`https://college-list-server.vercel.app/api/colleges?page=${currentPage}`);
};

const prevBtn = () => {
  if (currentPage > 0) {
    currentPage--;
    fetchedCollegeData(`https://college-list-server.vercel.app/api/colleges?page=${currentPage}`);
  }
};

const firstBtn = () => {
  currentPage = 0;
  fetchedCollegeData(`https://college-list-server.vercel.app/api/colleges?page=${currentPage}`);
};

const fetchedCollegeData = (url) => {
  const container = document.getElementById("cardsInside");
  container.innerHTML = `<div class="text-center my-4">Loading...</div>`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (!data.data || data.data.length === 0) {
        container.innerHTML = `<div class="text-center my-4"><h4>No colleges found.</h4></div>`;
        return;
      }

      container.innerHTML = data.data
        .map((item) => {
          return `
            <div class="col-auto mb-3">
              <a href="/InsideCollege.html?id=${item._id}" class="text-decoration-none" target="_blank">
                <div class="card border-info shadow-sm" style="max-width: 18rem;">
                  <div class="card-header text-truncate">📌 ${item.state}, ${item.city}</div>
                  <div class="card-body">
                    <h5 class="card-title text-truncate" style="max-width: 240px;">🏫 ${item.name}</h5>
                    <p class="card-text text-start">Dist- ${item.district}</p>
                  </div>
                </div>
              </a>
            </div>
          `;
        })
        .join("");
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      container.innerHTML = `<div class="text-danger text-center">Failed to load colleges.</div>`;
    });
};
