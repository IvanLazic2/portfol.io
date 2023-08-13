// TODO: dodat messageType = ["success", "warning", "error"]

import { MessageType } from '../enums/messageType.js';
import * as projectService from '../services/project.service.js';

import { ProjectPOST, ProjectGET } from '../models/project/Project.models.js';

export async function get(req, res, next) {
    try {

        if (!req.params.id) {
            console.error("Error in project controller: get: projectId undefined.");
            return res.staus(500).end();
        }

        const result = await projectService.get(req.params.id);

        const project = ProjectGET.InstanceFromObject(result);

        return res.status(200).json(project);

    } catch (error) {
        console.error("Error in project controller: get: ", error);
        return res.status(500).end();
    }
}

export async function getAll(req, res, next) {
    try {

        const result = await projectService.getAll(req.userId);

        const projects = ProjectGET.InstanceFromObjectArray(result);

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

        const result = await projectService.create(res, req.userId, project);

        res.status(200).json({ messageType: MessageType.Success, message: "Project created.", projectId: result.insertedId.toString() })

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

        await projectService.update(res, req.params.id, project)

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

        const result = await projectService.remove(req.params.id);

        res.status(200).json({ messageType: MessageType.Success, message: "Project removed" });

    } catch (error) {
        console.error("Error in project controller: remove", error);
        return res.status(500).end();
    }
}