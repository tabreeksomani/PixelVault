import {Router} from "express";
import PhotoController from "../controllers/photoController.js";
import multer from "multer";

const router = Router();
const photoController = new PhotoController();
import mime from 'mime-types';

const upload = multer({
    dest: 'uploads/',
    filename: function (req, file, cb) {
        const extension = mime.extension(file.mimetype);
        cb(null, req.file.originalname + extension);
    }
})


router.delete('/:photoId', (req, res) => {
    if (!req) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    return photoController.deletePhoto(req)
        .then((response) => {
            return res.status(200).json(response);
        })
        .catch((err) => {
            return res.status(404).json(err);
        });
});

router.post('/', upload.single('image'), (req, res) => {
    if (!req) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    return photoController.addPhoto(req)
        .then((response) => {
            return res.status(200).json(response);
        })
        .catch((err) => {
            return res.status(404).json(err);
        });
});

router.get('/', (req, res) => {
    if (!req) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    return photoController.getPublicPhotos(req)
        .then((response) => {
            return res.status(200).json(response);
        })
        .catch((err) => {
            return res.status(404).json(err);
        });
});

export default router;
