// This exists to force a cache update on client. Simply increase the number.
import flatten from "flat";

import ItemUtility from "./ItemUtility";
import SettingsUtility from "./SettingsUtility";

const SCRIPT_VERSION = 4;

class DataUtility {
    constructor() {
        this._data = null;
        this._meta = null;
        this._map = null;
        this._langSite = null;
        this._langGameData = null;
    }

    getKeyByValue(object, value) {
        for(let prop in object) {
            if(object.hasOwnProperty(prop)) {
                if(object[prop] === value) {
                    return prop;
                }
            }
        }

        return "0";
    }

    getMapIdByValue(type, value) {
        if (!(type in this._map)) {
            return "0";
        }

        return this.getKeyByValue(this._map[type], value);
    }

    getWeaponId(value) {
        return this.getMapIdByValue("Weapons", value);
    }

    getArmourId(value) {
        return this.getMapIdByValue("Armours", value);
    }

    getLanternId(value) {
        return this.getMapIdByValue("Lanterns", value);
    }

    getCellId(value) {
        return this.getMapIdByValue("Cells", value);
    }

    getPartId(weaponType, value) {
        return this.getMapIdByValue(`Parts:${ItemUtility.formatWeaponTypeForParts(weaponType).capitalize()}`, value);
    }

    getJSON(url) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();

            request.open("GET", url, true);

            request.onload = () => {
                if(request.status >= 200 && request.status < 400) {
                    try {
                        const json = JSON.parse(request.responseText);
                        resolve(json);
                    } catch(ex) {
                        reject(ex);
                    }
                }
            };

            request.onerror = () => {
                reject();
            };

            request.send();
        });
    }

    loadData(urlPrefix = "") {
        if(this.isCurrentDataStillValid()) {
            this._data = this.retrieveData("__db_data");
            this._meta = this.retrieveData("__db_meta");
            this._map = this.retrieveData("__db_map");
            this._langGameData = this.retrieveData("__db_lang_data");
            this._langSite = this.retrieveData("__db_lang_site");

            return Promise.resolve(true);
        }

        const lang = SettingsUtility.getLanguage();

        let langGameData = Promise.resolve({});

        if (lang !== "en") {
            langGameData = this.getJSON(urlPrefix + `/i18n/data.${lang}.json`);
        }

        return Promise.all([
            this.getJSON(urlPrefix + "/data.json"),
            this.getJSON(urlPrefix + "/meta.json"),
            this.getJSON(urlPrefix + "/map/names.json"),
            this.getJSON(urlPrefix + `/i18n/site.${lang}.json`),
            langGameData
        ]).then(([data, meta, map, langSite, langGameData]) => {
            langSite = flatten(langSite);

            this.persistData("__db_lastupdate", new Date().getTime());
            this.persistData("__db_data", data);
            this.persistData("__db_meta", meta);
            this.persistData("__db_map", map);
            this.persistData("__db_lang", lang);
            this.persistData("__db_lang_site", langSite);
            this.persistData("__db_lang_gamedata", langGameData);
            this.persistData("__db_scriptversion", SCRIPT_VERSION);

            this._data = data;
            this._meta = meta;
            this._map = map;
            this._langSite = langSite;
            this._langGameData = langGameData;

            return true;
        }).catch(reason => {
            console.error(reason);
            return false;
        });
    }

    isCurrentDataStillValid() {
        // hasn't been updated yet
        const lastUpdate = this.retrieveData("__db_lastupdate");

        if(!lastUpdate || ("isDeveloperModeEnabled" in window && window.isDeveloperModeEnabled())) {
            return false;
        }

        // script version has changed
        const scriptVersion = this.retrieveData("__db_scriptversion") || -1;

        if(scriptVersion != SCRIPT_VERSION) {
            return false;
        }

        // language has changed...
        const lang = SettingsUtility.getLanguage();

        if (lang !== this.retrieveData("__db_lang")) {
            return false;
        }

        // data has been timed out
        const now = new Date().getTime();

        const SECOND = 1000;
        const MINUTE = 60 * SECOND;

        return now < (Number(lastUpdate) + 30 * MINUTE);
    }

    persistData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    retrieveData(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    data() {
        return this._data;
    }

    meta() {
        return this._meta;
    }

    stringMap() {
        return this._map;
    }

    langSite() {
        return this._langSite;
    }

    langGameData() {
        return this._langGameData;
    }
}

export default new DataUtility();
