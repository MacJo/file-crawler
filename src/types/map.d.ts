export interface MapOptions {
    id: string ,
    filenameAppender?: string,
    savePath?: string,
}

export interface MapResults {
    error?: boolean,
    message?:string,
    id: string,
    nresults?: Number,
    time?: Number
}
