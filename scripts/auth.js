const AdminAuthKey = "adminUnlocked";

const checkAuthentication = () => {
    const adminAuthenticated = localStorage.getItem(AdminAuthKey);
    if (!adminAuthenticated) window.location.href = "index.html";
}