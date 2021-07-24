# File mapper client

## Description

file-crawler-ts lib helps you maps folder contents and exports it in JSON format.
It uses nodejs workers for parallel tasking. You have to implement your own worker pool.

## Options

Interfaces:
map
worker

## Implemetation

Example:

```
# code block
const val = new Crawler();
        
const options : MapOptions = {
    id: 'id0123',
    filenameAppender: 'mp',
    savePath: __dirname + '/export/'
}

const result: MapResults = await val.mapFolders(__dirname + '/../test-folder/', options);
```