function toggleSideNav() {
  const sidenav = document.querySelector("#mySidenav");
  const hamburger = document.querySelector(".hamburger");

  const isOpen = sidenav.classList.contains("open");

  if (isOpen) {
    sidenav.classList.remove("open");
    hamburger.classList.remove("hidden");
  } else {
    sidenav.classList.add("open");
    hamburger.classList.add("hidden");
  }
}

function checkCredentials() {
  const ADMIN_CODE = process.env.NEXT_PUBLIC_ADMIN_CODE || "1234";

  console.log(ADMIN_CODE);
  if (window.location.href === "admin.html") return;
  const password = prompt("אנא הזן סיסמה:");

  if (password === "1234") {
    window.location.href = "admin.html"; // Redirect if correct
  } else {
    alert("סיסמה שגויה");
  }
}
