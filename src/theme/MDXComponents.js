import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import BrowserWindow from '@site/src/components/BrowserWindow';
import IframeWindow from '@site/src/components/BrowserWindow/IFrameWindow';
import MermaidExample from '@site/src/components/MermaidExample/MermaidExample';
import PdfViewer from '@site/src/components/PdfViewer/PdfViewer';
import { StepByStep, Step } from '@site/src/components/StepByStep';
import { CardGrid, Card } from '@site/src/components/CardGrid';
import ZoomableMermaid from '@site/src/components/ZoomableMermaid';
import { Quiz, Question, Option } from '@site/src/components/Quiz/Quiz';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import DaisyPreview from '@site/src/components/DaisyPreview';
import CourseCards from '@site/src/components/CourseCards';
import InteractiveFrame from '@site/src/components/InteractiveFrame';

export default {
    // Re-use the default mapping
    ...MDXComponents,
    
    // Register our custom components globally
    BrowserWindow,
    IframeWindow,
    MermaidExample,
    PdfViewer,
    StepByStep,
    Step,
    CardGrid,
    Card,
    ZoomableMermaid,
    Quiz,
    Question,
    Option,
    Tabs,
    TabItem,
    DaisyPreview,
    CourseCards,
    InteractiveFrame,
};
