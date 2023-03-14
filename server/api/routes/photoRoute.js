import {Router} from "express";
import PhotoController from "../controllers/photoController.js";

const router = Router();
const photoController = new PhotoController();

router.delete('/:photoId', (req, res) => {
    if (!req) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    return photoController.deletePhoto(req)
        .then((response) => {
            return res.status(200).send(response);
        })
        .catch((err) => {
            return res.status(404).json(err);
        });
});

router.get('/', (req, res) => {
    res.send('Hello, world!');
});

export default router;
