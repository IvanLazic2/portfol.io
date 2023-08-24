import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { profilePictureDirectory } from '../configs/profilePicture.config.js';
import { checkAndCreateDirectory } from '../configs/upload.config.js';
import { MessageType } from '../enums/messageType.js';
import * as UserService from '../services/user.service.js';

async function removeIfExists(path) {
    try {
        await fs.unlink(path)
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error("Error in profilePicture controller: removeIfExists:", error);
        }
    }
}

export async function get(req, res) {
    try {

        const profilePicturePath = profilePictureDirectory + req.params.id + '.jpg';
        await fs.access(profilePicturePath);
        return res.sendFile(path.resolve(profilePicturePath));

    } catch (error) {
        if (error.code === "ENOENT")
            return res.end();
        console.error(error);
    }
}

export async function create(req, res) {
    try {

        const getUserResult = await UserService.get(req.userId);
        if (getUserResult.ProfilePictureId) {
            const removeProfilePictureResult = await UserService.removeProfilePicture(req.userId)
            await removeIfExists(profilePictureDirectory + getUserResult.ProfilePictureId + '.jpg');
        }

        const profilePictureId = uuidv4();
        const changeProfilePictureResult = await UserService.changeProfilePicture(req.userId, profilePictureId);

        await checkAndCreateDirectory(res, profilePictureDirectory);
        await sharp(req.file.buffer, { failOnError: false })
            .rotate()
            .resize({ width: 512 })
            .toFile(profilePictureDirectory + profilePictureId + '.jpg');

        return res.status(200).json({ MessageType: MessageType.Success, Message: "Profile picture updated." });

    } catch (error) {
        console.error(error);
    }
}

export async function remove(req, res) {
    

    try {
        const getUserResult = await UserService.get(req.userId);

        const removeProfilePictureResult = await UserService.removeProfilePicture(req.userId);
        await removeIfExists(profilePictureDirectory + getUserResult.ProfilePictureId + '.jpg');

        return res.status(200).json({ MessageType: MessageType.Success, Message: "Profile picture removed." });

    } catch (error) {
        console.error(error);
    }
}