
// define the project class
export interface Project {

    id?: string;
    name: string;
    desc?: string;
    coverImg?: string;
    taskLists?: string[]; // task list in project
    members?: string[]; // project member id
}

