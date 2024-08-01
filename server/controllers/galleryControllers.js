const Gallery = require("../schema/gallery");

const InternalServerError = require("../errors/interServerError");

exports.checkIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    if (!identifier)
      return res
        .status(400)
        .json({ ok: false, message: "Identifier is required" });
    const gallery = await Gallery.findOne({ identifier });
    if (gallery)
      return res
        .status(400)
        .json({ ok: false, message: "Identifier already exists" });

    res.status(200).json({ ok: true, message: "Identifier is available" });
  } catch (error) {
    next(new InternalServerError());
  }
};

exports.createGallery = async (req, res, next) => {
  try {
    const { identifier, width, height, images } = req.body;
    const gallery = new Gallery({ identifier, width, height, images });
    await gallery.save();
    res.status(201).json({ ok: true, message: "Gallery created" });
  } catch (error) {
    next(new InternalServerError());
  }
};

exports.getGallery = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const gallery = await Gallery.findOne({ identifier });
    if (!gallery)
      return res.status(404).json({ ok: false, message: "Gallery not found" });

    res.status(200).json({ ok: true, gallery });
  } catch (error) {
    next(new InternalServerError());
  }
};
