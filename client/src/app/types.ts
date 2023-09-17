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

//// ENUMS

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
