const DB_NAME = 'gemini-character-chat-db';
const STORE_NAME = 'keyval';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        dbPromise = null; // Allow retrying
        reject(request.error);
      };

      request.onsuccess = () => {
        const db = request.result;
        
        // When the connection is unexpectedly closed (e.g., by the browser),
        // clear the promise so a new connection will be opened on the next call to getDb().
        db.onclose = () => {
          console.warn('IndexedDB connection closed.');
          dbPromise = null;
        };

        resolve(db);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  }
  return dbPromise;
}

export async function get<T>(key: IDBValidKey): Promise<T | undefined> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onsuccess = () => {
      resolve(request.result as T);
    };

    request.onerror = () => {
      console.error(`Error getting key "${key}" from IndexedDB:`, request.error);
      reject(request.error);
    };
  });
}

export async function set(key: IDBValidKey, value: any): Promise<void> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(value, key);

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      console.error(`Error setting key "${key}" in IndexedDB:`, transaction.error);
      reject(transaction.error);
    };
  });
}