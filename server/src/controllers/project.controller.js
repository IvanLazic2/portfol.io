import fs from 'fs/promises';
import { MessageType } from '../enums/messageType.js';
import * as ProjectService from '../services/project.service.js';
import * as UploadService from '../services/upload.service.js';
import { uploadDirectory } from '../configs/upload.config.js';

import { ProjectPOST, ProjectGET } from '../models/project/Project.models.js';

export async function get(req, res, next) {
    try {

        if (!req.params.id) {
            console.error("Error in project controller: get: projectId undefined.");
            return res.status(500).end();
        }

        const getProjectResult = await ProjectService.get(req.params.id);
        const project = ProjectGET.InstanceFromObject(getProjectResult);
        project.UploadIds = (await UploadService.getAll(project.Id.toString()))
            .map(upload => { 
                    return upload._id.toString(); 
                });

        return res.status(200).json(project);

    } catch (error) {
        console.error("Error in project controller: get: ", error);
        return res.status(500).end();
    }
}

export async function getAll(req, res, next) {
    try {

        const getProjectsResult = await ProjectService.getAll(req.userId);
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

        const createProjectResult = await ProjectService.create(res, req.userId, project);

        res.status(200).json({ messageType: MessageType.Success, message: "Project created.", projectId: createProjectResult.insertedId.toString() })

    } catch (error) {
        console.error("Error in project controller: create: ", error);
        return res.status(500).end();
    }
}

export async function update(req, res, next) {
    try {

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

        await fs.rm(uploadDirectory + req.params.id, { recursive: true });

        await UploadService.removeAll(req.params.id);

        await ProjectService.remove(req.params.id);

        res.status(200).json({ messageType: MessageType.Success, message: "Project removed" });

    } catch (error) {
        console.error("Error in project controller: remove", error);
        return res.status(500).end();
    }
}

export async function highlightUpload(req, res, next) {
    try {

        const getUploadResult = await UploadService.get(req.params.uploadId);
        const updateProjectResult = await ProjectService.highlightUpload(getUploadResult.ProjectId, req.params.uploadId);

        return res.status(200).json({ messageType: MessageType.Success, message: "Upload highlighted" });

    } catch (error) {
        console.error("Error in upload controller: highlightUpload: ", err);
        return res.status(500).end();
    }
}