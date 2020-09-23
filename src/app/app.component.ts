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

const DELAY_BETWEEN_RESULT = 1000;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  score = 0;
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

  ];

  constructor(private gsapService: GsapService) { }

  ngOnInit() {
    // Disable scrolling
    window.addEventListener('scroll', () => { window.scrollTo(0, 0); });
  }

  reinitialize() {
    if (this.score === 0) {
      this.dismissSnape();
    }
    this.score = 0;
    this.exitTop('#ending-screen');
    this.bringToCenter('#starting-screen');
  }

  startQuiz() {
    this.exitTop('#starting-screen');
    this.bringToCenter('#question-0');
  }

  answerQuestion(selectedAnswer: string, question: QuizQuestion, index: number): void {
    //  Dismiss answered question
    this.exitTop(`#question-${index}`);

    // Prepare next index
    const nextIndex = index + 1;
    let result;

    // Determine if answer was correct
    if (selectedAnswer === question.answerKey) {
      console.log('CORRECT');
      result = '#correct-answer';
      this.score = this.score + 1;
    } else {
      console.log('WRONGANSWER');
      result = '#incorrect-answer';
    }

    // Display result
    console.log('DISPLAYING RESULT', result);
    this.rotateEnterFromBottom(result);

    // Wait 3 seconds
    setTimeout(() => {

      // Dismiss result
      this.rotateExitToTop(result);

      // Bring in next question
      console.log('questionLength', this.questions.length, '> next index', nextIndex);

      // If more questions remain
      if (this.questions.length > nextIndex) {
        // Bring in next question
        console.log('Bring in question', `#question-${nextIndex}`);
        this.bringToCenter(`#question-${nextIndex}`);
      } else {
        // Display end screen
        console.log('NO more questions');
        this.bringToCenter('#ending-screen');
        if (this.score === 0) {
          this.summonSnape();
        }
      }
    }, DELAY_BETWEEN_RESULT);
  }

  rotateExitToTop(elementId: string): void {
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

  rotateEnterFromBottom(elementId: string): void {
    const fromPosition = {
      y: 0,
      top: '150%',
      rotate: 0,
      duration: 1,
      ease: 'power1.out',
      opacity: 1,
    };

    const toPosition = {
      top: '40%',
      rotate: 360,
      duration: 1,
      ease: 'power1.out',
      opacity: 1,
    };
    this.gsapService.fromTo(elementId, fromPosition, toPosition);
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

  bringToCenter(elementId: string) {
    const fromPosition = {
      y: 0,
      top: '150%',
      duration: 1,
      opacity: 1
    };

    const toPosition = {
      top: '40%',
      duration: 1,
      opacity: 1
    };

    this.gsapService.fromTo(elementId, fromPosition, toPosition);
  }

  summonSnape() {
    const fromPosition = {
      bottom: '-1000px',
      duration: 3
    };

    const toPosition = {
      bottom: '0px',
      duration: 3
    };
    this.gsapService.fromTo('#snape', fromPosition, toPosition);
  }

  dismissSnape() {
    const fromPosition = {
      bottom: '0px',
      duration: 3
    };

    const toPosition = {
      bottom: '-1000px',
      duration: 2
    };

    this.gsapService.fromTo('#snape', fromPosition, toPosition);
  }

}
