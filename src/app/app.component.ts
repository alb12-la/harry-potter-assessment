import { Component, OnInit } from '@angular/core';
import { GsapService } from './services/gsap.service';


export interface QuizOptions {
  optionKey: string;
  optionLabel: string;
}

export interface QuizQuestion {
  questionLabel: string;
  answerKey: string;
  options: QuizOptions[];
}

const DELAY_BETWEEN_RESULT = 3000;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  questions: QuizQuestion[] = [
    {
      questionLabel: 'What spell creates light at the end of the wand?',
      answerKey: 'b',
      options: [
        {
          optionKey: 'a',
          optionLabel: 'Avada Kedavra'
        },
        {
          optionKey: 'b',
          optionLabel: 'Lumos'
        },
        {
          optionKey: 'c',
          optionLabel: 'Expelliarmus'
        },
      ]
    },
    {
      questionLabel: 'What is Harry Potter\'s Birthday?',
      answerKey: 'a',
      options: [
        {
          optionKey: 'a',
          optionLabel: 'July 31st '
        },
        {
          optionKey: 'b',
          optionLabel: 'June 31st'
        },
        {
          optionKey: 'c',
          optionLabel: 'October 31st'
        }
      ]
    }
  ];


  constructor(private gsapService: GsapService) { }

  noScroll() {
    window.scrollTo(0, 0);
  }

  ngOnInit() {
    window.addEventListener('scroll', this.noScroll);
    console.log(this.gsapService);
  }

  startQuiz() {
    this.exitTop('#starting-screen');
    this.bringToCenter('#question-0');
  }

  answerQuestion(selectedAnswer, question: QuizQuestion, index: number) {
    //  Dismiss answered question
    this.exitTop(`#question-${index}`);

    // Prepare next index
    const nextIndex = index + 1;
    let result;

    // Determine if answer was correct
    if (selectedAnswer === question.answerKey) {
      console.log('CORRECT');
      result = '#correct-answer';

    } else {
      console.log('WRONGANSWER');
      result = '#incorrect-answer';
    }

    // Display result
    this.bringToCenterSpecial(result);

    // Wait 3 seconds
    setTimeout(() => {

      // Dismiss result
      this.exitTopSpecial(result);

      // Bring in next question
      console.log('questionLength', this.questions.length, '> next index', nextIndex);

      // If more questions remain
      if (this.questions.length > nextIndex) {
        // Pull up next question
        console.log('Bring in question', `#question-${nextIndex}`);
        this.bringToCenter(`#question-${nextIndex}`);

      } else {
        // Display end screen
        console.log('NO more questions');
        this.bringToCenter('#ending-screen');
      }

    }, DELAY_BETWEEN_RESULT);
  }




  exitTopSpecial(elementId) {
    const moveUp = {
      y: -1000,
      rotate: 720,
      duration: 1,
      ease: 'power1.out',
    };

    const fadeout = {
      opacity: 0,
      duration: .5
    };
    // TODO Figure out how to call different durations in one call and combine these
    this.gsapService.to(elementId, moveUp);
    this.gsapService.to(elementId, fadeout);
  }

  exitTop(elementId: string) {
    const moveUp = {
      y: -1000,
      duration: 2
    };

    const fadeout = {
      opacity: 0,
      duration: .5
    };
    // TODO Figure out how to call different durations in one call and combine these
    this.gsapService.to(elementId, moveUp);
    this.gsapService.to(elementId, fadeout);
  }


  bringToCenterSpecial(elementId) {
    const moveToCenter = {
      top: '40%',
      rotate: 360,
      duration: 1,
      ease: 'power1.out',
    };
    // TODO Figure out how to call different durations in one call and combine these
    this.gsapService.to(elementId, moveToCenter);
  }


  bringToCenter(elementId: string) {
    const moveToCenter = {
      top: '40%',
      duration: 1
    };
    // TODO Figure out how to call different durations in one call and combine these
    this.gsapService.to(elementId, moveToCenter);
  }
}