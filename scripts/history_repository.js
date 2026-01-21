const submitData = async (data) => {
    try {
        await fetch("/api/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error(error);
        return false;
    }
}

const getHistory = async () => {
    try {
        const response = await fetch("/api/history");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return false;
    }
}