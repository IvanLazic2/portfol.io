// https://levelup.gitconnected.com/complete-guide-to-upload-multiple-files-in-node-js-using-middleware-3ac78a0693f3

export async function saveFiles(req, res, next) {
    try {

        /* temp */ return res.status(200).json({ message: "Files save called: projectId: " + req.body.projectId });

    } catch (err) {
        console.error("Error in upload controller: saveFiles: ", err);
        next(err);
    }
}

export async function deleteFile(req, res, next) {
    try {
        
        /* temp */ return res.status(200).json({ message: "File delete called: id: " + req.params.id });

    } catch (err) {
        console.error("Error in upload controller: deleteFile: ", err);
        next(err);
    }
}

