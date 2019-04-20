const CONFIG_PATH = '../config/data_response_config.json';
const fs = require('fs');
const path = require('path');
const jsMapping = require('json-mapping');
const dateFormat = require('dateformat');

const DEVICE_TYPES = {
    MOBILE: "mobile",
    BROWSER: "web_brower"
};
const DEFAULT_DATETIME_FORMAT = 'yyyy-mm-dd hh:MM:ss';

const UNIT_CONVERTS = {
    'number': {
        'date-time': function(data, format) {
            format = format ? format : DEFAULT_DATETIME_FORMAT;
            return dateFormat(data, format);
        }
    },
    'string': {
        'date-time': function(data, format) {
            format = format ? format : DEFAULT_DATETIME_FORMAT;
            return dateFormat(data, format);
        }
    }
    //We can define more UNIT_CONVERT function
};
class DataConverter {
    constructor() {
        this._filePath = path.join(__dirname, CONFIG_PATH);
        this.readConfigFile = this.readConfigFile.bind(this);
        this.convertData = this.convertData.bind(this);
        this.configs = this.readConfigFile();
    }

    readConfigFile() {
        if (fs.existsSync(this._filePath)) {
            var result = fs.readFileSync(this._filePath);
            return JSON.parse(result);
        } else {
            fs.writeFileSync(this._filePath, JSON.stringify({}), 'utf8');
        }
        return {};
    }
    convertData(sourceObjArray, field, device) {
        if (!device || device === DEVICE_TYPES.MOBILE || sourceObjArray.length === 0 || !this.configs[device] ||
            (typeof this.configs[device] === 'object' && !this.configs[device][field])) {
            return sourceObjArray;
        }
        let sourceObj = sourceObjArray[0];
        let deviceFields = this.configs[device][field];
        var mappingKey = [];
        Object.keys(deviceFields).forEach((key) => {
            var item = {
                oldKey: key,
                newKey: deviceFields[key]['value']
            };
            mappingKey.push(item);
        });
        let result = sourceObjArray.map((x) => {
            Object.keys(x).forEach(key => {
                if (typeof x[key] !== deviceFields[key]['type']) {
                    let fn = UNIT_CONVERTS[typeof x[key]][deviceFields[key]['type']];
                    if (fn) {
                        let newValue = fn(x[key], deviceFields[key]['format']);
                        x[key] = newValue;
                    }
                }
            });
            let rs = jsMapping.map(x, mappingKey); 
            return rs;
        });
        return result;
    }
}
module.exports = new DataConverter();