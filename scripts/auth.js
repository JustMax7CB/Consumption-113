const AdminAuthKey = "adminUnlocked";

const checkAuthentication = () => {
    const adminAuthenticated = localStorage.getItem(AdminAuthKey);
    if (!adminAuthenticated) {
        window.location.href =
            typeof window.__FLAVOR_HOME__ === "string" && window.__FLAVOR_HOME__.length
                ? window.__FLAVOR_HOME__
                : "/index.html";
    }
}