const Setting = require('../models/Setting');

// @desc    Get settings
// @route   GET /api/settings
// @access  Private
const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = await Setting.create({});
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private
const updateSettings = async (req, res, next) => {
  try {
    const { gstPercentage, storeName, storeAddress, storePhone, printerName, printerPaperSize } = req.body;

    let settings = await Setting.findOne();

    if (!settings) {
       settings = new Setting({});
    }

    settings.gstPercentage = gstPercentage !== undefined ? gstPercentage : settings.gstPercentage;
    settings.storeName = storeName || settings.storeName;
    settings.storeAddress = storeAddress || settings.storeAddress;
    settings.storePhone = storePhone || settings.storePhone;
    settings.printerName = printerName || settings.printerName;
    settings.printerPaperSize = printerPaperSize || settings.printerPaperSize;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);

  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings };
