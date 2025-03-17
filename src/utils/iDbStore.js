const DB_NAME = "DownloadsDB";
const STORE_NAME = "pdf";
const DB_VERSION = 1;

// Open IndexedDB
const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("❌ Failed to open IndexedDB");
    });
};

// **📌 Create or Update Data**
export const setData = async (id, data) => {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        await store.put( {id, ...data} );

        return `✅ Data stored for ID: ${id}`;
    } catch (error) {
        console.error("❌ setData Error:", error);
    }
};

// **📌 Retrieve Data by ID**
export const getData = async (id) => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readonly");
            const store = tx.objectStore(STORE_NAME);
            console.log(id);
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result?.pdfBlob || null);
            request.onerror = () => reject("❌ Failed to retrieve data");
        });
    } catch (error) {
        console.error("❌ getData Error:", error);
    }
};

// **📌 Retrieve All Data**
export const getAllData = async () => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readonly");
            const store = tx.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject("❌ Failed to retrieve all data");
        });
    } catch (error) {
        console.error("❌ getAllData Error:", error);
    }
};

// **📌 Delete Data by ID**
export const deleteData = async (id) => {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        await store.delete(id);

        return `✅ Data with ID ${id} deleted`;
    } catch (error) {
        console.error("❌ deleteData Error:", error);
    }
};

// **📌 Clear All Data**
export const clearAllData = async () => {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        await store.clear();

        return "✅ All data cleared from IndexedDB";
    } catch (error) {
        console.error("❌ clearAllData Error:", error);
    }
};

// **📌 Check if ID Exists**
export const idExists = async (id) => {
    try {
        const data = await getData(id);
        return data !== null;
    } catch (error) {
        console.error("❌ idExists Error:", error);
    }
};

// **📌 Count Total Records**
export const getCount = async () => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readonly");
            const store = tx.objectStore(STORE_NAME);
            const request = store.count();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("❌ Failed to count records");
        });
    } catch (error) {
        console.error("❌ getCount Error:", error);
    }
};
