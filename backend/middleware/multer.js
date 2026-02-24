/**
 * MoroVerse — Multer Upload Middleware
 * Handles audio file and image uploads
 */

const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const uploadDir = process.env.UPLOAD_DIR || './uploads';

// Ensure subdirectories
['audio', 'images'].forEach((sub) => {
    const dir = path.join(uploadDir, sub);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const isAudio = file.mimetype.startsWith('audio/');
        cb(null, path.join(uploadDir, isAudio ? 'audio' : 'images'));
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = [
        'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4',
        'image/jpeg', 'image/png', 'image/webp',
    ];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

module.exports = { upload };
