export function createSourceFile(project, fileName, content) {
    return project.createSourceFile(fileName, content, {
        overwrite: true
    });
}
