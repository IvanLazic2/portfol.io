import * as HomeService from '../services/home.service.js';
import * as UploadService from '../services/upload.service.js';
import * as UserService from '../services/user.service.js';

import { ProjectGET } from '../models/project/Project.models.js';

export async function getAll(req, res) {
    try {
        
        const getProjectsResult = await HomeService.getAll();

        const projects = ProjectGET.InstanceFromObjectArray(getProjectsResult);

        for (const project of projects) {
            project.Username = (await UserService.getById(project.UserId)).Username;
            //project.LikedByCurrentUser = 
            project.UploadIds = (await UploadService.getAll(project.Id.toString())).map(upload => { return upload._id.toString(); });
        }

        return res.status(200).json(projects);

    } catch (error) {
        console.error(error);
        return res.status(500).end();
    }
}