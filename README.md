# JEE Advanced Practice Website

A modern web application for JEE Advanced exam preparation.

## Overview

This application uses a JSON file to store questions, subjects, and chapter data. The data is loaded directly from the JSON file and managed using Redux.

## Features

- Browse questions by subject and chapter
- Filter questions by difficulty level
- Track your progress
- Review your performance statistics
- Mobile-friendly interface

## Development

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Build

To build the app for production:

```
npm run build
```

The build files will be in the `build` folder.

## Data Structure

The application uses a JSON file located at `src/data/ADV_DPP.json` which contains:

- Modules (subjects): Physics, Chemistry, Mathematics
- Chapters within each module
- Questions within each chapter, organized by sections
- Each question includes text, options, correct answers, and explanations

## Important Notes

- The `question_text` field may contain embedded images. The application is designed to handle and display these images properly.
- Similarly, `options` and `explanation` fields may also contain images.
- User progress is stored in the browser's localStorage.
