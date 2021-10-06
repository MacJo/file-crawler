import { Worker, parentPort } from 'worker_threads';
import { MapOptions, MapResults } from './types/map';
import { existsSync } from 'fs';

export const mapFolders = async (folder_path: string, options: MapOptions): Promise<MapResults> => new Promise((resolve, reject) => {
    return new Promise((resolve, reject) => {

        let result: MapResults = { id: options.id, error: true }
        if (!existsSync(folder_path)) reject(result);

        const path = options.savePath ? options.savePath : __dirname + '../export/fs/';
        const wID = options.id ? options.filenameAppender + options.id : 'mp' + Date.now();

        const worker_data = {
            id: wID,
            exportPath: path,
            srcPath: folder_path,
            options: {}
        }

        const worker = new Worker(__dirname + '/workers/mapping-worker.js', { workerData: worker_data })

        worker.on('message', (message) => {
            result.nresults = message.linesimported;
            result.time = message.time;
            result.error = false;
            resolve(result);
        });

        worker.on('error', (error) => reject(error));

        worker.on('exit', (code) => {
            if (code !== 0) {
                if (code !== 0) reject(new Error(`Index worker stopped with exit code ${code}`));
                parentPort.postMessage('Finished mapping');
            }
        });
    });
})
