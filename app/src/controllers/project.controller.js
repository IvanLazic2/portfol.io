import fs from 'fs/promises';
import { MessageType } from '../enums/messageType.js';
import * as ProjectService from '../services/project.service.js';
import * as UploadService from '../services/upload.service.js';
import * as LikeService from '../services/like.service.js';
import * as UserService from '../services/user.service.js';
import { uploadDirectory } from '../configs/upload.config.js';

import { ProjectPOST, ProjectGET } from '../models/project/Project.models.js';

export async function get(req, res, next) {
    try {

        if (!req.params.id || req.params.id === "user") {
            console.error("Error in project controller: get: projectId undefined.");
            return res.status(500).end();
        }

        console.log("projectid", req.params.id)

        const getProjectResult = await ProjectService.get(req.params.id);

        const project = ProjectGET.InstanceFromObject(getProjectResult);

        project.UploadIds = (await UploadService.getAll(project.Id.toString()))
            .map(upload => {
                if (upload)
                    return upload._id.toString();
            });

        return res.status(200).json(project);

    } catch (error) {
        console.error("Error in project controller: get: ", error);
        return res.status(500).end();
    }
}

export async function getAllUserProjects(req, res, next) {
    try {

        const getProjectsResult = await ProjectService.getAllUserProjects(req.params.username);

        const projects = ProjectGET.InstanceFromObjectArray(getProjectsResult);

        for (const project of projects) {
            project.UploadIds = (await UploadService.getAll(project.Id.toString())).map(upload => { return upload._id.toString(); });
        }

        return res.status(200).json(projects);

    } catch (error) {
        console.error("Error in project controller: get: ", error);
        return res.status(500).end();
    }
}

export async function create(req, res, next) {
    try {

        const project = ProjectPOST.InstanceFromObject(req.body);

        const errorMessage = project.Validate();
        if (errorMessage) {
            /*res.statusMessage = errorMessage;
            return res.status(400).end();*/

            return res.status(400).json({ messageType: MessageType.Warning, message: errorMessage });
        }

        const createProjectResult = await ProjectService.create(req.userId, project);

        res.status(200).json({ messageType: MessageType.Success, message: "Project created.", projectId: createProjectResult.insertedId.toString() })

    } catch (error) {
        console.error("Error in project controller: create: ", error);
        return res.status(500).end();
    }
}

export async function update(req, res, next) {
    try {

        const getProjectResult = await ProjectService.get(req.params.id);

        if (getProjectResult.UserId != req.userId) {
            return res.status(401).end();
        }



        const project = ProjectPOST.InstanceFromObject(req.body);

        const errorMessage = project.Validate();
        if (errorMessage)
            return res.status(400).json({ messageType: MessageType.Warning, message: errorMessage });

        const updateProjectResult = await ProjectService.update(req.params.id, project)

        res.status(200).json({ messageType: MessageType.Success, message: "Project updated." });

    } catch (error) {
        console.error("Error in project controller: update: ", error);
        return res.status(500).end();
    }
}

export async function remove(req, res, next) {
    try {

        if (!req.params.id) {
            console.error("Error in project controller: remove: projectId undefined.");
            return res.staus(500).end();
        }

        const getProjectResult = await ProjectService.get(req.params.id);

        if (getProjectResult.UserId != req.userId) {
            return res.status(401).end();
        }
    }
    catch (error) {
        console.error("Error in project controller: remove", error);
        return res.status(500).end();
    }

    try {
        await fs.rm(uploadDirectory + req.params.id, { recursive: true });
    }
    catch (error) {
        console.error("Error in project controller: remove", error);
    }

    try {
        await UploadService.removeAll(req.params.id);
        await ProjectService.remove(req.params.id);
        res.status(200).json({ messageType: MessageType.Success, message: "Project removed" });

    } catch (error) {
        console.error("Error in project controller: remove", error);
        return res.status(500).end();
    }
}

export async function like(req, res) {
    let selfLoveAcheavementAquired = false;

    try {
        if (await LikeService.isProjectLiked(req.userId, req.params.id)) {
            return res.status(400).json({ messageType: MessageType.Warning, message: "Already liked." });
        }

        const likeProjectResult = await LikeService.likeProject(req.userId, req.params.id);

        const getProjectResut = await ProjectService.get(req.params.id);

        if (req.userId === getProjectResut.UserId) {
            const getUserResult = await UserService.getById(req.userId);

            if (!getUserResult.SelfLoveAcheavement) {
                const setSelfLoveAcheavement = await UserService.setSelfLoveAcheavement(req.userId);
                selfLoveAcheavementAquired = true;
            }
        }

        const incrementLikeResult = await ProjectService.incrementLike(req.params.id);

        if (selfLoveAcheavementAquired) {
            return res.status(200).json({ messageType: MessageType.Info, message: "Acheavement \"Self love\" aquired!", acheavement: true });
        }
        else {
            return res.status(200).json({ messageType: MessageType.Success });
        }

    } catch (error) {
        console.error("Error in project controller: like: ", error);
        return res.status(500).end();
    }
}

export async function unlike(req, res) {
    try {
        if (!await LikeService.isProjectLiked(req.userId, req.params.id)) {
            return res.status(400).json({ messageType: MessageType.Warning, message: "Not liked." });
        }

        const unlikeProjectResult = await LikeService.unlikeProject(req.userId, req.params.id);
        const decrementLikeResult = await ProjectService.decrementLike(req.params.id);

        return res.status(200).json({ messageType: MessageType.Success });

    } catch (error) {
        console.error("Error in project controller: unlike: ", error);
        return res.status(500).end();
    }
}

export async function getIsLiked(req, res) {
    try {
        const isProjectLikedResult = await LikeService.isProjectLiked(req.userId, req.params.id);

        return res.status(200).json(isProjectLikedResult);
    } catch (error) {
        console.error("Error in project controller: isLiked: ", error);
        return res.status(500).end();
    }
}

export async function getLikeCount(req, res) {
    try {
        const getLikesCountResult = await LikeService.getProjectLikeCount(req.params.id);
        return res.status(200).json(getLikesCountResult);
    } catch (error) {
        console.error("Error in project controller: getLikes: ", error);
        return res.status(500).end();
    }
}

export async function highlightUpload(req, res, next) {
    try {
        const getUploadResult = await UploadService.get(req.params.uploadId);

        const getProjectResult = await ProjectService.get(getUploadResult.ProjectId);

        if (getProjectResult.UserId != req.userId) {
            return res.status(401).end();
        }



        if (req.params.uploadId === getProjectResult.HighlightedUploadId) {
            const updateProjectResult = await ProjectService.unhighlightUpload(getUploadResult.ProjectId, req.params.uploadId);
        }
        else {
            const updateProjectResult = await ProjectService.highlightUpload(getUploadResult.ProjectId, req.params.uploadId);
        }



        return res.status(200).json({ messageType: MessageType.Success, message: "Upload highlighted" });

    } catch (error) {
        console.error("Error in upload controller: highlightUpload: ", err);
        return res.status(500).end();
    }
}