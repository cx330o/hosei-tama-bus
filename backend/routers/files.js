const path = require('path');
const config = require('../utils/config');
const router = require('express').Router()

router.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  const directoryPath = path.resolve(config.FILE_PATH);
  const filePath = path.join(directoryPath, filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});

module.exports = router
