import * as projectService from '../services/project.service.js';

export async function get(req, res, next) {
    try {
        const { project, code, message } = await projectService.get(req.params.id);
        res.status(code).json({ project: project, message: message });
    } catch (err) {
        console.error("Error in project controller: get: ", err);
        next(err);
    }
}

export async function create(req, res, next) {
    try {
        const { code, message } = await projectService.create(req.body);
        return res.status(code).json({ message: message });
    } catch (err) {
        console.error("Error in project controller: create: ", err);
        next(err);
    }
}

export async function update(req, res, next) {
    try {
        const { code, message } = await projectService.update(req.params.id, req.body);
        return res.status(code).json({ message: message });
    } catch (err) {
        console.error("Error in project controller: update: ", err);
        next(err);
    }
}

export async function remove(req, res, next) {
    try {
        const { code, message } = await projectService.remove(req.params.id);
        return res.status(code).json({ message: message });
    } catch (err) {
        console.error("Error in project controller: remove", err);
        next(err);
    }
}