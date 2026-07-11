import Banner from "../models/Banner.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const getActiveBanners = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.position) filter.position = req.query.position;
    const banners = await Banner.find(filter).sort({ order: 1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ position: 1, order: 1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBanner = async (req, res) => {
  try {
    const { title, subtitle, ctaText, ctaLink, position, order, isActive, startDate, endDate } = req.body;

    let image = { url: "", publicId: "" };
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "lumiere/banners" });
      image = { url: result.secure_url, publicId: result.public_id };
      fs.unlinkSync(req.file.path);
    }

    const banner = await Banner.create({
      title,
      subtitle,
      ctaText,
      ctaLink,
      position,
      order,
      isActive,
      startDate: startDate || null,
      endDate: endDate || null,
      image,
    });
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    const { title, subtitle, ctaText, ctaLink, position, order, isActive, startDate, endDate } = req.body;
    if (title !== undefined) banner.title = title;
    if (subtitle !== undefined) banner.subtitle = subtitle;
    if (ctaText !== undefined) banner.ctaText = ctaText;
    if (ctaLink !== undefined) banner.ctaLink = ctaLink;
    if (position !== undefined) banner.position = position;
    if (order !== undefined) banner.order = order;
    if (isActive !== undefined) banner.isActive = isActive;
    if (startDate !== undefined) banner.startDate = startDate || null;
    if (endDate !== undefined) banner.endDate = endDate || null;

    if (req.file) {
      if (banner.image?.publicId) {
        await cloudinary.uploader.destroy(banner.image.publicId).catch(() => {});
      }
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "lumiere/banners" });
      banner.image = { url: result.secure_url, publicId: result.public_id };
      fs.unlinkSync(req.file.path);
    }

    await banner.save();
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    if (banner.image?.publicId) {
      await cloudinary.uploader.destroy(banner.image.publicId).catch(() => {});
    }
    await banner.deleteOne();
    res.status(200).json({ message: "Banner deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};