import { Worker } from 'worker_threads';
import { MapOptions, MapResults } from './types/map';
import { existsSync } from 'fs';

export class Crawler {

    constructor() {}

    async mapFolders(folder_path: string, options: MapOptions): Promise <MapResults> {  
        return new Promise ((resolve, reject)=>{
            
            let result: MapResults = { id: options.id, error: true } 
            const path = options.savePath ? options.savePath : __dirname + '../export/fs/';
            const wID = options.id ? options.filenameAppender + options.id : 'mp'+ Date.now();
            
            if(!existsSync(folder_path)) resolve(result);
            
            const worker = new Worker(__dirname + '/workers/mapping-worker.js', {
                workerData: {
                    id: wID,
                    exportPath: path,
                    srcPath: folder_path,
                    options: {}
                  }
            })
    
            worker.on('message', (message) => {
                result.nresults = message.linesimported;
                result.time = message.time;
            });
    
            worker.on('error', (error) => reject(error));
    
            worker.on('exit', (code) => {
                if (code !== 0) {
                    result.error = false;
                    reject(result);
                }
                result.error = false;
                resolve(result);
            });
        });
    }
}
 