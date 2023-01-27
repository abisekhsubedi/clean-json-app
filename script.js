const { readdir, readFile, writeFile } = require('fs/promises');
const { exec } = require('child_process');

// // Read the JSON file
async function readJsonFile() {
    try {
        const result = await readFile('./videos.json', { encoding: 'utf-8' })
        const data = JSON.parse(result);
        const videoTitle = data.map(video => video.title)

        // Extract the video URLs from the JSON file
        // const videoTitle = data.map(video => video.title);
        console.log(...videoUrls)

        // Download each video using youtube-dl
        videoUrls.forEach(url => {
            exec(`youtube-dl -f 'best[height=360]' --write-thumbnail --write-info-json ${url}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
            });
        });

        const downloadedTitles = [];

        async function getDownloadedTitle() {
            const files = await readdir(".");
            files.forEach(file => {
                if (file.endsWith(".mp4")) {
                    downloadedTitles.push(file.replace(".mp4", ""));
                }
            })

            const remainingTitle = videoTitle.filter(videoTitle => {
                let regex = new RegExp(videoTitle);
                for (let title of downloadedTitles) {
                    if (regex.test(title)) {
                        return true;
                    }
                }
            })
            console.log(remainingTitle.length);
            const remainingFiles = videoTitle.filter(title => !remainingTitle.includes(title))
            const foo = data.filter(({ title }) => { return remainingFiles.includes(title) })

            async function writeDateToFile() {
                try {
                    await writeFile("./remaining.json", JSON.stringify(foo, null, 4));
                    console.log("File written successfully");
                }
                catch (err) {
                    console.log(err);
                }
            }

            writeDateToFile();
        }

        getDownloadedTitle()
    } catch (err) {
        console.log(err);
    }
}

readJsonFile();
