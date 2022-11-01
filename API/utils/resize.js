const sharp = require('sharp');
const path = require('path');

class Resize {
  constructor(folder) {
    this.folder = folder;
  }
  async save(buffer, filename) {
    const filepath = this.filepath(filename);

    await sharp(buffer)
      .toFile(filepath);
    
    return filename;
  }
  
  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`)
  }
}
module.exports = Resize;