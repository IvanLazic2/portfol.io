export class RatingCreateOrUpdate {
    constructor(projectId, userId, rating) {
        this.ProjectId = projectId;
        this.UserId = userId;
        this.Rating = rating;
    }

    static InstanceFromObject(projectId, userId, rating) {
        return new RatingCreate(projectId, userId, rating);
    }
}