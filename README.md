# Code that takes full page screenshot of website

### Enter following command through terminal:

```sh
node screenshot.js URL FILE_NAME delay -o -l
```

- URL: Complete url of page,
- FILE_NAME: Name of file to be saved,
- delay (in seconds): Optional. Default delay is 10 seconds. To wait furthermore until page loads before taking screenshot.
- -o: Optional. Open screenshot's folder to see screenshot at the end.
- -l: Optional. Launch browser during process.

Note: Must change default screenshot folder Path location.

- Change SCREENSHOT_FOLDER_PATH variable to custom folder path or remove it/set to empty string to save the screenshots in the current folder.
