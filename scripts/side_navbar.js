window.addEventListener("DOMContentLoaded", () => {
  const isAdmin = localStorage.getItem("adminUnlocked") === "true";
  const logoutBtn = document.querySelector("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.style.display = isAdmin ? "block" : "none";
  }
});

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

const  checkCredentials = async () => {
  const adminUnlocked = localStorage.getItem(AdminAuthKey);

  if (adminUnlocked === "true") {
    window.location.href = "admin.html";
    return;
  }

  const STORED_HASH = "1520337df654eec274e41789d187ea2b15939bfcdb312ed90364f76258c91037";

  const input = prompt("הזן סיסמה:");
    if (!input) return alert("סיסמה לא הוזנה");
    const inputHash = await hashPassword(input);

    if (inputHash === STORED_HASH) {
      alert("כניסה מאושרת!");
      localStorage.setItem(AdminAuthKey, "true");
      window.location.href = "admin.html";
    } else {
      alert("סיסמה שגויה");
    }
}

const adminLogout = () => {
  localStorage.setItem(AdminAuthKey, "false");
  alert("התנתקת בהצלחה!")
  location.reload();
  window.location.href = "index.html";
}

const hashPassword = async (password) => {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
