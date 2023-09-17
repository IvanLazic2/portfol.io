//// POST Models

export interface ProjectPOST {
    Name: string,
    Concept: string,
    Material?: string,
    Width?: string,
    Height?: string,
    Depth?: string
}

export interface UploadEdit {
    UploadId: string,
    File: File
}

export interface RatingPOST {
    ProjectId: string,
    UserId: string,
    Rating: number
}

//// DELETE Models

export interface RatingDELETE {
    ProjectId: string,
    UserId: string
}

//// App Models

export interface Project {
    _id: string,
    Name: string,
    Images: Image[],
    Concept: string,
    TehnicalInfo: TehnicalInfo
}

export interface Image {
    _id: string,
    ImageId: string,
    Description: string,
}

export interface TehnicalInfo {
    _id: string,
    Dimensions: number[], // Width, Height, Depth
    Material: string
}

/*export interface File {
    _id: string,
    Name: string,
    Size: number,
    UploadDate: Date;
    //Categories: Category[],
    //_defaultSortIndex: number
}*/

export enum Category {
    Files = "files",
    Shared = "shared",
    Pinned = "pinned",
    Trash = "trash"
}

export enum Page {
    Files = "files",
    Shared = "shared",
    Pinned = "pinned",
    Trash = "trash"
}

export enum SortOrder {
    Default,
    NameAToZ,
    NameZToA
}

export enum AuthType {
    Register = "Register",
    Login = "Log in"
}

export enum ToastType {
    Success = "Success",
    Warning = "Warning",
    Error = "Error",
    Info = "Info"
}

//// Models

export interface User {
    Username: string
}