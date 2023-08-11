import { ObjectId } from "mongodb";
import { db } from '../configs/db.config.js';
import { ProjectPOST } from '../models/project/ProjectPOST.model.js';
import * as projectService from '../services/project.service.js';

export async function get(req, res, next) {
    try {

        if (!req.params.id) {
            console.error("Error in project controller: get: projectId undefined.");
            res.staus(500);
        }
            
        await projectService.get(res, req.params.id);
        
    } catch (error) {
        console.error("Error in project controller: get: ", error);
        res.status(500);
    }
}

export async function create(req, res, next) {
    try {

        const project = ProjectPOST.InstanceFromObject(req.body);

        const errorMessage = project.Validate();
        if (errorMessage)
            res.status(400).json({ message: errorMessage });

        await projectService.create(res, project); // TODO: svakom useru dodat projekt u njegov collection

    } catch (error) {
        console.error("Error in project controller: create: ", error);
        res.status(500);
    }
}

export async function update(req, res, next) {
    try {

        const project = ProjectPOST.InstanceFromObject(req.body);

        const errorMessage = project.Validate();
        if (errorMessage)
            res.status(400).json({ message: errorMessage });
        
        await projectService.update(res, req.params.id, project)

    } catch (error) {
        console.error("Error in project controller: update: ", error);
        res.status(500);
    }
}

export async function remove(req, res, next) {
    try {
        
        if (!req.params.id) {
            console.error("Error in project controller: remove: projectId undefined.");
            res.staus(500);
        }
            
        await projectService.remove(res, req.params.id);

    } catch (error) {
        console.error("Error in project controller: remove", error);
        res.status(500);
    }
}