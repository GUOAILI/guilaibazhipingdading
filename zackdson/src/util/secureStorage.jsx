import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_STORAGE_KEY;

export const secureStorage = {
  setItem(key, data) {
    const minhuizpd = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    localStorage.setItem(key, minhuizpd);
  },
  
  getItem(key) {
    const minhuizpd = localStorage.getItem(key);
    if (!minhuizpd) return null;
    
    try {
      const bytes = CryptoJS.AES.decrypt(minhuizpd, SECRET_KEY);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      console.error('Failed to decrypt data:', e);
      return null;
    }
  },
  
  removeItem(key) {
    localStorage.removeItem(key);
  },
  
  clear() {
    localStorage.clear();
  }
};