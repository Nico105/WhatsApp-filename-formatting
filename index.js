// If there are duplicate file names, then just run the script again and it will increment  the names (seconds) by 1

const fs = require('fs');
const path = require('path');

const folderPath = 'path/to/folder'; // Replace with the actual folder path

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Error reading folder:', err);
        return;
    }

    files.forEach(file => {
        const oldFilePath = path.join(folderPath, file);
        const fileInfo = path.parse(file);

        if (fileInfo.name.startsWith('WhatsApp') && fileInfo.ext) {
            const dateRegex = /\d{4}-\d{2}-\d{2} at \d{2}.\d{2}.\d{2}/;
            const dateMatch = fileInfo.name.match(dateRegex);

            if (dateMatch) {
                const dateTimeString = dateMatch[0];
                const formattedDateTime = dateTimeString.replace(' at ', '_').replace(/\W/g, '');

                let newFileName = `${formattedDateTime}${fileInfo.ext}`;
                let newFilePath = path.join(folderPath, newFileName);
                let increment = 1;

                while (fs.existsSync(newFilePath)) {
                    const incrementedNumber = (parseInt(formattedDateTime.slice(-6)) + increment)
                        .toString()
                        .padStart(6, '0');
                    newFileName = `${formattedDateTime.slice(0, -6)}${incrementedNumber}${fileInfo.ext}`;
                    newFilePath = path.join(folderPath, newFileName);
                    increment++;
                }

                fs.rename(oldFilePath, newFilePath, err => {
                    if (err) {
                        console.error(`Error renaming file '${file}':`, err);
                    } else {
                        console.log(`Renamed file '${file}' to '${newFileName}'`);
                    }
                });
            }
        }
    });
});
