import 'mocha';
import { assert, expect } from 'chai'
import { mapFolders } from './index'
import { MapOptions, MapResults } from './types/map';

describe('Map Folders function', () => {

    it('Should map folder', async () => {
        const options : MapOptions = {
            id: 'id0123',
            filenameAppender: 'mp',
            savePath: __dirname + '/export/fs/'
        }

        const result: MapResults = await mapFolders(__dirname + '/test-folder/', options);

        expect(result.error).to.be.false;
    });

    it('Should return error - folder does not exist', async () => {
        const options : MapOptions = {
            id: 'falseid',
            filenameAppender: 'upsi'
        }

        const result: MapResults = await mapFolders(__dirname +'/test-folde/', options);

        expect(result.error).to.be.true;
    });

    it('Should map multiple folders', async () => {
        const paths = ['/test-folder/folder1/','/test-folder/folder2/','/test-folder/folder3/'];
        
        for(let i = 0; i < 3; i++){
            
            const options : MapOptions = {
                id: Date.now().toString(),
                filenameAppender: i +'-id',
                savePath: __dirname + '/export/fs/'
            }
    
            await mapFolders(__dirname+paths[i], options)
            .then((result)=>{
                expect(result.error).to.be.false;
            });
        } 
    });

    it('Should fail 1st folder success 2 folders', async () => {
        const paths = ['/test-folder/folder1/*','/test-folder/folder2/','/test-folder/folder3/'];
        
        for(let i = 0; i < 3; i++){
            
            const options : MapOptions = {
                id: i.toString(),
                filenameAppender: i +'-id',
                savePath: __dirname + '/export/fs/'
            }
    
            await mapFolders(__dirname+paths[i], options)
            .then((result)=>{
                if(result.id == '0')expect(result.error).to.be.true;
                else expect(result.error).to.be.false;
            });
        } 
    });


});