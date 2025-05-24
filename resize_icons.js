const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const FAVICON_SIZE = 32; // Standard favicon size
const ICON_DIR = path.join(__dirname, 'assets', 'icons');

async function resizeIcon(inputFile, outputFile) {
    try {
        await sharp(inputFile)
            .resize(FAVICON_SIZE, FAVICON_SIZE, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png()
            .toFile(outputFile);
        
        console.log(`Successfully resized ${inputFile} to ${outputFile}`);
    } catch (error) {
        console.error(`Error processing ${inputFile}:`, error);
    }
}

async function main() {
    // Create resized versions of both light and dark icons
    await resizeIcon(
        path.join(ICON_DIR, 'app_icon_light.png'),
        path.join(ICON_DIR, 'favicon_light.png')
    );
    
    await resizeIcon(
        path.join(ICON_DIR, 'app_icon_dark.png'),
        path.join(ICON_DIR, 'favicon_dark.png')
    );
}

main().catch(console.error); 