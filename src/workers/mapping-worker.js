const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const dir = require('node-dir');

try {
    dir.paths(workerData.srcPath, function (err, paths) {
        if (err) return err;

        const tStart = Date.now();
        let filesFinal = [];

        paths.files.forEach(function (element) {

            const stats = fs.statSync(element);

            const dirPath = path.parse(element).dir;

            if (fs.existsSync(dirPath + '/.fsignore')) return;

            const file_label = path.parse(element).name
            let file_extension = path.parse(element).ext

            file_extension = file_extension.substr(1);
            file_extension = file_extension.toLowerCase();


            const file_path = workerData.path;
            const file_size = stats.size;
            const file_birth = stats.birthtime;
            const file_mod = stats.mtime;
            const file_gid = stats.gid;
            const file_uid = stats.uid;
            const file_nlink = stats.nlink;
            const file_dev = stats.dev;
            const file_rdev = stats.rdev;

            filesFinal.push({ file_label, file_path, file_extension, file_size, file_birth, file_mod, file_uid, file_gid, file_nlink, file_dev, file_rdev });

        });

        fs.writeFileSync(workerData.exportPath + workerData.id + '.json', JSON.stringify(filesFinal), (err) => {throw(new Error(err))});

        const tEnd = Date.now();
        const stats = {
            "workerid": workerData.id,
            "linesimported": filesFinal.length,
            "time": (tEnd - tStart) / 1000
        }

        parentPort.postMessage(stats);
    });
} catch (e) {
    parentPort.once('error', (error) => {
        parentPort.postMessage('Mapping worker ' + workerData.id + ' caught in an error');
    });
}
