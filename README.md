# Nursing Exam Practice

A modern web application for practicing nursing exam questions with multiple choice answers.

## Features

- Landing page with exam selection
- Multiple exam options (EXAM 1, EXAM 2, EXAM 3)
- Interactive question and answer interface
- Real-time feedback on answers
- Beautiful, modern UI with Tailwind CSS

## Technologies

- React 19
- Vite
- Tailwind CSS
- React Router DOMS

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── LandingPage.jsx    # Landing page with exam selection
│   └── Exam.jsx           # Exam interface component
├── App.jsx                # Main app component with routing
├── main.jsx               # Entry point
└── index.css              # Tailwind CSS imports
```

## Next Steps

- Add your actual questions and answers from the PDF
- Import and structure the question data
- Customize the exam names as needed

