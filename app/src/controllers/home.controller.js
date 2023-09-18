import * as HomeService from '../services/home.service.js';
import * as UploadService from '../services/upload.service.js';
import * as UserService from '../services/user.service.js';

import { ProjectGET } from '../models/project/Project.models.js';

export async function getAll(req, res) {
    try {

        const getProjectsResult = await HomeService.getAll();

        const projects = ProjectGET.InstanceFromObjectArray(getProjectsResult);

        for (let i = 0; i < projects.length; i++) {
            const getUserResult = await UserService.getById(projects[i].UserId);

            if (!getUserResult) {
                projects.splice(i, 1);
                i--;
            }
            else {
                projects[i].Username = getUserResult.Username;
                projects[i].UserProfilePictureId = getUserResult.ProfilePictureId;
                projects[i].UploadIds = (await UploadService.getAll(projects[i].Id.toString())).map(upload => {
                    if (upload)
                        return upload._id.toString();
                });
            }
        }

        return res.status(200).json(projects);

    } catch (error) {
        console.error(error);
        return res.status(500).end();
    }
}