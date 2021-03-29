# Code that takes full page screenshot of website

### Enter following command through terminal:

```sh
node screenshot.js URL FILE_NAME DELAY OPEN_SCREENSHOT_FOLDER
```

- URL: Complete url of page,
- FILE_NAME: Name of file to be saved,
- DELAY (in seconds): Optional. Default delay is 10 seconds. To wait furthermore until page loads before taking screenshot.
- OPEN_SCREENSHOT_FOLDER: Optional. Whether to open screenshot's folder after. Enter "-o" to open.

Note: Must change default screenshot folder Path location.

- Change SCREENSHOT_FOLDER_PATH variable to custom folder path or remove it to save the screenshots in the current folder.
