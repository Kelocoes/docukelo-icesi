# Usability Testing Plan for Betting Adviser System

## Objectives

This usability testing plan is designed to evaluate:

1. **User Satisfaction**: How satisfied are users with the system's interface, flow, and recommendations?
2. **Interpretability**: How well do users understand the system's recommendations and reasoning?

## Testing Methodology

### Participant Selection

- **Sample Size**: 10-15 participants
- **Target Profile**:
  - Age range: 19-24 years old
  - Spanish speakers (system uses Spanish interface with English backend)

### Testing Setup

- **Environment**: Quiet room with minimal distractions
- **Equipment**: Computer with the betting adviser system

> **Note:** For this testing phase, a functional prototype of the system was used, available at the [`app/templates/index.html`](../../app/templates/index.html) directory.

### Testing Process

1. **Pre-test Questionnaire** (5 minutes)
2. **System Introduction** (3 minutes)
3. **Task Completion** (15-20 minutes)
4. **Post-test Questionnaire** (10 minutes)
5. **Semi-structured Interview** (10 minutes)

## Testing Scenarios

### Task 1: Basketball Betting Scenario
Ask participants to use the system to determine whether to bet on a basketball game with the following scenario:
- Home team with good recent performance
- Some minor injuries
- Playing at home
- Medium betting odds

### Task 2: Soccer Betting Scenario
Ask participants to use the system to determine whether to bet on a soccer match with these characteristics:
- Away game
- No injuries
- High league position
- Mixed results in recent matches

### Task 3: Interpreting Recommendations
After receiving a recommendation, ask participants to explain back:
- What the recommendation means
- Which factors contributed most to the recommendation
- Their confidence level in the recommendation

## Measurement Instruments

### 1. System Usability Scale (SUS)

Standard 10-item questionnaire with 5-point Likert scale responses:

1. I think that I would like to use this system frequently.
2. I found the system unnecessarily complex.
3. I thought the system was easy to use.
4. I think that I would need the support of a technical person to be able to use this system.
5. I found the various functions in this system were well integrated.
6. I thought there was too much inconsistency in this system.
7. I would imagine that most people would learn to use this system very quickly.
8. I found the system very cumbersome to use.
9. I felt very confident using the system.
10. I needed to learn a lot of things before I could get going with this system.

### 2. Interpretability Questionnaire

Rate the following statements from 1 (Strongly Disagree) to 5 (Strongly Agree):

1. The system clearly explained why it made its recommendation.
2. I understand how different factors affect the betting recommendation.
3. The probability percentages provided were meaningful to me.
4. I could explain to someone else how this system makes its decisions.
5. The Spanish terminology used was clear and understandable.
6. I trust the system's recommendations.
7. I could predict how changing my answers would affect the recommendation.
8. The system's explanations matched my own intuition about sports betting.

### 3. Task Completion Metrics

For each task, measure:
- **Completion Rate**: Whether participants completed the task successfully
- **Time on Task**: How long it took to complete
- **Error Rate**: Number of incorrect inputs or misunderstandings
- **Navigation Efficiency**: Number of unnecessary steps taken

### 4. Think-Aloud Protocol

Encourage participants to verbalize their thoughts while using the system:
- Record comments about confusion points
- Note questions that arise during use
- Capture reactions to recommendations
- Document vocabulary or terminology issues

## Observation Guide for Test Administrators

During the test, observe and record:

1. **Hesitation Points**: Where do users pause or seem uncertain?
2. **Misinterpretations**: Which questions or recommendations are misunderstood?
3. **Body Language**: Signs of frustration, confusion, or satisfaction
4. **Questions Asked**: What clarifications do participants need?
5. **Response to Results**: Initial reaction to the system's recommendation

## Semi-structured Interview Questions

After completing tasks and questionnaires, ask:

1. What did you find most useful about the system?
2. What aspects of the system were most confusing?
3. How would you compare this to how you normally make betting decisions?
4. What additional information would have made the recommendations more helpful?
5. How confident would you feel making a bet based on this system's recommendation?
6. Which factors do you think influenced the recommendation the most?
7. What would make the explanation of the recommendation clearer?
8. Would you use this system in real-life betting scenarios? Why or why not?

## Data Analysis Plan

1. **Quantitative Analysis**:
   - Calculate SUS scores (overall usability)
   - Average scores for interpretability questions
   - Task completion metrics (time, error rates)
   - Correlation between user experience and betting experience

2. **Qualitative Analysis**:
   - Thematic analysis of interview responses
   - Common patterns in think-aloud protocols
   - Categorization of confusion points
   - Suggestions for improvement

## Implementation Schedule

1. **Pilot Test**: Conduct with 2-3 participants to refine protocol
2. **Main Testing**: Schedule 10-15 participants over a two-week period
3. **Analysis**: One week for data compilation and analysis
4. **Reporting**: Prepare findings and recommendations

## Usability Test Results

### Executive Summary

**Testing Period:** May 22-24, 2025  
**Participants:** 12 users
**Overall SUS Score:** 72/100 (Above average usability)

#### Key Findings

1. **User Satisfaction:** Users were generally satisfied with the system's recommendations (average satisfaction score: 4.1/5), but found the interface navigation somewhat challenging.

2. **Interpretability:** Most users (83%) could correctly explain the reasoning behind recommendations, though technical terminology created confusion for novice users.

3. **Critical Usability Issues:**
   - Navigation between different sport sections was not intuitive for 7/12 users
   - Statistical explanations were difficult to understand for novice users (4/5)
   - Spanish terminology for betting concepts created confusion for 3 users

### Detailed Findings

#### Task Completion Metrics

| Task | Completion Rate | Avg. Time | Error Rate | Comments |
|------|----------------|-----------|------------|----------|
| Basketball Scenario | 100% | 3.2 min | Low | Users easily understood the context |
| Soccer Scenario | 92% | 4.1 min | Moderate | Some confusion about "league position" concept |
| Interpreting Recommendations | 83% | 5.3 min | High | Technical explanations caused hesitation |

#### System Usability Scale Results

- **Overall SUS Score:** 72/100
- **Highest scored item:** "I thought the system was easy to use" (4.2/5)
- **Lowest scored item:** "I think that I would need support to use this system" (2.8/5)
- **Notable difference:** Experienced bettors scored system 14 points higher than novices

#### Interpretability Scores

| Statement | Avg. Score (1-5) |
|-----------|-----------------|
| The system clearly explained its recommendation | 3.8 |
| I understand how factors affect the recommendation | 3.5 |
| Probability percentages were meaningful | 3.2 |
| I could explain how the system decides | 3.6 |
| Spanish terminology was clear | 3.9 |
| I trust the system's recommendations | 3.7 |
| I could predict how changing answers affects results | 2.9 |
| Explanations matched my betting intuition | 4.1 |

#### Qualitative Feedback Themes

1. **Positive Themes:**
   - "The system considers factors I wouldn't have thought about"
   - "Visual representation of probability helped decision making"
   - "Recommendations aligned with my own judgment in most cases"

2. **Confusion Points:**
   - Statistical concepts (confidence intervals, probability distributions)
   - Relationship between different input factors
   - Navigation between different sections of the application

3. **User Suggestions:**
   - Add tooltips explaining technical terms
   - Include more visual representations of data
   - Provide comparison with expert opinions

### Recommendations

#### High Priority Improvements

1. **Simplify Technical Explanations:**
   - Add a glossary of betting terms
   - Provide layered explanations (basic → advanced)
   - Use more visual representations of statistical concepts

2. **Improve Navigation:**
   - Redesign the main menu to clearly separate sports categories
   - Add a persistent navigation bar
   - Implement breadcrumb navigation

#### Medium Priority Improvements

1. **Enhance Interpretability:**
   - Add a "How this works" section
   - Illustrate the weighting of different factors
   - Create interactive examples showing how changing input affects outcomes

2. **Language Improvements:**
   - Review Spanish terminology for clarity
   - Add language toggle for technical explanations
   - Consider bilingual tooltips for specialized terms

#### Long-term Considerations

1. **Personalization:**
   - Allow users to customize which factors they see
   - Build profiles based on betting experience
   - Remember user preferences

2. **Expanded Features:**
   - Add comparison between different betting scenarios
   - Include historical performance of similar recommendations
   - Develop a mobile version of the application

### Learning Outcomes

The primary value of the system appears to be in exposing users to factors they might not have considered in their betting decisions. Experienced bettors appreciated the systematic approach, while novices benefited from the educational aspects but struggled with technical concepts.

For future iterations, focusing on progressive disclosure of information based on user expertise would significantly improve both satisfaction and interpretability.