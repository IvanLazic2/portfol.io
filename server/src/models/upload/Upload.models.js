export class UploadGET {
    constructor(name, size, uploadDate, buffer) {
        this.Name = name;
        this.Size = size;
        this.UploadDate = uploadDate;
        this.Buffer = buffer;
    }
}

export class UploadDL {
    constructor(projectId, name, size, uploadDate, mimeType) {
        this.ProjectId = projectId
        this.Name = name;
        this.Size = size;
        this.UploadDate = uploadDate;
        this.MimeType = mimeType
    }
}