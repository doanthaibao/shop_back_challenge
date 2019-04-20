const fs = require('fs');
const path = require('path');

class Core {

    constructor(fileName) {
        this._filePath = path.join(__dirname, fileName);
    }

    /**
     * return JSON content of file
     * throw exception
     */
    read() { 
        if (fs.existsSync(this._filePath)) {
            var result = fs.readFileSync(this._filePath);
            return JSON.parse(result);
        } else {
            fs.writeFileSync(this._filePath, JSON.stringify([]), 'utf8');
        }
        return [];
    }
    /**
     * write content to file
     * throw exception
     */
    update(oData) { 
        fs.writeFileSync(this._filePath, JSON.stringify(oData));
    }

}
module.exports = Core;