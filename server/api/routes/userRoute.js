import { Router } from "express";
import UserController from "../controllers/userController.js";

const router = Router();
const userController = new UserController();

router.post('/register',  (req, res) => {
    if (!req) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    return userController.createUser(req)
        .then((response) => {
            return res.status(200).json(response);
        })
        .catch((err) => {
            return res.status(404).json(err);
        });
});

router.post('/login',  (req, res) => {
    if (!req) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    return userController.authenticateUser(req)
        .then((response) => {
            return res.status(200).send(response);
        })
        .catch((err) => {
            return res.status(404).json(err);
        });
});

router.put('/:isPublic',  (req, res) => {
    if (!req) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    return userController.updatePrivacy(req)
        .then((response) => {
            return res.status(200).send(response);
        })
        .catch((err) => {
            console.log(err);
            return res.status(404).json(err);
        });
});

router.get('/:userId/photos',  (req, res) => {
    if (!req) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    return userController.getPhotosByUser(req)
        .then((response) => {
            return res.status(200).send(response);
        })
        .catch((err) => {
            console.log(err);
            return res.status(404).json(err);
        });
});

router.get('/', (req, res) => {
    res.send('Hello, world!');
});

export default router;
