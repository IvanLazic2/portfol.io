import { MessageType } from '../enums/messageType.js';
import * as RatingService from "../services/rating.service.js";


export async function rateProject(req, res) {
    try {
        const updateProjectResult = await RatingService.createOrUpdateRating(req.body.projectId, req.body.userId, req.body.rating);
        return res.status(200).json({ messageType: MessageType.Success, message: "Project rated" });
    }
    catch (error) {
        console.error("Error in project controller: rateProject: ", error);
        return res.status(500).end();
    }
}

export async function removeProjectRating(req, res) {
    try {
        const rating = await RatingService.removeProjectRating(req.params.id);
        return res.status(200).json({ messageType: MessageType.Success, message: "Project rating removed" });
    }
    catch (error) {
        console.error("Error in project controller: removeProjectRating: ", error);
        return res.status(500).end();
    }
}